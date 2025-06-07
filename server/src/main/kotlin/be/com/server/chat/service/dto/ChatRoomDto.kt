package be.com.server.chat.service.dto

import java.util.UUID

data class ChatRoomDto(
    val roomId: String = UUID.randomUUID().toString(),
    val sender: String
)
