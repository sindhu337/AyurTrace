-- Remove redundant legacy tables to prevent future data integrity issues
-- These are not used by the current JPA entities (Farmer, Customer)
DROP TABLE IF EXISTS farmers;
DROP TABLE IF EXISTS customers;
