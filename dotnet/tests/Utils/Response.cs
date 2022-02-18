using System.Net;

namespace Tournaments.Tests.Utils
{
    public class Response<T>
    {
        public T Content { get; }
        public HttpStatusCode StatusCode { get; }

        public Response(HttpStatusCode statusCode, T content)
        {
            StatusCode = statusCode;
            Content = content;
        }
    }
}