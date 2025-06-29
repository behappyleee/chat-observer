package be.com.server.chat.service.dto

import java.time.LocalDateTime

data class ChatRoomCreateDto(
    val userType: String,
    val userName: String,
    val message: String,
    val createdAt: LocalDateTime = LocalDateTime.now()
)
