# 23695871_HoPhucKhang_CabSystem
Lập trình hướng dịch vụ

## Local microservices

The implementation is organized as independent services under `services/`:

- `auth-service`: registration, login and JWT access tokens.
- `booking-service`: customer bookings and booking persistence.
- `trip-service`: trips and simulated driver locations.
- `payment-service`: fare calculation and payments.
- `src/server.js`: API gateway and Swagger entry point.

Each domain service has its own PostgreSQL container and initialization script. The fare rule is `distanceKm * 5,000 VND`.

### Database ports for DBeaver

Use host `localhost`, user `cab`, password `cab`, and the database name shown below:

| Database | Host port |
|---|---:|
| `auth` | `5433` |
| `booking` | `5434` |
| `trip` | `5435` |
| `payment` | `5436` |
| `profile_fleet` | `5437` |
| `driver_assignment` | `5438` |
| `notification` | `5439` |
| `rating` | `5440` |
| `operations` | `5441` |
| `reporting` | `5442` |

The container port remains `5432`; only the host port is different for each database.

### Start with Docker

```bash
docker compose up --build
```

The gateway is available at `http://localhost:3000`, health check at `/api/v1/health`, and Swagger UI at `/docs`. Customer and Driver profile data belong to `profile-fleet-service`.

### REST API conventions

Resource endpoints use nouns and HTTP methods:

- `POST /api/v1/bookings` creates a booking.
- `GET /api/v1/bookings` and `GET /api/v1/bookings/:bookingId` read bookings.
- `PATCH /api/v1/bookings/:bookingId` updates a requested booking.
- `DELETE /api/v1/bookings/:bookingId` cancels a cancellable booking.
- `GET /api/v1/trips/:tripId`, `PATCH /api/v1/trips/:tripId` read/update a trip.
- `GET/PATCH /api/v1/trips/:tripId/location` manages the location sub-resource.
- `GET /api/v1/trips/:tripId/fare` reads a calculated fare and `POST /api/v1/trips/:tripId/payments` creates a payment.

`/auth/register` and `/auth/login` remain command-style exceptions because authentication is not a CRUD resource. The old `/bookings/:id/assign`, `/trips/:id/status`, `/trips/:id/accept`, and `/trips/:id/reject` routes are not used by the new service implementation; assignment should be modeled as an `assignments` resource when that service is added.

Each service can also be started independently from its own Compose file, for example:

```powershell
Push-Location services/auth-service
docker compose up --build
Pop-Location
```

The root [docker-compose.yml](docker-compose.yml) remains the integration Compose for the complete system.

Use a strong `JWT_SECRET` and `INTERNAL_SERVICE_TOKEN` in production:

```bash
JWT_SECRET=replace-me INTERNAL_SERVICE_TOKEN=replace-me docker compose up --build
```

### CI/CD

`.github/workflows/ci-cd.yml` runs npm tests, syntax checks, Compose validation, and Docker image builds on pushes to `main` and pull requests.


Định nghĩa bound context
Xây dựng bộ ngôn ngữ ứng xử riêng cho từng bound context

Thiết kế CSDL cho từng boundcontext
Chọn dùng loại database nào tương ứng từng bound_context

Mỗi bound_context dùng để làm gì liên quan đến fr nào, phục vụ cho workflow nào(business process model), đi kèm theo bảng mô tả từng ubitiquous language cho từng bound_context, trong microservice sẽ có những api nào, database dùng loại CSDL nào và có những data gì
