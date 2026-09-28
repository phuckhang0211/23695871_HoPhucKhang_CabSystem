# API trong thư mục `services/`

Tài liệu này mô tả các microservice và API đang được hiện thực trong thư mục `services/`. Nội dung tập trung vào route runtime của từng service, chức năng chính, dữ liệu vào/ra quan trọng và các lời gọi nội bộ giữa service.

> Ghi chú: các API dưới đây là API hiện có trong code. Một số endpoint có thể khác với tài liệu OpenAPI tổng quát ở `document/api_documents/`.

## 1. Quy ước chung

- Các service dùng ExpressJS và trả dữ liệu JSON.
- Mỗi service có endpoint kiểm tra trạng thái:

| Method | Endpoint | Chức năng |
|---|---|---|
| GET | `/health` | Trả `{ service, status: "ok" }` để kiểm tra service đang hoạt động. |

- API public của `booking-service` dùng JWT thông qua `requireAuth`.
- Nhiều API nội bộ dùng `requireServiceAuth`, tức cần header xác thực service-to-service theo `services/shared/internal-auth.js`.
- Các service giao tiếp nội bộ bằng HTTP qua `services/shared/http-client.js`.
- Giá chuyến đi được tính bằng helper `services/shared/pricing.js`.

## 2. Auth Service

**Thư mục:** `services/auth-service`  
**Port mặc định:** `3001`  
**Vai trò:** quản lý đăng ký, đăng nhập, hash mật khẩu và phát JWT access token.

### API

| Method | Endpoint | Auth | Chức năng |
|---|---|---|---|
| POST | `/auth/register` | Không yêu cầu | Đăng ký tài khoản mới cho `CUSTOMER` hoặc `DRIVER`. |
| POST | `/auth/login` | Không yêu cầu | Đăng nhập bằng `identifier` và `password`, trả access token. |

### `POST /auth/register`

Request body chính:

| Trường | Bắt buộc | Ghi chú |
|---|---:|---|
| `name` | Có | Tên người dùng. |
| `phone` | Có | Số điện thoại, dùng để định danh. |
| `email` | Không | Email người dùng. |
| `password` | Có | Mật khẩu được hash bằng `crypto.scryptSync`. |
| `role` | Không | Mặc định `CUSTOMER`; chỉ chấp nhận `CUSTOMER` hoặc `DRIVER`. |

Chức năng xử lý:

- Kiểm tra `name`, `phone`, `password` và `role`.
- Tạo user mới trong database.
- Hash password trước khi lưu.
- Trả thông tin user đã ẩn dữ liệu nhạy cảm và `accessToken` JWT.

### `POST /auth/login`

Request body chính:

| Trường | Bắt buộc | Ghi chú |
|---|---:|---|
| `identifier` | Có | Định danh đăng nhập, service dùng để tìm user. |
| `password` | Có | Mật khẩu cần xác thực. |

Chức năng xử lý:

- Tìm user theo identifier.
- So khớp password với password hash bằng so sánh an toàn thời gian.
- Nếu hợp lệ, trả `{ user, accessToken, tokenType: "Bearer" }`.
- Nếu sai thông tin, trả lỗi `401 INVALID_CREDENTIALS`.

## 3. Profile Fleet Service

**Thư mục:** `services/profile-fleet-service`  
**Vai trò:** lưu và cập nhật hồ sơ người dùng ở mức profile.

### API

| Method | Endpoint | Auth | Chức năng |
|---|---|---|---|
| GET | `/profiles/:userId` | Chưa gắn middleware auth trong route | Lấy profile theo `userId`. |
| PUT | `/profiles/:userId` | Chưa gắn middleware auth trong route | Tạo mới hoặc cập nhật profile theo `userId`. |

### `GET /profiles/:userId`

Chức năng xử lý:

- Truy vấn bảng `profiles` theo `user_id`.
- Trả profile nếu tồn tại.

### `PUT /profiles/:userId`

Request body chính:

| Trường | Bắt buộc | Ghi chú |
|---|---:|---|
| `displayName` | Có theo logic lưu hiện tại | Tên hiển thị. |
| `phone` | Không | Số điện thoại. |
| `email` | Không | Email. |

Chức năng xử lý:

- `INSERT` profile mới.
- Nếu `user_id` đã tồn tại thì `ON CONFLICT` cập nhật `display_name`, `phone`, `email`.
- Trả profile sau khi lưu.

## 4. Booking Service

**Thư mục:** `services/booking-service`  
**Port mặc định:** `3002`  
**Vai trò:** tạo và quản lý yêu cầu đặt xe của customer, đồng thời khởi động quy trình phân công tài xế.

### API

| Method | Endpoint | Auth | Chức năng |
|---|---|---|---|
| POST | `/bookings` | JWT user | Tạo booking mới và gọi assignment service để phân công tài xế. |
| GET | `/bookings` | JWT user | Lấy danh sách booking của user đang đăng nhập. |
| GET | `/bookings/:bookingId` | JWT user | Lấy chi tiết booking thuộc user đang đăng nhập. |
| PATCH | `/bookings/:bookingId` | JWT user | Cập nhật booking khi booking còn ở trạng thái `REQUESTED`. |
| DELETE | `/bookings/:bookingId` | JWT user | Hủy booking khi trạng thái là `REQUESTED` hoặc `SEARCHING_DRIVER`. |

### `POST /bookings`

Request body chính:

| Trường | Bắt buộc | Ghi chú |
|---|---:|---|
| `pickup` | Có | Cần có tọa độ, tối thiểu `latitude`. |
| `destination` | Có | Cần có tọa độ, tối thiểu `latitude`. |
| `vehicleType` | Không | Mặc định `CAR`. |
| `note` | Không | Ghi chú đặt xe. |
| `driverId` | Không | Nếu có thì chuyển sang assignment service; nếu không dùng `DEFAULT_DRIVER_ID`. |

Chức năng xử lý:

- Tạo bản ghi trong bảng `bookings` với `customer_id` lấy từ JWT `req.user.sub`.
- Gọi `driver-assignment-service` qua `POST {ASSIGNMENT_SERVICE_URL}/assignments`.
- Nếu phân công thành công, trả `201` gồm `{ booking, assignment }`.
- Nếu workflow phân công lỗi, cập nhật booking sang `SEARCHING_DRIVER` và trả `202` để báo quy trình sẽ retry.

### `GET /bookings`

Chức năng xử lý:

- Lấy tất cả booking của user đang đăng nhập.
- Sắp xếp mới nhất trước.
- Trả `{ data: [...] }`.

### `GET /bookings/:bookingId`

Chức năng xử lý:

- Chỉ trả booking nếu `booking_id` thuộc `customer_id` của user đang đăng nhập.
- Nếu không tìm thấy, trả `404 NOT_FOUND`.

### `PATCH /bookings/:bookingId`

Request body có thể gồm:

| Trường | Ghi chú |
|---|---|
| `pickup` | Điểm đón mới. |
| `destination` | Điểm đến mới. |
| `note` | Ghi chú mới. |

Chức năng xử lý:

- Chỉ cập nhật khi booking thuộc user hiện tại và trạng thái còn là `REQUESTED`.
- Cập nhật `pickup`, `destination`, `note` bằng `COALESCE`.
- Nếu không còn được sửa, trả `404` với thông báo `Editable booking not found`.

### `DELETE /bookings/:bookingId`

Chức năng xử lý:

- Chuyển trạng thái booking sang `CANCELLED`.
- Chỉ cho hủy khi trạng thái là `REQUESTED` hoặc `SEARCHING_DRIVER`.
- Nếu không tìm thấy booking có thể hủy, trả `404`.

## 5. Driver Assignment Service

**Thư mục:** `services/driver-assignment-service`  
**Vai trò:** tạo assignment cho booking, tạo trip tương ứng và gửi thông báo khi đã có tài xế.

### API

| Method | Endpoint | Auth | Chức năng |
|---|---|---|---|
| POST | `/assignments` | Service auth | Tạo assignment cho booking và tạo trip. |
| GET | `/assignments/:assignmentId` | Service auth | Xem thông tin assignment. |
| PATCH | `/assignments/:assignmentId` | Service auth | Cập nhật trạng thái assignment. |

### `POST /assignments`

Request body chính:

| Trường | Bắt buộc | Ghi chú |
|---|---:|---|
| `bookingId` | Có | Booking cần phân công. |
| `driverId` | Có | Tài xế được gán. |
| `customerId` | Không | Dùng để gửi notification cho customer. |

Chức năng xử lý:

- Kiểm tra `bookingId` và `driverId`.
- Tạo assignment trạng thái `PENDING`.
- Gọi `trip-service` qua `POST {TRIP_SERVICE_URL}/trips` để tạo trip.
- Cập nhật assignment sang `ASSIGNED` và lưu `trip_id`.
- Gửi notification `DRIVER_ASSIGNED` tới `notification-service`.
- Trả `{ assignment, trip }`.

### `GET /assignments/:assignmentId`

Chức năng xử lý:

- Tìm assignment theo `assignment_id`.
- Nếu không có, trả `404 NOT_FOUND`.

### `PATCH /assignments/:assignmentId`

Request body chính:

| Trường | Bắt buộc | Ghi chú |
|---|---:|---|
| `status` | Có | Trạng thái mới của assignment. |

Chức năng xử lý:

- Cập nhật `status` và `updated_at`.
- Trả assignment sau cập nhật.

## 6. Trip Service

**Thư mục:** `services/trip-service`  
**Vai trò:** quản lý chuyến xe, trạng thái chuyến và vị trí gần nhất.

### API

| Method | Endpoint | Auth | Chức năng |
|---|---|---|---|
| POST | `/trips` | Service auth | Tạo trip từ booking và driver. |
| GET | `/trips/:tripId` | Service auth | Lấy chi tiết trip. |
| PATCH | `/trips/:tripId` | Service auth | Cập nhật trạng thái trip; nếu hoàn thành có thể tính fare. |
| PATCH | `/trips/:tripId/location` | Service auth | Lưu vị trí mới của trip. |
| GET | `/trips/:tripId/location` | Service auth | Lấy vị trí mới nhất của trip. |

### `POST /trips`

Request body chính:

| Trường | Bắt buộc | Ghi chú |
|---|---:|---|
| `bookingId` | Có | Booking nguồn. |
| `driverId` | Có | Tài xế được gán. |

Chức năng xử lý:

- Tạo bản ghi trong bảng `trips`.
- Trả trip mới với `trip_id`.

### `GET /trips/:tripId`

Chức năng xử lý:

- Lấy trip theo `trip_id`.
- Nếu không có, trả `404 NOT_FOUND`.

### `PATCH /trips/:tripId`

Request body chính:

| Trường | Bắt buộc | Ghi chú |
|---|---:|---|
| `status` | Không | Trạng thái mới của trip. |
| `distanceKm` | Không | Nếu `status` là `COMPLETED`, dùng để gọi payment service tính fare. |

Chức năng xử lý:

- Cập nhật `status` cho trip.
- Nếu status là `COMPLETED` và có `distanceKm`, gọi `payment-service` qua `GET {PAYMENT_SERVICE_URL}/trips/:tripId/fare?distanceKm=...`.
- Trả `{ trip, fare }`, trong đó `fare` có thể là `null`.

### `PATCH /trips/:tripId/location`

Request body chính:

| Trường | Bắt buộc | Ghi chú |
|---|---:|---|
| `latitude` | Có | Vĩ độ. |
| `longitude` | Có | Kinh độ. |

Chức năng xử lý:

- Thêm bản ghi vào `trip_locations`.
- Trả vị trí vừa lưu.

### `GET /trips/:tripId/location`

Chức năng xử lý:

- Lấy vị trí mới nhất của trip theo `recorded_at DESC`.
- Nếu chưa có vị trí, trả `404 NOT_FOUND`.

## 7. Payment Service

**Thư mục:** `services/payment-service`  
**Vai trò:** tính giá chuyến và tạo payment.

### API

| Method | Endpoint | Auth | Chức năng |
|---|---|---|---|
| GET | `/trips/:tripId/fare` | Service auth | Tính fare theo số km. |
| POST | `/trips/:tripId/payments` | Service auth | Tạo payment cho trip. |
| GET | `/payments/:paymentId` | Service auth | Xem chi tiết payment. |

### `GET /trips/:tripId/fare`

Query string:

| Tham số | Bắt buộc | Ghi chú |
|---|---:|---|
| `distanceKm` | Có | Số km, phải là số không âm. |

Chức năng xử lý:

- Validate `distanceKm`.
- Tính tiền bằng `calculateFare(distanceKm)`.
- Trả `{ tripId, distanceKm, pricePerKm, amount, currency: "VND" }`.

### `POST /trips/:tripId/payments`

Request body chính:

| Trường | Bắt buộc | Ghi chú |
|---|---:|---|
| `distanceKm` | Có | Số km để tính tiền. |
| `method` | Không | Mặc định `CASH`; chỉ nhận `CASH` hoặc `ELECTRONIC`. |
| `customerId` | Không | Controller đang lấy thêm từ `req.user.sub` nếu có. |

Header:

| Header | Ghi chú |
|---|---|
| `idempotency-key` | Nếu không gửi, service tự tạo UUID. |

Chức năng xử lý:

- Tính amount theo `distanceKm`.
- Tạo payment với currency `VND`.
- Nếu `method = CASH`, payment có trạng thái `SUCCESS`.
- Nếu `method = ELECTRONIC`, payment có trạng thái `PENDING`.
- Gửi notification `PAYMENT_CREATED` tới notification service nếu cấu hình có URL.
- Trả payment mới với status hiện tại.

### `GET /payments/:paymentId`

Chức năng xử lý:

- Tìm payment theo `payment_id`.
- Nếu không có, trả `404 NOT_FOUND`.

## 8. Notification Service

**Thư mục:** `services/notification-service`  
**Vai trò:** lưu thông báo, liệt kê thông báo theo người nhận và đánh dấu đã đọc/chưa đọc.

### API

| Method | Endpoint | Auth | Chức năng |
|---|---|---|---|
| POST | `/notifications` | Service auth | Tạo notification mới. |
| GET | `/notifications` | Service auth | Lấy danh sách notification theo `recipientId`. |
| PATCH | `/notifications/:notificationId` | Service auth | Cập nhật trạng thái đọc của notification. |

### `POST /notifications`

Request body chính:

| Trường | Bắt buộc | Ghi chú |
|---|---:|---|
| `recipientId` | Có | User nhận thông báo. |
| `type` | Có | Loại thông báo, ví dụ `DRIVER_ASSIGNED`, `PAYMENT_CREATED`, `RATING_SUBMITTED`. |
| `title` | Có | Tiêu đề thông báo. |
| `message` | Có | Nội dung thông báo. |

Chức năng xử lý:

- Tạo notification với `notification_id` UUID.
- Lưu `recipient_id`, `type`, `title`, `message`.
- Trả notification vừa tạo.

### `GET /notifications`

Query string:

| Tham số | Bắt buộc | Ghi chú |
|---|---:|---|
| `recipientId` | Có | Người nhận cần lấy thông báo. |

Chức năng xử lý:

- Lấy các notification của `recipientId`.
- Sắp xếp mới nhất trước.
- Trả `{ data: [...] }`.

### `PATCH /notifications/:notificationId`

Request body chính:

| Trường | Bắt buộc | Ghi chú |
|---|---:|---|
| `isRead` | Có | Ép kiểu bằng `Boolean(req.body.isRead)`. |

Chức năng xử lý:

- Cập nhật `is_read`.
- Trả notification sau cập nhật.

## 9. Rating Service

**Thư mục:** `services/rating-service`  
**Vai trò:** lưu đánh giá chuyến xe và thông báo cho tài xế khi có rating mới.

### API

| Method | Endpoint | Auth | Chức năng |
|---|---|---|---|
| POST | `/ratings` | Service auth | Tạo rating cho trip. |
| GET | `/trips/:tripId/ratings` | Service auth | Lấy danh sách rating của trip. |

### `POST /ratings`

Request body chính:

| Trường | Bắt buộc | Ghi chú |
|---|---:|---|
| `tripId` | Có | Trip được đánh giá. |
| `raterId` | Có nếu không có `req.user.sub` | Người đánh giá. |
| `driverId` | Có | Tài xế nhận đánh giá. |
| `score` | Có | Số nguyên từ 1 đến 5. |
| `comment` | Không | Nội dung nhận xét. |

Chức năng xử lý:

- Validate `score` là số nguyên từ 1 đến 5.
- Tạo rating trong bảng `ratings`.
- Gửi notification `RATING_SUBMITTED` cho `driverId`.
- Trả rating vừa tạo.

### `GET /trips/:tripId/ratings`

Chức năng xử lý:

- Lấy tất cả rating theo `trip_id`.
- Trả `{ data: [...] }`.

## 10. Operations Service

**Thư mục:** `services/operations-service`  
**Vai trò:** ghi nhận và tra cứu incident vận hành.

### API

| Method | Endpoint | Auth | Chức năng |
|---|---|---|---|
| POST | `/incidents` | Chưa gắn middleware auth trong route | Tạo incident vận hành. |
| GET | `/incidents` | Chưa gắn middleware auth trong route | Lấy danh sách incident. |

### `POST /incidents`

Request body chính:

| Trường | Bắt buộc | Ghi chú |
|---|---:|---|
| `resourceType` | Có | Loại tài nguyên bị ảnh hưởng, ví dụ `TRIP`, `BOOKING`. |
| `resourceId` | Có | ID tài nguyên liên quan. |
| `type` | Có | Loại sự cố. |
| `description` | Có | Mô tả sự cố. |

Chức năng xử lý:

- Tạo incident với UUID.
- Lưu thông tin tài nguyên liên quan và mô tả.
- Trả incident vừa tạo.

### `GET /incidents`

Chức năng xử lý:

- Lấy toàn bộ incident.
- Sắp xếp mới nhất trước.
- Trả `{ data: [...] }`.

## 11. Reporting Service

**Thư mục:** `services/reporting-service`  
**Vai trò:** đọc dữ liệu lịch sử/projection để trả báo cáo tổng hợp.

### API

| Method | Endpoint | Auth | Chức năng |
|---|---|---|---|
| GET | `/reports/trips` | Chưa gắn middleware auth trong route | Báo cáo tổng số chuyến, chuyến hoàn thành và chuyến hủy. |
| GET | `/reports/revenue` | Chưa gắn middleware auth trong route | Báo cáo tổng doanh thu và số lượng payment thành công. |

### `GET /reports/trips`

Chức năng xử lý:

- Đọc bảng `trip_history`.
- Trả:

| Trường | Ý nghĩa |
|---|---|
| `total_trips` | Tổng số trip trong lịch sử. |
| `completed_trips` | Số trip có status `COMPLETED`. |
| `cancelled_trips` | Số trip có status `CANCELLED`. |

### `GET /reports/revenue`

Chức năng xử lý:

- Đọc bảng `payment_history`.
- Chỉ tính payment có status `SUCCESS`.
- Trả:

| Trường | Ý nghĩa |
|---|---|
| `total_revenue` | Tổng amount của payment thành công. |
| `total_payments` | Số payment thành công. |

## 12. Luồng gọi nội bộ chính

### 12.1. Tạo booking và phân công tài xế

```text
Customer
  -> booking-service: POST /bookings
  -> booking-service: tạo booking
  -> driver-assignment-service: POST /assignments
  -> trip-service: POST /trips
  -> notification-service: POST /notifications DRIVER_ASSIGNED
  <- booking-service: trả booking + assignment
```

Nếu `driver-assignment-service` lỗi, `booking-service` vẫn giữ booking, chuyển status sang `SEARCHING_DRIVER` và trả HTTP `202`.

### 12.2. Hoàn thành trip và tính fare

```text
Service nội bộ
  -> trip-service: PATCH /trips/:tripId { status: "COMPLETED", distanceKm }
  -> payment-service: GET /trips/:tripId/fare?distanceKm=...
  <- trip-service: trả trip + fare
```

### 12.3. Tạo payment

```text
Service nội bộ
  -> payment-service: POST /trips/:tripId/payments
  -> payment-service: tính amount
  -> notification-service: POST /notifications PAYMENT_CREATED
  <- payment-service: trả payment
```

### 12.4. Tạo rating

```text
Service nội bộ
  -> rating-service: POST /ratings
  -> rating-service: lưu rating
  -> notification-service: POST /notifications RATING_SUBMITTED
  <- rating-service: trả rating
```

## 13. Bảng tổng hợp service

| Service | Chức năng chính | API chính | Service phụ thuộc |
|---|---|---|---|
| `auth-service` | Đăng ký, đăng nhập, phát JWT | `/auth/register`, `/auth/login` | Không |
| `profile-fleet-service` | Lưu profile người dùng | `/profiles/:userId` | Không |
| `booking-service` | Quản lý booking | `/bookings` | `driver-assignment-service` |
| `driver-assignment-service` | Gán tài xế và tạo trip | `/assignments` | `trip-service`, `notification-service` |
| `trip-service` | Quản lý trip và location | `/trips`, `/trips/:tripId/location` | `payment-service` |
| `payment-service` | Tính fare và tạo payment | `/trips/:tripId/fare`, `/trips/:tripId/payments` | `notification-service` |
| `notification-service` | Lưu và cập nhật thông báo | `/notifications` | Không |
| `rating-service` | Lưu đánh giá chuyến xe | `/ratings`, `/trips/:tripId/ratings` | `notification-service` |
| `operations-service` | Quản lý incident vận hành | `/incidents` | Không |
| `reporting-service` | Báo cáo trip và doanh thu | `/reports/trips`, `/reports/revenue` | Dữ liệu projection/history |

