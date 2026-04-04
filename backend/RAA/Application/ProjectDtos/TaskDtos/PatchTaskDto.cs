using RAA.Domain.Models.TaskModels;

namespace RAA.Application.ProjectDtos.TaskDtos
{
    public record PatchTaskDto(string Title, string? Description, Priority Priority, bool IsCompleted);
}
