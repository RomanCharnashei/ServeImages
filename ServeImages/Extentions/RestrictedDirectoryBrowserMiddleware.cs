using System.Linq;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Options;

namespace ServeImages.Extentions
{
    /// <summary>
    /// Enables directory browsing
    /// </summary>
    public class RestrictedDirectoryBrowserMiddleware
    {
        private readonly ImagesDirectoryBrowserOptions _browserOptions;
        private readonly PathString _matchUrl;
        private readonly RequestDelegate _next;
        private readonly IDirectoryFormatter _formatter;
        private readonly PhysicalFileProvider _fileProvider;
        private readonly string[] _forbiddenPaths;
        private readonly string[] _allowedExtentions;

        /// <summary>
        /// Creates a new instance of the SendFileMiddleware.
        /// </summary>
        /// <param name="next">The next middleware in the pipeline.</param>
        /// <param name="hostingEnv">The <see cref="IWebHostEnvironment"/> used by this middleware.</param>
        /// <param name="encoder">The <see cref="HtmlEncoder"/> used by the default <see cref="HtmlDirectoryFormatter"/>.</param>
        /// <param name="options">The configuration for this middleware.</param>
        public RestrictedDirectoryBrowserMiddleware(
            RequestDelegate next,
            PhysicalFileProvider fileProvider,
            IOptions<ImagesDirectoryBrowserOptions> browserOptions, 
            IOptions<RestrictedDirectoriesOptions> restrictedOptions)
        {            
            _next = next;
            _browserOptions = browserOptions.Value;
            _fileProvider = fileProvider;
            _formatter = new JsonDirectoryFormatter();
            _matchUrl = _browserOptions.RequestPath;
            _forbiddenPaths = restrictedOptions.Value.Directories;
            _allowedExtentions = restrictedOptions.Value.AllowedExtentions;
        }

        /// <summary>
        /// Examines the request to see if it matches a configured directory.  If so, a view of the directory contents is returned.
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public Task Invoke(HttpContext context)
        {
            int? limit = null;
            if (context.Request.Query.Any(x => x.Key == "limit"))
            {
                limit = int.Parse(context.Request.Query["limit"].ToString());
            };

            // Check if the URL matches any expected paths, skip if an endpoint with a request delegate was selected
            if (context.GetEndpoint()?.RequestDelegate is null
                && IsGetOrHeadMethod(context.Request.Method)
                && TryMatchPath(context, subpath: out var subpath)
                && TryGetDirectoryInfo(subpath, limit, out var contents))
            {
                // If the path matches a directory but does not end in a slash, redirect to add the slash.
                // This prevents relative links from breaking.
                if (!PathEndsInSlash(context.Request.Path))
                {
                    RedirectToPathWithSlash(context);
                    return Task.CompletedTask;
                }

                return _formatter.GenerateContentAsync(context, contents);
            }

            return _next(context);
        }

        private bool TryGetDirectoryInfo(PathString subpath, int? queryLmit, out IEnumerable<IFileInfo> contents)
        {
            // TryMatchPath will not output an empty subpath when it returns true. This is called only in that case.
            var fullContents = _fileProvider.GetDirectoryContents(subpath.Value!);

            // Filter forbiden directories
            contents = fullContents.Where(x => !_forbiddenPaths
                .Any(e => x.PhysicalPath!
                    .Substring(_fileProvider.Root.Length - 1)
                    .Replace(Path.DirectorySeparatorChar, '/')
                    .StartsWith(e)
                    )
                );

            // Leave only allowed files
            contents = contents.Where(x => x.IsDirectory ||
                (!x.IsDirectory && _allowedExtentions.Contains(Path.GetExtension(x.PhysicalPath))));

            if (queryLmit.HasValue)
            {
                contents = contents.Take(queryLmit.Value);
            }

            return fullContents.Exists;
        }

        private bool IsGetOrHeadMethod(string method)
        {
            return HttpMethods.IsGet(method) || HttpMethods.IsHead(method);
        }

        private bool PathEndsInSlash(PathString path)
        {
            return path.HasValue && path.Value!.EndsWith("/", StringComparison.Ordinal);
        }

        private void RedirectToPathWithSlash(HttpContext context)
        {
            context.Response.StatusCode = StatusCodes.Status301MovedPermanently;
            var request = context.Request;
            var redirect = UriHelper.BuildAbsolute(request.Scheme, request.Host, request.PathBase, request.Path + "/", request.QueryString);
            context.Response.Headers.Location = redirect;
        }

        private bool TryMatchPath(HttpContext context, out PathString subpath)
        {
            var path = context.Request.Path;

            if (!Path.HasExtension(path) && !PathEndsInSlash(path))
            {
                path += new PathString("/");
            }

            if (path.StartsWithSegments(_matchUrl, out subpath))
            {
                return true;
            }
            return false;
        }
    }
}
