using RAA.Domain.Models.TaskModels;

namespace RAA.Application.ProjectDtos.TaskDtos
{
    public record PostTaskDto(string Title, string? Description, Priority Priority);
}
