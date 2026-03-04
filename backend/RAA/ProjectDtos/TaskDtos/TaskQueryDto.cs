using RAA.Models.TaskModels;

namespace RAA.ProjectDtos.TaskDtos
{
    public record TaskQueryDto(string? Title, bool? IsCompleted, Priority? Priority);
}
