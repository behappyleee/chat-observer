package be.com.server.chat.controller

import be.com.server.chat.controller.response.ChatMessageResponse
import be.com.server.chat.controller.response.ChatRoomResponse
import be.com.server.chat.controller.response.toChatMessageResponse
import be.com.server.chat.controller.response.toChatRoomResponse
import be.com.server.chat.service.ChatService
import be.com.server.common.ApiEndpointVersion
import io.swagger.v3.oas.annotations.Operation
import org.slf4j.LoggerFactory
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("${ApiEndpointVersion.V1_API_PREFIX}/chats")
class ChatController(
    private val chatService: ChatService
) {
    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_AGENT','ROLE_OBSERVER')")
    @Operation(summary = "상담 중인 채팅 목록 조회", description = "AGENT 와 OBSERVER 상담중인 채팅 목록을 조회.")
    fun getAllChatRooms(
        @RequestParam(name = "userType", required = true) userType: String
    ): List<ChatRoomResponse> {
        return chatService.getChatRooms().map { it.toChatRoomResponse(userType = userType) }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_CUSTOMER', 'ROLE_AGENT', 'ROLE_OBSERVER')")
    @Operation(summary = "상담 중인 채팅방 상세 조회", description = "채팅방 정보를 조회")
    fun getChatRoomById(
        @PathVariable("id") chatId: String,
        @RequestParam(value = "userType", required = true) userType: String,
        @RequestParam(value = "userName", required = true) userName: String
    ): ChatRoomResponse {
        return chatService.findChatRoomByIdOrThrow(chatRoomId = chatId).toChatRoomResponse(userType = userType)
    }

    @GetMapping("/rooms/{id}")
    @PreAuthorize("hasAnyRole('ROLE_CUSTOMER','ROLE_AGENT','ROLE_OBSERVER')")
    @Operation(summary = "채팅방에 메세지들을 조회", description = "채팅방 메세지를 조회.")
    fun getChatRoomMessagesById(
        @PathVariable("id") chatId: String,
        @RequestParam(value = "userType", required = true) userType: Set<String>,
        @RequestParam(value = "channelType", required = true) channelType: String
    ): List<ChatMessageResponse> {
        return chatService.findChatRoomMessagesBy(chatRoomId = chatId, userTypes = userType, channelType = channelType).toChatMessageResponse()
    }

    @DeleteMapping("/rooms/{roomId}")
    @PreAuthorize("hasAnyRole('ROLE_OBSERVER')")
    @Operation(summary = "OBSERVER 와 나눈 대화를 삭제", description = "OBSERVER 와 나누었던 대화를 삭제")
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
