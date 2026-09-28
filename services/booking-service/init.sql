CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS bookings (
  booking_id UUID PRIMARY KEY,
  customer_id UUID NOT NULL,
  pickup JSONB NOT NULL,
  destination JSONB NOT NULL,
  vehicle_type VARCHAR(50) NOT NULL,
  note TEXT,
  status VARCHAR(30) NOT NULL DEFAULT 'REQUESTED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS bookings_customer_created_idx ON bookings(customer_id, created_at DESC);
