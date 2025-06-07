package be.com.server.chat.controller.request

import java.time.LocalDateTime

data class ChatMessageSendRequest(
    val userType: String,
    val userName: String,
    val message: String,
    val channelType: String,
    val createdAt: LocalDateTime = LocalDateTime.now()
)
