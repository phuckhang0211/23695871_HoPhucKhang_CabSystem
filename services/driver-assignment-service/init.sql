CREATE TABLE IF NOT EXISTS assignments (assignment_id UUID PRIMARY KEY, booking_id UUID NOT NULL, driver_id UUID NOT NULL, trip_id UUID, status VARCHAR(20) NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE assignments ADD COLUMN IF NOT EXISTS trip_id UUID;
