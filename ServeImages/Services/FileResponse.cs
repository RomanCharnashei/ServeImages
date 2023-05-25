namespace ServeImages.Services
{
    public class FileResponse
    {
        public FileResponse(string name, long length, string extension)
        {
            Name = name ?? throw new ArgumentNullException(nameof(name));
            Length = length;
            Extension = extension ?? throw new ArgumentNullException(nameof(extension));
        }

        public string Name { get; }
        public long Length { get; }
        public string Extension { get; }
    }
}
