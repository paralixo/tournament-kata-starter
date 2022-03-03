import { Request, Response } from 'express';
import { TournamentRepository } from '../repository/tournament-repository';
import {Participant, TournamentToAdd} from './api-model';
import { v4 as uuidv4 } from 'uuid';

const tournamentRepository = new TournamentRepository();

export const postTournament = (req: Request, res: Response) => {
  const tournamentToAdd: TournamentToAdd = req.body;

  if (!tournamentToAdd.name || tournamentToAdd.name == '') {
    respond(res, 400, {error: 'Le champ nom est manquant ou vide.'})
  }
  if (tournamentRepository.getTournamentByName(tournamentToAdd.name)) {
    respond(res, 400, {error: 'Le nom est déjà pris.'})
  }

  const tournament = { id: uuidv4(), name: tournamentToAdd.name, phases: [], participants: [] };
  tournamentRepository.saveTournament(tournament);
  respond(res, 201, {id: tournament.id})
};

export const getTournament = (req: Request, res: Response) => {
  const id = req.params['id'];

  const tournament = tournamentRepository.getTournament(id);
  if (tournament == null) {
    respond(res, 404, {error: "Ce tournoi n'existe pas"})
  }

  respond(res, 200, tournament)
};

export const postParticipant = (req: Request, res: Response) => {
  const id = req.params['id'];
  const participant:Participant = {id: uuidv4(), ...req.body};

  if(!participant.name || participant.name == ''){
    respond(res, 400, {error: "Le nom ne peut pas être vide"})
  }

  if(!participant.elo || !Number.isInteger(participant.elo)){
    respond(res, 400, {error: "elo doit être un nombre entier"})
  }

  const tournament = tournamentRepository.getTournament(id);
  if (tournament == null){
    respond(res, 404, {error: "Le tournoi n'existe pas"})
  }

  const participantAlreadyExists = tournament.participants.find(p => p.name == participant.name) != undefined

  if(participantAlreadyExists){
    respond(res, 400, {error: "Le participant existe déjà"})
  }

  const participants:Participant[] = tournament.participants
  participants.push(participant)

  tournamentRepository.saveTournament(tournament);

  respond(res, 201, {id: participant.id})
};

export const getParticipant = (req: Request, res: Response) => {
  const id = req.params['id'];

  const tournament = tournamentRepository.getTournament(id);
  if (tournament == null) {
    respond(res, 404, {error: "Le tournoi n'existe pas"})
  }

  respond(res, 200, tournament.participants)
};

const respond = (res: Response, code: number, body: any) => {
  res.status(code)
  res.send(body)
}
