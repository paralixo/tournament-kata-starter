export interface IParticipant {
  id: string,
  name: string,
  elo: number
}

export interface IPhase {
  type: string
}

export interface ITournament {
  id: string,
  name: string,
  participants: IParticipant[],
  phases: IPhase[]
}
