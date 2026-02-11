using Microsoft.EntityFrameworkCore;
using RAA.Databases;
using RAA.Models.AuthModels;
using RAA.Models.TaskModels;
using RAA.ProjectDtos;
using RAA.ProjectDtos.ResponseDto;

namespace RAA.Services.TasksServices
{
    public class TaskService
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
            var currentId = _currentUserService.CurrentUserId();
            var currentUser = _db.Tasks.Any(t => t.UserId == currentId);
            if (currentUser) { await _db.Tasks.SingleOrDefaultAsync(t => t.Id == id); }
        }
        public async Task<List<TaskModel>> GetAllTasks()
        {
            var currentId = _currentUserService.CurrentUserId();
            return _db.Tasks.Where(u => u.UserId == currentId).ToList();
        }
        public async Task<bool> AddTask(GetTaskDto addTaskDto)
        {
            var addTask = await _db.Tasks.AddAsync(new (addTaskDto.Title,addTaskDto.Description));
            await _db.SaveChangesAsync();
            return true;
        }
        public async Task<List<TaskModel>> UpdateTask(PostTaskDto postTaskDto) 
        {
            var currentTask = await GetTask(postTaskDto.Id);
            currentTask.Title = postTaskDto.Title;
            currentTask.Description = postTaskDto.Description;
            _db.Tasks.Update(currentTask);
            _db.SaveChanges();
            return currentTask;
        }
        public async Task<bool> DeleteTask(Guid id)
        {
            var currentTask = GetTask(id);
            await _db.Tasks.ExecuteDeleteAsync(currentTask);
            return true;
        }
    }
}
