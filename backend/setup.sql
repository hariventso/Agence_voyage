-- Schema principal pour l'administration du site

CREATE TABLE IF NOT EXISTS destinations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    price VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Actif',
    service_name VARCHAR(255),
    duration INTEGER,
    image_url TEXT,
    description TEXT,
    itinerary TEXT,
    accommodation TEXT,
    budget TEXT,
    tips TEXT,
    highlights TEXT,
    is_popular BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    status VARCHAR(50) DEFAULT 'Actif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    content TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    sender VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    subject VARCHAR(255),
    content TEXT,
    unread BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50),
    sender VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    participants INTEGER,
    departure_date DATE,
    duration VARCHAR(100),
    message TEXT,
    tour_name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'En attente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS team (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    bio TEXT,
    image_url TEXT,
    facebook_url TEXT,
    twitter_url TEXT,
    instagram_url TEXT,
    pinterest_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS testimonials (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255),
    content TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(255),
    phone VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Actif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS calendar_events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    event_type VARCHAR(80) DEFAULT 'evenement',
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    location VARCHAR(255),
    employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
    description TEXT,
    reminder_sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS slides (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    subtitle VARCHAR(255),
    description TEXT,
    image_url TEXT,
    button_text VARCHAR(100),
    link VARCHAR(255),
    slide_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO destinations (name, type, price, status)
VALUES
('Antananarivo', 'Excursion', '700 EUR', 'Actif'),
('Sud Madagascar', 'Circuit Culturel', '1200 EUR', 'Actif'),
('Sainte Marie', 'Sejour Balneaire', '900 EUR', 'Draft'),
('Nosy Be', 'Detente', '599 EUR', 'Actif')
ON CONFLICT DO NOTHING;

INSERT INTO employees (name, email, role, phone, status)
VALUES
('Mialy Rakoto', 'mialy@example.com', 'Guide Senior', '+261 34 00 000 00', 'Actif'),
('Andry Ranaivo', 'andry@example.com', 'Coordinateur Logistique', '+261 34 11 111 11', 'Actif')
ON CONFLICT (email) DO NOTHING;
