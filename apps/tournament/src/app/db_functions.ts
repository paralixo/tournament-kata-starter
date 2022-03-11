import * as mongoose from 'mongoose';
import {IParticipant, ITournament} from "./api/models/interfaces";
import {Participant, Tournament} from './api/models/models'

(async function createParticipant(id, name, elo) {

  const participant: IParticipant = await Participant.create({
    id: id,
    name: name,
    elo: elo
  });

  console.log('Utilisateur créé.');
})();


(async function createTournament(id, name) {

  const tournament: ITournament = await Tournament.create({
    id: id,
    name: name,
    participants: [],
    phases: []
  });

  console.log('Tournois créé.');
})();
