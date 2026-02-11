using RAA.Models.AuthModels;

namespace RAA.Models.TaskModels
{
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

        public TaskModel(string title, string? description)
        {
            Id = Guid.NewGuid();
            Title = title; 
            Description = description; 
            IsCompleted = false;
            CreatedAt = DateTime.UtcNow;
            Priority = Priority.Low;
        }
    }
}
