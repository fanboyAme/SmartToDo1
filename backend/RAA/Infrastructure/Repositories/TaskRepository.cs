using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using RAA.Application.Interfaces.Repositories;
using RAA.Application.ProjectDtos.TaskDtos;
using RAA.Domain.Models.TaskModels;
using RAA.Infrastructure.Databases;

namespace RAA.Infrastructure.Repositories
{
    public class TaskRepository: ITaskRepositories
    {
        private readonly ApplicationDbContext _db;

        public TaskRepository(ApplicationDbContext db)
        {
            _db = db;
        }
        public async Task<TaskModel?> GetTask(Guid id)
        {
            var currentTask = await _db.Tasks.SingleOrDefaultAsync(t => t.Id == id);
            return currentTask;
        }

        public async Task<List<TaskModel>?> GetAllTasks(Guid id)
        {
            return await _db.Tasks.Where(u => u.UserId == id).ToListAsync();
        }
        public async Task<EntityEntry<TaskModel>?> AddTask(PostTaskDto postTaskDto)
        {
            return await _db.Tasks.AddAsync(new(postTaskDto.Title, postTaskDto.Description, postTaskDto.Priority));
        }

        public async Task SaveChanges()
        {
            await _db.SaveChangesAsync();
        }
    }
}
//public async Task<bool> AddTask(PostTaskDto postTaskDto)
//{
//    var addTask = await _db.Tasks.AddAsync(new(postTaskDto.Title, postTaskDto.Description, postTaskDto.Priority));
//    await _db.SaveChangesAsync();
//    return true;
//}
//public Task<TaskModel> UpdateTask(PatchTaskDto patchTaskDto, Guid id);
//public Task<bool> DeleteTask(Guid id);