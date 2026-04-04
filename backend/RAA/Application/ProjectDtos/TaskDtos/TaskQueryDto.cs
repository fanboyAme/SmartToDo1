using RAA.Domain.Models.TaskModels;

namespace RAA.Application.ProjectDtos.TaskDtos
{
    public enum TaskSortBy { SortNameA, SortNameZ, SortNewDate, SortOldDate, SortHighPriority, SortLowPriotrity };
    public class TaskQueryDto
    {
        public string? Title { get; set; }
        public bool? IsCompleted { get; set; }
        public Priority? Priority { get; set; }
        public TaskSortBy? SortBy { get; set; }
        public int? Page {  get; set; }
        public int? PageSize { get; set; }
    }
}
