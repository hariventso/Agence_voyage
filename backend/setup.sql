-- Script pour créer les tables nécessaires dans PostgreSQL

-- 1. Table des Destinations
CREATE TABLE IF NOT EXISTS destinations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    price VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Actif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table des Messages
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    sender VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    content TEXT,
    time VARCHAR(50),
    unread BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insérer quelques données de test
INSERT INTO destinations (name, type, price, status) VALUES 
('Antananarivo', 'Excursion', '700€', 'Actif'),
('Sud Madagascar', 'Circuit Culturel', '1,200€', 'Actif'),
('Sainte Marie', 'Séjour Balnéaire', '900€', 'Draft'),
('Nosy Be', 'Détente', '599€', 'Actif');

INSERT INTO messages (sender, subject, content, time, unread) VALUES
('Jean-Pierre Morel', 'Question sur le circuit Sud', 'Bonjour, j''aimerais plus d''infos...', '10:30', true),
('Sarah Jenkins', 'Disponibilités pour Août', 'Avez-vous des places libres ?', 'Hier', false);
