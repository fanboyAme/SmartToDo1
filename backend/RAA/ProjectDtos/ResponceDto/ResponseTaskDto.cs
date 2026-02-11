using RAA.Models.TaskModels;

namespace RAA.ProjectDtos.ResponseDto
{
    public record ResponseTaskDto(Guid Id, string Title, string? Description, bool IsCompleted, DateTime CreatedAt, Priority Priority);
}
