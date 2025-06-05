package be.com.server.health

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
class HealthCheckController {

    @GetMapping("/health")
    @ResponseStatus(HttpStatus.OK)
    fun health(): String = HttpStatus.OK.name
}
