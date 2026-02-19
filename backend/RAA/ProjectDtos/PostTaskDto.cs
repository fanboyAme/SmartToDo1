using RAA.Models.TaskModels;

namespace RAA.ProjectDtos
{
    public record PostTaskDto(string Title, string? Description, Priority Priority);
}
