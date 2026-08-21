CREATE TABLE IF NOT EXISTS `cultivation_requests` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `cultivation_id` bigint NOT NULL,
  `farmer_id` bigint NOT NULL,
  `manufacturer_id` bigint NOT NULL,
  `message` text,
  `offered_price` decimal(38,2) DEFAULT NULL,
  `quantity` decimal(38,2) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `FK_cultivation_requests_cultivation` FOREIGN KEY (`cultivation_id`) REFERENCES `cultivations` (`id`),
  CONSTRAINT `FK_cultivation_requests_farmer` FOREIGN KEY (`farmer_id`) REFERENCES `farmer_registration` (`id`),
  CONSTRAINT `FK_cultivation_requests_manufacturer` FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturer_registration` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
