import { Tournament } from '../api/api-model';

export class TournamentRepository {
  private tournaments = new Map<string, Tournament>();

  public saveTournament(tournament: Tournament): void {
    this.tournaments.set(tournament.id, tournament);
  }

  public getTournament(tournamentId: string): Tournament {
    return this.tournaments.get(tournamentId);
  }

  public getTournamentByName(name: string): Tournament {
    const tournament: Tournament = [...this.tournaments.values()].find((item: Tournament) => item.name === name);
    return tournament;
  }
}
