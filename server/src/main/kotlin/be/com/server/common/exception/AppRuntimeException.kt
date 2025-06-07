package be.com.server.common.exception

class AppRuntimeException(
    message: String?,
    cause: Exception
) : Throwable(message, cause)
