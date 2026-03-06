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
        private readonly TaskQueryBuilder _taskQueryBuilder;
        public TaskFilterService(ApplicationDbContext db, CurrentUserService currentUserService, TaskQueryBuilder taskQueryBuilder)
        {
            _db = db;
            _currentUserService = currentUserService;
            _taskQueryBuilder = taskQueryBuilder;
        }

        public async Task<List<TaskModel>> GetTasksWithFiltred(TaskQueryDto TaskQuery)
        {
            var currentTaskList = _db.Tasks.Where(t => t.UserId == _currentUserService.CurrentUserId());

            _taskQueryBuilder.ApplyFilters(currentTaskList, TaskQuery);

            _taskQueryBuilder.ApplySorting(currentTaskList, TaskQuery.SortBy);


            return await currentTaskList.ToListAsync();
        }
    }
}
