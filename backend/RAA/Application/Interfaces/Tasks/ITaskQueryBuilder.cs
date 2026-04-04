using RAA.Application.ProjectDtos.TaskDtos;
using RAA.Domain.Models.TaskModels;

namespace RAA.Application.Interfaces.Tasks
{
    public interface ITaskQueryBuilder
    {
        public IQueryable<TaskModel> ApplyFilters(IQueryable<TaskModel> query, TaskQueryDto taskQuery);
        public IQueryable<TaskModel> ApplySorting(IQueryable<TaskModel> query, TaskQueryDto taskQuery);
        public IQueryable<TaskModel> ApplyPagination(IQueryable<TaskModel> query, int page, int pageSize);
    }
}
