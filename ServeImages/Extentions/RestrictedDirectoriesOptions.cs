namespace ServeImages.Extentions
{
    public class RestrictedDirectoriesOptions
    {
        public string[] Directories { get; set; } = null!;
        public string[] AllowedExtentions { get; set;} = null!;
    }
}
