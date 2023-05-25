namespace ServeImages.Services
{
    public class DirectoryResponse
    {
        public DirectoryResponse(string name)
        {
            Name = name ?? throw new ArgumentNullException(nameof(name));
        }

        public string Name { get; }
    }
}
