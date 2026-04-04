using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RAA.Application.Interfaces.Tasks;
using RAA.Application.ProjectDtos.TaskDtos;

namespace RAA.API.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/tasks")]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _taskService;
        private readonly ITaskFilterService _taskFilterService;

        public TasksController(ITaskService taskService, ITaskFilterService taskFilterService)
        {
            _taskService = taskService;
            _taskFilterService = taskFilterService;
        }
        [HttpGet]
        public async Task<IActionResult> GetTasks([FromQuery] TaskQueryDto TaskQuery)
        {
            var tasks = await _taskFilterService.GetTasksWithFiltred(TaskQuery);
            return Ok(tasks);
        }
        [HttpPost("Addendum")]
        public async Task<IActionResult> AddTask([FromBody] PostTaskDto postTaskDto)
        {
            var createdTask = await _taskService.AddTask(postTaskDto);
            return Created(string.Empty, createdTask);
        }
        [HttpPatch("Update/{id}")]
        public async Task<IActionResult> UpdateTask([FromBody] PatchTaskDto patchTaskDto, Guid id)
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
