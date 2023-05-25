using Microsoft.AspNetCore.Mvc;
using ServeImages.Services;
using ServeImages.Services.DirectoriesBrowse;

namespace ServeImages.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImagesController : ControllerBase
    {
        [HttpGet("{**catchAll}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public DirectoriesResponse Get(
            [FromRoute] string? catchAll, 
            [FromQuery] int? limit,
            [FromServices] IDirectoriesBrowseHandler handler)
        {
            return handler.Handle(new DirectoriesBrowseRequest(catchAll, limit));
        }
    }
}
