package be.com.server.user.controller

import be.com.server.common.ApiEndpointVersion
import be.com.server.user.controller.request.UserSignupRequest
import be.com.server.user.controller.request.toUserSignupDto
import be.com.server.user.controller.response.UserInfoResponse
import be.com.server.user.service.UserService
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("${ApiEndpointVersion.V1_API_PREFIX}/users")
class UserController(
    private val userService: UserService
) {

    @PostMapping("/signup")
    fun signup(
        @RequestBody signupRequest: UserSignupRequest
    ) {
        userService.signup(userSignupDto = signupRequest.toUserSignupDto())
    }

    @PostMapping("/signin")
    fun signin() {
        userService.signin()
    }

    @GetMapping("/me")
    fun getUser(): UserInfoResponse {
        // TODO - User 세션 정보 넘겨주기 !
        return UserInfoResponse(
            email = "TEST-EMAIL"
        )
    }

    companion object {
        private val logger = LoggerFactory.getLogger(UserController::class.java)
    }
}
