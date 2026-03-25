using Microsoft.EntityFrameworkCore;
using RAA.Application.Interfaces.Tasks;
using RAA.Application.ProjectDtos.ResponceDto;
using RAA.Application.ProjectDtos.TaskDtos;
using RAA.Infrastructure.Databases;
using RAA.Infrastructure.Queries;
using RAA.Infrastructure.Services.AuthServices;

namespace RAA.Infrastructure.Services.TasksServices
{
    public class TaskFilterService: ITaskFilterService
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

        public async Task<TaskFilterResponseDto> GetTasksWithFiltred(TaskQueryDto TaskQuery)
        {
            var currentTaskList = _db.Tasks.Where(t => t.UserId == _currentUserService.CurrentUserId());

            currentTaskList = _taskQueryBuilder.ApplyFilters(currentTaskList, TaskQuery);

            currentTaskList = _taskQueryBuilder.ApplySorting(currentTaskList, TaskQuery);


            var totalTask = await currentTaskList.CountAsync();

            var page = TaskQuery.Page ?? 1;

            if (page < 1) page = 1;

            var pageSize = TaskQuery.PageSize ?? 9;

            if (pageSize < 1) pageSize = 9;

            int totalPages = (totalTask + pageSize - 1) / pageSize;

            if (page > totalPages) page = totalPages;

            currentTaskList = _taskQueryBuilder.ApplyPagination(currentTaskList, page, pageSize);

            var item = await currentTaskList.ToListAsync();

            return new TaskFilterResponseDto(item, totalTask, totalPages, page, pageSize);
        }
    }
}
