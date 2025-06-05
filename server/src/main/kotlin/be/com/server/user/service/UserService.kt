package be.com.server.user.service

import be.com.server.user.repository.UserRepository
import be.com.server.user.service.dto.UserSignupDto
import org.springframework.stereotype.Service

@Service
class UserService(
    private val userRepository: UserRepository,
){

    fun signup(userSignupDto: UserSignupDto) {}

    fun signin() {}
}
