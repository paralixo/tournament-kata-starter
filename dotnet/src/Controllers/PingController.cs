using Microsoft.AspNetCore.Mvc;

namespace Tournaments.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PingController: ControllerBase
    {

        [HttpGet]
        public void Ping()
        {
            
        }
    }
}