-- Migration script for customer actions tracking
-- Created on: 2025-12-20

-- Create action_types table
CREATE TABLE action_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create customer_actions table
CREATE TABLE customer_actions (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    action_type_id INTEGER NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (action_type_id) REFERENCES action_types(id) ON DELETE RESTRICT
);

-- Add indexes for performance
CREATE INDEX idx_customer_actions_customer_id ON customer_actions(customer_id);
CREATE INDEX idx_customer_actions_action_type_id ON customer_actions(action_type_id);
CREATE INDEX idx_customer_actions_timestamp ON customer_actions(timestamp);

-- Insert initial action types
INSERT INTO action_types (name, description) VALUES
('SMS', 'Text message sent to customer'),
('Email', 'Email sent to customer'),
('Call', 'Phone call with customer'),
('Meeting', 'In-person or virtual meeting with customer'),
('Note', 'General note about customer interaction');