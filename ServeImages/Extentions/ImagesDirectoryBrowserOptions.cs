using Microsoft.Extensions.FileProviders;

namespace ServeImages.Extentions
{
    public class ImagesDirectoryBrowserOptions
    {
        public const string Section = "ImagesConfig";
        public PathString ApiRequestPath { get; set; }
        public PathString StaticRequestPath { get; set; }
        public string SourceFolder { get; set; } = null!;
    }
}
