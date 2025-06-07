package be.com.server.chat.controller.response

import be.com.server.chat.domain.ChatMessage
import java.time.LocalDateTime

data class ChatMessageResponse(
    val id: String,
    val roomId: String,
    val senderId: String,
    val senderType: String,
    val message: String,
    val createdAt: LocalDateTime
)

fun List<ChatMessage>.toChatMessageResponse(): List<ChatMessageResponse> =
    this.map {
        ChatMessageResponse(
            id = it.id,
            roomId = it.chatRoomId,
            senderId = it.senderId,
            senderType = it.senderType,
            message = it.content,
            createdAt = it.createdAt
        )
    }

// CREATE TABLE `chat_message` (
// `id` bigint NOT NULL AUTO_INCREMENT,
// `uuid` char(36) NOT NULL,
// `chat_room_id` char(36) NOT NULL,
// `sender_id` char(36) NOT NULL,
// `sender_type` varchar(50) NOT NULL,
// `content` text NOT NULL,
// `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
// PRIMARY KEY (`id`),
// UNIQUE KEY `uuid` (`uuid`)
// ) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
