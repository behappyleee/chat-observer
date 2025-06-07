package be.com.server.chat.controller.response

import java.time.LocalDateTime

data class ChatResponse(
    val id: String,
    val sender: String,
    val senderType: String,
    val message: String,
    val createdAt: LocalDateTime = LocalDateTime.now()
)
