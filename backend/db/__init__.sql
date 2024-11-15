create database waste_management_system;
use waste_management_system;
select * from user;
CREATE TABLE user (
    user_id VARCHAR(50) PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    city VARCHAR(100) NOT NULL,
    street VARCHAR(100) NOT NULL,
    landmark VARCHAR(100) NOT NULL,
    password VARCHAR(60) NOT NULL,
    centre_id INT NOT NULL,
    FOREIGN KEY (centre_id) REFERENCES centre(centre_id)
);

-- Create Centre table
CREATE TABLE IF NOT EXISTS centre (
    centre_id INT PRIMARY KEY,
    centre_name VARCHAR(100) NOT NULL,
    location VARCHAR(200) NOT NULL
);

-- Create Admin table
CREATE TABLE IF NOT EXISTS admin (
    admin_id VARCHAR(50) PRIMARY KEY,
    admin_name VARCHAR(100) NOT NULL,
    password VARCHAR(60) NOT NULL,
    centre_id INT NOT NULL,
    FOREIGN KEY (centre_id) REFERENCES centre(centre_id)
);

-- Create User table


-- Create Vehicle table
CREATE TABLE IF NOT EXISTS vehicle (
    vehicle_id VARCHAR(50) PRIMARY KEY,
    vehicle_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    centre_id INT NOT NULL,
    FOREIGN KEY (centre_id) REFERENCES centre(centre_id)
);

-- Create WasteRequest table
CREATE TABLE IF NOT EXISTS waste_request (
    req_id VARCHAR(50) PRIMARY KEY,
    req_date DATETIME NOT NULL,
    status VARCHAR(20) NOT NULL,
    waste_type VARCHAR(50) NOT NULL,
    admin_id VARCHAR(50) NOT NULL,
    vehicle_id VARCHAR(50)  NULL,
    user_id VARCHAR(50) NOT NULL,
    FOREIGN KEY (admin_id) REFERENCES admin(admin_id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicle(vehicle_id),
    FOREIGN KEY (user_id) REFERENCES user(user_id)
);

-- Create WasteCollection table
CREATE TABLE IF NOT EXISTS waste_collection (
    collection_id VARCHAR(50) PRIMARY KEY,
    req_id VARCHAR(50) NOT NULL,
    collection_quantity FLOAT NOT NULL,
    collection_date DATETIME NOT NULL,
    report_id VARCHAR(50) NOT NULL,
    FOREIGN KEY (req_id) REFERENCES waste_request(req_id)
);
select * from waste_collection;

-- Create AnalysisReport table
CREATE TABLE IF NOT EXISTS analysis_report (
    report_id VARCHAR(50) PRIMARY KEY,
    wet_waste_qty FLOAT NOT NULL,
    dry_waste_qty FLOAT NOT NULL,
    biodegradable_waste FLOAT NOT NULL,
    nonbiodegradable_waste FLOAT NOT NULL,
    date DATETIME NOT NULL,
    admin_id VARCHAR(50) NOT NULL,
    FOREIGN KEY (admin_id) REFERENCES admin(admin_id)
);

-- Add foreign key to WasteCollection after AnalysisReport is created
ALTER TABLE waste_collection
ADD FOREIGN KEY (report_id) REFERENCES analysis_report(report_id);

-- Insert Centres
INSERT INTO centre (centre_id, centre_name, location) VALUES
(2, 'Majestic Waste Management', 'Majestic, Bengaluru'),
(3, 'Electronic City Recycling Center', 'Electronic City, Bengaluru'),
(4, 'Koramangala Green Initiative', 'Koramangala, Bengaluru'),
(1, 'Banashankari Eco Hub', 'Banashankari, Bengaluru');

-- Insert Admins
INSERT INTO admin (admin_id, admin_name, password, centre_id) VALUES
('admin_majestic', 'Rahul Sharma', 'admin2', 2),
('admin_ecity', 'Priya Patel', 'admin3', 3),
('admin_koramangala', 'Amit Kumar', 'admin4', 4),
('admin_banashankari', 'Sneha Reddy', 'admin1', 1);

select * from admin;
select * from centre;

DELIMITER //

CREATE TRIGGER after_waste_request_insert
AFTER INSERT ON waste_request
FOR EACH ROW
BEGIN
    UPDATE waste_request
    SET notification = TRUE
    WHERE req_id = NEW.req_id;
END//

DELIMITER ;
ALTER TABLE waste_request
ADD COLUMN notification BOOLEAN DEFAULT TRUE;
SHOW TRIGGERS;
select * from waste_request;

ALTER TABLE waste_request
ADD COLUMN notification BOOLEAN DEFAULT TRUE;
DROP TRIGGER after_waste_request_insert;

ALTER TABLE waste_request 
MODIFY vehicle_id VARCHAR(50) NULL;

-- Insert vehicles for Centre 1
INSERT INTO vehicle (vehicle_id, vehicle_type, status, centre_id) VALUES
('V101', 'Household', 'Not Active', 1),
('V102', 'Recyclable', 'Not Active', 1),
('V103', 'Organic', 'Not Active', 1),
('V104', 'Hazardous', 'Not Active', 1);



-- Insert vehicles for Centre 2
INSERT INTO vehicle (vehicle_id, vehicle_type, status, centre_id) VALUES
('V201', 'Household', 'Not Active', 2),
('V202', 'Recyclable', 'Not Active', 2),
('V203', 'Organic', 'Not Active', 2),
('V204', 'Hazardous', 'Not Active', 2);
select * from vehicle;

-- Insert vehicles for Centre 3
INSERT INTO vehicle (vehicle_id, vehicle_type, status, centre_id) VALUES
('V301', 'Household', 'Not Active', 3),
('V302', 'Recyclable', 'Not Active', 3),
('V303', 'Organic', 'Not Active', 3),
('V304', 'Hazardous', 'Not Active', 3);

-- Insert vehicles for Centre 4
INSERT INTO vehicle (vehicle_id, vehicle_type, status, centre_id) VALUES
('V401', 'Household', 'Not Active', 4),
('V402', 'Recyclable', 'Not Active', 4),
('V403', 'Organic', 'Not Active', 4),
('V404', 'Hazardous', 'Not Active', 4);

DELIMITER //

CREATE TRIGGER after_vehicle_status_update
AFTER UPDATE ON vehicle
FOR EACH ROW
BEGIN
    IF NEW.status = 'active' AND OLD.status != 'active' THEN
        UPDATE waste_request
        SET vehicle_id = NEW.vehicle_id,
            status = 'Assigned'
        WHERE vehicle_id IS NULL
          AND status = 'Pending'
          AND waste_type = NEW.vehicle_type
          AND user_id IN (SELECT user_id FROM user WHERE centre_id = NEW.centre_id);
    END IF;
END //
DELIMITER ;
select * from vehicle;


DELIMITER //

CREATE PROCEDURE update_collection_status(IN p_req_id VARCHAR(50))
BEGIN
    DECLARE v_report_id VARCHAR(50);
    
    -- Generate a new report_id
    SET v_report_id = CONCAT('REP', LPAD(FLOOR(RAND() * 100000), 5, '0'));
    
    -- Start transaction
    START TRANSACTION;
    
    -- Update waste_request status
    UPDATE waste_request
    SET status = 'Collected'
    WHERE req_id = p_req_id;
    
    -- Insert into analysis_report
    INSERT INTO analysis_report (report_id, wet_waste_qty, biodegradable_waste, nonbiodegradable_waste, date, admin_id)
    SELECT 
        v_report_id,
        0, -- placeholder values, to be updated later
        0,
        0,
        NOW(),
        admin_id
    FROM waste_request
    WHERE req_id = p_req_id;
    
    -- Insert into waste_collection
    INSERT INTO waste_collection (collection_id, req_id, collection_quantity, collection_date, report_id)
    VALUES (
        CONCAT('COL', LPAD(FLOOR(RAND() * 100000), 5, '0')),
        p_req_id,
        0, -- placeholder value, to be updated later
        NOW(),
        v_report_id
    );
    
    -- Commit transaction
    COMMIT;
END //

CREATE TRIGGER after_waste_collection_insert
AFTER INSERT ON waste_collection
FOR EACH ROW
BEGIN
    -- Update the vehicle status to 'Not Active' after collection
    UPDATE vehicle v
    JOIN waste_request wr ON v.vehicle_id = wr.vehicle_id
    SET v.status = 'Not Active'
    WHERE wr.req_id = NEW.req_id;
END //

DELIMITER ;


alter table analysis_report modify column report_id varchar(10) null;

-- Drop the report_id column from waste_collection table
ALTER TABLE waste_collection
DROP FOREIGN KEY waste_collection_ibfk_2;

-- Step 2: Drop the report_id column from waste_collection
ALTER TABLE waste_collection
DROP COLUMN report_id;

-- Add the collection_id column to analysis_report table
ALTER TABLE analysis_report
ADD COLUMN collection_id VARCHAR(50);

-- Set collection_id as a foreign key referencing waste_collection's collection_id
ALTER TABLE analysis_report
ADD CONSTRAINT fk_collection_id
FOREIGN KEY (collection_id) REFERENCES waste_collection(collection_id);

select * from waste_collection;


DELIMITER //
CREATE PROCEDURE mark_waste_collected(
    IN p_req_id VARCHAR(50),
    IN p_collection_quantity FLOAT,
    IN p_user_id VARCHAR(50)
)
BEGIN
    DECLARE v_collection_id VARCHAR(50);
    DECLARE v_admin_id VARCHAR(50);
    
    -- Start transaction
    START TRANSACTION;
    
    -- Update waste_request status
    UPDATE waste_request
    SET status = 'Collected'
    WHERE req_id = p_req_id AND user_id = p_user_id;
    
    -- Get the admin_id from the waste_request
    SELECT admin_id INTO v_admin_id
    FROM waste_request
    WHERE req_id = p_req_id;
    
    -- Generate a new collection_id
    SET v_collection_id = CONCAT('COL', LPAD(FLOOR(RAND() * 100000), 5, '0'));
    
    -- Insert into waste_collection
    INSERT INTO waste_collection (collection_id, req_id, collection_quantity, collection_date)
    VALUES (v_collection_id, p_req_id, p_collection_quantity, NOW());
    
    -- Insert into analysis_report with placeholder values
    INSERT INTO analysis_report (report_id, wet_waste_qty, biodegradable_waste, nonbiodegradable_waste, date, admin_id, collection_id)
    VALUES (
        CONCAT('REP', LPAD(FLOOR(RAND() * 100000), 5, '0')),
        0, -- placeholder values, to be updated later by admin
        0,
        0,
        NOW(),
        v_admin_id,
        v_collection_id
    );
    
    -- Commit transaction
    COMMIT;
END //

DELIMITER ;

ALTER TABLE analysis_report 
MODIFY COLUMN wet_waste_qty FLOAT DEFAULT 0 NOT NULL,
MODIFY COLUMN dry_waste_qty FLOAT DEFAULT 0 NOT NULL,
MODIFY COLUMN biodegradable_waste FLOAT DEFAULT 0 NOT NULL,
MODIFY COLUMN nonbiodegradable_waste FLOAT DEFAULT 0 NOT NULL,
CHANGE COLUMN date report_date DATETIME NOT NULL;

select * from waste_collection;
select * from waste_request;


DROP PROCEDURE IF EXISTS mark_waste_collected;

DELIMITER //

CREATE PROCEDURE mark_waste_collected(
    IN p_req_id VARCHAR(50),
    IN p_collection_quantity FLOAT,
    IN p_user_id VARCHAR(50)
)
BEGIN
    DECLARE v_collection_id VARCHAR(50);
    
    -- Start transaction
    START TRANSACTION;
    
    -- Update waste_request status
    UPDATE waste_request
    SET status = 'Collected'
    WHERE req_id = p_req_id AND user_id = p_user_id;
    
    -- Generate the collection_id
    SET v_collection_id = CONCAT('C', p_req_id);
    
    -- Insert into waste_collection
    INSERT INTO waste_collection (collection_id, req_id, collection_quantity, collection_date)
    VALUES (v_collection_id, p_req_id, p_collection_quantity, NOW());
    
    -- Commit transaction
    COMMIT;
END //

DELIMITER ;

ALTER TABLE analysis_report
-- CHANGE COLUMN wet_waste_qty Household FLOAT DEFAULT 0 NOT NULL,
-- CHANGE COLUMN dry_waste_qty Organic FLOAT DEFAULT 0 NOT NULL,
-- CHANGE COLUMN biodegradable_waste Hazardous FLOAT DEFAULT 0 NOT NULL,
-- CHANGE COLUMN nonbiodegradable_waste Recyclable FLOAT DEFAULT 0 NOT NULL,


CHANGE COLUMN report_date date datetime NOT NULL;
select * from user;
select * from user_phone_number;
select * from waste_request;

ALTER TABLE waste_collection MODIFY req_id varchar(50) NULL;
