using RAA.Domain.Models.AuthModels;

namespace RAA.Domain.Models.TaskModels
{
  // public enum TaskSortBy { SortNameA, SortNameZ, SortNewDate, SortOldDate, SortHighPriority, sortLowPriotrity };
    public enum Priority { Low , Medium , High };
    public class TaskModel
    {
        public Guid Id { get; set; }
        public string Title { get; set; }

        public string? Description { get; set; }

        public bool IsCompleted { get; set; }

        public DateTime CreatedAt { get; set; }

        public Priority Priority { get; set; }

        public Guid UserId { get; set; }

        public Users? User { get; set; }

        public TaskModel(string title, string? description, Priority priority)
        {
            Id = Guid.NewGuid();
            Title = title; 
            Description = description; 
            IsCompleted = false;
            CreatedAt = DateTime.UtcNow;
            Priority = priority;
        }
    }
}
