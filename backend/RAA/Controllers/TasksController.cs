using Microsoft.AspNetCore.Mvc;
using RAA.Services.TasksServices;

namespace RAA.Controllers
{
    [ApiController]
    [Route("api/tasks")]
    public class TasksController: ControllerBase
    {
        private readonly TaskService _taskService;

        public TasksController(TaskService taskService)
        {
            _taskService = taskService;
        }
        [HttpGet]

    }
}
