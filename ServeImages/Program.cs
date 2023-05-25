using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Options;
using ServeImages.Common;
using ServeImages.Extentions;
using ServeImages.Services.DirectoriesBrowse;

namespace ServeImages
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Logging
                .AddConfiguration(builder.Configuration.GetSection("Logging"))
                .AddFile("mylog.log");

            builder.Services.AddOptions<RestrictedDirectoriesOptions>()
                .Configure((opt) =>
                {
                    opt.Directories = File.ReadAllLines("ForbiddenPaths.txt")
                        .Select(x => x.Trim())
                        .Where(x => !string.IsNullOrEmpty(x))
                        .ToArray();
                    opt.AllowedExtentions = new string[] { ".png", ".jpg", ".svg" };
                });


            builder.Services.AddOptions<ImagesDirectoryBrowserOptions>()
                .Configure((opt) =>
                {
                    builder.Configuration.GetSection(ImagesDirectoryBrowserOptions.Section).Bind(opt);
                });

            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(opt =>
                {
                    opt.Events = new JwtBearerEvents
                    {
                        OnChallenge = (context) =>
                        {
                            throw new NotFoundException();
                        }
                    };
                });

            builder.Services.AddHttpContextAccessor();

            builder.Services.AddSingleton((services) =>
            {
                var options = services.GetRequiredService<IOptions<ImagesDirectoryBrowserOptions>>().Value;
                return new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), options.SourceFolder));
            });

            builder.Services.AddScoped<IDirectoriesBrowseHandler, DirectoriesBrowseHandler>();

            builder.Services.AddSingleton<IAuthorizationHandler, RestrictedDirectoriesRequirementHandler>();

            builder.Services.AddAuthorization(options => 
            {
                options.FallbackPolicy = new AuthorizationPolicyBuilder()
                    .AddRequirements(new RestrictedDirectoriesRequirement())
                    .Build();
            });

            builder.Services.AddControllers();

            var app = builder.Build();

            app.UseCustomExceptionHandler();

            app.UseDefaultFiles();

            app.UseStaticFiles();

            app.UseAuthorization();

            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = app.Services.GetRequiredService<PhysicalFileProvider>(),
                RequestPath = app.Services
                    .GetRequiredService<IOptions<ImagesDirectoryBrowserOptions>>()
                    .Value.StaticRequestPath
            });

            app.MapControllers();

            app.Run();
        }
    }
}