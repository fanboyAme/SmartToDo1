using RAA.Domain.Models.TaskModels;

namespace RAA.Application.ProjectDtos.ResponceDto
{
    public record TaskFilterResponseDto(List<TaskModel> Item, int TotalTask, int TotalPage, int Page, int PageSize);
}
