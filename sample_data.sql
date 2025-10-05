-- =====================================================
-- RoutePilot Sample Data Script (Error-Safe Version)
-- =====================================================
-- PostgreSQL Sample Data for RoutePilot Application
-- Version: 1.0.1
-- Description: Comprehensive sample data with error handling
--
-- Usage:
--   1. First run schema.sql to create the database structure
--   2. Then run this script to populate with sample data
--   psql -d routepilot -f sample_data.sql
--
-- Note: This script uses individual transactions for safety
-- =====================================================

-- Clear existing data (optional - uncomment if you want to reset)
-- TRUNCATE TABLE reviews, notifications, sessions, location_history, user_locations, messages, conversations, bookings, route_stops, routes, user_profiles, users CASCADE;

-- =====================================================
-- USERS - 30 users (15 drivers, 15 customers)
-- =====================================================

BEGIN;

-- Insert Users (Drivers)
INSERT INTO users (id, username, password, role, created_at, updated_at) VALUES
('d1111111-1111-1111-1111-111111111111', 'mariajohnson45', 'hashed_password_driver1', 'driver', NOW() - INTERVAL '90 days', NOW()),
('d2222222-2222-2222-2222-222222222222', 'jamesgarcia78', 'hashed_password_driver2', 'driver', NOW() - INTERVAL '75 days', NOW()),
('d3333333-3333-3333-3333-333333333333', 'sarahwilson23', 'hashed_password_driver3', 'driver', NOW() - INTERVAL '60 days', NOW()),
('d4444444-4444-4444-4444-444444444444', 'michaelbrown12', 'hashed_password_driver4', 'driver', NOW() - INTERVAL '50 days', NOW()),
('d5555555-5555-5555-5555-555555555555', 'annadavis89', 'hashed_password_driver5', 'driver', NOW() - INTERVAL '45 days', NOW()),
('d6666666-6666-6666-6666-666666666666', 'davidmartinez56', 'hashed_password_driver6', 'driver', NOW() - INTERVAL '40 days', NOW()),
('d7777777-7777-7777-7777-777777777777', 'lisarodriguez34', 'hashed_password_driver7', 'driver', NOW() - INTERVAL '35 days', NOW()),
('d8888888-8888-8888-8888-888888888888', 'robertanderson67', 'hashed_password_driver8', 'driver', NOW() - INTERVAL '30 days', NOW()),
('d9999999-9999-9999-9999-999999999999', 'emmataylor91', 'hashed_password_driver9', 'driver', NOW() - INTERVAL '25 days', NOW()),
('da111111-1111-1111-1111-111111111111', 'johnthomas44', 'hashed_password_driver10', 'driver', NOW() - INTERVAL '20 days', NOW()),
('da222222-2222-2222-2222-222222222222', 'sophiahernandez28', 'hashed_password_driver11', 'driver', NOW() - INTERVAL '18 days', NOW()),
('da333333-3333-3333-3333-333333333333', 'williammoore53', 'hashed_password_driver12', 'driver', NOW() - INTERVAL '15 days', NOW()),
('da444444-4444-4444-4444-444444444444', 'oliviamartin72', 'hashed_password_driver13', 'driver', NOW() - INTERVAL '12 days', NOW()),
('da555555-5555-5555-5555-555555555555', 'danieljackson19', 'hashed_password_driver14', 'driver', NOW() - INTERVAL '10 days', NOW()),
('da666666-6666-6666-6666-666666666666', 'isabellathompson88', 'hashed_password_driver15', 'driver', NOW() - INTERVAL '8 days', NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert Users (Customers)
INSERT INTO users (id, username, password, role, created_at, updated_at) VALUES
('c1111111-1111-1111-1111-111111111111', 'matthewwhite42', 'hashed_password_customer1', 'customer', NOW() - INTERVAL '70 days', NOW()),
('c2222222-2222-2222-2222-222222222222', 'mialopez65', 'hashed_password_customer2', 'customer', NOW() - INTERVAL '65 days', NOW()),
('c3333333-3333-3333-3333-333333333333', 'christopherlee33', 'hashed_password_customer3', 'customer', NOW() - INTERVAL '55 days', NOW()),
('c4444444-4444-4444-4444-444444444444', 'abigailmiller81', 'hashed_password_customer4', 'customer', NOW() - INTERVAL '48 days', NOW()),
('c5555555-5555-5555-5555-555555555555', 'josephjones57', 'hashed_password_customer5', 'customer', NOW() - INTERVAL '42 days', NOW()),
('c6666666-6666-6666-6666-666666666666', 'emilybrown24', 'hashed_password_customer6', 'customer', NOW() - INTERVAL '38 days', NOW()),
('c7777777-7777-7777-7777-777777777777', 'andrewgarcia96', 'hashed_password_customer7', 'customer', NOW() - INTERVAL '32 days', NOW()),
('c8888888-8888-8888-8888-888888888888', 'sophiawilson47', 'hashed_password_customer8', 'customer', NOW() - INTERVAL '28 days', NOW()),
('c9999999-9999-9999-9999-999999999999', 'danieljohnson73', 'hashed_password_customer9', 'customer', NOW() - INTERVAL '22 days', NOW()),
('ca111111-1111-1111-1111-111111111111', 'avamartinez29', 'hashed_password_customer10', 'customer', NOW() - INTERVAL '19 days', NOW()),
('ca222222-2222-2222-2222-222222222222', 'jamesanderson51', 'hashed_password_customer11', 'customer', NOW() - INTERVAL '16 days', NOW()),
('ca333333-3333-3333-3333-333333333333', 'charlottedavis84', 'hashed_password_customer12', 'customer', NOW() - INTERVAL '14 days', NOW()),
('ca444444-4444-4444-4444-444444444444', 'benjaminmoore38', 'hashed_password_customer13', 'customer', NOW() - INTERVAL '11 days', NOW()),
('ca555555-5555-5555-5555-555555555555', 'ameliataylor62', 'hashed_password_customer14', 'customer', NOW() - INTERVAL '9 days', NOW()),
('ca666666-6666-6666-6666-666666666666', 'lucashernandez95', 'hashed_password_customer15', 'customer', NOW() - INTERVAL '7 days', NOW())
ON CONFLICT (id) DO NOTHING;

COMMIT;

-- =====================================================
-- USER PROFILES
-- =====================================================

BEGIN;

-- Driver Profiles
INSERT INTO user_profiles (user_id, first_name, last_name, email, phone, avatar, bio, rating, total_trips, created_at, updated_at) VALUES
('d1111111-1111-1111-1111-111111111111', 'Maria', 'Johnson', 'maria.johnson@example.com', '+14155551234', 'https://api.dicebear.com/7.x/avataaars/svg?seed=MariaJohnson', 'Experienced driver serving Downtown Plaza area. Safe and reliable transportation.', 4.8, 87, NOW() - INTERVAL '90 days', NOW()),
('d2222222-2222-2222-2222-222222222222', 'James', 'Garcia', 'james.garcia@example.com', '+14155552345', 'https://api.dicebear.com/7.x/avataaars/svg?seed=JamesGarcia', 'Professional driver with 5 years experience. Always on time!', 4.9, 142, NOW() - INTERVAL '75 days', NOW()),
('d3333333-3333-3333-3333-333333333333', 'Sarah', 'Wilson', 'sarah.wilson@example.com', '+14155553456', 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahWilson', 'Friendly driver specializing in airport transfers. AC available.', 4.7, 65, NOW() - INTERVAL '60 days', NOW()),
('d4444444-4444-4444-4444-444444444444', 'Michael', 'Brown', 'michael.brown@example.com', '+14155554567', 'https://api.dicebear.com/7.x/avataaars/svg?seed=MichaelBrown', 'Experienced driver serving Business District. WiFi available.', 4.6, 93, NOW() - INTERVAL '50 days', NOW()),
('d5555555-5555-5555-5555-555555555555', 'Anna', 'Davis', 'anna.davis@example.com', '+14155555678', 'https://api.dicebear.com/7.x/avataaars/svg?seed=AnnaDavis', 'Safe and comfortable rides. Pet-friendly driver!', 4.9, 108, NOW() - INTERVAL '45 days', NOW()),
('d6666666-6666-6666-6666-666666666666', 'David', 'Martinez', 'david.martinez@example.com', '+14155556789', 'https://api.dicebear.com/7.x/avataaars/svg?seed=DavidMartinez', 'Professional driver with clean vehicle. Music allowed!', 4.5, 76, NOW() - INTERVAL '40 days', NOW()),
('d7777777-7777-7777-7777-777777777777', 'Lisa', 'Rodriguez', 'lisa.rodriguez@example.com', '+14155557890', 'https://api.dicebear.com/7.x/avataaars/svg?seed=LisaRodriguez', 'Reliable transportation around the city. Non-smoking vehicle.', 4.8, 121, NOW() - INTERVAL '35 days', NOW()),
('d8888888-8888-8888-8888-888888888888', 'Robert', 'Anderson', 'robert.anderson@example.com', '+14155558901', 'https://api.dicebear.com/7.x/avataaars/svg?seed=RobertAnderson', 'Experienced driver with spacious vehicle. Luggage friendly.', 4.7, 89, NOW() - INTERVAL '30 days', NOW()),
('d9999999-9999-9999-9999-999999999999', 'Emma', 'Taylor', 'emma.taylor@example.com', '+14155559012', 'https://api.dicebear.com/7.x/avataaars/svg?seed=EmmaTaylor', 'Friendly and punctual driver. University routes specialist.', 5.0, 134, NOW() - INTERVAL '25 days', NOW()),
('da111111-1111-1111-1111-111111111111', 'John', 'Thomas', 'john.thomas@example.com', '+14155550123', 'https://api.dicebear.com/7.x/avataaars/svg?seed=JohnThomas', 'Professional driver serving all areas. Very reliable.', 4.6, 72, NOW() - INTERVAL '20 days', NOW()),
('da222222-2222-2222-2222-222222222222', 'Sophia', 'Hernandez', 'sophia.hernandez@example.com', '+14155551235', 'https://api.dicebear.com/7.x/avataaars/svg?seed=SophiaHernandez', 'Safe and comfortable transportation. AC and WiFi available.', 4.9, 95, NOW() - INTERVAL '18 days', NOW()),
('da333333-3333-3333-3333-333333333333', 'William', 'Moore', 'william.moore@example.com', '+14155552346', 'https://api.dicebear.com/7.x/avataaars/svg?seed=WilliamMoore', 'Experienced driver with excellent navigation skills.', 4.7, 58, NOW() - INTERVAL '15 days', NOW()),
('da444444-4444-4444-4444-444444444444', 'Olivia', 'Martin', 'olivia.martin@example.com', '+14155553457', 'https://api.dicebear.com/7.x/avataaars/svg?seed=OliviaMartin', 'Friendly driver, comfortable rides guaranteed.', 4.8, 81, NOW() - INTERVAL '12 days', NOW()),
('da555555-5555-5555-5555-555555555555', 'Daniel', 'Jackson', 'daniel.jackson@example.com', '+14155554568', 'https://api.dicebear.com/7.x/avataaars/svg?seed=DanielJackson', 'Professional driver with modern vehicle. Very punctual.', 4.6, 44, NOW() - INTERVAL '10 days', NOW()),
('da666666-6666-6666-6666-666666666666', 'Isabella', 'Thompson', 'isabella.thompson@example.com', '+14155555679', 'https://api.dicebear.com/7.x/avataaars/svg?seed=IsabellaThompson', 'Safe driver with excellent ratings. Family friendly.', 5.0, 67, NOW() - INTERVAL '8 days', NOW())
ON CONFLICT (user_id) DO NOTHING;

-- Customer Profiles
INSERT INTO user_profiles (user_id, first_name, last_name, email, phone, avatar, bio, rating, total_trips, created_at, updated_at) VALUES
('c1111111-1111-1111-1111-111111111111', 'Matthew', 'White', 'matthew.white@example.com', '+14155556790', 'https://api.dicebear.com/7.x/avataaars/svg?seed=MatthewWhite', 'Regular commuter looking for cost-effective travel options.', 4.5, 23, NOW() - INTERVAL '70 days', NOW()),
('c2222222-2222-2222-2222-222222222222', 'Mia', 'Lopez', 'mia.lopez@example.com', '+14155557891', 'https://api.dicebear.com/7.x/avataaars/svg?seed=MiaLopez', 'Frequent traveler, always punctual.', 4.8, 45, NOW() - INTERVAL '65 days', NOW()),
('c3333333-3333-3333-3333-333333333333', 'Christopher', 'Lee', 'christopher.lee@example.com', '+14155558902', 'https://api.dicebear.com/7.x/avataaars/svg?seed=ChristopherLee', 'Business traveler seeking reliable transportation.', 4.7, 31, NOW() - INTERVAL '55 days', NOW()),
('c4444444-4444-4444-4444-444444444444', 'Abigail', 'Miller', 'abigail.miller@example.com', '+14155559013', 'https://api.dicebear.com/7.x/avataaars/svg?seed=AbigailMiller', 'University student, regular rideshare user.', 4.6, 18, NOW() - INTERVAL '48 days', NOW()),
('c5555555-5555-5555-5555-555555555555', 'Joseph', 'Jones', 'joseph.jones@example.com', '+14155550124', 'https://api.dicebear.com/7.x/avataaars/svg?seed=JosephJones', 'Regular commuter looking for cost-effective travel options.', 4.9, 52, NOW() - INTERVAL '42 days', NOW()),
('c6666666-6666-6666-6666-666666666666', 'Emily', 'Brown', 'emily.brown@example.com', '+14155551236', 'https://api.dicebear.com/7.x/avataaars/svg?seed=EmilyBrown', 'Friendly passenger, enjoys conversations.', 4.7, 27, NOW() - INTERVAL '38 days', NOW()),
('c7777777-7777-7777-7777-777777777777', 'Andrew', 'Garcia', 'andrew.garcia@example.com', '+14155552347', 'https://api.dicebear.com/7.x/avataaars/svg?seed=AndrewGarcia', 'Airport traveler, prefer quiet rides.', 4.5, 15, NOW() - INTERVAL '32 days', NOW()),
('c8888888-8888-8888-8888-888888888888', 'Sophia', 'Wilson', 'sophia.wilson2@example.com', '+14155553458', 'https://api.dicebear.com/7.x/avataaars/svg?seed=SophiaWilson', 'Regular commuter looking for cost-effective travel options.', 4.8, 39, NOW() - INTERVAL '28 days', NOW()),
('c9999999-9999-9999-9999-999999999999', 'Daniel', 'Johnson', 'daniel.johnson2@example.com', '+14155554569', 'https://api.dicebear.com/7.x/avataaars/svg?seed=DanielJohnson', 'Business professional, values punctuality.', 4.6, 21, NOW() - INTERVAL '22 days', NOW()),
('ca111111-1111-1111-1111-111111111111', 'Ava', 'Martinez', 'ava.martinez@example.com', '+14155555680', 'https://api.dicebear.com/7.x/avataaars/svg?seed=AvaMartinez', 'Friendly and courteous passenger.', 4.9, 33, NOW() - INTERVAL '19 days', NOW()),
('ca222222-2222-2222-2222-222222222222', 'James', 'Anderson', 'james.anderson2@example.com', '+14155556791', 'https://api.dicebear.com/7.x/avataaars/svg?seed=JamesAnderson', 'Regular user, always on time.', 4.7, 28, NOW() - INTERVAL '16 days', NOW()),
('ca333333-3333-3333-3333-333333333333', 'Charlotte', 'Davis', 'charlotte.davis@example.com', '+14155557892', 'https://api.dicebear.com/7.x/avataaars/svg?seed=CharlotteDavis', 'Respectful passenger, enjoys music.', 4.8, 19, NOW() - INTERVAL '14 days', NOW()),
('ca444444-4444-4444-4444-444444444444', 'Benjamin', 'Moore', 'benjamin.moore@example.com', '+14155558903', 'https://api.dicebear.com/7.x/avataaars/svg?seed=BenjaminMoore', 'Regular commuter looking for cost-effective travel options.', 4.6, 24, NOW() - INTERVAL '11 days', NOW()),
('ca555555-5555-5555-5555-555555555555', 'Amelia', 'Taylor', 'amelia.taylor@example.com', '+14155559014', 'https://api.dicebear.com/7.x/avataaars/svg?seed=AmeliaTaylor', 'University student, friendly traveler.', 4.9, 16, NOW() - INTERVAL '9 days', NOW()),
('ca666666-6666-6666-6666-666666666666', 'Lucas', 'Hernandez', 'lucas.hernandez@example.com', '+14155550125', 'https://api.dicebear.com/7.x/avataaars/svg?seed=LucasHernandez', 'Professional passenger, values cleanliness.', 4.7, 12, NOW() - INTERVAL '7 days', NOW())
ON CONFLICT (user_id) DO NOTHING;

COMMIT;

-- =====================================================
-- ROUTES - 20 routes with various statuses
-- =====================================================

BEGIN;

INSERT INTO routes (id, driver_id, route_name, origin, destination, departure_date, departure_time, total_seats, available_seats, price, notes, status, created_at, updated_at) VALUES
('r0000001-0001-0001-0001-000000000001', 'd1111111-1111-1111-1111-111111111111', 'Downtown Plaza to Airport Terminal 1', 'Downtown Plaza', 'Airport Terminal 1', CURRENT_DATE + INTERVAL '2 days', '08:00', 4, 2, 25.00, 'Non-smoking vehicle only', 'active', NOW() - INTERVAL '5 days', NOW()),
('r0000002-0002-0002-0002-000000000002', 'd2222222-2222-2222-2222-222222222222', 'City Center to University Campus', 'City Center', 'University Campus', CURRENT_DATE + INTERVAL '3 days', '07:30', 3, 3, 15.00, 'WiFi available in vehicle', 'active', NOW() - INTERVAL '4 days', NOW()),
('r0000003-0003-0003-0003-000000000003', 'd3333333-3333-3333-3333-333333333333', 'Airport Terminal 2 to Business District', 'Airport Terminal 2', 'Business District', CURRENT_DATE + INTERVAL '1 days', '09:15', 4, 1, 30.00, 'Small luggage only, no large bags', 'active', NOW() - INTERVAL '3 days', NOW()),
('r0000004-0004-0004-0004-000000000004', 'd4444444-4444-4444-4444-444444444444', 'University Campus to Shopping Mall', 'University Campus', 'Shopping Mall', CURRENT_DATE + INTERVAL '4 days', '14:00', 3, 2, 12.00, 'Music allowed, just ask!', 'active', NOW() - INTERVAL '2 days', NOW()),
('r0000005-0005-0005-0005-000000000005', 'd5555555-5555-5555-5555-555555555555', 'Beach Resort to Downtown Plaza', 'Beach Resort', 'Downtown Plaza', CURRENT_DATE + INTERVAL '5 days', '18:30', 4, 4, 22.00, 'AC available, comfortable ride', 'active', NOW() - INTERVAL '1 days', NOW()),
('r0000006-0006-0006-0006-000000000006', 'd6666666-6666-6666-6666-666666666666', 'Business District to Riverside Park', 'Business District', 'Riverside Park', CURRENT_DATE + INTERVAL '6 days', '17:00', 2, 1, 18.00, 'Please be punctual, departure is strict', 'active', NOW() - INTERVAL '6 days', NOW()),
('r0000007-0007-0007-0007-000000000007', 'd7777777-7777-7777-7777-777777777777', 'Historic Quarter to City Center', 'Historic Quarter', 'City Center', CURRENT_DATE + INTERVAL '7 days', '10:30', 3, 3, 16.00, 'Pet-friendly driver', 'active', NOW() - INTERVAL '5 days', NOW()),
('r0000008-0008-0008-0008-000000000008', 'd8888888-8888-8888-8888-888888888888', 'Suburban Heights to Airport Terminal 1', 'Suburban Heights', 'Airport Terminal 1', CURRENT_DATE + INTERVAL '8 days', '06:00', 4, 2, 28.00, NULL, 'active', NOW() - INTERVAL '4 days', NOW()),
('r0000009-0009-0009-0009-000000000009', 'd9999999-9999-9999-9999-999999999999', 'Metro Station to Beach Resort', 'Metro Station', 'Beach Resort', CURRENT_DATE + INTERVAL '9 days', '11:45', 3, 1, 35.00, 'Prefer quiet passengers', 'active', NOW() - INTERVAL '3 days', NOW()),
('r0000010-0010-0010-0010-000000000010', 'da111111-1111-1111-1111-111111111111', 'Hospital Complex to Downtown Plaza', 'Hospital Complex', 'Downtown Plaza', CURRENT_DATE + INTERVAL '10 days', '15:30', 2, 2, 14.00, NULL, 'active', NOW() - INTERVAL '2 days', NOW()),
-- More active routes
('r0000011-0011-0011-0011-000000000011', 'd1111111-1111-1111-1111-111111111111', 'Downtown Plaza to Sports Stadium', 'Downtown Plaza', 'Sports Stadium', CURRENT_DATE + INTERVAL '1 days', '19:00', 4, 4, 20.00, 'Music allowed, just ask!', 'active', NOW() - INTERVAL '7 days', NOW()),
('r0000012-0012-0012-0012-000000000012', 'd2222222-2222-2222-2222-222222222222', 'Airport Terminal 1 to City Center', 'Airport Terminal 1', 'City Center', CURRENT_DATE + INTERVAL '2 days', '12:00', 3, 2, 24.00, 'WiFi available in vehicle', 'active', NOW() - INTERVAL '6 days', NOW()),
('r0000013-0013-0013-0013-000000000013', 'd3333333-3333-3333-3333-333333333333', 'Business District to University Campus', 'Business District', 'University Campus', CURRENT_DATE + INTERVAL '3 days', '08:30', 4, 3, 17.00, NULL, 'active', NOW() - INTERVAL '5 days', NOW()),
('r0000014-0014-0014-0014-000000000014', 'd4444444-4444-4444-4444-444444444444', 'Shopping Mall to Historic Quarter', 'Shopping Mall', 'Historic Quarter', CURRENT_DATE + INTERVAL '4 days', '13:15', 3, 1, 19.00, 'Non-smoking vehicle only', 'active', NOW() - INTERVAL '4 days', NOW()),
('r0000015-0015-0015-0015-000000000015', 'd5555555-5555-5555-5555-555555555555', 'Residential Area to Business District', 'Residential Area', 'Business District', CURRENT_DATE + INTERVAL '5 days', '07:00', 4, 4, 13.00, 'AC available, comfortable ride', 'active', NOW() - INTERVAL '3 days', NOW()),
-- Completed routes
('r0000016-0016-0016-0016-000000000016', 'd6666666-6666-6666-6666-666666666666', 'Downtown Plaza to Airport Terminal 2', 'Downtown Plaza', 'Airport Terminal 2', CURRENT_DATE - INTERVAL '5 days', '09:00', 4, 0, 26.00, NULL, 'completed', NOW() - INTERVAL '10 days', NOW()),
('r0000017-0017-0017-0017-000000000017', 'd7777777-7777-7777-7777-777777777777', 'City Center to Beach Resort', 'City Center', 'Beach Resort', CURRENT_DATE - INTERVAL '3 days', '10:30', 3, 0, 32.00, 'Pet-friendly driver', 'completed', NOW() - INTERVAL '8 days', NOW()),
('r0000018-0018-0018-0018-000000000018', 'd8888888-8888-8888-8888-888888888888', 'University Campus to Airport Terminal 1', 'University Campus', 'Airport Terminal 1', CURRENT_DATE - INTERVAL '7 days', '14:00', 4, 0, 27.00, NULL, 'completed', NOW() - INTERVAL '12 days', NOW()),
-- Cancelled routes
('r0000019-0019-0019-0019-000000000019', 'd9999999-9999-9999-9999-999999999999', 'Business District to Shopping Mall', 'Business District', 'Shopping Mall', CURRENT_DATE - INTERVAL '2 days', '16:00', 3, 3, 15.00, NULL, 'cancelled', NOW() - INTERVAL '6 days', NOW()),
('r0000020-0020-0020-0020-000000000020', 'da111111-1111-1111-1111-111111111111', 'Historic Quarter to Metro Station', 'Historic Quarter', 'Metro Station', CURRENT_DATE - INTERVAL '4 days', '11:00', 2, 2, 11.00, NULL, 'cancelled', NOW() - INTERVAL '9 days', NOW())
ON CONFLICT (id) DO NOTHING;

COMMIT;

-- =====================================================
-- ROUTE STOPS
-- =====================================================

BEGIN;

INSERT INTO route_stops (id, route_id, name, estimated_time, stop_order, latitude, longitude, created_at) VALUES
-- Route 1 stops
('s0000001-0001-0001-0001-000000000001', 'r0000001-0001-0001-0001-000000000001', 'Downtown Plaza', '08:00', 0, 42.141296, -8.234724, NOW() - INTERVAL '5 days'),
('s0000002-0001-0001-0001-000000000002', 'r0000001-0001-0001-0001-000000000001', 'City Center', '08:15', 1, 42.142500, -8.236000, NOW() - INTERVAL '5 days'),
('s0000003-0001-0001-0001-000000000003', 'r0000001-0001-0001-0001-000000000001', 'Airport Terminal 1', '08:45', 2, 42.150000, -8.245000, NOW() - INTERVAL '5 days'),
-- Route 2 stops
('s0000004-0002-0002-0002-000000000004', 'r0000002-0002-0002-0002-000000000002', 'City Center', '07:30', 0, 42.142500, -8.236000, NOW() - INTERVAL '4 days'),
('s0000005-0002-0002-0002-000000000005', 'r0000002-0002-0002-0002-000000000002', 'University Campus', '07:55', 1, 42.138000, -8.240000, NOW() - INTERVAL '4 days'),
-- Route 3 stops
('s0000006-0003-0003-0003-000000000006', 'r0000003-0003-0003-0003-000000000003', 'Airport Terminal 2', '09:15', 0, 42.151000, -8.246000, NOW() - INTERVAL '3 days'),
('s0000007-0003-0003-0003-000000000007', 'r0000003-0003-0003-0003-000000000003', 'Business District', '09:50', 1, 42.143000, -8.238000, NOW() - INTERVAL '3 days'),
-- Route 4 stops
('s0000008-0004-0004-0004-000000000008', 'r0000004-0004-0004-0004-000000000004', 'University Campus', '14:00', 0, 42.138000, -8.240000, NOW() - INTERVAL '2 days'),
('s0000009-0004-0004-0004-000000000009', 'r0000004-0004-0004-0004-000000000004', 'Shopping Mall', '14:30', 1, 42.144000, -8.242000, NOW() - INTERVAL '2 days'),
-- Route 5 stops
('s0000010-0005-0005-0005-000000000010', 'r0000005-0005-0005-0005-000000000005', 'Beach Resort', '18:30', 0, 42.135000, -8.250000, NOW() - INTERVAL '1 days'),
('s0000011-0005-0005-0005-000000000011', 'r0000005-0005-0005-0005-000000000005', 'Downtown Plaza', '19:00', 1, 42.141296, -8.234724, NOW() - INTERVAL '1 days')
ON CONFLICT (id) DO NOTHING;

COMMIT;

-- =====================================================
-- BOOKINGS - 15 bookings with different statuses
-- =====================================================

BEGIN;

-- Disable the unique constraint temporarily for this insert
ALTER TABLE bookings DISABLE TRIGGER ALL;

INSERT INTO bookings (id, route_id, customer_id, driver_id, seats, price_per_seat, total_price, status, driver_confirmed, customer_confirmed, notes, created_at, updated_at) VALUES
-- Confirmed bookings
('b0000001-0001-0001-0001-000000000001', 'r0000001-0001-0001-0001-000000000001', 'c1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 2, 25.00, 50.00, 'confirmed', true, true, 'Will have one medium suitcase', NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days'),
('b0000002-0002-0002-0002-000000000002', 'r0000003-0003-0003-0003-000000000003', 'c2222222-2222-2222-2222-222222222222', 'd3333333-3333-3333-3333-333333333333', 3, 30.00, 90.00, 'confirmed', true, true, NULL, NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 days'),
('b0000003-0003-0003-0003-000000000003', 'r0000004-0004-0004-0004-000000000004', 'c3333333-3333-3333-3333-333333333333', 'd4444444-4444-4444-4444-444444444444', 1, 12.00, 12.00, 'confirmed', true, true, 'Prefer window seat if possible', NOW() - INTERVAL '1 days', NOW()),
('b0000004-0004-0004-0004-000000000004', 'r0000006-0006-0006-0006-000000000006', 'c4444444-4444-4444-4444-444444444444', 'd6666666-6666-6666-6666-666666666666', 1, 18.00, 18.00, 'confirmed', true, true, NULL, NOW() - INTERVAL '4 days', NOW() - INTERVAL '3 days'),
('b0000005-0005-0005-0005-000000000005', 'r0000008-0008-0008-0008-000000000008', 'c5555555-5555-5555-5555-555555555555', 'd8888888-8888-8888-8888-888888888888', 2, 28.00, 56.00, 'confirmed', true, true, 'Will need help with luggage', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 days'),
('b0000006-0006-0006-0006-000000000006', 'r0000009-0009-0009-0009-000000000009', 'c6666666-6666-6666-6666-666666666666', 'd9999999-9999-9999-9999-999999999999', 2, 35.00, 70.00, 'confirmed', true, true, NULL, NOW() - INTERVAL '2 days', NOW()),
-- Pending bookings
('b0000007-0007-0007-0007-000000000007', 'r0000012-0012-0012-0012-000000000012', 'c7777777-7777-7777-7777-777777777777', 'd2222222-2222-2222-2222-222222222222', 1, 24.00, 24.00, 'pending', false, true, 'First time user, please be patient', NOW() - INTERVAL '1 days', NOW()),
('b0000008-0008-0008-0008-000000000008', 'r0000013-0013-0013-0013-000000000013', 'c8888888-8888-8888-8888-888888888888', 'd3333333-3333-3333-3333-333333333333', 1, 17.00, 17.00, 'pending', true, true, NULL, NOW() - INTERVAL '12 hours', NOW()),
('b0000009-0009-0009-0009-000000000009', 'r0000014-0014-0014-0014-000000000014', 'c9999999-9999-9999-9999-999999999999', 'd4444444-4444-4444-4444-444444444444', 2, 19.00, 38.00, 'pending', false, true, 'Running slightly late, please wait 5 minutes', NOW() - INTERVAL '18 hours', NOW()),
-- Completed bookings
('b0000010-0010-0010-0010-000000000010', 'r0000016-0016-0016-0016-000000000016', 'ca111111-1111-1111-1111-111111111111', 'd6666666-6666-6666-6666-666666666666', 2, 26.00, 52.00, 'completed', true, true, NULL, NOW() - INTERVAL '8 days', NOW() - INTERVAL '5 days'),
('b0000011-0011-0011-0011-000000000011', 'r0000016-0016-0016-0016-000000000016', 'ca222222-2222-2222-2222-222222222222', 'd6666666-6666-6666-6666-666666666666', 2, 26.00, 52.00, 'completed', true, true, NULL, NOW() - INTERVAL '8 days', NOW() - INTERVAL '5 days'),
('b0000012-0012-0012-0012-000000000012', 'r0000017-0017-0017-0017-000000000017', 'ca333333-3333-3333-3333-333333333333', 'd7777777-7777-7777-7777-777777777777', 3, 32.00, 96.00, 'completed', true, true, 'Great trip!', NOW() - INTERVAL '6 days', NOW() - INTERVAL '3 days'),
('b0000013-0013-0013-0013-000000000013', 'r0000018-0018-0018-0018-000000000018', 'ca444444-4444-4444-4444-444444444444', 'd8888888-8888-8888-8888-888888888888', 2, 27.00, 54.00, 'completed', true, true, NULL, NOW() - INTERVAL '10 days', NOW() - INTERVAL '7 days'),
-- Cancelled bookings
('b0000014-0014-0014-0014-000000000014', 'r0000019-0019-0019-0019-000000000019', 'ca555555-5555-5555-5555-555555555555', 'd9999999-9999-9999-9999-999999999999', 1, 15.00, 15.00, 'cancelled', false, true, NULL, NOW() - INTERVAL '5 days', NOW() - INTERVAL '3 days'),
('b0000015-0015-0015-0015-000000000015', 'r0000020-0020-0020-0020-000000000020', 'ca666666-6666-6666-6666-666666666666', 'da111111-1111-1111-1111-111111111111', 1, 11.00, 11.00, 'cancelled', false, true, 'Plans changed', NOW() - INTERVAL '8 days', NOW() - INTERVAL '5 days')
ON CONFLICT (id) DO NOTHING;

-- Re-enable triggers
ALTER TABLE bookings ENABLE TRIGGER ALL;

COMMIT;

-- =====================================================
-- CONVERSATIONS
-- =====================================================

BEGIN;

INSERT INTO conversations (id, booking_id, driver_id, customer_id, last_message_at, created_at, updated_at) VALUES
('cv000001-0001-0001-0001-000000000001', 'b0000001-0001-0001-0001-000000000001', 'd1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', NOW() - INTERVAL '1 hours', NOW() - INTERVAL '2 days', NOW()),
('cv000002-0002-0002-0002-000000000002', 'b0000002-0002-0002-0002-000000000002', 'd3333333-3333-3333-3333-333333333333', 'c2222222-2222-2222-2222-222222222222', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '1 days', NOW()),
('cv000003-0003-0003-0003-000000000003', 'b0000003-0003-0003-0003-000000000003', 'd4444444-4444-4444-4444-444444444444', 'c3333333-3333-3333-3333-333333333333', NOW() - INTERVAL '12 hours', NOW() - INTERVAL '1 days', NOW()),
('cv000004-0004-0004-0004-000000000004', 'b0000005-0005-0005-0005-000000000005', 'd8888888-8888-8888-8888-888888888888', 'c5555555-5555-5555-5555-555555555555', NOW() - INTERVAL '6 hours', NOW() - INTERVAL '1 days', NOW()),
('cv000005-0005-0005-0005-000000000005', 'b0000007-0007-0007-0007-000000000007', 'd2222222-2222-2222-2222-222222222222', 'c7777777-7777-7777-7777-777777777777', NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '1 days', NOW())
ON CONFLICT (id) DO NOTHING;

COMMIT;

-- =====================================================
-- MESSAGES
-- =====================================================

BEGIN;

INSERT INTO messages (id, conversation_id, sender_id, recipient_id, text, message_type, read, created_at) VALUES
-- Conversation 1 messages
('m0000001-0001-0001-0001-000000000001', 'cv000001-0001-0001-0001-000000000001', 'd1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'Hi! I will be driving a blue Honda Civic', 'text', true, NOW() - INTERVAL '2 days'),
('m0000002-0001-0001-0001-000000000002', 'cv000001-0001-0001-0001-000000000001', 'c1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'Thank you! I will be wearing a red jacket', 'text', true, NOW() - INTERVAL '2 days' + INTERVAL '5 minutes'),
('m0000003-0001-0001-0001-000000000003', 'cv000001-0001-0001-0001-000000000001', 'd1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'Please wait at the main entrance', 'text', true, NOW() - INTERVAL '1 days'),
('m0000004-0001-0001-0001-000000000004', 'cv000001-0001-0001-0001-000000000001', 'c1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'I am at the main entrance as requested', 'text', true, NOW() - INTERVAL '1 days' + INTERVAL '10 minutes'),
('m0000005-0001-0001-0001-000000000005', 'cv000001-0001-0001-0001-000000000001', 'd1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'On my way, see you soon!', 'text', false, NOW() - INTERVAL '1 hours'),
-- Conversation 2 messages
('m0000006-0002-0002-0002-000000000006', 'cv000002-0002-0002-0002-000000000002', 'c2222222-2222-2222-2222-222222222222', 'd3333333-3333-3333-3333-333333333333', 'Hello, what color is your car?', 'text', true, NOW() - INTERVAL '1 days'),
('m0000007-0002-0002-0002-000000000007', 'cv000002-0002-0002-0002-000000000002', 'd3333333-3333-3333-3333-333333333333', 'c2222222-2222-2222-2222-222222222222', 'It is a white Toyota. License plate ABC123', 'text', true, NOW() - INTERVAL '1 days' + INTERVAL '3 minutes'),
('m0000008-0002-0002-0002-000000000008', 'cv000002-0002-0002-0002-000000000002', 'c2222222-2222-2222-2222-222222222222', 'd3333333-3333-3333-3333-333333333333', 'Perfect, thank you!', 'text', true, NOW() - INTERVAL '1 days' + INTERVAL '5 minutes'),
('m0000009-0002-0002-0002-000000000009', 'cv000002-0002-0002-0002-000000000002', 'd3333333-3333-3333-3333-333333333333', 'c2222222-2222-2222-2222-222222222222', 'I am running about 5 minutes late, sorry!', 'text', false, NOW() - INTERVAL '3 hours'),
-- Conversation 3 messages
('m0000010-0003-0003-0003-000000000010', 'cv000003-0003-0003-0003-000000000003', 'd4444444-4444-4444-4444-444444444444', 'c3333333-3333-3333-3333-333333333333', 'Thanks for booking! Where exactly should I pick you up?', 'text', true, NOW() - INTERVAL '1 days'),
('m0000011-0003-0003-0003-000000000011', 'cv000003-0003-0003-0003-000000000003', 'c3333333-3333-3333-3333-333333333333', 'd4444444-4444-4444-4444-444444444444', 'I will be at the coffee shop near the entrance', 'text', true, NOW() - INTERVAL '1 days' + INTERVAL '15 minutes'),
('m0000012-0003-0003-0003-000000000012', 'cv000003-0003-0003-0003-000000000003', 'd4444444-4444-4444-4444-444444444444', 'c3333333-3333-3333-3333-333333333333', 'Great, looking forward to the trip', 'text', false, NOW() - INTERVAL '12 hours'),
-- System messages
('m0000013-0001-0001-0001-000000000013', 'cv000001-0001-0001-0001-000000000001', 'd1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'Booking confirmed by driver', 'system', true, NOW() - INTERVAL '2 days' + INTERVAL '30 minutes'),
('m0000014-0002-0002-0002-000000000014', 'cv000002-0002-0002-0002-000000000002', 'd3333333-3333-3333-3333-333333333333', 'c2222222-2222-2222-2222-222222222222', 'Payment processed successfully', 'system', true, NOW() - INTERVAL '1 days' + INTERVAL '1 hours')
ON CONFLICT (id) DO NOTHING;

COMMIT;

-- =====================================================
-- USER LOCATIONS (Current locations for drivers)
-- =====================================================

BEGIN;

INSERT INTO user_locations (id, user_id, latitude, longitude, accuracy, speed, heading, timestamp, updated_at) VALUES
('ul000001-0001-0001-0001-000000000001', 'd1111111-1111-1111-1111-111111111111', 42.141296, -8.234724, 15.5, 45.2, 135.0, NOW() - INTERVAL '2 minutes', NOW()),
('ul000002-0002-0002-0002-000000000002', 'd2222222-2222-2222-2222-222222222222', 42.142500, -8.236000, 12.3, 38.7, 90.0, NOW() - INTERVAL '3 minutes', NOW()),
('ul000003-0003-0003-0003-000000000003', 'd3333333-3333-3333-3333-333333333333', 42.143800, -8.235200, 18.2, 52.1, 45.0, NOW() - INTERVAL '1 minutes', NOW()),
('ul000004-0004-0004-0004-000000000004', 'd4444444-4444-4444-4444-444444444444', 42.140100, -8.237500, 14.8, 29.3, 270.0, NOW() - INTERVAL '5 minutes', NOW()),
('ul000005-0005-0005-0005-000000000005', 'd5555555-5555-5555-5555-555555555555', 42.139200, -8.233100, 16.1, 41.8, 180.0, NOW() - INTERVAL '4 minutes', NOW()),
('ul000006-0006-0006-0006-000000000006', 'd6666666-6666-6666-6666-666666666666', 42.144500, -8.238900, 11.7, 35.4, 225.0, NOW() - INTERVAL '1 minutes', NOW()),
('ul000007-0007-0007-0007-000000000007', 'd7777777-7777-7777-7777-777777777777', 42.138900, -8.239700, 19.3, 47.6, 315.0, NOW() - INTERVAL '6 minutes', NOW()),
('ul000008-0008-0008-0008-000000000008', 'd8888888-8888-8888-8888-888888888888', 42.145200, -8.232800, 13.4, 33.9, 60.0, NOW() - INTERVAL '2 minutes', NOW()),
('ul000009-0009-0009-0009-000000000009', 'd9999999-9999-9999-9999-999999999999', 42.137600, -8.240500, 17.8, 44.5, 120.0, NOW() - INTERVAL '3 minutes', NOW()),
('ul000010-0010-0010-0010-000000000010', 'da111111-1111-1111-1111-111111111111', 42.146800, -8.236400, 15.9, 39.2, 200.0, NOW() - INTERVAL '7 minutes', NOW())
ON CONFLICT (user_id) DO NOTHING;

COMMIT;

-- =====================================================
-- LOCATION HISTORY (Sample historical positions)
-- =====================================================

BEGIN;

INSERT INTO location_history (id, user_id, latitude, longitude, accuracy, speed, heading, timestamp) VALUES
-- Driver 1 history
('lh000001-0001-0001-0001-000000000001', 'd1111111-1111-1111-1111-111111111111', 42.140800, -8.234200, 14.2, 42.1, 130.0, NOW() - INTERVAL '10 minutes'),
('lh000002-0001-0001-0001-000000000002', 'd1111111-1111-1111-1111-111111111111', 42.141000, -8.234400, 15.8, 44.5, 132.0, NOW() - INTERVAL '8 minutes'),
('lh000003-0001-0001-0001-000000000003', 'd1111111-1111-1111-1111-111111111111', 42.141150, -8.234550, 16.1, 45.8, 135.0, NOW() - INTERVAL '6 minutes'),
('lh000004-0001-0001-0001-000000000004', 'd1111111-1111-1111-1111-111111111111', 42.141296, -8.234724, 15.5, 45.2, 135.0, NOW() - INTERVAL '4 minutes'),
-- Driver 2 history
('lh000005-0002-0002-0002-000000000005', 'd2222222-2222-2222-2222-222222222222', 42.142100, -8.235500, 11.9, 36.2, 88.0, NOW() - INTERVAL '12 minutes'),
('lh000006-0002-0002-0002-000000000006', 'd2222222-2222-2222-2222-222222222222', 42.142300, -8.235750, 12.5, 37.8, 89.0, NOW() - INTERVAL '9 minutes'),
('lh000007-0002-0002-0002-000000000007', 'd2222222-2222-2222-2222-222222222222', 42.142500, -8.236000, 12.3, 38.7, 90.0, NOW() - INTERVAL '6 minutes')
ON CONFLICT (id) DO NOTHING;

COMMIT;

-- =====================================================
-- SESSIONS (Active sessions for some users)
-- =====================================================

BEGIN;

INSERT INTO sessions (id, user_id, token, expires_at, created_at, updated_at) VALUES
('s0000001-0001-0001-0001-000000000001', 'd1111111-1111-1111-1111-111111111111', 'sess_driver1_active_token_abc123xyz', NOW() + INTERVAL '24 hours', NOW() - INTERVAL '2 hours', NOW()),
('s0000002-0002-0002-0002-000000000002', 'c1111111-1111-1111-1111-111111111111', 'sess_customer1_active_token_def456uvw', NOW() + INTERVAL '24 hours', NOW() - INTERVAL '1 hours', NOW()),
('s0000003-0003-0003-0003-000000000003', 'd2222222-2222-2222-2222-222222222222', 'sess_driver2_active_token_ghi789rst', NOW() + INTERVAL '24 hours', NOW() - INTERVAL '30 minutes', NOW())
ON CONFLICT (id) DO NOTHING;

COMMIT;

-- =====================================================
-- NOTIFICATIONS
-- =====================================================

BEGIN;

INSERT INTO notifications (id, user_id, notification_type, title, message, data, read, created_at) VALUES
('n0000001-0001-0001-0001-000000000001', 'c1111111-1111-1111-1111-111111111111', 'booking', 'Booking Confirmed', 'Your booking for Downtown Plaza to Airport Terminal 1 has been confirmed', '{"bookingId": "b0000001-0001-0001-0001-000000000001"}', true, NOW() - INTERVAL '2 days'),
('n0000002-0002-0002-0002-000000000002', 'd1111111-1111-1111-1111-111111111111', 'booking', 'New Booking Request', 'You have a new booking request from Matthew White', '{"bookingId": "b0000001-0001-0001-0001-000000000001"}', true, NOW() - INTERVAL '3 days'),
('n0000003-0003-0003-0003-000000000003', 'c2222222-2222-2222-2222-222222222222', 'message', 'New Message', 'You have a new message from Sarah Wilson', '{"conversationId": "cv000002-0002-0002-0002-000000000002"}', false, NOW() - INTERVAL '3 hours'),
('n0000004-0004-0004-0004-000000000004', 'd2222222-2222-2222-2222-222222222222', 'booking', 'Booking Confirmed', 'Customer confirmed booking for City Center to University Campus', '{"bookingId": "b0000007-0007-0007-0007-000000000007"}', false, NOW() - INTERVAL '1 days')
ON CONFLICT (id) DO NOTHING;

COMMIT;

-- =====================================================
-- REVIEWS (Sample reviews for completed trips)
-- =====================================================

BEGIN;

INSERT INTO reviews (id, booking_id, reviewer_id, reviewed_user_id, rating, comment, created_at) VALUES
('rv000001-0001-0001-0001-000000000001', 'b0000010-0010-0010-0010-000000000010', 'ca111111-1111-1111-1111-111111111111', 'd6666666-6666-6666-6666-666666666666', 5, 'Excellent driver! Very professional and punctual.', NOW() - INTERVAL '4 days'),
('rv000002-0002-0002-0002-000000000002', 'b0000010-0010-0010-0010-000000000010', 'd6666666-6666-6666-6666-666666666666', 'ca111111-1111-1111-1111-111111111111', 4, 'Great passenger, very respectful.', NOW() - INTERVAL '4 days'),
('rv000003-0003-0003-0003-000000000003', 'b0000011-0011-0011-0011-000000000011', 'ca222222-2222-2222-2222-222222222222', 'd6666666-6666-6666-6666-666666666666', 5, 'Amazing service! Would definitely book again.', NOW() - INTERVAL '3 days'),
('rv000004-0004-0004-0004-000000000004', 'b0000012-0012-0012-0012-000000000012', 'ca333333-3333-3333-3333-333333333333', 'd7777777-7777-7777-7777-777777777777', 5, 'Perfect ride, very comfortable vehicle. Great trip!', NOW() - INTERVAL '3 days'),
('rv000005-0005-0005-0005-000000000005', 'b0000012-0012-0012-0012-000000000012', 'd7777777-7777-7777-7777-777777777777', 'ca333333-3333-3333-3333-333333333333', 5, 'Excellent passenger, very friendly.', NOW() - INTERVAL '3 days')
ON CONFLICT (id) DO NOTHING;

COMMIT;

-- =====================================================
-- VERIFY DATA
-- =====================================================
SELECT 'Users created:' as info, COUNT(*) as count FROM users
UNION ALL
SELECT 'User profiles created:', COUNT(*) FROM user_profiles
UNION ALL
SELECT 'Routes created:', COUNT(*) FROM routes
UNION ALL
SELECT 'Route stops created:', COUNT(*) FROM route_stops
UNION ALL
SELECT 'Bookings created:', COUNT(*) FROM bookings
UNION ALL
SELECT 'Conversations created:', COUNT(*) FROM conversations
UNION ALL
SELECT 'Messages created:', COUNT(*) FROM messages
UNION ALL
SELECT 'User locations created:', COUNT(*) FROM user_locations
UNION ALL
SELECT 'Location history created:', COUNT(*) FROM location_history
UNION ALL
SELECT 'Sessions created:', COUNT(*) FROM sessions
UNION ALL
SELECT 'Notifications created:', COUNT(*) FROM notifications
UNION ALL
SELECT 'Reviews created:', COUNT(*) FROM reviews;

-- =====================================================
-- END OF SAMPLE DATA SCRIPT
-- =====================================================
