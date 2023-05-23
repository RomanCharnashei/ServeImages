using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;

namespace ServeImages.Extentions
{
    public class RestrictedDirectoriesRequirementHandler :
        AuthorizationHandler<RestrictedDirectoriesRequirement>
    {
        private readonly ImagesDirectoryBrowserOptions _options;
        private readonly RestrictedDirectoriesOptions _restrictedOptions;
        private readonly IHttpContextAccessor _contextAccessor;
        public RestrictedDirectoriesRequirementHandler(
            IOptions<ImagesDirectoryBrowserOptions> options, 
            IOptions<RestrictedDirectoriesOptions> restrictedOptions, 
            IHttpContextAccessor contextAccessor)
        {
            _options = options.Value;
            _contextAccessor = contextAccessor;
            _restrictedOptions = restrictedOptions.Value;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, RestrictedDirectoriesRequirement requirement)
        {
            var httpContext = _contextAccessor.HttpContext;
            var path = httpContext!.Request.Path;

            if (path.StartsWithSegments(_options.RequestPath, out var subpath))
            {
                if (!Path.IsPathFullyQualified(subpath) && !_restrictedOptions.Directories.Any(subpath.Value!.StartsWith))
                {
                    context.Succeed(requirement);
                }
            }
            else
            {
                context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }
    }
}
