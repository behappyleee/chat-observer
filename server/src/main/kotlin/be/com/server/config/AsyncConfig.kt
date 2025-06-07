package be.com.server.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Primary
import org.springframework.core.task.TaskExecutor
import org.springframework.scheduling.annotation.EnableAsync
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor

@EnableAsync
@Configuration
class AsyncConfig {
    @Bean
    @Primary
    fun taskExecutor(): TaskExecutor =
        ThreadPoolTaskExecutor().apply {
            this.corePoolSize = 4
            this.maxPoolSize = 10
            this.setQueueCapacity(100)
            this.setThreadNamePrefix("async-task-")
            this.initialize()
        }
}