using Microsoft.EntityFrameworkCore;
using RAA.Databases;
using RAA.Interfaces;
using RAA.Models.AuthModels;
using RAA.Models.TaskModels;
using RAA.ProjectDtos.ResponseDto;
using RAA.ProjectDtos.TaskDtos;
using RAA.Services.AuthServices;

namespace RAA.Services.TasksServices
{
    public class TaskService: ITaskService
    {
        private readonly ApplicationDbContext _db;
        private readonly CurrentUserService _currentUserService;

        public TaskService(ApplicationDbContext db, CurrentUserService currentUserService)
        {
            _db = db;
            _currentUserService = currentUserService;
        }
        public async Task<TaskModel> GetTask(Guid id)
        {
            var currentTask = await _db.Tasks.SingleOrDefaultAsync(t => t.Id == id);
            if (currentTask is null) { throw new ArgumentNullException("Задача не найдена"); }
            return currentTask;
        }
        public async Task<List<TaskModel>?> GetAllTasks()
        {
            var currentId = _currentUserService.CurrentUserId();
            return await _db.Tasks.Where(u => u.UserId == currentId).ToListAsync();
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
