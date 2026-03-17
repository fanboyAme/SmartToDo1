using RAA.Application.Interfaces.Task;
using RAA.Application.ProjectDtos.TaskDtos;
using RAA.Domain.Models.TaskModels;
using RAA.Infrastructure.Repositories.TaskRepository;
using RAA.Infrastructure.Services.AuthServices;

namespace RAA.Application.Services.TasksServices
{
    public class TaskService: ITaskService
    {
        private readonly CurrentUserService _currentUserService;
        private readonly TaskRepository _taskRepository;

        public TaskService(CurrentUserService currentUserService, TaskRepository taskRepository)
        {
            _currentUserService = currentUserService;
            _taskRepository = taskRepository;
        }
        public async Task<TaskModel> GetTask(Guid id)
        {
            var currentTask = await _taskRepository.GetTaskAsync(id);
            if (currentTask is null) { throw new ArgumentNullException("Задача не найдена"); }
            return currentTask;
        }
        public async Task<List<TaskModel>?> GetAllTasks()
        {
            var currentId = _currentUserService.CurrentUserId();
            return await _taskRepository.GetAllTasksAsync(currentId);
        }
        public async Task<bool> AddTask(PostTaskDto postTaskDto)
        {
            await _taskRepository.AddTaskAsync(postTaskDto);
            await _taskRepository.SaveChangesAsync();
            return true;
        }
        public async Task<TaskModel> UpdateTask(PatchTaskDto patchTaskDto, Guid id) 
        {
            var currentTask = await GetTask(id);
            currentTask.Title = patchTaskDto.Title;
            currentTask.Description = patchTaskDto.Description;
            currentTask.Priority = patchTaskDto.Priority;
            currentTask.IsCompleted = patchTaskDto.IsCompleted;
            _taskRepository.UpdateTask(currentTask);
            await _taskRepository.SaveChangesAsync();
            return currentTask;
        }
        public async Task<bool> DeleteTask(Guid id)
        {
            var currentTask = await GetTask(id);
            if (currentTask is null) return false;
            _taskRepository.RemoveTask(currentTask);
            await _taskRepository.SaveChangesAsync();
            return true;
        }
    }
}
