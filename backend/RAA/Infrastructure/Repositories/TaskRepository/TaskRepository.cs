using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using RAA.Application.Interfaces.Repositories;
using RAA.Application.ProjectDtos.TaskDtos;
using RAA.Domain.Models.TaskModels;
using RAA.Infrastructure.Databases;

namespace RAA.Infrastructure.Repositories.TaskRepository
{
    public class TaskRepository: ITaskRepository
    {
        private readonly ApplicationDbContext _db;

        public TaskRepository(ApplicationDbContext db)
        {
            _db = db;
        }
        public async Task<TaskModel?> GetTaskAsync(Guid id)
        {
            var currentTask = await _db.Tasks.SingleOrDefaultAsync(t => t.Id == id);
            return currentTask;
        }

        public async Task<List<TaskModel>?> GetAllTasksAsync(Guid id)
        {
            return await _db.Tasks.Where(u => u.UserId == id).ToListAsync();
        }
        public async Task<TaskModel?> AddTaskAsync(PostTaskDto postTaskDto, Guid userId)
        {
            var task = new TaskModel(
                postTaskDto.Title,
                postTaskDto.Description,
                postTaskDto.Priority
            );

            task.UserId = userId;

            await _db.Tasks.AddAsync(task);
            return task;
        }


        public async Task<bool> SaveChangesAsync()
        {
            await _db.SaveChangesAsync();
            return true;
        }
        public void UpdateTask(TaskModel taskModel)
        {
            _db.Tasks.Update(taskModel);
        }
        public void RemoveTask(TaskModel currentTask)
        {
            _db.Tasks.Remove(currentTask);
        }
    }
}