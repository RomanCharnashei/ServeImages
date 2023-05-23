using Microsoft.Extensions.FileProviders;

namespace ServeImages.Extentions
{
    public class ImagesDirectoryBrowserOptions
    {
        public const string Section = "ImagesConfig";
        public PathString RequestPath { get; set; }
        public string SourceFolder { get; set; } = null!;
    }
}
