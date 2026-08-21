CREATE TABLE IF NOT EXISTS `admin` (
  `username` varchar(50) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `mobile` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('ROLE_ADMIN','ROLE_CUSTOMER','ROLE_FARMER','ROLE_SUPERVISOR') NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  UNIQUE KEY `UKr43af9ap4edm43mmtq01oddj6` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `customers` (
  `address` varchar(255) DEFAULT NULL,
  `preferences` varchar(255) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  `district` varchar(255) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `pincode` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `FKrh1g1a20omjmn6kurd35o3eit` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `farmers` (
  `aadhar_no` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `certification_details` varchar(255) DEFAULT NULL,
  `farm_location` varchar(255) DEFAULT NULL,
  `farmer_id` varchar(255) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  `district` varchar(255) DEFAULT NULL,
  `gps_coordinates` varchar(255) DEFAULT NULL,
  `pincode` varchar(255) DEFAULT NULL,
  `rtc_document` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `status` enum('APPROVED','PENDING','REJECTED') DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `UKgkcmqxd9liv7t001451b3y6cn` (`farmer_id`),
  CONSTRAINT `FKdlh51qn5nx993i33cvax28cy3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `customer_registration` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mobile` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `district` varchar(255) DEFAULT NULL,
  `pincode` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `role` varchar(20) DEFAULT 'ROLE_CUSTOMER',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `mobile` (`mobile`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `farmer_registration` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `farmer_id` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mobile` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `aadhar_no` varchar(255) DEFAULT NULL,
  `rtc_document` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `district` varchar(255) DEFAULT NULL,
  `pincode` varchar(255) DEFAULT NULL,
  `latitude` decimal(38,2) DEFAULT NULL,
  `longitude` decimal(38,2) DEFAULT NULL,
  `status` enum('ACTIVE','BLOCKED','PENDING') DEFAULT 'PENDING',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `role` varchar(20) DEFAULT 'ROLE_FARMER',
  `supervisor_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `mobile` (`mobile`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `farmer_id` (`farmer_id`),
  UNIQUE KEY `aadhar_no` (`aadhar_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `manufacturer_registration` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `address` text,
  `ayush_license_no` varchar(50) DEFAULT NULL,
  `company_name` varchar(150) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `district` varchar(50) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `gst_number` varchar(30) DEFAULT NULL,
  `license_document` varchar(255) DEFAULT NULL,
  `license_expiry` date DEFAULT NULL,
  `mobile` varchar(15) NOT NULL,
  `owner_name` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `pincode` varchar(10) DEFAULT NULL,
  `state` varchar(50) DEFAULT NULL,
  `status` enum('APPROVED','BLOCKED','PENDING','REJECTED') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK4c8noq1pevd83skasqinf14a1` (`email`),
  UNIQUE KEY `UKa4t08jn1uhrg1hmbhabde9v3l` (`ayush_license_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `manufacturer_login` (
  `login_id` bigint NOT NULL AUTO_INCREMENT,
  `account_status` enum('ACTIVE','BLOCKED') NOT NULL,
  `manufacturer_id` varchar(20) NOT NULL,
  `registration_id` bigint NOT NULL,
  PRIMARY KEY (`login_id`),
  UNIQUE KEY `UKk3m0v7i8dkfbis6ldmkc63uje` (`manufacturer_id`),
  UNIQUE KEY `UKns4t2wtkfcoyyjgwlfjujd90` (`registration_id`),
  CONSTRAINT `FKlsth353isjhw67nwgov93y8hy` FOREIGN KEY (`registration_id`) REFERENCES `manufacturer_registration` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `cultivations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `area` varchar(255) DEFAULT NULL,
  `expected_harvest_date` date DEFAULT NULL,
  `herb_name` varchar(255) NOT NULL,
  `planting_date` date DEFAULT NULL,
  `status` enum('GROWING','HARVESTED','PLANTED') DEFAULT NULL,
  `farmer_id` bigint NOT NULL,
  `area_unit` varchar(255) DEFAULT NULL,
  `cultivation_method` varchar(255) DEFAULT NULL,
  `expected_quantity` decimal(38,2) DEFAULT NULL,
  `latitude` decimal(38,2) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `longitude` decimal(38,2) DEFAULT NULL,
  `notes` varchar(1000) DEFAULT NULL,
  `price` decimal(38,2) DEFAULT NULL,
  `quantity_unit` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `FKs0b8ci6yacg5fvbangd4hx44` FOREIGN KEY (`farmer_id`) REFERENCES `farmer_registration` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `batches` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `batch_number` varchar(255) NOT NULL,
  `harvest_date` date DEFAULT NULL,
  `qr_code` varchar(255) DEFAULT NULL,
  `quantity` decimal(38,2) DEFAULT NULL,
  `cultivation_id` bigint NOT NULL,
  `latitude` decimal(38,2) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `longitude` decimal(38,2) DEFAULT NULL,
  `notes` varchar(1000) DEFAULT NULL,
  `quantity_unit` varchar(255) DEFAULT NULL,
  `status` enum('APPROVED','CREATED','HARVESTED','REJECTED','SUBMITTED') DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK4ec7meu91alfw2xei0bc86ce5` (`batch_number`),
  UNIQUE KEY `UKkxenwjosjioc30vcwhgdxdvad` (`cultivation_id`),
  UNIQUE KEY `UK2llu96uab6u69e96mhwewmlck` (`qr_code`),
  CONSTRAINT `FK10dy0veqg8w8m7lydt0j5ytfo` FOREIGN KEY (`cultivation_id`) REFERENCES `cultivations` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `products` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `category` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `manufacturer_details` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(38,2) NOT NULL,
  `stock_quantity` int DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `manufacturing_date` date DEFAULT NULL,
  `product_status` enum('ACTIVE','INACTIVE','OUT_OF_STOCK') DEFAULT NULL,
  `quality_info` varchar(500) DEFAULT NULL,
  `batch_id` bigint DEFAULT NULL,
  `manufacturer_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `FKb0ssyu4uv32rn1v5iv9d7r8g6` FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturer_registration` (`id`),
  CONSTRAINT `FKfpy55pjseikwntuvti1et3pe3` FOREIGN KEY (`batch_id`) REFERENCES `batches` (`id`
) ON DELETE SET NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `orders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_number` varchar(50) NOT NULL,
  `customer_id` bigint NOT NULL,
  `total_amount` decimal(38,2) DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `payment_status` varchar(255) DEFAULT NULL,
  `order_status` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `order_date` datetime(6) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_number` (`order_number`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer_registration` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `order_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `price` decimal(38,2) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `order_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `FKbioxgbv59vetrxe0ejfubep1w` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `FKocimc7dtr037rh4ls4l95nlfi` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `qr_codes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `generated_at` datetime(6) DEFAULT NULL,
  `qr_id` varchar(30) NOT NULL,
  `qr_image_path` varchar(500) DEFAULT NULL,
  `batch_id` bigint NOT NULL,
  `manufacturer_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKhaxt9u2i3s7w1i8lom9jswgnw` (`qr_id`),
  CONSTRAINT `FK7ankn1da0p36h9v0ot04ca7w2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `FKgnf9053stiyhd9s1ei83b53jv` FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturer_registration` (`id`),
  CONSTRAINT `FKrcac7hg0p12hd1w1d7o8evw06` FOREIGN KEY (`batch_id`) REFERENCES `batches` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `carts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `customer_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK88sv4i13lo80s74ox7rsb5a2c` (`customer_id`),
  CONSTRAINT `FKkjqhauq4mq8fjn67wke72w0ap` FOREIGN KEY (`customer_id`) REFERENCES `customer_registration` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `cart_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `quantity` int DEFAULT NULL,
  `cart_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `FK1re40cjegsfvw58xrkdp6bac6` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `FKpcttvuq4mxppo8sxggjtn5i2c` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `favourites` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `customer_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `FKlun1uhuc5m4o44vuv7nsymyvf` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `FKqn034iervdk65y6r997rpt67l` FOREIGN KEY (`customer_id`) REFERENCES `customer_registration` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `messages` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` varchar(1000) NOT NULL,
  `timestamp` datetime(6) DEFAULT NULL,
  `receiver_id` bigint NOT NULL,
  `sender_id` bigint NOT NULL,
  `receiver_role` varchar(255) DEFAULT NULL,
  `sender_role` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `FK4ui4nnwntodh6wjvck53dbk9m` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKt05r0b6n0iis8u7dfna4xdh73` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `supervisor_messages` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `message` text NOT NULL,
  `status` enum('CLOSED','PENDING','REPLIED') NOT NULL,
  `subject` varchar(200) NOT NULL,
  `farmer_id` bigint NOT NULL,
  `manufacturer_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `FK34ovbsacer4174jrpkjwj8jfd` FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturer_registration` (`id`),
  CONSTRAINT `FK3rmfdfg5q4ryqxgjlaa275l13` FOREIGN KEY (`farmer_id`) REFERENCES `farmer_registration` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `notifications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `is_read` bit(1) NOT NULL,
  `message` varchar(255) NOT NULL,
  `timestamp` datetime(6) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  `user_role` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
