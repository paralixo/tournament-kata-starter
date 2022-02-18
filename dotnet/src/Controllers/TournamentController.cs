using Microsoft.AspNetCore.Mvc;
using Tournaments.Model;
using Tournaments.Services;

namespace Tournaments.Controllers
{
    [ApiController]
    [Route("api/[controller]s")]
    public class TournamentController: ControllerBase
    {
        private readonly TournamentRepository _tournamentRepository;

        public TournamentController(TournamentRepository tournamentRepository)
        {
            _tournamentRepository = tournamentRepository;
        }

        [HttpPost]
        public IActionResult CreateTournament([FromBody] TournamentToCreate tournament)
        {
            var id = _tournamentRepository.CreateTournament(tournament);
            return CreatedAtAction(nameof(GetTournamentById), new { id }, new CreatedResponse(id));
        }

        [HttpGet("{id}")]
        public Tournament GetTournamentById(string id)
        {
            return _tournamentRepository.GetTournament(id);
        }
    }
}