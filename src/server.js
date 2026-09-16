const path = require("path");
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");

const app = express();
const port = process.env.PORT || 3000;
const apiPrefix = "/api/v1";
const apiDocsPath = path.join(__dirname, "..", "api");

app.use(cors());
app.use(express.json());

app.use("/api", express.static(apiDocsPath));
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(null, {
    swaggerOptions: {
      url: "/api/openapi.yaml"
    }
  })
);

const ids = {
  user: "11111111-1111-4111-8111-111111111111",
  booking: "22222222-2222-4222-8222-222222222222",
  driver: "33333333-3333-4333-8333-333333333333",
  vehicle: "44444444-4444-4444-8444-444444444444",
  trip: "55555555-5555-4555-8555-555555555555",
  payment: "66666666-6666-4666-8666-666666666666",
  notification: "77777777-7777-4777-8777-777777777777",
  rating: "88888888-8888-4888-8888-888888888888"
};

const now = () => new Date().toISOString();

const pagination = {
  page: 1,
  limit: 20,
  total: 1,
  totalPages: 1
};

const location = {
  latitude: 10.7769,
  longitude: 106.7009,
  timestamp: now()
};

const address = {
  address: "1 Nguyen Hue, District 1, Ho Chi Minh City",
  latitude: 10.7758,
  longitude: 106.7019
};

const user = {
  id: ids.user,
  name: "Ho Phuc Khang",
  phone: "0900000000",
  email: "khang@example.com",
  role: "CUSTOMER",
  status: "ACTIVE"
};

const vehicle = {
  id: ids.vehicle,
  driverId: ids.driver,
  licensePlate: "51A-12345",
  type: "CAR",
  brand: "Toyota",
  model: "Vios",
  status: "ACTIVE"
};

const driver = {
  id: ids.driver,
  name: "Nguyen Van Tai",
  phone: "0911111111",
  status: "ONLINE",
  rating: 4.8,
  location,
  vehicle
};

const booking = {
  id: ids.booking,
  customerId: ids.user,
  pickup: address,
  destination: {
    address: "Independence Palace, District 1, Ho Chi Minh City",
    latitude: 10.777,
    longitude: 106.6953
  },
  status: "DRIVER_ASSIGNED",
  note: "Mock booking for Swagger Try it out.",
  createdAt: now(),
  updatedAt: now()
};

const trip = {
  id: ids.trip,
  bookingId: ids.booking,
  driverId: ids.driver,
  status: "ASSIGNED",
  startedAt: null,
  completedAt: null,
  currentLocation: location
};

const payment = {
  id: ids.payment,
  tripId: ids.trip,
  amount: 85000,
  method: "CASH",
  status: "SUCCESS",
  transactionId: null,
  paidAt: now()
};

const notification = {
  id: ids.notification,
  userId: ids.user,
  title: "Driver assigned",
  message: "A driver has accepted your booking.",
  isRead: false,
  createdAt: now()
};

const rating = {
  id: ids.rating,
  tripId: ids.trip,
  score: 5,
  comment: "Good trip.",
  createdAt: now()
};

const ok = (res, data, status = 200) => res.status(status).json(data);

app.get("/", (req, res) => {
  res.redirect("/docs");
});

const router = express.Router();

router.post("/auth/register", (req, res) => {
  ok(res, {
    message: "Register successfully",
    user: { ...user, ...req.body, id: ids.user, status: "ACTIVE" },
    accessToken: "mock-access-token"
  }, 201);
});

router.post("/auth/login", (req, res) => {
  ok(res, {
    accessToken: "mock-access-token",
    tokenType: "Bearer",
    user
  });
});

router.post("/auth/logout", (req, res) => {
  ok(res, {
    success: true,
    message: "Logout successfully"
  });
});

router.get("/users/me", (req, res) => ok(res, user));
router.put("/users/me", (req, res) => ok(res, { ...user, ...req.body }));

router.get("/drivers/me/vehicle", (req, res) => ok(res, vehicle));
router.put("/drivers/me/vehicle", (req, res) => ok(res, { ...vehicle, ...req.body }));

router.post("/bookings", (req, res) => {
  ok(res, {
    ...booking,
    ...req.body,
    id: ids.booking,
    customerId: ids.user,
    status: "REQUESTED",
    createdAt: now(),
    updatedAt: now()
  }, 201);
});

router.get("/bookings", (req, res) => ok(res, { data: [booking], pagination }));
router.get("/bookings/:bookingId", (req, res) => ok(res, { ...booking, id: req.params.bookingId }));
router.patch("/bookings/:bookingId", (req, res) => ok(res, { ...booking, ...req.body, id: req.params.bookingId, updatedAt: now() }));

router.get("/bookings/:bookingId/drivers", (req, res) => ok(res, { data: [driver], pagination }));
router.post("/bookings/:bookingId/assign", (req, res) => ok(res, { ...trip, bookingId: req.params.bookingId, driverId: req.body.driverId || ids.driver }));

router.post("/trips/:tripId/accept", (req, res) => ok(res, { ...trip, id: req.params.tripId, status: "DRIVER_ARRIVING" }));
router.post("/trips/:tripId/reject", (req, res) => ok(res, { ...trip, id: req.params.tripId, status: "CANCELLED" }));
router.get("/trips/:tripId", (req, res) => ok(res, { ...trip, id: req.params.tripId }));
router.patch("/trips/:tripId/status", (req, res) => ok(res, { ...trip, id: req.params.tripId, status: req.body.status || trip.status }));
router.get("/trips/:tripId/location", (req, res) => ok(res, location));
router.get("/trips/:tripId/fare", (req, res) => ok(res, { tripId: req.params.tripId, amount: 85000, currency: "VND" }));
router.post("/trips/:tripId/payments", (req, res) => ok(res, { ...payment, ...req.body, id: ids.payment, tripId: req.params.tripId }, 201));

router.get("/payments/:paymentId", (req, res) => ok(res, { ...payment, id: req.params.paymentId }));

router.get("/notifications", (req, res) => ok(res, { data: [notification], pagination }));
router.patch("/notifications/:notificationId/read", (req, res) => ok(res, { ...notification, id: req.params.notificationId, isRead: true }));

router.post("/trips/:tripId/rating", (req, res) => ok(res, { ...rating, ...req.body, id: ids.rating, tripId: req.params.tripId }, 201));
router.get("/trips/:tripId/rating", (req, res) => ok(res, { ...rating, tripId: req.params.tripId }));

router.get("/admin/customers", (req, res) => ok(res, { data: [user], pagination }));
router.get("/admin/drivers", (req, res) => ok(res, { data: [driver], pagination }));
router.get("/admin/vehicles", (req, res) => ok(res, { data: [vehicle], pagination }));
router.get("/admin/trips", (req, res) => ok(res, { data: [trip], pagination }));
router.patch("/admin/trips/:tripId", (req, res) => ok(res, { ...trip, ...req.body, id: req.params.tripId }));

router.get("/history/trips", (req, res) => ok(res, { data: [trip], pagination }));
router.get("/history/payments", (req, res) => ok(res, { data: [payment], pagination }));
router.get("/reports/trips", (req, res) => ok(res, { totalTrips: 1, completedTrips: 1, cancelledTrips: 0 }));
router.get("/reports/revenue", (req, res) => ok(res, { totalRevenue: 85000, totalPayments: 1, currency: "VND" }));

router.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    code: "NOT_FOUND"
  });
});

app.use(apiPrefix, router);

app.listen(port, () => {
  console.log(`CAB System mock API is running at http://localhost:${port}${apiPrefix}`);
  console.log(`Swagger UI is available at http://localhost:${port}/docs`);
});
