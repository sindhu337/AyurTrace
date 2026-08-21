-- V3: Unify Farmer and Customer into the users table using JOINED inheritance

SET FOREIGN_KEY_CHECKS = 0;

-- Drop referencing foreign keys before altering primary keys
ALTER TABLE cultivations DROP FOREIGN KEY FKs0b8ci6yacg5fvbangd4hx44;
ALTER TABLE supervisor_messages DROP FOREIGN KEY FK3rmfdfg5q4ryqxgjlaa275l13;
ALTER TABLE cultivation_requests DROP FOREIGN KEY FK_cultivation_requests_farmer;

ALTER TABLE orders DROP FOREIGN KEY orders_ibfk_1;
ALTER TABLE carts DROP FOREIGN KEY FKkjqhauq4mq8fjn67wke72w0ap;
ALTER TABLE favourites DROP FOREIGN KEY FKqn034iervdk65y6r997rpt67l;

-- 1. Insert existing Farmers into users table
INSERT INTO users (email, full_name, mobile, password, role, username)
SELECT email, full_name, mobile, password, 'ROLE_FARMER', username
FROM farmer_registration
WHERE email NOT IN (SELECT email FROM users);

-- 2. Insert existing Customers into users table
INSERT INTO users (email, full_name, mobile, password, role, username)
SELECT email, full_name, mobile, password, 'ROLE_CUSTOMER', username
FROM customer_registration
WHERE email NOT IN (SELECT email FROM users);

-- 3. Create temporary mapping column for Farmers
ALTER TABLE farmer_registration ADD COLUMN temp_user_id BIGINT;
UPDATE farmer_registration fr JOIN users u ON fr.email = u.email SET fr.temp_user_id = u.id;

-- 4. Create temporary mapping column for Customers
ALTER TABLE customer_registration ADD COLUMN temp_user_id BIGINT;
UPDATE customer_registration cr JOIN users u ON cr.email = u.email SET cr.temp_user_id = u.id;

-- 5. Update dependent tables (Farmer references)
UPDATE cultivations c JOIN farmer_registration fr ON c.farmer_id = fr.id SET c.farmer_id = fr.temp_user_id;
UPDATE supervisor_messages sm JOIN farmer_registration fr ON sm.farmer_id = fr.id SET sm.farmer_id = fr.temp_user_id;
UPDATE cultivation_requests crq JOIN farmer_registration fr ON crq.farmer_id = fr.id SET crq.farmer_id = fr.temp_user_id;

-- 6. Update dependent tables (Customer references)
UPDATE orders o JOIN customer_registration cr ON o.customer_id = cr.id SET o.customer_id = cr.temp_user_id;
UPDATE favourites f JOIN customer_registration cr ON f.customer_id = cr.id SET f.customer_id = cr.temp_user_id;
UPDATE carts c JOIN customer_registration cr ON c.customer_id = cr.id SET c.customer_id = cr.temp_user_id;

-- 7. Restructure farmer_registration table
ALTER TABLE farmer_registration MODIFY id BIGINT NOT NULL;
ALTER TABLE farmer_registration DROP PRIMARY KEY;
UPDATE farmer_registration SET id = temp_user_id;
ALTER TABLE farmer_registration ADD PRIMARY KEY (id);
ALTER TABLE farmer_registration DROP COLUMN temp_user_id;
ALTER TABLE farmer_registration DROP COLUMN email, DROP COLUMN full_name, DROP COLUMN mobile, DROP COLUMN password, DROP COLUMN role, DROP COLUMN username;
ALTER TABLE farmer_registration ADD CONSTRAINT FK_farmer_user FOREIGN KEY (id) REFERENCES users(id);

-- 8. Restructure customer_registration table
ALTER TABLE customer_registration MODIFY id BIGINT NOT NULL;
ALTER TABLE customer_registration DROP PRIMARY KEY;
UPDATE customer_registration SET id = temp_user_id;
ALTER TABLE customer_registration ADD PRIMARY KEY (id);
ALTER TABLE customer_registration DROP COLUMN temp_user_id;
ALTER TABLE customer_registration DROP COLUMN email, DROP COLUMN full_name, DROP COLUMN mobile, DROP COLUMN password, DROP COLUMN role, DROP COLUMN username;
ALTER TABLE customer_registration ADD CONSTRAINT FK_customer_user FOREIGN KEY (id) REFERENCES users(id);

-- 9. Re-add referencing foreign keys pointing to updated primary keys
ALTER TABLE cultivations ADD CONSTRAINT FKs0b8ci6yacg5fvbangd4hx44 FOREIGN KEY (farmer_id) REFERENCES farmer_registration (id);
ALTER TABLE supervisor_messages ADD CONSTRAINT FK3rmfdfg5q4ryqxgjlaa275l13 FOREIGN KEY (farmer_id) REFERENCES farmer_registration (id);
ALTER TABLE cultivation_requests ADD CONSTRAINT FK_cultivation_requests_farmer FOREIGN KEY (farmer_id) REFERENCES farmer_registration (id);

ALTER TABLE orders ADD CONSTRAINT orders_ibfk_1 FOREIGN KEY (customer_id) REFERENCES customer_registration (id);
ALTER TABLE carts ADD CONSTRAINT FKkjqhauq4mq8fjn67wke72w0ap FOREIGN KEY (customer_id) REFERENCES customer_registration (id);
ALTER TABLE favourites ADD CONSTRAINT FKqn034iervdk65y6r997rpt67l FOREIGN KEY (customer_id) REFERENCES customer_registration (id);

SET FOREIGN_KEY_CHECKS = 1;