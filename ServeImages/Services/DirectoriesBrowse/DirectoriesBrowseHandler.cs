using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Options;
using ServeImages.Extentions;

namespace ServeImages.Services.DirectoriesBrowse
{
    public class DirectoriesBrowseHandler : IDirectoriesBrowseHandler
    {
        private readonly RestrictedDirectoriesOptions _restrictedOptions;
        private readonly PhysicalFileProvider _fileProvider;

        public DirectoriesBrowseHandler(IOptions<RestrictedDirectoriesOptions> restrictedOptions, PhysicalFileProvider fileProvider)
        {
            _restrictedOptions = restrictedOptions.Value ?? throw new ArgumentNullException(nameof(restrictedOptions));
            _fileProvider = fileProvider ?? throw new ArgumentNullException(nameof(fileProvider));
        }

        public DirectoriesResponse Handle(DirectoriesBrowseRequest request)
        {
            var path = EnsureCorrectPath(request.Path);
            var fullContents = _fileProvider.GetDirectoryContents(path);

            // Filter forbiden directories
            var contents = fullContents.Where(x => !_restrictedOptions.Directories
                .Any(e => x.PhysicalPath!
                    .Substring(_fileProvider.Root.Length - 1)
                    .Replace(Path.DirectorySeparatorChar, '/')
                    .StartsWith(e)
                    )
                );

            // Leave only files with allowed extentions
            contents = contents.Where(x => x.IsDirectory ||
                (!x.IsDirectory && _restrictedOptions.AllowedExtentions.Contains(Path.GetExtension(x.PhysicalPath))));

            if (request.Limit.HasValue)
            {
                contents = contents.Take(request.Limit.Value);
            }

            return ToViewModel(contents);
        }

        private DirectoriesResponse ToViewModel(IEnumerable<IFileInfo> contents)
        {
            return new DirectoriesResponse(
                    contents.Where(x => x.IsDirectory).Select(x => new DirectoryResponse(x.Name)),
                    contents.Where(x => !x.IsDirectory)
                        .Select(x => new FileResponse(x.Name, x.Length, Path.GetExtension(x.PhysicalPath)!))
                );
        }

        private string EnsureCorrectPath(string? path)
        {
            if (!string.IsNullOrWhiteSpace(path))
            {
                var truncatedPath = path.Trim();

                return truncatedPath.StartsWith('/') ? path : "/" + path;
            }

            return "/";
        }
    }
}
