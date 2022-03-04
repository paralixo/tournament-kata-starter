import {model} from "mongoose";
import {IParticipant, IPhase, ITournament} from "./interfaces";
import {participantSchema, phasesSchema, tournamentSchema} from "./schemas";

export const Participant = model<IParticipant>('Participant', participantSchema);
// export const Phase = model<IPhase>('Phase', phasesSchema);
export const Tournament = model<ITournament>('Tournament', tournamentSchema);
