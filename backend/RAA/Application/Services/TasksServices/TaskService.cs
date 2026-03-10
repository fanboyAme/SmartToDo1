using Microsoft.EntityFrameworkCore;
using RAA.Application.Interfaces.Task;
using RAA.Application.ProjectDtos.TaskDtos;
using RAA.Domain.Models.TaskModels;
using RAA.Infrastructure.Databases;
using RAA.Infrastructure.Repositories;
using RAA.Infrastructure.Services.AuthServices;

namespace RAA.Application.Services.TasksServices
{
    public class TaskService: ITaskService
    {
        private readonly ApplicationDbContext _db;
        private readonly CurrentUserService _currentUserService;
        private readonly TaskRepository _taskRepository;

        public TaskService(ApplicationDbContext db, CurrentUserService currentUserService, TaskRepository taskRepository)
        {
            _db = db;
            _currentUserService = currentUserService;
            _taskRepository = taskRepository;
        }
        public async Task<TaskModel> GetTask(Guid id)
        {
            var currentTask = await _taskRepository.GetTask(id);
            if (currentTask is null) { throw new ArgumentNullException("Задача не найдена"); }
            return currentTask;
        }
        public async Task<List<TaskModel>?> GetAllTasks()
        {
            var currentId = _currentUserService.CurrentUserId();
            return await _taskRepository.GetAllTasks(currentId);
        }
        public async Task<bool> AddTask(PostTaskDto postTaskDto)
        {
            var addTask = await _db.Tasks.AddAsync(new (postTaskDto.Title, postTaskDto.Description, postTaskDto.Priority));
            await _db.SaveChangesAsync();
            return true;
        }
        public async Task<TaskModel> UpdateTask(PatchTaskDto patchTaskDto, Guid id) 
        {
            var currentTask = await GetTask(id);
            currentTask.Title = patchTaskDto.Title;
            currentTask.Description = patchTaskDto.Description;
            currentTask.Priority = patchTaskDto.Priority;
            currentTask.IsCompleted = patchTaskDto.IsCompleted;
            _db.Tasks.Update(currentTask);
            await _db.SaveChangesAsync();
            return currentTask;
        }
        public async Task<bool> DeleteTask(Guid id)
        {
            var currentTask = await GetTask(id);
            if (currentTask is null) return false;
            _db.Tasks.Remove(currentTask);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
