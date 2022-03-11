import {Tournament} from "../api/models/models";
import {ITournament} from "../api/models/interfaces";
import * as mongoose from "mongoose";
import {QueryOptions} from "mongoose";

export class TournamentRepository {

  public async saveTournament(tournamentName: string): Promise<ITournament> {
    const id = mongoose.Types.ObjectId()
    const newtournament = new Tournament({
      _id: id,
      id: id,
      name: tournamentName,
      participants: [],
      phases: []
    })

    return await newtournament.save();
  }

  public async updateTournament(tournamentId: string, updates): Promise<void> {
    await Tournament.updateOne({ id: tournamentId}, {$set: updates} as QueryOptions)
  }

  public async getTournament(tournamentId: string): Promise<ITournament>{
    return await Tournament.findOne({id: tournamentId}).exec()
  }

  public async doesTournamentAlreadyExists(name: string): Promise<boolean> {
    const tournaments = await Tournament.find({})
    return tournaments.some((item: ITournament) => item.name === name);
  }
}
