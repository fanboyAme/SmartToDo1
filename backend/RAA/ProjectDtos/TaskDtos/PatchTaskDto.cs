using RAA.Models.TaskModels;

namespace RAA.ProjectDtos.TaskDtos
{
    public record PatchTaskDto(string Title, string? Description, Priority Priority, bool IsCompleted);
}
