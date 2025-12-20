-- Script to insert sample customer actions for testing
-- This script assumes customers and action_types already exist

-- Clear existing test data (optional - uncomment if needed)
-- DELETE FROM customer_actions WHERE customer_id IN (12, 13, 14, 15, 16);

-- Insert sample customer actions
INSERT INTO customer_actions (customer_id, action_type_id, notes, metadata) VALUES
-- Actions for John Smith (customer_id 12)
(12, 1, 'Welcome SMS sent to new customer', '{"content": "Welcome to our service! We''re glad to have you."}'),
(12, 2, 'Follow-up email after initial contact', '{"subject": "Thank you for joining us", "content": "We hope you''re enjoying our services."}'),
(12, 3, 'Initial consultation call', '{"duration": "15 minutes", "outcome": "Positive response"}'),

-- Actions for Maria Garcia (customer_id 13)
(13, 2, 'Monthly newsletter sent', '{"subject": "Monthly Updates - December", "content": "Check out our latest offers and news."}'),
(13, 4, 'Product demonstration meeting', '{"duration": "30 minutes", "participants": ["Maria Garcia", "Sales Rep"], "outcome": "Interested in premium package"}'),
(13, 1, 'Reminder SMS for meeting', '{"content": "Hi Maria, just confirming your meeting tomorrow at 2pm."}'),

-- Actions for Robert Johnson (customer_id 14)
(14, 5, 'Customer status note', '{"content": "Customer has not responded to previous outreach attempts. Consider re-engagement campaign."}'),
(14, 2, 'Re-engagement email sent', '{"subject": "We miss you!", "content": "Special offer for returning customers."}'),

-- Actions for Emily Williams (customer_id 15)
(15, 4, 'VIP customer consultation', '{"duration": "45 minutes", "participants": ["Emily Williams", "Account Manager"], "topics": ["Custom package", "Exclusive offers"]}'),
(15, 1, 'Exclusive offer SMS', '{"content": "Special VIP offer just for you! 25% off all services this month."}'),
(15, 2, 'Personalized product recommendation', '{"subject": "Emily, check out these exclusive offers", "content": "Based on your preferences, we think you''ll love these new products."}'),

-- Actions for Michael Brown (customer_id 16)
(16, 3, 'Product inquiry call', '{"duration": "20 minutes", "topics": ["New product line", "Pricing"], "outcome": "Requested quote"}'),
(16, 5, 'Follow-up note', '{"content": "Customer requested quote for premium package. Send within 24 hours."}'),
(16, 1, 'Quote delivery SMS', '{"content": "Your requested quote has been sent to your email. Let us know if you have any questions!"}');

-- Verify the data was inserted
SELECT COUNT(*) as total_actions FROM customer_actions;