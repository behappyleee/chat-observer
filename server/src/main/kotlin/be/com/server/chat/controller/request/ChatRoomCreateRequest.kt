package be.com.server.chat.controller.request

import be.com.server.chat.service.dto.ChatRoomCreateDto

data class ChatRoomCreateRequest(
    val userType: String,
    val userName: String,
    val initialMessage: String
)

fun ChatRoomCreateRequest.toChatMessageDto() =
    ChatRoomCreateDto(
        userType = this.userType,
        userName = this.userName,
        message = this.initialMessage
    )
