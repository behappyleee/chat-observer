package be.com.server.chat.repository

import be.com.server.chat.service.dto.ChatRoomCreateDto
import be.com.server.chat.service.dto.ChatRoomDto
import org.springframework.stereotype.Repository
import java.util.concurrent.ConcurrentHashMap

@Repository
class ChatRepositoryTest {

    // TODO - 주고 받는 채팅 메세지 DB 에 저장 하기 .. .!
    private val chatRooms: MutableMap<String, ChatRoomDto> = ConcurrentHashMap()

    fun insertChatRoom(chatRoomCreateDto: ChatRoomCreateDto): ChatRoomDto {
        return ChatRoomDto(
            roomId = chatRoomCreateDto.roomId,
            sender = chatRoomCreateDto.userName
        ).apply { chatRooms[this.roomId] = this }
    }

    fun findAllChatRooms() {
    }

    fun findChatRoomByIdOrNull(id: String): ChatRoomDto? {
        return null
    }
}
