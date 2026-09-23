-- CAB System logical database schema
-- PostgreSQL reference implementation for the ten bounded contexts.
-- Each schema can later be moved to an independent microservice database.
-- Cross-context identifiers are intentionally not declared as foreign keys.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE SCHEMA IF NOT EXISTS identity;
CREATE SCHEMA IF NOT EXISTS profile;
CREATE SCHEMA IF NOT EXISTS booking;
CREATE SCHEMA IF NOT EXISTS assignment;
CREATE SCHEMA IF NOT EXISTS trip;
CREATE SCHEMA IF NOT EXISTS payment;
CREATE SCHEMA IF NOT EXISTS notification;
CREATE SCHEMA IF NOT EXISTS rating;
CREATE SCHEMA IF NOT EXISTS operations;
CREATE SCHEMA IF NOT EXISTS reporting;

CREATE TABLE identity.users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL UNIQUE,
    email VARCHAR(255) UNIQUE,
    role VARCHAR(30) NOT NULL CHECK (role IN ('CUSTOMER', 'DRIVER', 'OPERATION_STAFF')),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE identity.credentials (
    user_id UUID PRIMARY KEY REFERENCES identity.users(user_id),
    password_hash TEXT NOT NULL,
    password_changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE identity.refresh_tokens (
    token_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES identity.users(user_id),
    token_hash TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ
);

CREATE TABLE profile.profiles (
    user_id UUID PRIMARY KEY,
    display_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30),
    email VARCHAR(255),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE profile.driver_profiles (
    user_id UUID PRIMARY KEY,
    eligibility_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    rating_average NUMERIC(3,2) NOT NULL DEFAULT 0 CHECK (rating_average BETWEEN 0 AND 5),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE profile.vehicles (
    vehicle_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id UUID NOT NULL,
    license_plate VARCHAR(30) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL,
    brand VARCHAR(80),
    model VARCHAR(80),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE'))
);

CREATE TABLE profile.availability_sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id UUID NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('ONLINE', 'OFFLINE', 'BUSY')),
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    ended_at TIMESTAMPTZ
);

CREATE TABLE profile.driver_locations (
    location_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id UUID NOT NULL,
    latitude NUMERIC(10,7) NOT NULL CHECK (latitude BETWEEN -90 AND 90),
    longitude NUMERIC(10,7) NOT NULL CHECK (longitude BETWEEN -180 AND 180),
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX driver_locations_driver_time_idx
    ON profile.driver_locations (driver_id, recorded_at DESC);

CREATE TABLE booking.bookings (
    booking_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL,
    status VARCHAR(30) NOT NULL CHECK (status IN (
        'REQUESTED', 'SEARCHING_DRIVER', 'DRIVER_ASSIGNED',
        'ACCEPTED', 'CANCELLED', 'COMPLETED'
    )),
    note TEXT,
    trip_id UUID,
    version INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE booking.booking_addresses (
    address_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES booking.bookings(booking_id),
    address_type VARCHAR(20) NOT NULL CHECK (address_type IN ('PICKUP', 'DESTINATION')),
    address_text TEXT NOT NULL,
    latitude NUMERIC(10,7) CHECK (latitude BETWEEN -90 AND 90),
    longitude NUMERIC(10,7) CHECK (longitude BETWEEN -180 AND 180),
    UNIQUE (booking_id, address_type)
);

CREATE TABLE booking.booking_status_history (
    history_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES booking.bookings(booking_id),
    from_status VARCHAR(30),
    to_status VARCHAR(30) NOT NULL,
    reason TEXT,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE assignment.assignments (
    assignment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL,
    trip_id UUID,
    winning_driver_id UUID,
    status VARCHAR(30) NOT NULL CHECK (status IN ('SEARCHING', 'ASSIGNED', 'ACCEPTED', 'FAILED', 'CANCELLED')),
    assigned_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);
CREATE UNIQUE INDEX assignment_one_active_booking_idx
    ON assignment.assignments (booking_id)
    WHERE status IN ('SEARCHING', 'ASSIGNED', 'ACCEPTED');

CREATE TABLE assignment.assignment_attempts (
    attempt_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES assignment.assignments(assignment_id),
    driver_id UUID NOT NULL,
    attempt_no INTEGER NOT NULL,
    status VARCHAR(30) NOT NULL CHECK (status IN ('SENT', 'ACCEPTED', 'REJECTED', 'TIMEOUT', 'CANCELLED')),
    requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ,
    responded_at TIMESTAMPTZ,
    reason TEXT,
    UNIQUE (assignment_id, attempt_no)
);

CREATE TABLE trip.trips (
    trip_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL,
    driver_id UUID,
    status VARCHAR(30) NOT NULL CHECK (status IN (
        'ASSIGNED', 'DRIVER_ARRIVING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'
    )),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    version INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE trip.trip_status_history (
    history_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES trip.trips(trip_id),
    from_status VARCHAR(30),
    to_status VARCHAR(30) NOT NULL,
    changed_by UUID,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE trip.trip_locations (
    location_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES trip.trips(trip_id),
    latitude NUMERIC(10,7) NOT NULL CHECK (latitude BETWEEN -90 AND 90),
    longitude NUMERIC(10,7) NOT NULL CHECK (longitude BETWEEN -180 AND 180),
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX trip_locations_trip_time_idx
    ON trip.trip_locations (trip_id, recorded_at DESC);

CREATE TABLE payment.fares (
    fare_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL,
    amount NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
    currency CHAR(3) NOT NULL DEFAULT 'VND',
    pricing_version VARCHAR(30) NOT NULL,
    factors JSONB NOT NULL DEFAULT '{}'::jsonb,
    calculated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE payment.payments (
    payment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL,
    fare_id UUID NOT NULL REFERENCES payment.fares(fare_id),
    amount NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
    currency CHAR(3) NOT NULL DEFAULT 'VND',
    method VARCHAR(20) NOT NULL CHECK (method IN ('CASH', 'ELECTRONIC')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED', 'RETRY')),
    idempotency_key VARCHAR(120) NOT NULL UNIQUE,
    transaction_id VARCHAR(150),
    paid_at TIMESTAMPTZ
);

CREATE TABLE payment.payment_attempts (
    attempt_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID NOT NULL REFERENCES payment.payments(payment_id),
    attempt_no INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL,
    failure_reason TEXT,
    requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (payment_id, attempt_no)
);

CREATE TABLE payment.provider_transactions (
    provider_transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID NOT NULL REFERENCES payment.payment_attempts(attempt_id),
    provider_name VARCHAR(80) NOT NULL,
    external_transaction_id VARCHAR(150) NOT NULL UNIQUE,
    provider_status VARCHAR(50) NOT NULL,
    received_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE notification.notification_templates (
    template_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(80) NOT NULL,
    channel VARCHAR(30) NOT NULL,
    language VARCHAR(10) NOT NULL DEFAULT 'vi',
    title_template TEXT NOT NULL,
    body_template TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE notification.notifications (
    notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id UUID NOT NULL,
    template_id UUID REFERENCES notification.notification_templates(template_id),
    type VARCHAR(80) NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX notifications_recipient_read_idx
    ON notification.notifications (recipient_id, is_read, created_at DESC);

CREATE TABLE notification.notification_deliveries (
    delivery_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notification_id UUID NOT NULL REFERENCES notification.notifications(notification_id),
    channel VARCHAR(30) NOT NULL,
    status VARCHAR(30) NOT NULL,
    retry_count INTEGER NOT NULL DEFAULT 0,
    failure_reason TEXT,
    sent_at TIMESTAMPTZ
);

CREATE TABLE rating.ratings (
    rating_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL,
    rater_id UUID NOT NULL,
    driver_id UUID,
    score SMALLINT NOT NULL CHECK (score BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ,
    UNIQUE (trip_id, rater_id)
);

CREATE TABLE operations.incidents (
    incident_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID NOT NULL,
    type VARCHAR(80) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'OPEN',
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    resolved_at TIMESTAMPTZ
);

CREATE TABLE operations.admin_actions (
    action_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID NOT NULL,
    action VARCHAR(80) NOT NULL,
    reason TEXT,
    before_state JSONB,
    after_state JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE operations.audit_logs (
    audit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action_id UUID NOT NULL REFERENCES operations.admin_actions(action_id),
    result VARCHAR(30) NOT NULL,
    correlation_id VARCHAR(120),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE reporting.trip_history_projections (
    trip_id UUID PRIMARY KEY,
    booking_id UUID,
    customer_id UUID,
    driver_id UUID,
    status VARCHAR(30) NOT NULL,
    completed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    source_updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE reporting.payment_history_projections (
    payment_id UUID PRIMARY KEY,
    trip_id UUID,
    amount NUMERIC(12,2) NOT NULL,
    currency CHAR(3) NOT NULL,
    method VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    paid_at TIMESTAMPTZ,
    source_updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE reporting.daily_trip_reports (
    report_date DATE PRIMARY KEY,
    total_trips INTEGER NOT NULL DEFAULT 0,
    completed_trips INTEGER NOT NULL DEFAULT 0,
    cancelled_trips INTEGER NOT NULL DEFAULT 0,
    calculated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE reporting.daily_revenue_reports (
    report_date DATE NOT NULL,
    currency CHAR(3) NOT NULL,
    total_revenue NUMERIC(14,2) NOT NULL DEFAULT 0,
    total_payments INTEGER NOT NULL DEFAULT 0,
    calculated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (report_date, currency)
);

CREATE TABLE reporting.driver_performance_daily (
    report_date DATE NOT NULL,
    driver_id UUID NOT NULL,
    assigned_trips INTEGER NOT NULL DEFAULT 0,
    completed_trips INTEGER NOT NULL DEFAULT 0,
    cancelled_trips INTEGER NOT NULL DEFAULT 0,
    average_rating NUMERIC(3,2),
    PRIMARY KEY (report_date, driver_id)
);
