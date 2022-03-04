export enum TournamentPhaseType {
  SingleBracketElimination = 'SingleBracketElimination',
  SwissRound = 'SwissRound',
}

export interface TournamentPhase {
  type: TournamentPhaseType;
}

export interface Participant extends ParticipantToAdd {
  id: string;
}

export interface ParticipantToAdd {
  name: string;
  elo: number;
}

export interface TournamentToAdd {
  name: string;
}

export interface Tournament extends TournamentToAdd {
  id: string;

  phases: TournamentPhase[];
  participants: Participant[];
}

export interface Round {
  name: string;
  matches: Match[];
}

export interface Match {
  participant1: Participant;
  participant2: Participant;
}
