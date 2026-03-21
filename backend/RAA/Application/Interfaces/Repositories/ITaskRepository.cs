using RAA.Application.ProjectDtos.TaskDtos;
using RAA.Domain.Models.TaskModels;

namespace RAA.Application.Interfaces.Repositories
{
    public interface ITaskRepository
    {
        public Task<TaskModel?> GetTaskAsync(Guid id);
        public Task<List<TaskModel>?> GetAllTasksAsync(Guid id);
        public Task<TaskModel?> AddTaskAsync(PostTaskDto postTaskDto);
        public Task<bool> SaveChangesAsync();
        public void UpdateTask(TaskModel taskModel);
        public void RemoveTask(TaskModel currentTask);
    }
}