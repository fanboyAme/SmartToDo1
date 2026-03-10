using Microsoft.EntityFrameworkCore.ChangeTracking;
using RAA.Application.Interfaces.Task;
using RAA.Application.ProjectDtos.TaskDtos;
using RAA.Domain.Models.TaskModels;
using RAA.Infrastructure.Databases;
using RAA.Infrastructure.Services.AuthServices;

namespace RAA.Application.Interfaces.Repositories
{
    public interface ITaskRepositories
    {
        public Task<TaskModel?> GetTask(Guid id);
        public Task<List<TaskModel>?> GetAllTasks();
        public Task<EntityEntry<TaskModel>?> AddTask(PostTaskDto postTaskDto);
        public Task<TaskModel> UpdateTask(PatchTaskDto patchTaskDto, Guid id);
        public Task<bool> DeleteTask(Guid id);


    }
}