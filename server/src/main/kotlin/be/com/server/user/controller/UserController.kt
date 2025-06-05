package be.com.server.user.controller

import be.com.server.common.ApiEndpointVersion
import be.com.server.user.controller.request.UserSignupRequest
import be.com.server.user.controller.request.toUserSignupDto
import be.com.server.user.service.UserService
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("${ApiEndpointVersion.V1_API_PREFIX}/users")
class UserController(
    private val userService: UserService,
){

    @PostMapping("/signup")
    fun signup(
        @RequestBody signupRequest: UserSignupRequest,
    ) {
        userService.signup(userSignupDto = signupRequest.toUserSignupDto())
    }

    @PostMapping("/signin")
    fun signin() {
        userService.signin()
    }

    companion object {
        private val logger = LoggerFactory.getLogger(UserController::class.java)
    }
}
