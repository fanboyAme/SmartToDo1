using RAA.Application.ProjectDtos.ResponceDto;
using RAA.Application.ProjectDtos.TaskDtos;

namespace RAA.Application.Interfaces.Tasks
{
    public interface ITaskFilterService
    {
        public Task<TaskFilterResponseDto> GetTasksWithFiltred(TaskQueryDto TaskQuery);
    }
}
