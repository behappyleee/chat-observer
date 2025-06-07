package be.com.server.chat.controller

import be.com.server.chat.controller.response.ChatMessageResponse
import be.com.server.chat.controller.response.ChatRoomResponse
import be.com.server.chat.controller.response.toChatMessageResponse
import be.com.server.chat.controller.response.toChatRoomResponse
import be.com.server.chat.service.ChatService
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
class ChatRestController(
    private val chatService: ChatService
) {
    @GetMapping("/chats")
    fun getAllChatRooms(
        @RequestParam(name = "userType", required = true) userType: String
    ): List<ChatRoomResponse> {
        return chatService.getChatRooms().map { it.toChatRoomResponse(userType = userType) }
    }

    // TODO - Channel Type 데이터 추가해주기 !!
    @GetMapping("/chats/{id}")
    fun getChatRoomById(
        @PathVariable("id") chatId: String,
        @RequestParam(value = "userType", required = true) userType: String,
        @RequestParam(value = "userName", required = true) userName: String
    ): ChatRoomResponse {
        // TODO - Channel Type 입력하기 !
        return chatService.findChatRoomByIdOrThrow(chatRoomId = chatId).toChatRoomResponse(userType = userType)
    }

    @GetMapping("/chats/rooms/{id}")
    fun getChatRoomMessagesById(
        @PathVariable("id") chatId: String,
        @RequestParam(value = "userType", required = true) userType: Set<String>
    ): List<ChatMessageResponse> {
        return chatService.findChatRoomMessagesBy(chatRoomId = chatId, userTypes = userType).toChatMessageResponse()
    }

//    @GetMapping("/chats/rooms/{id}")
//    fun getChatRoomMessages(
//        @PathVariable("id") chatRoomId: String
//    ): List<ChatMessageResponse> {
//        return chatService.findChatRoomMessageByRoomId(roomId = chatRoomId).toChatMessageResponse()
//    }

    // 저장 된 메세지 들을 조회 !
    companion object {
        private val logger = LoggerFactory.getLogger(ChatRestController::class.java)
    }
}
