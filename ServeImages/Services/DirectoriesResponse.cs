namespace ServeImages.Services
{
    public class DirectoriesResponse
    {
        public DirectoriesResponse(IEnumerable<DirectoryResponse> directories, IEnumerable<FileResponse> files)
        {
            Directories = directories ?? throw new ArgumentNullException(nameof(directories));
            Files = files ?? throw new ArgumentNullException(nameof(files));
        }

        public IEnumerable<DirectoryResponse> Directories { get; }
        public IEnumerable<FileResponse> Files { get; }
    }
}
