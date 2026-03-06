using RAA.Models.TaskModels;

namespace RAA.ProjectDtos.TaskDtos
{
    public record PostTaskDto(string Title, string? Description, Priority Priority);
}
