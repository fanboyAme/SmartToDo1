using RAA.Domain.Models.TaskModels;

namespace RAA.Application.ProjectDtos.ResponceDto
{
    public record ResponseTaskDto(Guid Id, string Title, string? Description, bool IsCompleted, DateTime CreatedAt, Priority Priority);
}
