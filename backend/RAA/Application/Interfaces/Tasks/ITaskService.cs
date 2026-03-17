using RAA.Application.ProjectDtos.TaskDtos;
using RAA.Domain.Models.TaskModels;

namespace RAA.Application.Interfaces.Tasks
{
    public interface ITaskService
    {
        public Task<TaskModel> GetTask(Guid id);
        public Task<List<TaskModel>?> GetAllTasks();
        public Task<bool> AddTask(PostTaskDto postTaskDto);
        public Task<TaskModel> UpdateTask(PatchTaskDto patchTaskDto, Guid id);
        public Task<bool> DeleteTask(Guid id);
    }
}
