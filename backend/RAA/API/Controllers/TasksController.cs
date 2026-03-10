using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RAA.Application.ProjectDtos.TaskDtos;
using RAA.Application.Services.TasksServices;
using RAA.Infrastructure.Services.TasksServices;

namespace RAA.API.Controllers
{
    [ApiController]
    [Route("api/tasks")]
    public class TasksController : ControllerBase
    {
        private readonly TaskService _taskService;
        private readonly TaskFilterService _taskFilterService;

        public TasksController(TaskService taskService, TaskFilterService taskFilterService)
        {
            _taskService = taskService;
            _taskFilterService = taskFilterService;
        }
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetTasks(TaskQueryDto TaskQuery)
        {
            var tasks = await _taskFilterService.GetTasksWithFiltred(TaskQuery);
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
