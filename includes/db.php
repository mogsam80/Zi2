CREATE TABLE `images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `unique_id` varchar(255) NOT NULL,
  `original_path` varchar(255) NOT NULL,
  `processed_path` varchar(255) NOT NULL,
  `ocr_text` text,
  `browser` varchar(255),
  `os` varchar(255),
  `device` varchar(255),
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_id` (`unique_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;