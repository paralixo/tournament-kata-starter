import {Tournament} from "../api/models/models";
import {ITournament} from "../api/models/interfaces";
import { v4 as uuidv4 } from 'uuid';

export class TournamentRepository {

  public async saveTournament(tournament: ITournament): Promise<void> {
    const newtournament = new Tournament()
    newtournament.id = uuidv4()
    newtournament.name = tournament.name
    newtournament.participants = []
    newtournament.phases = []
    await newtournament.save()
  }

  public async getTournament(tournamentId: string): Promise<ITournament>{
    return await Tournament.findOne({id: tournamentId}).exec()
  }

  public async doesTournamentAlreadyExists(name: string): Promise<boolean> {
    const tournaments = await Tournament.find({})
    return tournaments.some((item: ITournament) => item.name === name);
  }
}
