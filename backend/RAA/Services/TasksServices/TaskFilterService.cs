using Microsoft.EntityFrameworkCore;
using RAA.Databases;
using RAA.Models.TaskModels;
using RAA.ProjectDtos;
using RAA.ProjectDtos.TaskDtos;
using RAA.Queries;
using RAA.Services.AuthServices;

namespace RAA.Services.TasksServices
{
    public class TaskFilterService
    {
        private readonly ApplicationDbContext _db;
        private readonly CurrentUserService _currentUserService;
        public TaskFilterService(ApplicationDbContext db, CurrentUserService currentUserService)
        {
            _db = db;
            _currentUserService = currentUserService;
        }

        public async Task<List<TaskModel>> GetTasksWithFiltred(TaskQueryDto filter)
        {
            var currentTaskList = _db.Tasks.Where(t => t.UserId == _currentUserService.CurrentUserId());
            
            if(!string.IsNullOrWhiteSpace(filter.Title))
            {
                currentTaskList = currentTaskList.Where(t => t.Title.ToLower().Contains(filter.Title.ToLower()));
            }
            if (filter.Priority != null)
            {
                currentTaskList = currentTaskList.Where(t => t.Priority == filter.Priority);
            }
            if (filter.IsCompleted != null)
            {
                currentTaskList = currentTaskList.Where(t => t.IsCompleted == filter.IsCompleted);
            }
            return await currentTaskList.ToListAsync();
        }
    }
}
