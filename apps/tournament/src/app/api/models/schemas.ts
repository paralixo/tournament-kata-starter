import { Schema, Model, model } from 'mongoose';
import {IParticipant, IPhase, ITournament} from "./interfaces";

export const phasesSchema = new Schema<IPhase>({
  type: { type: String, required: true}
});

export const participantSchema = new Schema<IParticipant>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  elo: { type: Number, required: true }
});

// On décide de garder l'id en plus de l'_id pour être compatible avec d'autres bases de données au besoin
export const tournamentSchema = new Schema<ITournament>({
  id: {type: String, required: true},
  name: {type: String, required: true},
  participants: {type: [participantSchema], required: false},
  phases: {type: [phasesSchema], required: false}
});
