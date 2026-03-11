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
        public Task<TaskModel?> GetTask(Guid id);
        public Task<List<TaskModel>?> GetAllTasks(Guid id);
        public Task<EntityEntry<TaskModel>?> AddTask(PostTaskDto postTaskDto);
        public void SaveChanges();
        public void UpdateTask(TaskModel taskModel);
        public void RemoveTask(TaskModel currentTask);


    }
}