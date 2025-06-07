package be.com.server.chat.controller.response

import be.com.server.chat.service.dto.ChatRoomDto
import be.com.server.common.type.Authority

data class ChatRoomResponse(
    val id: String,
    val customerName: String,
    val userType: String,
    val lastMessage: String,
    val hasObserverMessage: Boolean,
    val observerMessage: String? = null,
    val createdAt: java.time.LocalDateTime
)

fun ChatRoomDto.toChatRoomResponse(userType: String): ChatRoomResponse =
    ChatRoomResponse(
        id = this.roomId,
        customerName = this.sender,
        userType = Authority.checkTypeCodeOrThrow(typeCode = userType).typeCode,
        lastMessage = "TODO LAST MESSAGE",
        hasObserverMessage = false,
        createdAt = java.time.LocalDateTime.now()
    )
