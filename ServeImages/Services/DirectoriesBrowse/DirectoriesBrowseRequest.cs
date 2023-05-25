namespace ServeImages.Services.DirectoriesBrowse
{
    public class DirectoriesBrowseRequest
    {
        public DirectoriesBrowseRequest(string? path, int? limit)
        {
            Path = path;
            Limit = limit;
        }

        public string? Path { get; }
        public int? Limit { get; }
    }
}
