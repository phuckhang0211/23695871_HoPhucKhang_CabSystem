# Bounded Context, ERD và thiết kế Microservice - CAB System

## 1. Mục đích

Tài liệu này hợp nhất bounded context, ubiquitous language và định hướng thiết kế microservice cho CAB System. Mỗi bounded context được mô tả theo cùng một mẫu:

1. Mục đích và phạm vi nghiệp vụ.
2. FR được phục vụ.
3. Business process/workflow.
4. Ubiquitous language riêng.
5. API của microservice.
6. Loại CSDL và dữ liệu sở hữu.
7. ERD, bảng dữ liệu, khóa và nguyên tắc triển khai CSDL.

Các context là ranh giới nghiệp vụ và ownership dữ liệu. Có thể triển khai mỗi context thành một microservice riêng hoặc bắt đầu bằng modular monolith, nhưng context khác không được truy cập trực tiếp bảng/aggregate mà context này sở hữu. Chương 7 là thiết kế dữ liệu chính của hệ thống; file [database_schema.sql](database_schema.sql) là DDL PostgreSQL thực thi tương ứng với thiết kế này.

## 2. Quy ước chung

- `Customer`, `Driver`, `Operation Staff` là các actor nghiệp vụ; `User` là danh tính dùng cho xác thực.
- `Booking` là yêu cầu đặt xe; `Trip` là chuyến thực tế sau khi được phân công.
- `Assignment` là quyết định gán Driver cho Booking/Trip, không phải là Trip.
- API dùng tên trạng thái đúng theo schema hiện tại: `DRIVER_ARRIVING`, `SUCCESS`, `CASH`, `ELECTRONIC`.
- `ARRIVED`, `PAID`, `Active` trong một số tài liệu được xem là cách diễn đạt nghiệp vụ, chưa phải enum API chuẩn.
- FR18-FR26 là FR trong SRS đã rà soát; BP01-BP09 là business process trong SRS.
- Dữ liệu giữa các context trao đổi bằng ID, API hoặc domain event. Không nhân bản dữ liệu gốc ngoài read model cần thiết.

## 3. Context map tổng quát

```text
Identity & Access ---> tất cả context
Profile & Fleet -----> Driver Assignment -----> Trip Operations
Customer ------------> Booking ----------------------|
                                                      +--> Pricing & Payment
Trip Operations -------------------------------------- +--> Rating
Các context nghiệp vụ -------------------------------- +--> Notification
Trip/Payment events --> History & Reporting
Operation Administration đọc và hỗ trợ các context qua API/read model
```

| Context | Upstream/downstream chính | Kiểu tích hợp |
|---|---|---|
| Identity & Access | Cung cấp danh tính cho tất cả context | Bearer token, role/claims |
| Profile & Fleet | Cung cấp Driver/Vehicle/availability cho Assignment | API hoặc event/read model |
| Booking | Gửi yêu cầu tìm tài xế; nhận kết quả phân công | Command và event |
| Driver Assignment | Tạo liên kết Driver-Booking-Trip | API nội bộ, event |
| Trip Operations | Cung cấp trạng thái hoàn thành cho Payment/Rating | Domain event |
| Pricing & Payment | Nhận dữ liệu Trip, phát kết quả Payment | API Payment Provider, event |
| Notification | Nhận event từ các context và gửi thông báo | Event-driven |
| Rating | Đọc trạng thái Trip, ghi Rating | API và event |
| Operations Administration | Đọc/điều chỉnh có kiểm soát | API quản trị, audit event |
| History & Reporting | Nhận projection từ Trip/Payment | Event projection/read model |

---

## BC01 - Identity and Access

### Mục đích và phạm vi

Quản lý đăng ký, đăng nhập, đăng xuất, danh tính, role và quyền truy cập. Context này sở hữu thông tin định danh và credential, không sở hữu hồ sơ chuyến, phương tiện hay thanh toán.

### FR và business process

- **FR01, FR02:** đăng ký và đăng nhập.
- **BP01 - Quản lý tài khoản:** đăng ký -> xác thực thông tin -> tạo User -> cấp access token -> đăng nhập các lần sau.
- Dùng chung cho mọi workflow cần xác thực: đặt xe, nhận chuyến, thanh toán và quản trị.

### Ubiquitous language

| Thuật ngữ | Định nghĩa trong context |
|---|---|
| `User` | Danh tính có thể đăng nhập vào hệ thống. |
| `Customer` | User có role sử dụng dịch vụ đặt xe. |
| `Driver` | User có role thực hiện chuyến. |
| `Operation Staff` | User có role vận hành/quản trị. |
| `Credential` | Thông tin dùng để xác thực, không được chia sẻ cho context khác. |
| `Access Token` | Token chứng minh danh tính và role sau khi đăng nhập. |
| `Role` | `CUSTOMER`, `DRIVER` hoặc `OPERATION_STAFF`. |
| `Authenticated User` | User đã vượt qua xác thực và được phép gọi API cần đăng nhập. |

### API microservice

| Method | Endpoint | Mục đích | FR |
|---|---|---|---|
| POST | `/auth/register` | Đăng ký Customer/Driver | FR01 |
| POST | `/auth/login` | Đăng nhập và cấp token | FR02 |
| POST | `/auth/logout` | Kết thúc phiên/token | - |

### CSDL và dữ liệu

- **Đề xuất:** PostgreSQL, vì User, Role và quan hệ quyền cần transaction, unique email/phone và consistency cao.
- **Dữ liệu sở hữu:** `users`, `credentials`, `roles`, `user_roles`, `refresh_tokens`, `login_audits`.
- **Trường chính:** `userId`, `name`, `phone`, `email`, `passwordHash`, `role`, `status`, `createdAt`, `updatedAt`.
- Context khác chỉ lưu `userId` và role snapshot khi cần audit, không lưu password/credential.

---

## BC02 - Profile and Fleet

### Mục đích và phạm vi

Quản lý hồ sơ Customer/Driver, phương tiện và trạng thái sẵn sàng của Driver. Đây là nguồn dữ liệu để Driver Assignment xác định tài xế đủ điều kiện.

### FR và business process

- **FR03:** xem/cập nhật hồ sơ.
- **FR04:** xem/cập nhật phương tiện.
- **FR21, FR22:** vận hành xem Driver và Vehicle.
- **BP01:** đăng nhập -> xem/cập nhật profile.
- **BP03:** Assignment đọc Driver đủ điều kiện, trạng thái sẵn sàng và Vehicle.
- **BP04:** Driver bật/tắt sẵn sàng, cập nhật vị trí trong quá trình thực hiện Trip.

### Ubiquitous language

| Thuật ngữ | Định nghĩa trong context |
|---|---|
| `Profile` | Thông tin hiển thị/nghiệp vụ của một User. |
| `Driver Profile` | Hồ sơ bổ sung cho Driver, gồm điều kiện hoạt động. |
| `Vehicle` | Phương tiện gắn với Driver để thực hiện Trip. |
| `Available/Ready` | Driver đang sẵn sàng nhận yêu cầu. |
| `Offline` | Driver không tham gia nhận yêu cầu. |
| `Busy` | Driver đang bận hoặc không thể nhận thêm yêu cầu. |
| `Driver Eligibility` | Tập điều kiện để Driver được đưa vào danh sách ứng viên. |
| `Driver Location` | Vị trí gần nhất của Driver dùng cho vận hành/Assignment. |

### API microservice

| Method | Endpoint | Mục đích | FR |
|---|---|---|---|
| GET | `/users/me` | Xem profile hiện tại | FR03 |
| PUT | `/users/me` | Cập nhật profile | FR03 |
| GET | `/drivers/me/vehicle` | Xem Vehicle của Driver | FR04 |
| PUT | `/drivers/me/vehicle` | Cập nhật Vehicle | FR04 |
| GET | `/admin/drivers` | Danh sách Driver cho vận hành | FR21 |
| GET | `/admin/vehicles` | Danh sách Vehicle cho vận hành | FR22 |
| PATCH | `/drivers/me/availability` | Đề xuất bổ sung để bật/tắt Ready | FR12 |
| PATCH | `/drivers/me/location` | Đề xuất bổ sung để cập nhật vị trí | FR13 |

Hai endpoint cuối phục vụ SRS nhưng chưa có trong OpenAPI hiện tại, cần bổ sung khi triển khai.

### CSDL và dữ liệu

- **Đề xuất:** PostgreSQL cho Profile/Vehicle; Redis GEO hoặc Redis cache cho vị trí và trạng thái ngắn hạn.
- **Dữ liệu sở hữu:** `profiles`, `driver_profiles`, `vehicles`, `driver_availability`, `driver_locations`.
- **Trường chính:** `userId`, `vehicleId`, `licensePlate`, `vehicleType`, `brand`, `model`, `availabilityStatus`, `latitude`, `longitude`, `locationTimestamp`.
- Lịch sử vị trí dài hạn nên đưa vào kho lưu trữ riêng hoặc policy retention; không dùng Redis làm nguồn dữ liệu lâu dài.

---

## BC03 - Booking

### Mục đích và phạm vi

Tiếp nhận và quản lý yêu cầu đặt xe của Customer từ lúc tạo đến khi được hoàn tất/hủy.

### FR và business process

- **FR05:** nhập điểm đón, điểm đến, loại dịch vụ.
- **FR06:** tạo và cập nhật Booking.
- **FR07:** theo dõi trạng thái Booking/Trip.
- **BP02 - Đặt xe:** Customer nhập dữ liệu -> validate -> tạo Booking -> chuyển sang tìm Driver.
- **BP03:** Booking phát yêu cầu tìm Assignment và nhận kết quả.
- **BP04-BP05:** Booking được liên kết với Trip và Payment.

### Ubiquitous language

| Thuật ngữ | Định nghĩa trong context |
|---|---|
| `Booking` | Yêu cầu đặt xe do Customer tạo. |
| `Pickup` | Điểm đón của Booking. |
| `Destination` | Điểm đến của Booking. |
| `Address` | Địa chỉ và tọa độ tùy chọn của một điểm. |
| `Booking Status` | Trạng thái vòng đời yêu cầu. |
| `Requested` | Booking vừa được tạo và hợp lệ. |
| `Searching Driver` | Đang tìm hoặc thử phân công Driver. |
| `Driver Assigned` | Đã có Driver được gán. |
| `Accepted` | Driver đã chấp nhận yêu cầu. |
| `No Driver Available` | Không còn Driver phù hợp; SRS có khái niệm này nhưng API chưa có enum. |

### API microservice

| Method | Endpoint | Mục đích | FR |
|---|---|---|---|
| POST | `/bookings` | Tạo Booking | FR05 |
| GET | `/bookings` | Danh sách Booking của User | FR07 |
| GET | `/bookings/{bookingId}` | Xem chi tiết Booking | FR06, FR07 |
| PATCH | `/bookings/{bookingId}` | Cập nhật Booking | FR06 |
| POST | `/bookings/{bookingId}/cancel` | Đề xuất bổ sung hủy Booking | TBD |

### CSDL và dữ liệu

- **Đề xuất:** PostgreSQL, vì Booking có quan hệ, trạng thái và yêu cầu transaction/locking.
- **Dữ liệu sở hữu:** `bookings`, `booking_addresses`, `booking_status_history`.
- **Trường chính:** `bookingId`, `customerId`, `pickup`, `destination`, `note`, `status`, `createdAt`, `updatedAt`.
- Chỉ lưu `customerId`; không sao chép profile Customer. `tripId` có thể lưu như reference sau khi Assignment tạo Trip.

### State machine

```text
REQUESTED -> SEARCHING_DRIVER -> DRIVER_ASSIGNED -> ACCEPTED -> COMPLETED
     \              \                    \                 
      +--------------+--------------------+---------------> CANCELLED
```

---

## BC04 - Driver Assignment

### Mục đích và phạm vi

Tìm Driver phù hợp, gửi yêu cầu, nhận Accept/Reject/Timeout và bảo đảm mỗi Booking chỉ có một Assignment thắng.

### FR và business process

- **FR08:** tìm Driver theo vị trí, trạng thái và tiêu chí.
- **FR09:** gửi và ghi nhận phân công.
- **FR10:** Driver Accept/Reject.
- **FR11:** Reject/Timeout -> tìm Driver tiếp theo.
- **BP03 - Tìm kiếm và phân công tài xế:** nhận `BookingCreated` -> lấy Driver Candidate -> gửi Assignment Attempt -> nhận phản hồi -> xác nhận hoặc Reassignment -> phát kết quả.

### Ubiquitous language

| Thuật ngữ | Định nghĩa trong context |
|---|---|
| `Driver Candidate` | Driver đủ điều kiện được đưa vào danh sách xét. |
| `Assignment` | Quyết định gán một Driver cho Booking/Trip. |
| `Assignment Attempt` | Một lần gửi yêu cầu tới một Candidate. |
| `Accept` | Driver đồng ý nhận Assignment. |
| `Reject` | Driver từ chối Assignment. |
| `Response Timeout` | Hết thời gian phản hồi mà không có kết quả hợp lệ. |
| `Reassignment` | Thử Candidate tiếp theo sau Reject/Timeout. |
| `Single Winner` | Chỉ một phản hồi đồng thời được xác nhận. |
| `No Driver Available` | Không còn Candidate để thử. |

### API microservice

| Method | Endpoint | Mục đích | FR |
|---|---|---|---|
| GET | `/bookings/{bookingId}/drivers` | Tìm Candidate | FR08 |
| POST | `/bookings/{bookingId}/assign` | Tạo Assignment | FR09 |
| POST | `/trips/{tripId}/accept` | Driver Accept | FR10 |
| POST | `/trips/{tripId}/reject` | Driver Reject và xử lý tiếp | FR10, FR11 |
| POST | `/assignments/{id}/timeout` | Endpoint nội bộ/worker xử lý Timeout | FR11 |

### CSDL và dữ liệu

- **Đề xuất:** PostgreSQL cho Assignment và lịch sử quyết định; Redis cho danh sách Candidate, lock ngắn hạn và timeout queue.
- **Dữ liệu sở hữu:** `assignments`, `assignment_attempts`, `driver_candidates`, `assignment_events`, `assignment_locks`.
- **Trường chính:** `assignmentId`, `bookingId`, `tripId`, `driverId`, `attemptNo`, `status`, `requestedAt`, `respondedAt`, `expiresAt`, `reason`.
- Không sở hữu hồ sơ Driver; chỉ lưu `driverId` và snapshot tối thiểu để audit.

### Workflow ngoại lệ

```text
Reject hoặc Timeout -> ghi attempt -> chọn Candidate tiếp theo
                  -> nếu hết Candidate: No Driver Available + thông báo Customer
```

---

## BC05 - Trip Operations

### Mục đích và phạm vi

Quản lý Trip sau khi Assignment thành công: trạng thái, tiến trình thực hiện và vị trí.

### FR và business process

- **FR12:** Driver bật/tắt sẵn sàng và cập nhật trạng thái Trip.
- **FR13:** ghi nhận/theo dõi vị trí.
- **FR22, FR23:** vận hành theo dõi và hỗ trợ Trip.
- **BP04 - Thực hiện chuyến:** `ASSIGNED` -> Driver đến điểm đón -> đón khách -> `IN_PROGRESS` -> `COMPLETED`.
- Phát `TripStatusChanged` để Payment, Rating, Notification và Reporting xử lý.

### Ubiquitous language

| Thuật ngữ | Định nghĩa trong context |
|---|---|
| `Trip` | Chuyến thực tế được tạo từ một Booking và Driver. |
| `Assigned` | Trip đã gắn với Driver. |
| `Driver Arriving` | Driver đang di chuyển đến Pickup; enum API là `DRIVER_ARRIVING`. |
| `In Progress` | Trip đang thực hiện sau khi đón khách. |
| `Completed` | Trip hoàn thành, đủ điều kiện tính cước và Rating. |
| `Cancelled` | Trip bị hủy theo chính sách. |
| `Location` | Latitude, longitude và timestamp. |
| `Trip Status Transition` | Chuyển trạng thái hợp lệ theo state machine. |

### API microservice

| Method | Endpoint | Mục đích | FR |
|---|---|---|---|
| GET | `/trips/{tripId}` | Xem Trip | FR12, FR13 |
| PATCH | `/trips/{tripId}/status` | Cập nhật trạng thái | FR12 |
| GET | `/trips/{tripId}/location` | Xem vị trí | FR13 |
| PATCH | `/trips/{tripId}/location` | Đề xuất bổ sung cập nhật vị trí | FR13 |
| GET | `/admin/trips` | Theo dõi Trip vận hành | FR23 |
| PATCH | `/admin/trips/{tripId}` | Điều chỉnh Trip có quyền | FR23, FR24 |

### CSDL và dữ liệu

- **Đề xuất:** PostgreSQL cho Trip và trạng thái; Redis GEO cho vị trí hiện tại; Kafka/RabbitMQ cho event trạng thái nếu tách microservice.
- **Dữ liệu sở hữu:** `trips`, `trip_status_history`, `trip_locations`, `trip_incidents`.
- **Trường chính:** `tripId`, `bookingId`, `driverId`, `status`, `startedAt`, `completedAt`, `currentLocation`.
- Trip chỉ tham chiếu Booking/Driver bằng ID, không sở hữu dữ liệu gốc của các context đó.

### State machine

```text
ASSIGNED -> DRIVER_ARRIVING -> IN_PROGRESS -> COMPLETED
     \             \              \
      +-------------+--------------+-------------> CANCELLED
```

API dùng `DRIVER_ARRIVING`; test case có từ `ARRIVED` cần được chuẩn hóa trong phiên bản API sau.

---

## BC06 - Pricing and Payment

### Mục đích và phạm vi

Tính Fare và ghi nhận thanh toán tiền mặt/điện tử cho Trip đã hoàn thành.

### FR và business process

- **FR14:** tính và hiển thị Fare.
- **FR15:** thanh toán Cash.
- **FR16:** thanh toán Electronic qua Payment Provider.
- **FR17:** ghi nhận Success/Failed và Retry.
- **BP05 - Tính cước và thanh toán:** Trip Completed -> Calculate Fare -> chọn Method -> tạo Payment -> gọi Provider nếu Electronic -> nhận kết quả -> Success/Failed/Retry.

### Ubiquitous language

| Thuật ngữ | Định nghĩa trong context |
|---|---|
| `Fare` | Số tiền cần thanh toán cho Trip. |
| `Amount` | Giá trị tiền của Fare/Payment. |
| `Currency` | Đơn vị tiền, hiện dùng ví dụ `VND`. |
| `Payment` | Giao dịch thanh toán cho một Trip. |
| `Cash` | Thanh toán tiền mặt, enum `CASH`. |
| `Electronic` | Thanh toán qua Provider, enum `ELECTRONIC`. |
| `Pending` | Chưa có kết quả cuối. |
| `Success` | Thanh toán thành công, enum `SUCCESS`. |
| `Failed` | Thanh toán thất bại. |
| `Retry` | Yêu cầu xử lý lại giao dịch. |
| `Transaction ID` | Mã tham chiếu giao dịch, không phải dữ liệu thẻ. |

### API microservice

| Method | Endpoint | Mục đích | FR |
|---|---|---|---|
| GET | `/trips/{tripId}/fare` | Tính/xem Fare | FR14 |
| POST | `/trips/{tripId}/payments` | Tạo Payment Cash/Electronic | FR15, FR16 |
| GET | `/payments/{paymentId}` | Xem kết quả Payment | FR17 |
| POST | `/payments/{paymentId}/retry` | Đề xuất bổ sung Retry | FR17 |
| POST | `/payments/provider-callback` | Nhận kết quả Provider | FR16, FR17 |

Hai API Retry và callback chưa có trong OpenAPI hiện tại nhưng cần cho workflow FR17.

### CSDL và dữ liệu

- **Đề xuất:** PostgreSQL cho Fare/Payment và transaction; không lưu dữ liệu thẻ nhạy cảm. Redis/RabbitMQ dùng cho retry/outbox nếu cần.
- **Dữ liệu sở hữu:** `fares`, `payments`, `payment_attempts`, `provider_transactions`, `payment_status_history`.
- **Trường chính:** `paymentId`, `tripId`, `amount`, `currency`, `method`, `status`, `transactionId`, `paidAt`, `failureReason`.
- Không lưu card number, CVV hoặc credential của Payment Provider trong CAB System.

### State machine

```text
PENDING -> SUCCESS
    \       ^
     +-> FAILED -> RETRY
```

Công thức Fare, số lần Retry và thời hạn xử lý là TBD01/TBD06 trong SRS.

---

## BC07 - Notification

### Mục đích và phạm vi

Tiếp nhận domain event, tạo và cung cấp thông báo cho Customer, Driver hoặc Operation Staff. Lỗi gửi Notification không được làm dừng workflow nguồn.

### FR và business process

- **FR18:** gửi và quản lý thông báo.
- **BP06 - Thông báo:** nhận event -> xác định người nhận/kênh -> tạo Notification -> gửi -> ghi nhận delivery -> retry hoặc báo lỗi.
- Các event chính: `BookingCreated`, `DriverAssigned`, `DriverRejected`, `TripStatusChanged`, `PaymentSucceeded`, `PaymentFailed`, `NoDriverAvailable`.

### Ubiquitous language

| Thuật ngữ | Định nghĩa trong context |
|---|---|
| `Notification` | Thông tin cần gửi cho một User. |
| `Recipient` | User nhận Notification. |
| `Channel` | Kênh gửi, ví dụ in-app, SMS, email hoặc push; hiện chưa chốt. |
| `Unread/Read` | Trạng thái người dùng chưa đọc/đã đọc. |
| `Delivery` | Lần gửi Notification qua một Channel. |
| `Delivery Failed` | Gửi không thành công, có thể cần Retry. |
| `Notification Event` | Domain event làm phát sinh Notification. |

### API microservice

| Method | Endpoint | Mục đích | FR |
|---|---|---|---|
| GET | `/notifications` | Danh sách Notification của User | FR18 |
| PATCH | `/notifications/{notificationId}/read` | Đánh dấu đã đọc | FR18 |
| POST | `/notifications/internal` | API nội bộ tạo Notification | FR18 |
| POST | `/notifications/{notificationId}/retry` | Đề xuất bổ sung retry gửi | FR18 |

### CSDL và dữ liệu

- **Đề xuất:** PostgreSQL cho Notification cần lưu lâu hơn; Redis Streams/RabbitMQ/Kafka cho event và queue gửi; Redis cache cho unread count.
- **Dữ liệu sở hữu:** `notifications`, `notification_deliveries`, `notification_templates`, `notification_preferences`.
- **Trường chính:** `notificationId`, `recipientId`, `type`, `title`, `message`, `isRead`, `channel`, `deliveryStatus`, `createdAt`, `sentAt`.
- Schema hiện tại mới mô hình hóa `isRead`; Channel/Delivery là phần cần bổ sung khi triển khai.

---

## BC08 - Rating

### Mục đích và phạm vi

Ghi nhận đánh giá của Customer đối với Driver sau khi Trip hoàn thành.

### FR và business process

- **FR19:** tạo và xem Rating.
- **BP07 - Đánh giá chuyến:** Trip Completed -> kiểm tra Customer đúng Trip -> kiểm tra chưa vượt chính sách -> ghi Rating -> phát `RatingSubmitted` cho báo cáo/profile.

### Ubiquitous language

| Thuật ngữ | Định nghĩa trong context |
|---|---|
| `Rating` | Đánh giá gắn với một Trip. |
| `Rater` | Customer tạo đánh giá. |
| `Rated Driver` | Driver được đánh giá, xác định qua Trip. |
| `Score` | Điểm đánh giá, schema định hướng thang 1-5. |
| `Comment` | Nhận xét tùy chọn của Customer. |
| `Eligible Trip` | Trip đã Completed và thuộc Customer hiện tại. |
| `Duplicate Rating` | Rating thứ hai cho cùng Trip trái với chính sách. |

### API microservice

| Method | Endpoint | Mục đích | FR |
|---|---|---|---|
| POST | `/trips/{tripId}/rating` | Tạo Rating | FR19 |
| GET | `/trips/{tripId}/rating` | Xem Rating | FR19 |

### CSDL và dữ liệu

- **Đề xuất:** PostgreSQL vì Rating cần unique constraint theo `tripId`/`raterId` và transaction.
- **Dữ liệu sở hữu:** `ratings`, `rating_dimensions` nếu mở rộng, `rating_moderation_logs`.
- **Trường chính:** `ratingId`, `tripId`, `raterId`, `driverId` hoặc driver reference, `score`, `comment`, `createdAt`.
- Chỉ lưu `tripId`, `raterId`, `driverId` dạng reference; không sao chép toàn bộ hồ sơ.

---

## BC09 - Operations Administration

### Mục đích và phạm vi

Cung cấp năng lực cho Operation Staff theo dõi dữ liệu và hỗ trợ các Trip/Booking phát sinh lỗi. Context này là lớp quản trị, không thay thế ownership của Booking, Trip, Driver hay Payment.

### FR và business process

- **FR20:** quản lý Customer.
- **FR21:** quản lý Driver và Vehicle.
- **FR22:** theo dõi Trip và trạng thái Driver.
- **FR23:** hỗ trợ xử lý Trip lỗi.
- **FR24:** kiểm soát quyền quản trị.
- **BP08 - Quản lý vận hành:** đăng nhập có quyền -> xem read model -> phát hiện sự cố -> thực hiện thao tác được phép -> ghi Audit -> thông báo kết quả.

### Ubiquitous language

| Thuật ngữ | Định nghĩa trong context |
|---|---|
| `Operation Staff` | Người dùng nội bộ thực hiện giám sát/vận hành. |
| `Admin Action` | Thao tác quản trị cần quyền. |
| `Operational Adjustment` | Điều chỉnh Trip/Assignment để hỗ trợ sự cố. |
| `Incident` | Sự cố cần nhân viên kiểm tra hoặc xử lý. |
| `Read Model` | Bản đọc tổng hợp, không phải dữ liệu nguồn sở hữu. |
| `Audit Action` | Bản ghi ai đã làm gì, lúc nào và trên đối tượng nào. |
| `Forbidden` | Từ chối do User không có quyền, trả HTTP 403. |

### API microservice

| Method | Endpoint | Mục đích | FR |
|---|---|---|---|
| GET | `/admin/customers` | Xem/quản lý Customer | FR20 |
| GET | `/admin/drivers` | Xem/quản lý Driver | FR21 |
| GET | `/admin/vehicles` | Xem/quản lý Vehicle | FR21 |
| GET | `/admin/trips` | Theo dõi Trip | FR22, FR23 |
| PATCH | `/admin/trips/{tripId}` | Điều chỉnh Trip có quyền | FR23, FR24 |
| GET | `/admin/audit-logs` | Tra cứu Audit | BR15 |

### CSDL và dữ liệu

- **Đề xuất:** PostgreSQL cho quyền, Incident và Audit; Elasticsearch/OpenSearch tùy chọn cho tìm kiếm log/read model lớn.
- **Dữ liệu sở hữu:** `admin_permissions`, `incidents`, `admin_actions`, `audit_logs`, các read model `customer_summary`, `driver_summary`, `trip_summary`.
- **Trường chính:** `actionId`, `staffId`, `resourceType`, `resourceId`, `action`, `reason`, `beforeState`, `afterState`, `createdAt`.
- Dữ liệu Customer/Driver/Trip gốc vẫn thuộc context tương ứng; Admin chỉ lưu projection hoặc reference.

---

## BC10 - History and Reporting

### Mục đích và phạm vi

Tra cứu lịch sử Trip/Payment và tạo báo cáo chuyến, doanh thu, hoàn thành, hủy và hiệu quả Driver.

### FR và business process

- **FR25:** tra cứu lịch sử Trip và Payment.
- **FR26:** báo cáo vận hành và doanh thu.
- **BP09 - Quản lý giao dịch và báo cáo:** nhận event Trip/Payment -> cập nhật projection -> lọc theo quyền/thời gian -> tổng hợp -> trả Report.

### Ubiquitous language

| Thuật ngữ | Định nghĩa trong context |
|---|---|
| `Trip History` | Danh sách Trip đã phát sinh trong phạm vi được phép xem. |
| `Payment History` | Danh sách Payment đã phát sinh. |
| `Trip Report` | Tổng hợp total/completed/cancelled Trip và chỉ số liên quan. |
| `Revenue Report` | Tổng hợp doanh thu và số lượng Payment. |
| `Projection` | Dữ liệu đọc được xây dựng từ event/context nguồn. |
| `Reporting Period` | Khoảng thời gian dùng để lọc báo cáo. |
| `Operational KPI` | Chỉ số phục vụ đánh giá hoạt động CAB. |

### API microservice

| Method | Endpoint | Mục đích | FR |
|---|---|---|---|
| GET | `/history/trips` | Tra cứu lịch sử Trip | FR25 |
| GET | `/history/payments` | Tra cứu lịch sử Payment | FR25 |
| GET | `/reports/trips` | Báo cáo Trip | FR26 |
| GET | `/reports/revenue` | Báo cáo doanh thu | FR26 |

### CSDL và dữ liệu

- **Đề xuất:** PostgreSQL read model cho quy mô vừa; khi dữ liệu lớn dùng ClickHouse/BigQuery cho analytical query và object storage cho archive.
- **Dữ liệu sở hữu:** `trip_history_projection`, `payment_history_projection`, `trip_report_daily`, `revenue_report_daily`, `driver_performance_daily`.
- **Trường chính:** `tripId`, `paymentId`, `customerId`, `driverId`, `status`, `amount`, `currency`, `completedAt`, `cancelledAt`, `reportDate`, `totalTrips`, `completedTrips`, `cancelledTrips`, `totalRevenue`.
- Đây là dữ liệu đọc/tổng hợp; nguồn sự thật vẫn là Trip Operations và Pricing & Payment.

---

## 4. Workflow end-to-end

### WF01 - Đặt xe đến hoàn thành

```text
Customer -> Booking: CreateBooking
Booking -> Driver Assignment: BookingCreated
Driver Assignment -> Profile & Fleet: lấy Driver Candidate
Driver Assignment -> Driver: Assignment Attempt
Driver -> Driver Assignment: Accept
Driver Assignment -> Trip Operations: tạo Trip
Trip Operations -> Customer: trạng thái/vị trí
Trip Operations -> Pricing & Payment: Trip Completed
Customer -> Payment: chọn Cash/Electronic
Payment -> Notification/Reporting: Payment result
Customer -> Rating: tạo Rating
```

Phục vụ: FR01-FR19, BP01-BP07.

### WF02 - Từ chối hoặc không phản hồi

```text
Driver -> Driver Assignment: Reject
hoặc timeout -> Assignment: ghi Attempt
Assignment -> Assignment: Reassignment
Assignment -> Driver tiếp theo: gửi yêu cầu
hết Candidate -> Booking: No Driver Available
Booking -> Notification: thông báo Customer
```

Phục vụ: FR08-FR11, BP03, EX01-EX04.

### WF03 - Thanh toán điện tử thất bại

```text
Trip Completed -> Calculate Fare -> CreatePayment(ELECTRONIC)
Payment -> Payment Provider: process
Provider -> Payment: FAILED hoặc không phản hồi
Payment -> Notification: thông báo kết quả
Payment -> Retry: xử lý lại theo policy
```

Phục vụ: FR14-FR17, BP05, EX05-EX06.

### WF04 - Giám sát và báo cáo

```text
Trip/Payment events -> History & Reporting: cập nhật projection
Operation Staff -> Operations: xem/điều chỉnh có quyền
Operations -> Audit: ghi thao tác
Operation Staff -> Reports: xem KPI/doanh thu/lịch sử
```

Phục vụ: FR20-FR26, BP08-BP09.

## 5. Domain events dùng chung

| Event | Context phát | Context nhận chính |
|---|---|---|
| `UserRegistered` | Identity | Profile, Notification |
| `BookingCreated` | Booking | Assignment, Notification |
| `DriverAssigned` | Assignment | Booking, Trip, Notification |
| `DriverAccepted` | Assignment | Booking, Trip, Notification |
| `DriverRejected` | Assignment | Assignment, Booking, Notification |
| `DriverResponseTimedOut` | Assignment | Assignment, Booking, Notification |
| `NoDriverAvailable` | Assignment | Booking, Notification |
| `TripStatusChanged` | Trip | Payment, Rating, Notification, Reporting |
| `DriverLocationUpdated` | Trip/Profile | Operations, Notification |
| `FareCalculated` | Payment | Notification, Reporting |
| `PaymentSucceeded` / `PaymentFailed` | Payment | Notification, Reporting, Operations |
| `RatingSubmitted` | Rating | Reporting, Profile |
| `TripOperationallyAdjusted` | Operations | Trip, Notification, Audit |
| `AuditActionRecorded` | Operations/cross-cutting | Audit storage |

Event envelope, message broker và versioning chưa được định nghĩa trong API; bảng trên là vocabulary/thiết kế logic.

## 6. Các quyết định cần chốt

| Mã | Nội dung | Context |
|---|---|---|
| TBD01 | Công thức Fare, currency và thời điểm chốt giá | Pricing & Payment |
| TBD02 | Tiêu chí ưu tiên/bán kính Driver Candidate | Driver Assignment |
| TBD03 | Response Timeout và số lần Reassignment | Driver Assignment |
| TBD04 | Chính sách hủy và enum `NO_DRIVER_AVAILABLE` | Booking/Trip |
| TBD05 | Chuẩn hóa `DRIVER_ARRIVING` và mốc đã đến | Trip |
| TBD06 | Retry/callback/đối soát Payment Provider | Payment |
| TBD07 | Channel, delivery retry và retention Notification | Notification |
| TBD08 | Thời hạn, số lần và chỉnh sửa Rating | Rating |
| TBD09 | Retention của Location, History và Audit | Operations/Reporting |

## 7. Thiết kế ERD và CSDL theo bounded context

Chương này là đặc tả dữ liệu cho từng bounded context. Mỗi context có một database/schema logic riêng, ERD riêng và danh sách bảng sở hữu riêng. Các ID trỏ sang context khác chỉ là reference ID, không phải foreign key xuyên database.

### 7.1. Nguyên tắc thiết kế dữ liệu

- Mỗi microservice sở hữu database/schema riêng; không tạo foreign key trực tiếp sang database của microservice khác.
- Các trường như `customer_id`, `driver_id`, `booking_id` và `trip_id` ở context khác là **reference ID**, được kiểm tra qua API hoặc domain event.
- PostgreSQL là lựa chọn mặc định cho dữ liệu nghiệp vụ cần transaction, ràng buộc và truy vấn quan hệ.
- Redis chỉ dùng cho cache, dữ liệu trạng thái ngắn hạn, GEO lookup hoặc distributed lock; không dùng làm nguồn dữ liệu nghiệp vụ lâu dài.
- Read model của Operations/Reporting được cập nhật bất đồng bộ từ event và phải có `source_updated_at`/`event_id` để truy vết.
- Các bảng lịch sử trạng thái dùng append-only để phục vụ audit, debugging và báo cáo.

### 7.2. BC01 - Identity and Access

**Database type:** PostgreSQL. User, credential, role và session cần unique constraint, transaction và bảo đảm nhất quán. Có thể dùng Redis cho deny-list access token ngắn hạn.

**ERD:**

```text
USERS (1) --------< USER_ROLES >-------- (1) ROLES
  |
  +-- (1:1) CREDENTIALS
  +-- (1:N) REFRESH_TOKENS
  +-- (1:N) LOGIN_AUDITS

PK: USERS.user_id
FK: CREDENTIALS.user_id, USER_ROLES.user_id/role_id,
    REFRESH_TOKENS.user_id, LOGIN_AUDITS.user_id
```

**CSDL tương ứng:**

| Bảng | Khóa và dữ liệu chính |
|---|---|
| `users` | `user_id`; name, phone, email, status, timestamps. Unique `phone`, `email`. |
| `credentials` | `user_id`; password hash và thời điểm đổi mật khẩu. |
| `roles` | `role_id`; code `CUSTOMER`, `DRIVER`, `OPERATION_STAFF`. |
| `user_roles` | Khóa ghép `user_id`, `role_id`. |
| `refresh_tokens` | `token_id`; chỉ lưu token hash, expiry và revoke time. |
| `login_audits` | `audit_id`; user, kết quả, IP và thời điểm đăng nhập. |

### 7.3. BC02 - Profile and Fleet

**Database type:** PostgreSQL cho profile/vehicle; Redis GEO cho vị trí và trạng thái sẵn sàng hiện tại. Vị trí dài hạn lưu PostgreSQL partition hoặc object storage theo retention policy.

**ERD:**

```text
PROFILES (1) -------- (0..1) DRIVER_PROFILES
                              |
                              +-- (1:N) VEHICLES
                              +-- (1:N) AVAILABILITY_SESSIONS
                              +-- (1:N) DRIVER_LOCATIONS

PK: PROFILES.user_id, DRIVER_PROFILES.user_id, VEHICLES.vehicle_id
FK nội bộ: VEHICLES.driver_id, AVAILABILITY_SESSIONS.driver_id,
           DRIVER_LOCATIONS.driver_id
Reference ngoài service: PROFILES.user_id -> Identity.users.user_id
```

**CSDL tương ứng:**

| Bảng/collection | Khóa và dữ liệu chính |
|---|---|
| `profiles` | `user_id`; thông tin hiển thị, phone, email. `user_id` là reference đến Identity, không phải FK xuyên service. |
| `driver_profiles` | `user_id`; eligibility, rating average. |
| `vehicles` | `vehicle_id`; driver ID, license plate, type, brand, model, status. |
| `availability_sessions` | `session_id`; driver, `ONLINE`/`OFFLINE`/`BUSY`, thời gian. |
| `driver_locations` | `location_id`; tọa độ và timestamp, nên partition theo thời gian. |

Redis key đề xuất: `driver:availability:{driverId}` và GEO set `drivers:locations`.

### 7.4. BC03 - Booking

**Database type:** PostgreSQL. Booking có state transition, optimistic locking và cần transaction khi cập nhật trạng thái.

**ERD:**

```text
BOOKINGS (1) --------< BOOKING_ADDRESSES
     |
     +--------------< BOOKING_STATUS_HISTORY

BOOKINGS.trip_id -> Trip service (reference ID, không phải FK)
PK: BOOKINGS.booking_id
FK nội bộ: BOOKING_ADDRESSES.booking_id,
           BOOKING_STATUS_HISTORY.booking_id
```

**CSDL tương ứng:**

| Bảng | Khóa và dữ liệu chính |
|---|---|
| `bookings` | `booking_id`; customer reference, status, note, trip reference, version. |
| `booking_addresses` | `address_id`; booking, `PICKUP`/`DESTINATION`, text và tọa độ. |
| `booking_status_history` | `history_id`; trạng thái trước/sau, lý do và thời điểm. |

Ràng buộc: mỗi Booking có đúng một Pickup và một Destination; `version` dùng optimistic locking. `NO_DRIVER_AVAILABLE` chỉ được thêm vào enum sau khi nghiệp vụ chốt.

### 7.5. BC04 - Driver Assignment

**Database type:** PostgreSQL cho kết quả phân công và lịch sử; Redis cho candidate set, TTL timeout và distributed lock. Không lưu toàn bộ Driver profile.

**ERD:**

```text
ASSIGNMENTS (1) --------< ASSIGNMENT_ATTEMPTS
      |
      +-----------------< ASSIGNMENT_EVENTS

ASSIGNMENTS.booking_id, trip_id, winning_driver_id -> context khác
PK: ASSIGNMENTS.assignment_id
FK nội bộ: ATTEMPTS.assignment_id,
           EVENTS.assignment_id/attempt_id
```

**CSDL tương ứng:**

| Bảng/collection | Khóa và dữ liệu chính |
|---|---|
| `assignments` | `assignment_id`; booking/trip reference, winning driver, status. Unique active assignment theo `booking_id`. |
| `assignment_attempts` | `attempt_id`; candidate driver, thứ tự, request/expiry/response và lý do. |
| `assignment_events` | `event_id`; Accept, Reject, Timeout, Reassignment, payload và timestamp. |

Redis key đề xuất: `assignment:candidates:{bookingId}`, `assignment:lock:{bookingId}`, `assignment:timeout:{attemptId}`.

### 7.6. BC05 - Trip Operations

**Database type:** PostgreSQL cho Trip và status history; Redis GEO cho current location; Kafka/RabbitMQ cho `TripStatusChanged` và `DriverLocationUpdated` nếu tách service.

**ERD:**

```text
TRIPS (1) --------< TRIP_STATUS_HISTORY
   |
   +---------------< TRIP_LOCATIONS
   +---------------< TRIP_INCIDENTS

TRIPS.booking_id -> Booking service
TRIPS.driver_id  -> Profile service
PK: TRIPS.trip_id
FK nội bộ: *_HISTORY.trip_id, TRIP_LOCATIONS.trip_id,
           TRIP_INCIDENTS.trip_id
```

**CSDL tương ứng:**

| Bảng/collection | Khóa và dữ liệu chính |
|---|---|
| `trips` | `trip_id`; booking/driver reference, status, started/completed time, version. |
| `trip_status_history` | `history_id`; from/to status, actor và thời điểm. |
| `trip_locations` | `location_id`; tọa độ, timestamp; partition/retention theo thời gian. |
| `trip_incidents` | `incident_id`; loại sự cố, mô tả, status và thời điểm. |

Không tạo FK đến `bookings.booking_id` hoặc `driver_profiles.user_id` vì đó là dữ liệu của service khác.

### 7.7. BC06 - Pricing and Payment

**Database type:** PostgreSQL. Payment cần idempotency, transaction, unique provider transaction và audit trạng thái. Có thể dùng queue cho retry/outbox.

**ERD:**

```text
FARES (1) --------< PAYMENTS (N)
                       |
                       +-- (1:N) PAYMENT_ATTEMPTS
                                      |
                                      +-- (0..1) PROVIDER_TRANSACTIONS
                       |
                       +-- (1:N) PAYMENT_STATUS_HISTORY

PAYMENTS.trip_id -> Trip service (reference ID)
PK: FARES.fare_id, PAYMENTS.payment_id
FK nội bộ: PAYMENTS.fare_id, ATTEMPTS.payment_id,
           PROVIDER_TRANSACTIONS.attempt_id,
           STATUS_HISTORY.payment_id
```

**CSDL tương ứng:**

| Bảng | Khóa và dữ liệu chính |
|---|---|
| `fares` | `fare_id`; trip reference, amount, currency, pricing version, factors. |
| `payments` | `payment_id`; trip/fare reference, method, status, idempotency key, paid time. |
| `payment_attempts` | `attempt_id`; lần thử, status, failure reason và request time. |
| `provider_transactions` | `provider_transaction_id`; provider, external transaction ID, provider status. |
| `payment_status_history` | `history_id`; from/to status và timestamp. |

Không lưu card number, CVV, password hoặc payment credential. Payment điện tử phải có idempotency key để callback/retry không tạo giao dịch trùng.

### 7.8. BC07 - Notification

**Database type:** PostgreSQL cho Notification và trạng thái đọc; RabbitMQ/Kafka/Redis Streams cho queue/event; Redis cache cho unread count.

**ERD:**

```text
NOTIFICATION_TEMPLATES (1) ------< NOTIFICATIONS (N)
                                      |
                                      +-- (1:N) NOTIFICATION_DELIVERIES
                                      +-- (1:N) NOTIFICATION_EVENTS

NOTIFICATIONS.recipient_id -> Identity service (reference ID)
PK: TEMPLATES.template_id, NOTIFICATIONS.notification_id
FK nội bộ: NOTIFICATIONS.template_id, DELIVERIES.notification_id,
           EVENTS.notification_id
```

**CSDL tương ứng:**

| Bảng | Khóa và dữ liệu chính |
|---|---|
| `notification_templates` | `template_id`; event type, channel, language và nội dung mẫu. |
| `notifications` | `notification_id`; recipient reference, title, message, type, is_read. |
| `notification_deliveries` | `delivery_id`; channel, status, retry count, failure reason. |
| `notification_events` | `event_id`; source event ID/type để idempotent khi nhận event. |

`recipient_id` là reference đến Identity; không tạo FK xuyên service.

### 7.9. BC08 - Rating

**Database type:** PostgreSQL. Rating cần transaction và unique constraint để chống đánh giá trùng.

**ERD:**

```text
RATINGS (1) --------< RATING_MODERATION_LOGS

RATINGS.trip_id  -> Trip service (reference ID)
RATINGS.rater_id -> Identity service (reference ID)
RATINGS.driver_id -> Profile service (reference ID)
PK: RATINGS.rating_id
FK nội bộ: RATING_MODERATION_LOGS.rating_id
```

**CSDL tương ứng:**

| Bảng | Khóa và dữ liệu chính |
|---|---|
| `ratings` | `rating_id`; trip/rater/driver reference, score 1-5, comment, timestamps. Unique theo `trip_id`, `rater_id` nếu mỗi Customer chỉ đánh giá một lần. |
| `rating_moderation_logs` | `log_id`; rating, staff reference, action, reason và timestamp. |

Không tạo FK đến Trip hoặc User database; Rating kiểm tra quyền và trạng thái Trip qua API/event.

### 7.10. BC09 - Operations Administration

**Database type:** PostgreSQL cho Incident, quyền và Audit; Elasticsearch/OpenSearch là tùy chọn cho truy vấn audit/read model lớn.

**ERD:**

```text
ADMIN_USERS (1) --------< ADMIN_ACTIONS (N) --------< AUDIT_LOGS
      |
      +-----------------< INCIDENTS (N) --------< INCIDENT_NOTES

INCIDENTS.resource_id / ADMIN_ACTIONS.resource_id -> context nguồn
PK: ADMIN_USERS.staff_id, INCIDENTS.incident_id,
    ADMIN_ACTIONS.action_id, AUDIT_LOGS.audit_id
FK nội bộ: ACTIONS.staff_id, AUDIT_LOGS.action_id,
           INCIDENTS.staff_id, NOTES.incident_id/staff_id
```

**CSDL tương ứng:**

| Bảng | Khóa và dữ liệu chính |
|---|---|
| `admin_users` | `staff_id`; role và status snapshot, reference đến Identity. |
| `incidents` | `incident_id`; resource type/ID, loại, status, mô tả, người xử lý. |
| `incident_notes` | `note_id`; incident, staff và nội dung ghi chú. |
| `admin_actions` | `action_id`; resource, action, reason, before/after state. |
| `audit_logs` | `audit_id`; action, result, correlation ID và timestamp. |

Các `resource_id` là reference đến Booking/Trip/Profile; Admin không sở hữu bản ghi nguồn.

### 7.11. BC10 - History and Reporting

**Database type:** PostgreSQL read model cho quy mô vừa. Khi dữ liệu lớn, dùng ClickHouse hoặc BigQuery cho báo cáo phân tích; object storage dùng archive. Đây không phải source-of-truth transaction database.

**ERD:**

```text
TRIP_HISTORY_PROJECTIONS (N) ----> DAILY_TRIP_REPORTS (1 per day)
              |
              +------------------> DRIVER_PERFORMANCE_DAILY

PAYMENT_HISTORY_PROJECTIONS (N) -> DAILY_REVENUE_REPORTS (1 per day/currency)

Các projection nhận event từ Trip/Payment service.
Không có FK xuyên service; khóa chính là ID nguồn hoặc (report_date, driver_id).
```

**CSDL tương ứng:**

| Bảng | Khóa và dữ liệu chính |
|---|---|
| `trip_history_projections` | `trip_id`; booking/customer/driver references, status và timestamps từ Trip events. |
| `payment_history_projections` | `payment_id`; trip reference, amount, currency, method, status và paid time. |
| `daily_trip_reports` | `report_date`; total, completed, cancelled trips. |
| `daily_revenue_reports` | `report_date`, currency; doanh thu và số lượng payment. |
| `driver_performance_daily` | Khóa ghép `report_date`, `driver_id`; KPI hoạt động và rating trung bình. |

Không tạo FK đến Trip/Payment service. Projection phải có `source_updated_at` và cơ chế upsert theo event ID để xử lý event đến trùng hoặc không đúng thứ tự.

## 8. Bảng tổng hợp lựa chọn CSDL

| Bounded context | CSDL chính | Thành phần bổ trợ | Lý do |
|---|---|---|---|
| Identity and Access | PostgreSQL | Redis tùy chọn | Credential, role và transaction. |
| Profile and Fleet | PostgreSQL | Redis GEO | Profile/Vehicle quan hệ; vị trí cần truy vấn gần nhất. |
| Booking | PostgreSQL | - | State transition và locking. |
| Driver Assignment | PostgreSQL | Redis | Lịch sử phân công bền vững; candidate/timeout/lock nhanh. |
| Trip Operations | PostgreSQL | Redis GEO, Kafka/RabbitMQ | Trip bền vững; vị trí và event có tần suất cao. |
| Pricing and Payment | PostgreSQL | Queue/Outbox | Idempotency, transaction và audit thanh toán. |
| Notification | PostgreSQL | Kafka/RabbitMQ, Redis | Lưu thông báo; queue gửi và cache unread. |
| Rating | PostgreSQL | - | Constraint chống đánh giá trùng. |
| Operations Administration | PostgreSQL | OpenSearch tùy chọn | Incident/Audit transaction; tìm kiếm log. |
| History and Reporting | PostgreSQL read model | ClickHouse/BigQuery, object storage | Truy vấn lịch sử vừa; phân tích lớn khi cần. |

## 9. Chiến lược xây dựng CSDL

DDL PostgreSQL tham chiếu cho các bảng lõi được cung cấp tại [database_schema.sql](database_schema.sql). File này dùng nhiều schema trong một PostgreSQL instance để thuận tiện chạy thử theo mô hình modular monolith; khi tách microservice, mỗi schema có thể chuyển thành database riêng.

### Giai đoạn 1 - Modular monolith

- Dùng một PostgreSQL instance nhưng tạo schema riêng: `identity`, `profile`, `booking`, `assignment`, `trip`, `payment`, `notification`, `rating`, `operations`, `reporting`.
- Vẫn giữ quy tắc không dùng bảng của schema khác trực tiếp trong domain code; giao tiếp qua module interface.
- Chạy migration riêng theo từng context, ví dụ `V001__identity_users.sql`, `V001__booking_bookings.sql`.

### Giai đoạn 2 - Tách microservice

- Mỗi context chuyển sang database/schema độc lập.
- Xóa FK xuyên context; thay bằng reference ID, API và event.
- Dùng transactional outbox cho event quan trọng như `BookingCreated`, `DriverAssigned`, `TripStatusChanged` và `PaymentSucceeded`.
- Dùng consumer idempotency table để một event được xử lý nhiều lần vẫn cho cùng kết quả.

### Ràng buộc cần áp dụng

- Tất cả bảng có UUID, `created_at`, `updated_at`; bảng lịch sử có `occurred_at`.
- Password và credential luôn hash/encrypt; không lưu dữ liệu thẻ nhạy cảm.
- Các thao tác tạo Payment, Accept Assignment và chuyển Trip status phải hỗ trợ idempotency.
- Index tối thiểu: các foreign/reference ID, status, timestamps; index GEO riêng cho location.
- Mọi migration phải có rollback hoặc kế hoạch forward migration và được kiểm tra bằng dữ liệu mẫu từ API schema.
