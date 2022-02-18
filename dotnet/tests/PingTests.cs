using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace Tournaments.Tests
{
    public class PingTests: IClassFixture<WebApplicationFactory<Startup>>
    {
        private readonly WebApplicationFactory<Startup> _factory;

        public PingTests(WebApplicationFactory<Startup> factory)
        {
            _factory = factory;
        }

        [Fact]
        public async Task Ping_Should_Return_200_OK()
        {
            var client = _factory.CreateClient();
            var response = await client.GetAsync("/api/ping");

            response.EnsureSuccessStatusCode();
        }
    }
}