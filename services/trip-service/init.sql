CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS trips (
  trip_id UUID PRIMARY KEY,
  booking_id UUID NOT NULL,
  driver_id UUID NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'ASSIGNED',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS trip_locations (
  location_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(trip_id),
  latitude NUMERIC(10,7) NOT NULL CHECK(latitude BETWEEN -90 AND 90),
  longitude NUMERIC(10,7) NOT NULL CHECK(longitude BETWEEN -180 AND 180),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS trip_locations_latest_idx ON trip_locations(trip_id, recorded_at DESC);
