# repair_mcs.md

# Kế hoạch sửa và hoàn thiện Microservices cho Cab System

## 1. Mục tiêu

Tài liệu này tổng hợp các vấn đề cần sửa trong hệ thống Cab System hiện tại để luồng nghiệp vụ đặt xe hoạt động hợp lý hơn theo trình tự:

`Đăng nhập → chọn điểm đón/điểm đến → ước tính quãng đường và giá → tạo booking → tìm tài xế → tài xế chấp nhận/từ chối → tạo trip → theo dõi chuyến → hoàn thành → thanh toán → đánh giá`.

Các service hiện có gồm:

- `auth-service`
- `profile-fleet-service`
- `booking-service`
- `driver-assignment-service`
- `trip-service`
- `payment-service`
- `notification-service`
- `rating-service`
- `operations-service`
- `reporting-service`

Không cần viết lại toàn bộ kiến trúc. Cần tập trung sửa workflow và bổ sung các API còn thiếu.

---

# 2. Mức độ ưu tiên

## P0 — Cần sửa trước để luồng đặt xe đúng nghiệp vụ

1. Loại bỏ `DEFAULT_DRIVER_ID` khỏi quy trình đặt xe thực tế.
2. Bổ sung cơ chế quản lý tài xế online/offline và vị trí tài xế.
3. Bổ sung cơ chế tìm tài xế phù hợp.
4. Bổ sung luồng tài xế Accept/Reject.
5. Không tạo Trip trước khi tài xế chấp nhận chuyến.
6. Chuẩn hóa trạng thái Booking, Assignment và Trip.

## P1 — Cần có để app đặt xe hoàn chỉnh

7. Bổ sung tính khoảng cách/thời gian trước khi booking.
8. Bổ sung API ước tính giá trước chuyến.
9. Kiểm soát quyền truy cập các API đang thiếu authentication/authorization.
10. Bổ sung validation chuyển trạng thái Trip.
11. Hoàn thiện thanh toán điện tử.

## P2 — Nâng cao chất lượng hệ thống

12. Cải thiện realtime location.
13. Hoàn thiện lịch sử chuyến cho tài xế.
14. Đồng bộ trạng thái giữa Booking, Assignment và Trip.
15. Hoàn thiện notification theo từng giai đoạn chuyến.

---

# 3. Lỗi 1 — Booking đang phụ thuộc vào `driverId` / `DEFAULT_DRIVER_ID`

## Hiện trạng

`POST /bookings` hiện cho phép truyền:

```json
{
  "pickup": {},
  "destination": {},
  "vehicleType": "CAR",
  "note": "",
  "driverId": "..."
}
```

Nếu không có `driverId`, hệ thống có thể sử dụng `DEFAULT_DRIVER_ID`.

## Vấn đề

Customer không nên biết hoặc tự chọn `driverId` trong luồng đặt xe thông thường.

Việc sử dụng `DEFAULT_DRIVER_ID` chỉ phù hợp để test/demo, không phù hợp với workflow thực tế.

Luồng hiện tại:

```text
Customer
   ↓
POST /bookings
   ↓
driverId / DEFAULT_DRIVER_ID
   ↓
Assignment Service
```

## Cần sửa

Bỏ `driverId` khỏi request public:

```json
{
  "pickup": {
    "latitude": 10.0,
    "longitude": 106.0
  },
  "destination": {
    "latitude": 10.1,
    "longitude": 106.1
  },
  "vehicleType": "CAR",
  "note": ""
}
```

Sau khi tạo booking:

```text
Booking
   ↓
status = SEARCHING_DRIVER
   ↓
Matching/Assignment Service tự tìm driver
```

## Tiêu chí hoàn thành

- Customer không truyền `driverId`.
- Không sử dụng `DEFAULT_DRIVER_ID` trong production workflow.
- Booking mới chuyển sang `SEARCHING_DRIVER`.
- Driver được lựa chọn bởi backend.

---

# 4. Lỗi 2 — Chưa có trạng thái online/offline của tài xế

## Vấn đề

Muốn tìm tài xế gần khách, hệ thống phải biết:

- tài xế nào đang online;
- tài xế nào đang bận;
- vị trí hiện tại;
- loại phương tiện;
- tài xế có đủ điều kiện nhận chuyến hay không.

Hiện tại hệ thống chưa thể hiện đầy đủ cơ chế này.

## Cần bổ sung

Có thể mở rộng `profile-fleet-service` hoặc tạo `driver-service`.

Ví dụ API:

```http
PATCH /drivers/me/availability
```

Request:

```json
{
  "status": "ONLINE"
}
```

Các trạng thái đề xuất:

```text
OFFLINE
ONLINE
BUSY
```

API cập nhật vị trí:

```http
PATCH /drivers/me/location
```

Request:

```json
{
  "latitude": 10.762,
  "longitude": 106.682
}
```

## Dữ liệu tối thiểu

```text
driver_id
availability_status
latitude
longitude
vehicle_type
updated_at
```

## Tiêu chí hoàn thành

Matching Service có thể truy vấn được danh sách tài xế:

```text
ONLINE
+ đúng vehicleType
+ có location hợp lệ
+ không có trip đang chạy
```

---

# 5. Lỗi 3 — Chưa có cơ chế tìm tài xế phù hợp

## Hiện trạng

`driver-assignment-service` hiện nhận trực tiếp `driverId`.

## Vấn đề

Assignment Service đang thực hiện việc "gán tài xế đã biết" thay vì "tìm tài xế".

## Workflow cần sửa

```text
Booking Service
     ↓
SEARCHING_DRIVER
     ↓
Driver Matching
     ↓
Lấy danh sách ONLINE drivers
     ↓
Lọc theo vehicleType
     ↓
Tính khoảng cách đến pickup
     ↓
Sắp xếp tài xế phù hợp
     ↓
Gửi offer
```

Có thể bổ sung API nội bộ:

```http
POST /assignments/search
```

Request:

```json
{
  "bookingId": "...",
  "pickup": {
    "latitude": 10.0,
    "longitude": 106.0
  },
  "vehicleType": "CAR"
}
```

## Không tìm thấy tài xế

Không được tạo Trip giả.

Giữ:

```text
booking.status = SEARCHING_DRIVER
```

Sau đó:

- retry sau một khoảng thời gian;
- mở rộng bán kính;
- hoặc thông báo không tìm thấy tài xế.

## Tiêu chí hoàn thành

Không cần `driverId` từ customer nhưng hệ thống vẫn có thể xác định driver phù hợp.

---

# 6. Lỗi 4 — Thiếu luồng Driver Accept / Reject

## Hiện trạng

Assignment Service có API cập nhật trạng thái chung:

```http
PATCH /assignments/:assignmentId
```

nhưng chưa thể hiện rõ nghiệp vụ tài xế nhận/từ chối chuyến.

## Cần bổ sung

Nên có API rõ nghĩa:

```http
POST /assignments/:assignmentId/accept
POST /assignments/:assignmentId/reject
```

### Accept

```text
Driver
  ↓
Accept
  ↓
Kiểm tra assignment còn PENDING
  ↓
Assignment = ASSIGNED
  ↓
Booking = DRIVER_ASSIGNED
  ↓
Tạo Trip
```

### Reject

```text
Driver
  ↓
Reject
  ↓
Assignment = REJECTED
  ↓
Booking vẫn SEARCHING_DRIVER
  ↓
Tìm driver khác
```

## Cần kiểm tra

Driver chỉ được accept assignment được gửi cho chính mình.

Không được:

```text
Driver A
   ↓
accept assignment của Driver B
```

## Tiêu chí hoàn thành

- Có Accept.
- Có Reject.
- Reject kích hoạt tìm tài xế tiếp theo.
- Accept mới dẫn đến Trip.
- Có authorization theo driver.

---

# 7. Lỗi 5 — Trip được tạo quá sớm

## Hiện trạng

Workflow hiện tại:

```text
POST /assignments
   ↓
Tạo assignment PENDING
   ↓
POST /trips
   ↓
Tạo Trip
   ↓
Assignment = ASSIGNED
```

## Vấn đề

Trip được tạo trước khi tài xế thực sự xác nhận nhận chuyến.

Nếu driver từ chối thì Trip đã tồn tại không đúng nghiệp vụ.

## Workflow đề xuất

```text
Booking
   ↓
SEARCHING_DRIVER
   ↓
Assignment = PENDING
   ↓
Gửi offer cho Driver
   ↓
Driver ACCEPT
   ↓
Assignment = ASSIGNED
   ↓
Booking = DRIVER_ASSIGNED
   ↓
POST /trips
   ↓
Trip được tạo
```

## Tiêu chí hoàn thành

`POST /trips` chỉ được gọi sau khi assignment được Accept thành công.

---

# 8. Lỗi 6 — Thiếu tính khoảng cách và thời gian trước chuyến

## Hiện trạng

Booking đã chứa pickup và destination nhưng chưa có workflow rõ ràng để tính:

```text
distanceKm
durationMinutes
```

trước khi khách đặt.

## Cần bổ sung

Tạo `location-service`, `route-service`, hoặc tích hợp chức năng này vào service phù hợp.

Ví dụ:

```http
POST /routes/estimate
```

Request:

```json
{
  "pickup": {
    "latitude": 10.762,
    "longitude": 106.682
  },
  "destination": {
    "latitude": 10.800,
    "longitude": 106.700
  }
}
```

Response:

```json
{
  "distanceKm": 8.2,
  "durationMinutes": 20
}
```

Có thể dùng provider bản đồ bên ngoài sau này.

## Tiêu chí hoàn thành

Trước khi tạo booking, frontend có thể hiển thị:

```text
Khoảng cách: 8.2 km
Thời gian dự kiến: 20 phút
```

---

# 9. Lỗi 7 — Chưa có API báo giá trước khi đặt xe

## Hiện trạng

Payment Service có:

```http
GET /trips/:tripId/fare?distanceKm=...
```

API này phù hợp để tính giá cho Trip đã tồn tại, nhưng khách cần biết giá dự kiến trước khi tạo booking.

## Cần bổ sung

Ví dụ:

```http
POST /pricing/estimate
```

Request:

```json
{
  "distanceKm": 8.2,
  "vehicleType": "CAR"
}
```

Response:

```json
{
  "distanceKm": 8.2,
  "vehicleType": "CAR",
  "estimatedFare": 95000,
  "currency": "VND"
}
```

Workflow:

```text
Pickup + Destination
        ↓
Route Service
        ↓
distanceKm
        ↓
Pricing Service
        ↓
estimatedFare
        ↓
Frontend
        ↓
Customer xác nhận
        ↓
POST /bookings
```

## Tiêu chí hoàn thành

Customer thấy giá dự kiến trước khi bấm "Đặt xe".

---

# 10. Lỗi 8 — Chưa kiểm soát chặt state transition của Trip

## Hiện trạng

`PATCH /trips/:tripId` có thể cập nhật `status`.

## Rủi ro

Nếu không validate transition, có thể xảy ra:

```text
ASSIGNED
   ↓
COMPLETED
```

hoặc:

```text
COMPLETED
   ↓
IN_PROGRESS
```

## Cần chuẩn hóa state machine

Đề xuất:

```text
CREATED
   ↓
DRIVER_ARRIVING
   ↓
DRIVER_ARRIVED
   ↓
IN_PROGRESS
   ↓
COMPLETED
```

Nhánh hủy:

```text
CREATED
   ↓
CANCELLED
```

hoặc theo business rule cho phép hủy ở một số trạng thái khác.

## Validation

Ví dụ:

```js
const allowedTransitions = {
  CREATED: ["DRIVER_ARRIVING", "CANCELLED"],
  DRIVER_ARRIVING: ["DRIVER_ARRIVED", "CANCELLED"],
  DRIVER_ARRIVED: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
};
```

## Tiêu chí hoàn thành

API từ chối mọi transition không hợp lệ bằng lỗi `409` hoặc `400`.

---

# 11. Lỗi 9 — Trạng thái Booking / Assignment / Trip cần đồng bộ

Ba domain có trạng thái riêng:

```text
Booking
Assignment
Trip
```

Nếu cập nhật độc lập có thể sinh trạng thái mâu thuẫn.

Ví dụ:

```text
Booking = SEARCHING_DRIVER
Assignment = ASSIGNED
Trip = IN_PROGRESS
```

là không hợp lý.

## Đề xuất mapping

### Giai đoạn tìm xe

```text
Booking   = SEARCHING_DRIVER
Assignment = PENDING
Trip       = chưa tồn tại
```

### Driver nhận chuyến

```text
Booking    = DRIVER_ASSIGNED
Assignment = ASSIGNED
Trip        = CREATED
```

### Driver đang đến

```text
Booking = DRIVER_ASSIGNED
Trip    = DRIVER_ARRIVING
```

### Đang chở khách

```text
Booking = IN_PROGRESS
Trip    = IN_PROGRESS
```

### Hoàn thành

```text
Booking = COMPLETED
Trip    = COMPLETED
```

### Hủy

```text
Booking = CANCELLED
Trip    = CANCELLED (nếu Trip đã tồn tại)
```

## Tiêu chí hoàn thành

Không tồn tại tổ hợp trạng thái mâu thuẫn giữa ba service sau khi workflow hoàn tất.

---

# 12. Lỗi 10 — Một số API chưa có authentication/authorization

Theo cấu trúc hiện tại, một số route chưa gắn middleware auth đầy đủ, đặc biệt:

```text
profile-fleet-service
operations-service
reporting-service
```

## Rủi ro

Ví dụ nếu:

```http
GET /profiles/:userId
```

không kiểm tra quyền, client có thể thử đọc profile của user khác.

## Cần sửa

Phân biệt:

```text
User JWT
Service-to-Service Auth
Admin Auth
```

Ví dụ:

```text
/profile/me
```

nên lấy:

```js
req.user.sub
```

thay vì để client tự truyền userId nếu không cần thiết.

Reporting nên giới hạn:

```text
ADMIN / OPERATIONS
```

Operations cũng cần role phù hợp.

## Tiêu chí hoàn thành

Mọi API public/private đều xác định rõ:

- ai được gọi;
- JWT hay service auth;
- role nào được phép;
- tài nguyên có thuộc user đó hay không.

---

# 13. Lỗi 11 — Thanh toán điện tử mới dừng ở PENDING

## Hiện trạng

```text
CASH
 ↓
SUCCESS

ELECTRONIC
 ↓
PENDING
```

## Vấn đề

Chưa có workflow hoàn tất electronic payment.

## Cần bổ sung

Ví dụ:

```text
Create Payment
      ↓
PENDING
      ↓
Payment Provider
      ↓
Webhook / Callback
      ↓
SUCCESS / FAILED
```

Có thể bổ sung internal endpoint:

```http
POST /payments/:paymentId/confirm
```

hoặc webhook:

```http
POST /payments/webhook
```

## Tiêu chí hoàn thành

Electronic payment cuối cùng phải chuyển được sang:

```text
SUCCESS
```

hoặc:

```text
FAILED
```

và xử lý idempotency để callback lặp không tạo giao dịch trùng.

---

# 14. Lỗi 12 — Location hiện tại phù hợp demo nhưng chưa realtime tốt

Hiện có:

```http
PATCH /trips/:tripId/location
GET /trips/:tripId/location
```

Cách này có thể chạy cho đồ án.

Luồng:

```text
Driver
   ↓
PATCH location
   ↓
Trip Service

Customer
   ↓
GET location
   ↓
Frontend map
```

## Vấn đề khi polling liên tục

Nếu frontend gọi:

```text
GET /location
```

mỗi 1–2 giây thì số request tăng mạnh.

## Nâng cấp sau

Có thể dùng:

```text
WebSocket / Socket.IO
```

Workflow:

```text
Driver GPS
   ↓
Trip Service
   ↓
WebSocket
   ↓
Customer
```

Đây là P2, không bắt buộc để hoàn thành phiên bản đồ án ban đầu.

---

# 15. Lỗi 13 — Thiếu lịch sử chuyến dành riêng cho Driver

Booking Service hiện hỗ trợ customer lấy booking của chính mình.

Driver cũng nên có API như:

```http
GET /drivers/me/trips
```

hoặc:

```http
GET /trips?driverId=me
```

nhưng backend phải lấy identity từ JWT thay vì tin tưởng `driverId` do client tùy ý gửi.

Response có thể gồm:

```json
{
  "data": [
    {
      "tripId": "...",
      "pickup": {},
      "destination": {},
      "status": "COMPLETED",
      "fare": 95000,
      "completedAt": "..."
    }
  ]
}
```

## Tiêu chí hoàn thành

Customer và Driver đều xem được lịch sử của chính mình nhưng không đọc trái phép lịch sử của người khác.

---

# 16. Lỗi 14 — Notification chưa bao phủ toàn bộ lifecycle

Hiện đã có các notification như:

```text
DRIVER_ASSIGNED
PAYMENT_CREATED
RATING_SUBMITTED
```

Nên cân nhắc bổ sung:

```text
DRIVER_OFFERED_TRIP
DRIVER_ASSIGNED
DRIVER_ARRIVED
TRIP_STARTED
TRIP_COMPLETED
PAYMENT_SUCCESS
PAYMENT_FAILED
BOOKING_CANCELLED
```

## Tiêu chí hoàn thành

Các sự kiện quan trọng trong chuyến đều có khả năng thông báo cho actor liên quan.

---

# 17. Workflow mục tiêu sau khi sửa

```text
CUSTOMER
   ↓
POST /auth/login
   ↓
Nhận accessToken
   ↓
Chọn pickup + destination
   ↓
Route Service
   ↓
distanceKm + duration
   ↓
Pricing Estimate
   ↓
estimatedFare
   ↓
Customer chọn vehicleType
   ↓
POST /bookings
   ↓
Booking = SEARCHING_DRIVER
   ↓
Driver Matching
   ↓
Tìm ONLINE driver gần pickup
   ↓
Assignment = PENDING
   ↓
Notification cho Driver
   ↓
Driver ACCEPT / REJECT
   │
   ├── REJECT
   │      ↓
   │   tìm driver khác
   │
   └── ACCEPT
          ↓
      Assignment = ASSIGNED
          ↓
      Booking = DRIVER_ASSIGNED
          ↓
      Tạo Trip
          ↓
      DRIVER_ARRIVING
          ↓
      Driver cập nhật GPS
          ↓
      DRIVER_ARRIVED
          ↓
      IN_PROGRESS
          ↓
      COMPLETED
          ↓
      Tính final fare
          ↓
      Payment
       /       \
    CASH     ELECTRONIC
      ↓           ↓
   SUCCESS     PENDING
                  ↓
             Provider callback
              /         \
          SUCCESS       FAILED
              ↓
          Rating
              ↓
          Hoàn tất
```

---

# 18. Thứ tự triển khai đề xuất

## Phase 1 — Sửa core booking

1. Bỏ `driverId` khỏi public `POST /bookings`.
2. Bỏ `DEFAULT_DRIVER_ID`.
3. Thêm driver availability.
4. Thêm driver location.
5. Thêm matching.
6. Thêm Accept/Reject.
7. Chuyển việc tạo Trip sang sau Accept.

## Phase 2 — Route và Pricing

8. Thêm route/distance estimation.
9. Thêm estimated fare.
10. Lưu snapshot giá cần thiết vào booking nếu business rule yêu cầu.

## Phase 3 — Trip lifecycle

11. Chuẩn hóa Trip statuses.
12. Validate state transition.
13. Đồng bộ Booking/Assignment/Trip.
14. Hoàn thiện cancel workflow.

## Phase 4 — Payment

15. Giữ CASH workflow.
16. Hoàn thiện ELECTRONIC callback/webhook.
17. Bảo đảm idempotency.

## Phase 5 — Security

18. Gắn authentication cho Profile.
19. Gắn authorization cho Operations.
20. Gắn authorization cho Reporting.
21. Kiểm tra ownership của Booking/Trip/Assignment/Rating.

## Phase 6 — UX / realtime

22. Hoàn thiện notifications.
23. Thêm Driver trip history.
24. Nếu cần, thay location polling bằng WebSocket.

---

# 19. Các phần hiện tại có thể giữ lại

Không cần sửa lớn các phần sau:

- JWT login/register của `auth-service`.
- Booking CRUD cơ bản.
- Cấu trúc service-to-service HTTP.
- `trip-service` làm nơi quản lý lifecycle của chuyến.
- API lưu vị trí trip.
- `payment-service` và helper tính fare cơ bản.
- `notification-service`.
- `rating-service`.
- `operations-service` về mặt chức năng incident.
- `reporting-service` về mặt mục đích báo cáo.

Chủ yếu cần bổ sung authorization, workflow và validation.

---

# 20. Definition of Done cho luồng đặt xe

Có thể coi core Cab System hoàn thành khi test được xuyên suốt:

```text
1. Customer login.
2. Customer nhập pickup và destination.
3. Hệ thống tính distance/duration.
4. Hệ thống trả estimated fare.
5. Customer tạo booking.
6. Booking chuyển SEARCHING_DRIVER.
7. Hệ thống tìm driver ONLINE phù hợp.
8. Driver nhận offer.
9. Driver accept.
10. Assignment chuyển ASSIGNED.
11. Trip được tạo.
12. Driver cập nhật location.
13. Driver báo đã đến.
14. Driver bắt đầu chuyến.
15. Driver hoàn thành chuyến.
16. Hệ thống tính final fare.
17. Customer thanh toán.
18. Payment SUCCESS.
19. Customer đánh giá driver.
20. Customer và Driver xem lại lịch sử chuyến.
```

Nếu Driver Reject ở bước 9:

```text
Assignment = REJECTED
      ↓
Booking vẫn SEARCHING_DRIVER
      ↓
Hệ thống tìm Driver khác
```

Nếu không tìm được Driver:

```text
SEARCHING_DRIVER
      ↓
Retry / mở rộng vùng tìm kiếm
      ↓
Hết thời gian
      ↓
Thông báo Customer
```

Đây nên là luồng chuẩn dùng để kiểm tra việc sửa các microservice.
