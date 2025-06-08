package be.com.server.chat.controller

import be.com.server.chat.controller.response.ChatMessageResponse
import be.com.server.chat.controller.response.ChatRoomResponse
import be.com.server.chat.controller.response.toChatMessageResponse
import be.com.server.chat.controller.response.toChatRoomResponse
import be.com.server.chat.service.ChatService
import org.slf4j.LoggerFactory
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
class ChatController(
    private val chatService: ChatService
) {
    @GetMapping("/chats")
    @PreAuthorize("hasAnyRole('ROLE_AGENT','ROLE_OBSERVER')")
    fun getAllChatRooms(
        @RequestParam(name = "userType", required = true) userType: String
    ): List<ChatRoomResponse> {
        return chatService.getChatRooms().map { it.toChatRoomResponse(userType = userType) }
    }

    @GetMapping("/chats/{id}")
    @PreAuthorize("hasAnyRole('ROLE_CUSTOMER', 'ROLE_AGENT', 'ROLE_OBSERVER')")
    fun getChatRoomById(
        @PathVariable("id") chatId: String,
        @RequestParam(value = "userType", required = true) userType: String,
        @RequestParam(value = "userName", required = true) userName: String
    ): ChatRoomResponse {
        return chatService.findChatRoomByIdOrThrow(chatRoomId = chatId).toChatRoomResponse(userType = userType)
    }

    @GetMapping("/chats/rooms/{id}")
    @PreAuthorize("hasAnyRole('ROLE_CUSTOMER','ROLE_AGENT','ROLE_OBSERVER')")
    fun getChatRoomMessagesById(
        @PathVariable("id") chatId: String,
        @RequestParam(value = "userType", required = true) userType: Set<String>,
        @RequestParam(value = "channelType", required = true) channelType: String
    ): List<ChatMessageResponse> {
        return chatService.findChatRoomMessagesBy(chatRoomId = chatId, userTypes = userType, channelType = channelType).toChatMessageResponse()
    }

    @DeleteMapping("/chats/rooms/{roomId}")
    @PreAuthorize("hasAnyRole('ROLE_OBSERVER')")
    fun deleteChatRoomObserverMessagesById(
        @PathVariable("roomId") roomId: String,
        @RequestParam(value = "channelType", required = true) channelType: String = "OBSERVER"
    ) {
        chatService.deleteChatRoomMessageBy(
            roomId = roomId,
            channelType = channelType
        )
    }

    companion object {
        private val logger = LoggerFactory.getLogger(ChatController::class.java)
    }
}
