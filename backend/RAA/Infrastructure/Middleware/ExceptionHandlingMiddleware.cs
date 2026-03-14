using RAA.Application.Exceptions;
using System.Text.Json;

namespace RAA.Infrastructure.Middleware
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }
        private int GetStatusCode(Exception exc)
        {
            switch (exc)
            {
                case BadRequestException: return StatusCodes.Status400BadRequest;
                case ForbiddenException: return StatusCodes.Status403Forbidden;
                case NotFoundException: return StatusCodes.Status404NotFound;
                case UnauthorizedAccessException: return StatusCodes.Status401Unauthorized;
                default: return StatusCodes.Status500InternalServerError;
            }

        }
        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc, "Unhandled exception");
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = GetStatusCode(exc);
                var response = new
                {
                    message = exc.Message
                };

                await context.Response.WriteAsync(JsonSerializer.Serialize(response));
            }
        }
    }
}
