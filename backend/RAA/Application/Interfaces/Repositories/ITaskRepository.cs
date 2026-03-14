using Microsoft.EntityFrameworkCore.ChangeTracking;
using RAA.Application.Interfaces.Task;
using RAA.Application.ProjectDtos.TaskDtos;
using RAA.Domain.Models.TaskModels;
using RAA.Infrastructure.Databases;
using RAA.Infrastructure.Services.AuthServices;

namespace RAA.Application.Interfaces.Repositories
{
    public interface ITaskRepository
    {
        public Task<TaskModel?> GetTaskAsync(Guid id);
        public Task<List<TaskModel>?> GetAllTasksAsync(Guid id);
        public Task<EntityEntry<TaskModel>?> AddTaskAsync(PostTaskDto postTaskDto);
        public Task<bool> SaveChangesAsync();
        public void UpdateTask(TaskModel taskModel);
        public void RemoveTask(TaskModel currentTask);


    }
}