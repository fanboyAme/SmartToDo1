using RAA.Application.Exceptions;
using RAA.Application.Interfaces.Tasks;
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
        private readonly ILogger<TaskService> _logger;

        public TaskService(CurrentUserService currentUserService, TaskRepository taskRepository, ILogger<TaskService> logger)
        {
            _currentUserService = currentUserService;
            _taskRepository = taskRepository;
            _logger = logger;
        }
        public async Task<TaskModel> GetTask(Guid id)
        {
            var currentTask = await _taskRepository.GetTaskAsync(id) 
                ?? throw new NotFoundException($"Задача {id} не найдена");

            _logger.LogInformation("Задача {Task} успешно отображена", currentTask);

            return currentTask;
        }
        public async Task<List<TaskModel>?> GetAllTasks()
        {
            var currentId = _currentUserService.CurrentUserId();
            _logger.LogInformation("Задачи пользователя {UserId} успешно отображенны", currentId);
            return await _taskRepository.GetAllTasksAsync(currentId);
        }
        public async Task<TaskModel?> AddTask(PostTaskDto postTaskDto)
        {
            var currentUserId = _currentUserService.CurrentUserId();
            var task = await _taskRepository.AddTaskAsync(postTaskDto, currentUserId);
            await _taskRepository.SaveChangesAsync();

            _logger.LogInformation(
                "Задача {taskId} успешно добавлена пользователем {UserId}: {TaskTittle}",
                task.Id,
                currentUserId,
                task.Title
            );

            return task;
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

            _logger.LogInformation("Задача {TaskId} успешно обновлена", id);

            return currentTask;
        }
        public async Task<TaskModel> DeleteTask(Guid id)
        {
            var currentTask = await GetTask(id)
                ?? throw new NotFoundException("Задача не найдена");
            _taskRepository.RemoveTask(currentTask);
            await _taskRepository.SaveChangesAsync();

            _logger.LogInformation("Задача {TaskId} успешно удалена", id );

            return currentTask;
        }
    }
}
