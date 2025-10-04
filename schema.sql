-- RoutePilot Database Schema
-- PostgreSQL Database Schema for RoutePilot Ridesharing Platform
-- Version: 1.0.0
-- Description: Complete database schema with all tables, relationships, indexes, and constraints

-- =====================================================
-- Extensions
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- For geospatial queries (optional but recommended)

-- =====================================================
-- TABLES
-- =====================================================

-- =====================================================
-- Users Table
-- =====================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Should be hashed in production
    role VARCHAR(20) NOT NULL CHECK (role IN ('driver', 'customer')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Profile Information
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    avatar TEXT, -- URL to avatar image
    bio TEXT,
    rating DECIMAL(3, 2) DEFAULT 4.5 CHECK (rating >= 0 AND rating <= 5),
    total_trips INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- Routes Table
-- =====================================================
CREATE TABLE routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    route_name VARCHAR(255) NOT NULL,
    origin VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    departure_date DATE NOT NULL,
    departure_time TIME NOT NULL,
    total_seats INTEGER NOT NULL CHECK (total_seats >= 1 AND total_seats <= 8),
    available_seats INTEGER NOT NULL CHECK (available_seats >= 0 AND available_seats <= total_seats),
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    notes TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Route Stops/Waypoints
CREATE TABLE route_stops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    estimated_time TIME NOT NULL,
    stop_order INTEGER NOT NULL CHECK (stop_order >= 0),
    latitude DECIMAL(10, 8), -- Geospatial coordinate
    longitude DECIMAL(11, 8), -- Geospatial coordinate
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(route_id, stop_order)
);

-- =====================================================
-- Bookings Table
-- =====================================================
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    driver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    seats INTEGER NOT NULL CHECK (seats >= 1 AND seats <= 8),
    price_per_seat DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    driver_confirmed BOOLEAN DEFAULT FALSE,
    customer_confirmed BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_active_booking UNIQUE (route_id, customer_id)
        DEFERRABLE INITIALLY DEFERRED
);

-- Index for preventing duplicate active bookings
CREATE UNIQUE INDEX idx_unique_active_booking
    ON bookings(route_id, customer_id)
    WHERE status IN ('pending', 'confirmed');

-- =====================================================
-- Conversations Table
-- =====================================================
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
    driver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Messages Table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    text TEXT NOT NULL CHECK (LENGTH(text) > 0 AND LENGTH(text) <= 1000),
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'system')),
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- Location Tracking Tables
-- =====================================================

-- Current Location (Latest position for each user)
CREATE TABLE user_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    latitude DECIMAL(10, 8) NOT NULL CHECK (latitude >= -90 AND latitude <= 90),
    longitude DECIMAL(11, 8) NOT NULL CHECK (longitude >= -180 AND longitude <= 180),
    accuracy DECIMAL(10, 2) NOT NULL CHECK (accuracy >= 0),
    speed DECIMAL(10, 2), -- Speed in m/s
    heading DECIMAL(5, 2), -- Direction in degrees (0-360)
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Location History (Track movement over time)
CREATE TABLE location_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    latitude DECIMAL(10, 8) NOT NULL CHECK (latitude >= -90 AND latitude <= 90),
    longitude DECIMAL(11, 8) NOT NULL CHECK (longitude >= -180 AND longitude <= 180),
    accuracy DECIMAL(10, 2) NOT NULL CHECK (accuracy >= 0),
    speed DECIMAL(10, 2),
    heading DECIMAL(5, 2),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- Sessions Table (for authentication)
-- =====================================================
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- Notifications Table (optional, for future use)
-- =====================================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL CHECK (notification_type IN ('booking', 'message', 'route', 'system')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB, -- Additional data as JSON
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- Reviews/Ratings Table (optional, for future use)
-- =====================================================
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reviewed_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(booking_id, reviewer_id)
);

-- =====================================================
-- INDEXES for Performance Optimization
-- =====================================================

-- Users indexes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);

-- Routes indexes
CREATE INDEX idx_routes_driver_id ON routes(driver_id);
CREATE INDEX idx_routes_origin ON routes(origin);
CREATE INDEX idx_routes_destination ON routes(destination);
CREATE INDEX idx_routes_departure_date ON routes(departure_date);
CREATE INDEX idx_routes_status ON routes(status);
CREATE INDEX idx_routes_price ON routes(price);
CREATE INDEX idx_routes_available_seats ON routes(available_seats);
CREATE INDEX idx_routes_search ON routes(origin, destination, departure_date, status);

-- Route stops indexes
CREATE INDEX idx_route_stops_route_id ON route_stops(route_id);
CREATE INDEX idx_route_stops_order ON route_stops(route_id, stop_order);

-- Bookings indexes
CREATE INDEX idx_bookings_route_id ON bookings(route_id);
CREATE INDEX idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX idx_bookings_driver_id ON bookings(driver_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_created_at ON bookings(created_at DESC);
CREATE INDEX idx_bookings_user_participation ON bookings(customer_id, driver_id);

-- Conversations indexes
CREATE INDEX idx_conversations_booking_id ON conversations(booking_id);
CREATE INDEX idx_conversations_driver_id ON conversations(driver_id);
CREATE INDEX idx_conversations_customer_id ON conversations(customer_id);
CREATE INDEX idx_conversations_last_message ON conversations(last_message_at DESC);

-- Messages indexes
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX idx_messages_read ON messages(read);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);

-- Location indexes
CREATE INDEX idx_user_locations_user_id ON user_locations(user_id);
CREATE INDEX idx_user_locations_timestamp ON user_locations(timestamp DESC);
CREATE INDEX idx_location_history_user_id ON location_history(user_id);
CREATE INDEX idx_location_history_timestamp ON location_history(user_id, timestamp DESC);

-- Sessions indexes
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- Reviews indexes
CREATE INDEX idx_reviews_booking_id ON reviews(booking_id);
CREATE INDEX idx_reviews_reviewed_user_id ON reviews(reviewed_user_id);

-- =====================================================
-- TRIGGERS for Automatic Timestamp Updates
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_routes_updated_at BEFORE UPDATE ON routes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_locations_updated_at BEFORE UPDATE ON user_locations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TRIGGERS for Business Logic
-- =====================================================

-- Trigger to update conversation's last_message_at when new message is added
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE conversations
    SET last_message_at = NEW.created_at
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_conversation_on_new_message
    AFTER INSERT ON messages
    FOR EACH ROW EXECUTE FUNCTION update_conversation_last_message();

-- Trigger to ensure available_seats doesn't go negative
CREATE OR REPLACE FUNCTION check_available_seats()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.available_seats < 0 THEN
        RAISE EXCEPTION 'Available seats cannot be negative';
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER check_routes_available_seats
    BEFORE UPDATE ON routes
    FOR EACH ROW EXECUTE FUNCTION check_available_seats();

-- Trigger to update user profile rating when new review is added
CREATE OR REPLACE FUNCTION update_user_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE user_profiles
    SET rating = (
        SELECT AVG(rating)::DECIMAL(3,2)
        FROM reviews
        WHERE reviewed_user_id = NEW.reviewed_user_id
    ),
    total_trips = total_trips + 1
    WHERE user_id = NEW.reviewed_user_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_rating_on_review
    AFTER INSERT ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_user_rating();

-- =====================================================
-- VIEWS for Common Queries
-- =====================================================

-- View for complete user information
CREATE OR REPLACE VIEW users_with_profiles AS
SELECT
    u.id,
    u.username,
    u.role,
    u.created_at,
    u.updated_at,
    p.first_name,
    p.last_name,
    p.email,
    p.phone,
    p.avatar,
    p.bio,
    p.rating,
    p.total_trips
FROM users u
LEFT JOIN user_profiles p ON u.id = p.user_id;

-- View for routes with driver information
CREATE OR REPLACE VIEW routes_with_driver_info AS
SELECT
    r.*,
    u.username as driver_username,
    p.first_name || ' ' || p.last_name as driver_name,
    p.avatar as driver_avatar,
    p.rating as driver_rating
FROM routes r
JOIN users u ON r.driver_id = u.id
LEFT JOIN user_profiles p ON u.id = p.user_id;

-- View for bookings with complete information
CREATE OR REPLACE VIEW bookings_with_details AS
SELECT
    b.*,
    r.origin,
    r.destination,
    r.departure_date as date,
    r.departure_time as time,
    cu.username as customer_username,
    cp.first_name || ' ' || cp.last_name as customer_name,
    cp.avatar as customer_avatar,
    du.username as driver_username,
    dp.first_name || ' ' || dp.last_name as driver_name,
    dp.avatar as driver_avatar
FROM bookings b
JOIN routes r ON b.route_id = r.id
JOIN users cu ON b.customer_id = cu.id
JOIN users du ON b.driver_id = du.id
LEFT JOIN user_profiles cp ON cu.id = cp.user_id
LEFT JOIN user_profiles dp ON du.id = dp.user_id;

-- View for conversations with unread message counts
CREATE OR REPLACE VIEW conversations_with_unread AS
SELECT
    c.*,
    du.username as driver_username,
    dp.first_name || ' ' || dp.last_name as driver_name,
    dp.avatar as driver_avatar,
    cu.username as customer_username,
    cp.first_name || ' ' || cp.last_name as customer_name,
    cp.avatar as customer_avatar,
    COUNT(CASE WHEN m.read = FALSE AND m.recipient_id = c.driver_id THEN 1 END) as driver_unread_count,
    COUNT(CASE WHEN m.read = FALSE AND m.recipient_id = c.customer_id THEN 1 END) as customer_unread_count
FROM conversations c
JOIN users du ON c.driver_id = du.id
JOIN users cu ON c.customer_id = cu.id
LEFT JOIN user_profiles dp ON du.id = dp.user_id
LEFT JOIN user_profiles cp ON cu.id = cp.user_id
LEFT JOIN messages m ON c.id = m.conversation_id
GROUP BY c.id, du.username, cu.username, dp.first_name, dp.last_name, dp.avatar,
         cp.first_name, cp.last_name, cp.avatar;

-- =====================================================
-- STORED PROCEDURES/FUNCTIONS
-- =====================================================

-- Function to get driver statistics
CREATE OR REPLACE FUNCTION get_driver_stats(driver_uuid UUID)
RETURNS TABLE (
    active_routes BIGINT,
    total_bookings BIGINT,
    pending_bookings BIGINT,
    completed_trips BIGINT,
    earnings DECIMAL,
    rating DECIMAL,
    total_reviews BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(DISTINCT r.id) FILTER (WHERE r.status = 'active') as active_routes,
        COUNT(DISTINCT b.id) as total_bookings,
        COUNT(DISTINCT b.id) FILTER (WHERE b.status = 'pending') as pending_bookings,
        COUNT(DISTINCT b.id) FILTER (WHERE b.status = 'completed') as completed_trips,
        COALESCE(SUM(b.total_price) FILTER (WHERE b.status = 'completed'), 0) as earnings,
        COALESCE(p.rating, 4.5) as rating,
        COALESCE(COUNT(DISTINCT rv.id), 0) as total_reviews
    FROM users u
    LEFT JOIN routes r ON u.id = r.driver_id
    LEFT JOIN bookings b ON u.id = b.driver_id
    LEFT JOIN user_profiles p ON u.id = p.user_id
    LEFT JOIN reviews rv ON u.id = rv.reviewed_user_id
    WHERE u.id = driver_uuid
    GROUP BY u.id, p.rating;
END;
$$ LANGUAGE plpgsql;

-- Function to get customer statistics
CREATE OR REPLACE FUNCTION get_customer_stats(customer_uuid UUID)
RETURNS TABLE (
    total_bookings BIGINT,
    completed_trips BIGINT,
    total_spent DECIMAL,
    saved_money DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(DISTINCT b.id) as total_bookings,
        COUNT(DISTINCT b.id) FILTER (WHERE b.status = 'completed') as completed_trips,
        COALESCE(SUM(b.total_price) FILTER (WHERE b.status = 'completed'), 0) as total_spent,
        0.0::DECIMAL as saved_money -- Placeholder for future calculation
    FROM bookings b
    WHERE b.customer_id = customer_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to find nearby drivers (using simple distance calculation)
CREATE OR REPLACE FUNCTION find_nearby_drivers(
    search_lat DECIMAL,
    search_lng DECIMAL,
    search_radius INTEGER DEFAULT 5000
)
RETURNS TABLE (
    driver_id UUID,
    username VARCHAR,
    full_name TEXT,
    avatar TEXT,
    latitude DECIMAL,
    longitude DECIMAL,
    distance_meters INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        u.id as driver_id,
        u.username,
        COALESCE(p.first_name || ' ' || p.last_name, u.username) as full_name,
        p.avatar,
        ul.latitude,
        ul.longitude,
        CAST(
            111000 * SQRT(
                POWER(ul.latitude - search_lat, 2) +
                POWER(ul.longitude - search_lng, 2)
            ) AS INTEGER
        ) as distance_meters
    FROM users u
    JOIN user_locations ul ON u.id = ul.user_id
    LEFT JOIN user_profiles p ON u.id = p.user_id
    WHERE u.role = 'driver'
    AND 111000 * SQRT(
        POWER(ul.latitude - search_lat, 2) +
        POWER(ul.longitude - search_lng, 2)
    ) <= search_radius
    ORDER BY distance_meters;
END;
$$ LANGUAGE plpgsql;

-- Function to clean expired sessions
CREATE OR REPLACE FUNCTION clean_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM sessions WHERE expires_at < CURRENT_TIMESTAMP;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMMENTS for Documentation
-- =====================================================

COMMENT ON TABLE users IS 'Main users table storing authentication and role information';
COMMENT ON TABLE user_profiles IS 'Extended user profile information for both drivers and customers';
COMMENT ON TABLE routes IS 'Routes created by drivers for ridesharing';
COMMENT ON TABLE route_stops IS 'Waypoints/stops along each route';
COMMENT ON TABLE bookings IS 'Customer bookings for routes';
COMMENT ON TABLE conversations IS 'Chat conversations between drivers and customers';
COMMENT ON TABLE messages IS 'Individual messages within conversations';
COMMENT ON TABLE user_locations IS 'Current location of drivers (real-time tracking)';
COMMENT ON TABLE location_history IS 'Historical location data for drivers';
COMMENT ON TABLE sessions IS 'User authentication sessions';
COMMENT ON TABLE notifications IS 'System notifications for users';
COMMENT ON TABLE reviews IS 'User reviews and ratings after completed trips';

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Insert sample driver
INSERT INTO users (username, password, role) VALUES
    ('driver1', 'hashed_password_here', 'driver');

-- Insert sample customer
INSERT INTO users (username, password, role) VALUES
    ('customer1', 'hashed_password_here', 'customer');

-- =====================================================
-- DATABASE MAINTENANCE
-- =====================================================

-- Schedule cleanup of expired sessions (run daily)
-- CREATE EXTENSION IF NOT EXISTS pg_cron;
-- SELECT cron.schedule('clean-sessions', '0 2 * * *', 'SELECT clean_expired_sessions();');

-- =====================================================
-- GRANTS (Adjust based on your application user)
-- =====================================================

-- Example: Grant permissions to application user
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO routepilot_app;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO routepilot_app;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO routepilot_app;
