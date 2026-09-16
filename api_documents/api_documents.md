# API Documents – CAB System

## 1. Mục đích của cấu trúc API

Cấu trúc API của CAB System được tổ chức theo các module nghiệp vụ thay vì chia thành một file cho từng Functional Requirement (FR).

Mục tiêu của cấu trúc này là:

- Giúp Dev dễ đọc và triển khai Backend.
- Phân tách API theo từng nhóm nghiệp vụ.
- Tái sử dụng các schema, parameter và response dùng chung.
- Dễ bảo trì khi API phát triển.
- Giữ được khả năng truy vết từ API về các FR trong SRS.
- Có thể sử dụng trực tiếp với các công cụ theo chuẩn OpenAPI/Swagger.

Nguyên tắc tổng quát:

```text
FR → Module nghiệp vụ → API Endpoint → Schema
```

Ví dụ:

```text
FR05 + FR06 + FR07
        ↓
     Booking
        ↓
paths/booking.yaml
        ↓
POST /bookings
GET /bookings/{bookingId}
PATCH /bookings/{bookingId}
        ↓
schemas/booking.yaml
```

---

# 2. Cấu trúc thư mục

```text
api/
├── openapi.yaml
├── paths/
│   ├── auth.yaml
│   ├── profile.yaml
│   ├── booking.yaml
│   ├── driver-assignment.yaml
│   ├── trip.yaml
│   ├── payment.yaml
│   ├── notification.yaml
│   ├── rating.yaml
│   ├── operation.yaml
│   └── report.yaml
├── schemas/
│   ├── auth.yaml
│   ├── user.yaml
│   ├── booking.yaml
│   ├── driver.yaml
│   ├── vehicle.yaml
│   ├── trip.yaml
│   ├── payment.yaml
│   ├── notification.yaml
│   ├── rating.yaml
│   └── common.yaml
├── parameters.yaml
└── responses.yaml
```

---

# 3. File `openapi.yaml`

## Ý nghĩa

`openapi.yaml` là **file gốc (root)** của toàn bộ API.

Đây là file mà Dev hoặc các công cụ như Swagger UI có thể sử dụng làm điểm bắt đầu để đọc toàn bộ API của hệ thống.

File này dùng để:

- Khai báo phiên bản chuẩn OpenAPI.
- Khai báo tên và phiên bản API.
- Mô tả thông tin chung của hệ thống.
- Khai báo các API `paths`.
- Liên kết đến các file schema.
- Liên kết đến các parameter dùng chung.
- Liên kết đến các response dùng chung.
- Cung cấp cấu trúc tổng thể của API.

Có thể hiểu:

```text
openapi.yaml
     │
     ├── paths/
     ├── schemas/
     ├── parameters.yaml
     └── responses.yaml
```

Dev chỉ cần mở `openapi.yaml` để bắt đầu theo dõi toàn bộ cấu trúc API.

---

# 4. Thư mục `paths/`

## Ý nghĩa

Thư mục `paths/` chứa **định nghĩa các API endpoint** của hệ thống.

Mỗi file trong thư mục đại diện cho một **module nghiệp vụ**, không phải một FR riêng.

Ví dụ:

```text
paths/
├── booking.yaml
├── payment.yaml
└── trip.yaml
```

Mỗi file mô tả:

- HTTP method.
- URL endpoint.
- Mục đích của API.
- Request.
- Response.
- Authentication.
- Authorization.
- Các mã FR/AC liên quan nếu cần truy vết.

---

# 5. `paths/auth.yaml`

## Ý nghĩa

Quản lý các API liên quan đến **tài khoản và xác thực người dùng**.

Phụ trách:

- FR01 – Đăng ký tài khoản.
- FR02 – Đăng nhập/xác thực.

Các API có thể bao gồm:

```text
POST /auth/register
POST /auth/login
POST /auth/logout
```

File giúp Dev xác định:

- API đăng ký tài khoản.
- API đăng nhập.
- Dữ liệu request.
- Dữ liệu response.
- Cơ chế xác thực.
- Các trường hợp lỗi liên quan.

---

# 6. `paths/profile.yaml`

## Ý nghĩa

Quản lý **thông tin cá nhân và thông tin phương tiện**.

Phụ trách:

- FR03 – Quản lý thông tin cá nhân.
- FR04 – Quản lý thông tin phương tiện.

Các API có thể bao gồm:

```text
GET  /users/me
PUT  /users/me
GET  /drivers/me/vehicle
PUT  /drivers/me/vehicle
```

File này giúp Dev xây dựng API cho:

- Xem thông tin cá nhân.
- Cập nhật thông tin cá nhân.
- Xem thông tin phương tiện.
- Cập nhật thông tin phương tiện.

---

# 7. `paths/booking.yaml`

## Ý nghĩa

Quản lý **đặt xe và theo dõi yêu cầu đặt xe**.

Phụ trách:

- FR05 – Tạo yêu cầu đặt xe.
- FR06 – Quản lý/thay đổi yêu cầu đặt xe.
- FR07 – Theo dõi trạng thái đặt xe.

Các API có thể bao gồm:

```text
POST  /bookings
GET   /bookings/{bookingId}
PATCH /bookings/{bookingId}
```

Đây là nhóm API chính phục vụ quá trình khách hàng tạo và theo dõi yêu cầu đặt xe.

---

# 8. `paths/driver-assignment.yaml`

## Ý nghĩa

Quản lý quá trình **tìm kiếm và phân công tài xế**.

Phụ trách:

- FR08 – Tìm tài xế phù hợp.
- FR09 – Gửi yêu cầu chuyến xe đến tài xế.
- FR10 – Tài xế nhận/từ chối chuyến.
- FR11 – Xử lý khi tài xế từ chối hoặc không phản hồi.

Các API có thể bao gồm:

```text
GET  /bookings/{bookingId}/drivers
POST /bookings/{bookingId}/assign
POST /trips/{tripId}/accept
POST /trips/{tripId}/reject
```

## Lưu ý về FR11

FR11 chủ yếu là **business logic của Backend**.

Ví dụ:

```text
Tài xế từ chối
      ↓
Backend xác định trạng thái
      ↓
Tìm tài xế tiếp theo
      ↓
Gửi yêu cầu mới
```

Do đó không nhất thiết phải tạo một endpoint riêng chỉ để thực hiện FR11.

---

# 9. `paths/trip.yaml`

## Ý nghĩa

Quản lý **quá trình thực hiện chuyến xe**.

Phụ trách:

- FR12 – Thực hiện chuyến xe.
- FR13 – Theo dõi vị trí/trạng thái chuyến xe.

Các API có thể bao gồm:

```text
GET   /trips/{tripId}
PATCH /trips/{tripId}/status
GET   /trips/{tripId}/location
```

Trạng thái chuyến xe nên được biểu diễn bằng thuộc tính `status`.

Ví dụ:

```text
ASSIGNED
DRIVER_ARRIVING
IN_PROGRESS
COMPLETED
CANCELLED
```

Không nên tạo một API riêng cho từng trạng thái.

---

# 10. `paths/payment.yaml`

## Ý nghĩa

Quản lý **giá chuyến xe và thanh toán**.

Phụ trách:

- FR14 – Tính/hiển thị giá chuyến.
- FR15 – Thanh toán tiền mặt.
- FR16 – Thanh toán điện tử.
- FR17 – Xử lý kết quả thanh toán.

Các API có thể bao gồm:

```text
GET  /trips/{tripId}/fare
POST /trips/{tripId}/payments
GET  /payments/{paymentId}
```

File này mô tả:

- Thông tin giá chuyến.
- Phương thức thanh toán.
- Trạng thái thanh toán.
- Kết quả thanh toán.
- Các trường hợp thanh toán thất bại hoặc cần xử lý lại.

Các thông tin nhạy cảm của thẻ/tài khoản thanh toán không nên được lưu trực tiếp trong hệ thống CAB nếu không được yêu cầu trong SRS.

---

# 11. `paths/notification.yaml`

## Ý nghĩa

Quản lý **thông báo cho người dùng**.

Phụ trách:

- FR18 – Thông báo liên quan đến chuyến xe và hoạt động của hệ thống.

Các API có thể bao gồm:

```text
GET   /notifications
PATCH /notifications/{notificationId}/read
```

Việc gửi notification có thể được Backend xử lý thông qua event hoặc service nội bộ.

Do đó không nhất thiết phải tạo một endpoint riêng cho từng loại notification.

---

# 12. `paths/rating.yaml`

## Ý nghĩa

Quản lý **đánh giá chuyến xe/tài xế**.

Phụ trách:

- FR19 – Đánh giá sau chuyến đi.

Các API có thể bao gồm:

```text
POST /trips/{tripId}/rating
GET  /trips/{tripId}/rating
```

File mô tả:

- Người thực hiện đánh giá.
- Chuyến xe được đánh giá.
- Điểm đánh giá.
- Nội dung đánh giá nếu có.
- Response sau khi đánh giá.

---

# 13. `paths/operation.yaml`

## Ý nghĩa

Quản lý các API phục vụ **nhân viên vận hành hệ thống**.

Phụ trách:

- FR20 – Quản lý khách hàng.
- FR21 – Quản lý tài xế.
- FR22 – Quản lý phương tiện.
- FR23 – Theo dõi/điều phối chuyến xe.
- FR24 – Quản lý quyền và xử lý nghiệp vụ vận hành.

Các API có thể bao gồm:

```text
GET   /admin/customers
GET   /admin/drivers
GET   /admin/vehicles
GET   /admin/trips
PATCH /admin/trips/{tripId}
```

Các API trong module này cần kiểm tra:

```text
Authentication
        ↓
Authorization
        ↓
Role / Permission
        ↓
Thực hiện nghiệp vụ
```

---

# 14. `paths/report.yaml`

## Ý nghĩa

Quản lý **lịch sử và báo cáo**.

Phụ trách:

- FR25 – Tra cứu lịch sử chuyến xe.
- FR26 – Báo cáo/thống kê.

Các API có thể bao gồm:

```text
GET /history/trips
GET /history/payments
GET /reports/trips
GET /reports/revenue
```

File này phục vụ việc:

- Tra cứu lịch sử chuyến xe.
- Tra cứu lịch sử thanh toán.
- Xem thống kê.
- Xem báo cáo hoạt động.

---

# 15. Thư mục `schemas/`

## Ý nghĩa

Thư mục `schemas/` chứa **định nghĩa cấu trúc dữ liệu** được sử dụng trong request và response.

Có thể hiểu:

```text
paths/
    ↓
API nào?

schemas/
    ↓
Dữ liệu của API có cấu trúc như thế nào?
```

Ví dụ:

```text
POST /bookings
       ↓
BookingRequest
       ↓
BookingResponse
```

Việc tách schema thành file riêng giúp:

- Tái sử dụng model.
- Tránh khai báo lặp lại.
- Dễ thay đổi cấu trúc dữ liệu.
- Giúp Dev Backend hiểu rõ request/response.

---

# 16. `schemas/auth.yaml`

## Ý nghĩa

Định nghĩa cấu trúc dữ liệu liên quan đến:

- Đăng ký.
- Đăng nhập.
- Token.
- Xác thực.

Ví dụ:

```yaml
LoginRequest:
  email:
  password:

LoginResponse:
  accessToken:
  user:
```

---

# 17. `schemas/user.yaml`

## Ý nghĩa

Định nghĩa cấu trúc dữ liệu của **người dùng**.

Có thể được sử dụng cho:

- Customer.
- Driver.
- Operation Staff.

Ví dụ:

```yaml
User:
  id:
  name:
  phone:
  email:
  role:
```

---

# 18. `schemas/booking.yaml`

## Ý nghĩa

Định nghĩa cấu trúc dữ liệu của **yêu cầu đặt xe**.

Ví dụ:

```yaml
Booking:
  id:
  customerId:
  pickup:
  destination:
  status:
  createdAt:
```

Schema này được sử dụng bởi các API thuộc module booking.

---

# 19. `schemas/driver.yaml`

## Ý nghĩa

Định nghĩa cấu trúc dữ liệu liên quan đến **tài xế**.

Ví dụ:

```yaml
Driver:
  id:
  name:
  phone:
  status:
  rating:
```

---

# 20. `schemas/vehicle.yaml`

## Ý nghĩa

Định nghĩa cấu trúc dữ liệu của **phương tiện**.

Ví dụ:

```yaml
Vehicle:
  id:
  driverId:
  licensePlate:
  type:
  status:
```

---

# 21. `schemas/trip.yaml`

## Ý nghĩa

Định nghĩa cấu trúc dữ liệu của **chuyến xe**.

Ví dụ:

```yaml
Trip:
  id:
  bookingId:
  driverId:
  status:
  startedAt:
  completedAt:
```

---

# 22. `schemas/payment.yaml`

## Ý nghĩa

Định nghĩa cấu trúc dữ liệu liên quan đến **giá và thanh toán**.

Ví dụ:

```yaml
Payment:
  id:
  tripId:
  amount:
  method:
  status:
  paidAt:
```

---

# 23. `schemas/notification.yaml`

## Ý nghĩa

Định nghĩa cấu trúc dữ liệu của **thông báo**.

Ví dụ:

```yaml
Notification:
  id:
  userId:
  title:
  message:
  isRead:
  createdAt:
```

---

# 24. `schemas/rating.yaml`

## Ý nghĩa

Định nghĩa cấu trúc dữ liệu của **đánh giá**.

Ví dụ:

```yaml
Rating:
  id:
  tripId:
  score:
  comment:
```

---

# 25. `schemas/common.yaml`

## Ý nghĩa

Chứa các schema **dùng chung cho nhiều API**.

Ví dụ:

```text
Pagination
Error
SuccessResponse
Address
Location
Timestamp
```

Mục đích:

- Tránh khai báo cùng một cấu trúc nhiều lần.
- Chuẩn hóa dữ liệu giữa các API.
- Dễ bảo trì.

---

# 26. `parameters.yaml`

## Ý nghĩa

Chứa các **parameter dùng chung** cho nhiều API.

Ví dụ:

```yaml
TripId:
  name: tripId
  in: path
  required: true

Page:
  name: page
  in: query

Limit:
  name: limit
  in: query
```

Các parameter thường gặp:

```text
Path parameter
Query parameter
Header parameter
```

Thay vì khai báo lại cùng một parameter ở nhiều API, Dev có thể tham chiếu đến `parameters.yaml`.

---

# 27. `responses.yaml`

## Ý nghĩa

Chứa các **response dùng chung** cho nhiều API.

Các response phổ biến:

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
500 Internal Server Error
```

Ví dụ:

```yaml
Unauthorized:
  description: User is not authenticated

NotFound:
  description: Resource not found

InternalServerError:
  description: Internal server error
```

Mục đích:

- Chuẩn hóa response lỗi.
- Tránh khai báo lặp lại.
- Giúp Dev xử lý lỗi thống nhất giữa các API.

---

# 28. Tổng quan vai trò của từng file

| File/thư mục | Ý nghĩa |
|---|---|
| `openapi.yaml` | File gốc, kết nối toàn bộ API |
| `paths/` | Chứa định nghĩa API endpoint |
| `paths/auth.yaml` | API tài khoản và xác thực |
| `paths/profile.yaml` | API thông tin cá nhân/phương tiện |
| `paths/booking.yaml` | API đặt xe |
| `paths/driver-assignment.yaml` | API tìm và phân công tài xế |
| `paths/trip.yaml` | API thực hiện và theo dõi chuyến |
| `paths/payment.yaml` | API giá và thanh toán |
| `paths/notification.yaml` | API thông báo |
| `paths/rating.yaml` | API đánh giá |
| `paths/operation.yaml` | API dành cho vận hành |
| `paths/report.yaml` | API lịch sử và báo cáo |
| `schemas/` | Định nghĩa cấu trúc dữ liệu |
| `schemas/auth.yaml` | Schema xác thực |
| `schemas/user.yaml` | Schema người dùng |
| `schemas/booking.yaml` | Schema đặt xe |
| `schemas/driver.yaml` | Schema tài xế |
| `schemas/vehicle.yaml` | Schema phương tiện |
| `schemas/trip.yaml` | Schema chuyến xe |
| `schemas/payment.yaml` | Schema thanh toán |
| `schemas/notification.yaml` | Schema thông báo |
| `schemas/rating.yaml` | Schema đánh giá |
| `schemas/common.yaml` | Schema dùng chung |
| `parameters.yaml` | Parameter dùng chung |
| `responses.yaml` | Response dùng chung |

---

# 29. Nguyên tắc chia API

Không nên chia API theo cách:

```text
FR01.yaml
FR02.yaml
FR03.yaml
...
FR26.yaml
```

Lý do là:

> **FR không đồng nghĩa với API endpoint.**

Một FR có thể được thực hiện bởi nhiều API và một API có thể phục vụ nhiều FR.

Nên tổ chức theo:

```text
FR
 ↓
Module nghiệp vụ
 ↓
API Endpoint
 ↓
Request / Response Schema
```

Ví dụ:

```text
FR05 + FR06 + FR07
        ↓
     Booking
        ↓
paths/booking.yaml
        ↓
POST  /bookings
GET   /bookings/{bookingId}
PATCH /bookings/{bookingId}
        ↓
schemas/booking.yaml
```

---

# 30. Nguyên tắc giữa API và Business Logic

Không phải mọi FR đều phải trở thành một endpoint.

Một số FR có thể được thực hiện bằng **business logic bên trong Backend**.

Ví dụ FR11:

```text
Tài xế từ chối chuyến
        ↓
Backend cập nhật trạng thái
        ↓
Backend tìm tài xế khác
        ↓
Backend gửi yêu cầu mới
```

Do đó không cần thiết phải tạo:

```text
POST /fr11
```

Thay vào đó, logic FR11 được thực hiện bên trong các API liên quan đến quá trình phân công tài xế.

---

# 31. Nguyên tắc đối với trạng thái

Không nên tạo API riêng cho từng trạng thái.

Không nên:

```text
POST /trip/start
POST /trip/in-progress
POST /trip/completed
```

Có thể tổ chức:

```text
PATCH /trips/{tripId}/status
```

với:

```json
{
  "status": "IN_PROGRESS"
}
```

Các trạng thái được quản lý bằng enum hoặc business rule trong Backend.

---

# 32. Nguyên tắc đối với Notification

Không nên tạo một endpoint cho từng loại thông báo.

Không nên:

```text
POST /notification/driver-arriving
POST /notification/trip-completed
POST /notification/payment-success
```

Có thể sử dụng:

```text
GET /notifications
PATCH /notifications/{notificationId}/read
```

Việc tạo và gửi thông báo có thể được Backend xử lý thông qua event/service nội bộ.

---

# 33. Nguyên tắc đối với NFR

Các Non-Functional Requirement (NFR) không nên được chuyển thành API endpoint.

Ví dụ:

```text
Performance
Security
Availability
Scalability
Logging
```

Đây là các yêu cầu mà Dev phải đảm bảo trong quá trình xây dựng hệ thống, không phải các chức năng để người dùng gọi trực tiếp.

---

# 34. Nguyên tắc đối với các nội dung TBD

Các chính sách được đánh dấu `TBD` trong SRS không nên tự ý đưa ra giá trị cụ thể trong API.

Ví dụ:

```text
Fare formula
Driver priority
Response timeout
Cancellation policy
Payment retry
Rating policy
Data retention
```

Khi chưa có quyết định chính thức, API nên để ở trạng thái có thể cấu hình hoặc ghi chú `TBD`.

Không nên tự ý giả định các giá trị nghiệp vụ chưa được xác định.

---

# 35. Mối quan hệ giữa các file

Có thể hình dung toàn bộ cấu trúc như sau:

```text
                    openapi.yaml
                         │
        ┌────────────────┼────────────────┐
        │                │                │
      paths/          schemas/      Shared Components
        │                │          │             │
        │                │   parameters.yaml  responses.yaml
        │                │
        ↓                ↓
   API Endpoint     Data Structure
        │                │
        └────────┬───────┘
                 ↓
            Backend API
```

Trong đó:

- `openapi.yaml` quản lý cấu trúc tổng thể.
- `paths/` mô tả API.
- `schemas/` mô tả dữ liệu.
- `parameters.yaml` chứa parameter dùng chung.
- `responses.yaml` chứa response dùng chung.

---

# 36. Mục tiêu cuối cùng

Cấu trúc này nhằm giúp Dev có thể đọc API theo cách:

```text
1. Mở openapi.yaml
        ↓
2. Chọn module nghiệp vụ
        ↓
3. Mở file trong paths/
        ↓
4. Xem endpoint
        ↓
5. Xem request/response
        ↓
6. Tham chiếu schema trong schemas/
        ↓
7. Tham chiếu parameter/response dùng chung
        ↓
8. Xây dựng API Backend
```

Do đó, bộ YAML không chỉ dùng để mô tả API mà còn đóng vai trò là **tài liệu kỹ thuật để Developer dựa vào đó xây dựng Backend API của CAB System**.
