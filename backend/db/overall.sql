---CREATE USER TABLE
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
ALTER TABLE waste_collection
ADD FOREIGN KEY (report_id) REFERENCES analysis_report(report_id);

ALTER TABLE waste_collection
DROP FOREIGN KEY waste_collection_ibfk_2;

ALTER TABLE waste_collection
DROP COLUMN report_id;

ALTER TABLE analysis_report
ADD COLUMN collection_id VARCHAR(50);

ALTER TABLE analysis_report
ADD CONSTRAINT fk_collection_id
FOREIGN KEY (collection_id) REFERENCES waste_collection(collection_id);

ALTER TABLE waste_request
ADD COLUMN notification BOOLEAN DEFAULT TRUE;
SHOW TRIGGERS;
select * from waste_request;

ALTER TABLE waste_request
ADD COLUMN notification BOOLEAN DEFAULT TRUE;
DROP TRIGGER after_waste_request_insert;

ALTER TABLE waste_request 
MODIFY vehicle_id VARCHAR(50) NULL;

ALTER TABLE analysis_report
CHANGE COLUMN wet_waste_qty Household FLOAT DEFAULT 0 NOT NULL,
CHANGE COLUMN dry_waste_qty Organic FLOAT DEFAULT 0 NOT NULL,
CHANGE COLUMN biodegradable_waste Hazardous FLOAT DEFAULT 0 NOT NULL,
CHANGE COLUMN nonbiodegradable_waste Recyclable FLOAT DEFAULT 0 NOT NULL

ALTER TABLE analysis_report 
MODIFY COLUMN wet_waste_qty FLOAT DEFAULT 0 NOT NULL,
MODIFY COLUMN dry_waste_qty FLOAT DEFAULT 0 NOT NULL,
MODIFY COLUMN biodegradable_waste FLOAT DEFAULT 0 NOT NULL,
MODIFY COLUMN nonbiodegradable_waste FLOAT DEFAULT 0 NOT NULL,
CHANGE COLUMN date report_date DATETIME NOT NULL;

select * from waste_collection;

INSERT INTO centre (centre_id, centre_name, location) VALUES
(2, 'Majestic Waste Management', 'Majestic, Bengaluru'),
(3, 'Electronic City Recycling Center', 'Electronic City, Bengaluru'),
(4, 'Koramangala Green Initiative', 'Koramangala, Bengaluru'),
(1, 'Banashankari Eco Hub', 'Banashankari, Bengaluru');


INSERT INTO admin (admin_id, admin_name, password, centre_id) VALUES
('admin_majestic', 'Rahul Sharma', 'admin2', 2),
('admin_ecity', 'Priya Patel', 'admin3', 3),
('admin_koramangala', 'Amit Kumar', 'admin4', 4),
('admin_banashankari', 'Sneha Reddy', 'admin1', 1);

INSERT INTO vehicle (vehicle_id, vehicle_type, status, centre_id) VALUES
('V101', 'Household', 'Not Active', 1),
('V102', 'Recyclable', 'Not Active', 1),
('V103', 'Organic', 'Not Active', 1),
('V104', 'Hazardous', 'Not Active', 1);


INSERT INTO vehicle (vehicle_id, vehicle_type, status, centre_id) VALUES
('V201', 'Household', 'Not Active', 2),
('V202', 'Recyclable', 'Not Active', 2),
('V203', 'Organic', 'Not Active', 2),
('V204', 'Hazardous', 'Not Active', 2);
select * from vehicle;


INSERT INTO vehicle (vehicle_id, vehicle_type, status, centre_id) VALUES
('V301', 'Household', 'Not Active', 3),
('V302', 'Recyclable', 'Not Active', 3),
('V303', 'Organic', 'Not Active', 3),
('V304', 'Hazardous', 'Not Active', 3);


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



DELIMITER //
CREATE TRIGGER after_waste_collection_insert
AFTER INSERT ON waste_collection
FOR EACH ROW
BEGIN
    UPDATE vehicle v
    JOIN waste_request wr ON v.vehicle_id = wr.vehicle_id
    SET v.status = 'Not Active'
    WHERE wr.req_id = NEW.req_id;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE mark_waste_collected(
    IN p_req_id VARCHAR(50),
    IN p_collection_quantity FLOAT,
    IN p_user_id VARCHAR(50)
)
BEGIN
    DECLARE v_collection_id VARCHAR(50);
    UPDATE waste_request
    SET status = 'Collected'
    WHERE req_id = p_req_id AND user_id = p_user_id;
    SET v_collection_id = CONCAT('C', p_req_id);
    INSERT INTO waste_collection (collection_id, req_id, collection_quantity, collection_date)
    VALUES (v_collection_id, p_req_id, p_collection_quantity, NOW());
    
END //
DELIMITER;

DELIMITER //
CREATE PROCEDURE GenerateAnalysisReport(
    IN p_admin_id INT,
    OUT p_total_household DECIMAL(10,2),
    OUT p_total_organic DECIMAL(10,2),
    OUT p_total_recyclable DECIMAL(10,2)
)
BEGIN
   

    START TRANSACTION;

    INSERT INTO analysis_report (
        report_id,
        Household,
        Organic,
        Recyclable,
        date,
        admin_id,
        collection_id
    )
    SELECT 
        CONCAT('AR-', wc.collection_id),
        CASE WHEN LOWER(wr.waste_type) = 'household' THEN wc.collection_quantity ELSE 0 END,
        CASE WHEN LOWER(wr.waste_type) = 'organic' THEN wc.collection_quantity ELSE 0 END,
        CASE WHEN LOWER(wr.waste_type) = 'recyclable' THEN wc.collection_quantity ELSE 0 END,
        CURRENT_TIMESTAMP,
        wr.admin_id,
        wc.collection_id
    FROM waste_collection wc
    JOIN waste_request wr ON wc.req_id = wr.req_id
    WHERE wr.admin_id = p_admin_id
    AND wc.collection_id IN (
        SELECT collection_id
        FROM (
            SELECT wc2.collection_id
            FROM waste_collection wc2
            JOIN waste_request wr2 ON wc2.req_id = wr2.req_id
            WHERE wr2.admin_id = p_admin_id
            AND wc2.collection_id NOT IN (
                SELECT ar.collection_id
                FROM analysis_report ar
                WHERE ar.admin_id = p_admin_id
            )
        ) AS pending_collections
    );

    SELECT 
        household_total,
        organic_total,
        recyclable_total
    INTO 
        p_total_household,
        p_total_organic,
        p_total_recyclable
    FROM (
        SELECT 
            COALESCE(SUM(Household), 0) as household_total,
            COALESCE(SUM(Organic), 0) as organic_total,
            COALESCE(SUM(Recyclable), 0) as recyclable_total
        FROM (
            SELECT 
                ar.Household,
                ar.Organic,
                ar.Recyclable
            FROM analysis_report ar
            WHERE ar.admin_id = p_admin_id
            AND EXISTS (
                SELECT 1
                FROM waste_collection wc3
                JOIN waste_request wr3 ON wc3.req_id = wr3.req_id
                WHERE wc3.collection_id = ar.collection_id
                AND wr3.admin_id = p_admin_id
            )
        ) AS detailed_reports
    ) AS total_summary;

    COMMIT;
END //
DELIMITER ;




