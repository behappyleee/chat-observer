package be.com.server.chat.controller

import be.com.server.chat.controller.response.ChatRoomResponse
import be.com.server.chat.controller.response.toChatRoomResponse
import be.com.server.chat.service.ChatService
import be.com.server.common.type.Authority
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
class ChatRestController(
    private val chatService: ChatService
) {
    // 전체 채팅방을 조회
    @GetMapping("/chats")
    fun getAllChatRooms(): List<ChatRoomResponse> {
        return chatService.getAllChatRooms().map { it.toChatRoomResponse(userType = Authority.ROLE_AGENT.typeCode) }
    }

    // 특정 채널을 조회
    @GetMapping("/chats/{id}")
    fun getChatRoomById(
        @PathVariable("id") chatId: String,
        @RequestParam(value = "userType", required = true) userType: String,
        @RequestParam(value = "userName", required = true) userName: String
    ): ChatRoomResponse {
        return chatService.findByIdOrThrow(chatRoomId = chatId).toChatRoomResponse(userType = userType)
    }

    companion object {
        private val logger = LoggerFactory.getLogger(ChatRestController::class.java)
    }
}
