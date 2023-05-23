using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;

namespace ServeImages.Extentions
{
    public static class ImagesDirectoryBrowserExtensions
    {
        /// <summary>
        /// Enable directory browsing with the given options
        /// </summary>
        /// <param name="app"></param>
        /// <param name="options"></param>
        /// <returns></returns>
        public static IApplicationBuilder UseImagesDirectoryBrowser(this IApplicationBuilder app)
        {
            if (app == null)
            {
                throw new ArgumentNullException(nameof(app));
            }
            var opt = app.ApplicationServices.GetRequiredService<IOptions<ImagesDirectoryBrowserOptions>>().Value;

            var fileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), opt.SourceFolder));

            app.UseMiddleware<RestrictedDirectoryBrowserMiddleware>(fileProvider);

            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = fileProvider,
                RequestPath = opt.RequestPath
            });

            return app;
        }
    }
}
