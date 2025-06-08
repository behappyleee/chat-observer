-- DROP TABLES (주의: 외래키 순서 고려)
DROP TABLE IF EXISTS member_authority;
DROP TABLE IF EXISTS chat_message;
DROP TABLE IF EXISTS chat_room;
DROP TABLE IF EXISTS member;
DROP TABLE IF EXISTS authority;

-- authority
CREATE TABLE `authority` (
                             `id` char(36) NOT NULL,
                             `name` varchar(50) NOT NULL COMMENT '예: ROLE_AGENT, ROLE_OBSERVER',
                             `description` varchar(255) NOT NULL,
                             `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                             `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                             PRIMARY KEY (`id`),
                             UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- chat_message
CREATE TABLE `chat_message` (
                                `id` char(36) NOT NULL,
                                `chat_room_id` char(36) NOT NULL,
                                `sender_id` char(36) NOT NULL,
                                `sender_type` varchar(50) NOT NULL,
                                `channel_type` varchar(50) NOT NULL DEFAULT 'TEST',
                                `content` text NOT NULL,
                                `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                                PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- chat_room
CREATE TABLE `chat_room` (
                             `id` char(36) NOT NULL,
                             `member_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
                             `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                             PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- member
CREATE TABLE `member` (
                          `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
                          `email` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
                          `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                          `status` tinyint NOT NULL DEFAULT '1' COMMENT '0: 정상, 1: 탈퇴, 9:정지',
                          `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                          `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                          PRIMARY KEY (`id`),
                          UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- member_authority
CREATE TABLE `member_authority` (
                                    `member_id` char(36) NOT NULL,
                                    `authority_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
                                    `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                                    PRIMARY KEY (`member_id`,`authority_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;