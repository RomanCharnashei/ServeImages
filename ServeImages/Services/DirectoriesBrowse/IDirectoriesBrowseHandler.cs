namespace ServeImages.Services.DirectoriesBrowse
{
    //perhaps for testing purposes
    public interface IDirectoriesBrowseHandler
    {
        DirectoriesResponse Handle(DirectoriesBrowseRequest request);
    }
}
