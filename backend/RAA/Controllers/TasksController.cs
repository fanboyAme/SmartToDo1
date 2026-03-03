using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RAA.ProjectDtos;
using RAA.Services.TasksServices;

namespace RAA.Controllers
{
    [ApiController]
    [Route("api/tasks")]
    public class TasksController : ControllerBase
    {
        private readonly TaskService _taskService;

        public TasksController(TaskService taskService)
        {
            _taskService = taskService;
        }
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetTasks()
        {
            var tasks = await _taskService.GetAllTasks();
            return Ok(tasks);
        }
        [HttpPost("Addendum")]
        [Authorize]
        public async Task<IActionResult> AddTask(PostTaskDto postTaskDto)
        {
            var addTask = await _taskService.AddTask(postTaskDto);
            return Ok(addTask);
        }
        [HttpPatch("Update/{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateTask(PatchTaskDto patchTaskDto, Guid id)
        {
            var updatedTask = _taskService.UpdateTask(patchTaskDto, id);
            return Ok(updatedTask);
        }
        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> DeleteTask(Guid id)
        {
            var DeletedTask = await _taskService.DeleteTask(id);
            return Ok(DeletedTask);
        }

    }
}
