using System.Net;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Tournaments.Model;
using Tournaments.Tests.Utils;
using Xunit;
using Tournament = Tournaments.Model.Tournament;

namespace Tournaments.Tests
{
    public class TournamentTests: IClassFixture<WebApplicationFactory<Startup>>
    {
        private readonly WebApplicationFactory<Startup> _factory;

        public TournamentTests(WebApplicationFactory<Startup> factory)
        {
            _factory = factory;
        }

        [Fact]
        public async Task Create_Tournament_Should_Return_Valid_Id()
        {
            var response = await TournamentUtils.CreateTournament("Unreal tournament", _factory);

            Assert.Equal(HttpStatusCode.Created, response.StatusCode);
            Assert.NotNull(response.Content?.Id);
        }

      

        [Fact]
        public async Task CreatedTournament_Should_EnableToRetrieveTournamentAfterwards()
        {
            var tournamentName = "New Tournament";

            var response = await TournamentUtils.CreateTournament(tournamentName, _factory);
            var tournamentResponse = await TournamentUtils.GetTournament(response.Content.Id, _factory);

            Assert.Equal(HttpStatusCode.OK, tournamentResponse.StatusCode);
            Assert.NotNull(tournamentResponse.Content);

            var tournament = tournamentResponse.Content;
            Assert.NotNull(tournament.Id);
            Assert.Equal(tournamentName, tournament.Name);
        }
    }
}