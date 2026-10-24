ALTER TABLE batches
    MODIFY COLUMN status enum('APPROVED','CREATED','HARVESTED','REJECTED','SUBMITTED','RECEIVED','PROCESSING','COMPLETED') DEFAULT NULL;

ALTER TABLE batches
    ADD COLUMN assigned_manufacturer_id bigint NULL,
    ADD COLUMN assigned_at datetime NULL,
    ADD COLUMN reviewed_at datetime NULL,
    ADD COLUMN rejection_reason varchar(1000) NULL;

ALTER TABLE batches
    ADD CONSTRAINT fk_batch_assigned_manufacturer
    FOREIGN KEY (assigned_manufacturer_id) REFERENCES manufacturer_registration(id);
