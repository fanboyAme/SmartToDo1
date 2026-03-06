using RAA.Models.TaskModels;
using RAA.ProjectDtos.TaskDtos;

namespace RAA.Queries
{
    public class TaskQueryBuilder
    {
        public IQueryable<TaskModel> ApplyFilters(IQueryable<TaskModel> query, TaskQueryDto taskQuery)
        {
            if (!string.IsNullOrWhiteSpace(taskQuery.Title))
            {
                query = query.Where(t => t.Title.ToLower().Contains(taskQuery.Title.ToLower()));
            }
            if (taskQuery.Priority != null)
            {
                query = query.Where(t => t.Priority == taskQuery.Priority);
            }
            if (taskQuery.IsCompleted != null)
            {
                query = query.Where(t => t.IsCompleted == taskQuery.IsCompleted);
            }
            return query;
        }
        public IQueryable<TaskModel> ApplySorting(IQueryable<TaskModel> query, TaskQueryDto taskQuery)
        {
            switch (taskQuery.SortBy)
            {
                case TaskSortBy.SortNameA:
                    return query.OrderBy(x => x.Title);
                case TaskSortBy.SortNameZ:
                    return query.OrderByDescending(x => x.Title);
                case TaskSortBy.SortNewDate:
                    return query.OrderByDescending(x => x.CreatedAt);
                case TaskSortBy.SortOldDate:
                    return query.OrderBy(x => x.CreatedAt);
                case TaskSortBy.SortHighPriority:
                    return query.OrderByDescending(x => x.Priority);
                case TaskSortBy.SortLowPriotrity:
                    return query.OrderBy(x => x.Priority);
                default:
                    return query;
            }
        }
    

        public IQueryable<TaskModel> ApplyPagination(IQueryable<TaskModel> query, int totalTask, int page)
        {
            const int pageSize = 9;
            var totalPages = (totalTask + pageSize - 1) / pageSize;
            if(page > totalPages) page = totalPages;
            if (page < 1) page = 1;
            var skip = (page - 1) * pageSize;
            return query.Skip(skip).Take(pageSize);
        }
    }
}
