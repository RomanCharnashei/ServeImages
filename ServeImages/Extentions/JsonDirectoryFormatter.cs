using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.FileProviders;
using System.Text;
using System.Text.Json;

namespace ServeImages.Extentions
{
    public class JsonDirectoryFormatter : IDirectoryFormatter
    {
        private const string JsonUtf8 = "application/json; charset=utf-8";

        public Task GenerateContentAsync(HttpContext context, IEnumerable<IFileInfo> contents)
        {
            if (context == null)
            {
                throw new ArgumentNullException(nameof(context));
            }
            if (contents == null)
            {
                throw new ArgumentNullException(nameof(contents));
            }

            context.Response.ContentType = JsonUtf8;

            if (HttpMethods.IsHead(context.Request.Method))
            {
                return Task.CompletedTask;
            }

            string data = JsonSerializer.Serialize(ToJson(contents));
            byte[] bytes = Encoding.UTF8.GetBytes(data);
            context.Response.ContentLength = bytes.Length;

            return context.Response.Body.WriteAsync(bytes, 0, bytes.Length);
        }

        private object ToJson(IEnumerable<IFileInfo> contents)
        {
            return new
            {
                directories = contents.Where(x => x.IsDirectory).Select(x => new
                {
                    x.Name
                }),
                files = contents.Where(x => !x.IsDirectory).Select(x => new
                {
                    x.Name,
                    x.Length,
                    Extension = Path.GetExtension(x.PhysicalPath)
                })
            };
        }
    }
}
