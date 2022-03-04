import { Request, Response } from 'express';
import { TournamentRepository } from '../repository/tournament-repository';
import {Participant, TournamentToAdd} from './api-model';
import { v4 as uuidv4 } from 'uuid';

const tournamentRepository = new TournamentRepository();

const respond = (res: Response, code: number, body: any) => {
  res.status(code)
  res.send(body)
}

export const postTournament = async (req: Request, res: Response) => {
  const tournamentToAdd: TournamentToAdd = req.body;

  if (!tournamentToAdd.name) {
    respond(res, 400, {error: 'Le champ nom est manquant ou vide.'})
  }
  if (await tournamentRepository.doesTournamentAlreadyExists(tournamentToAdd.name)) {
    respond(res, 400, {error: 'Le nom est déjà pris.'})
  }

  const tournament = { id: uuidv4(), name: tournamentToAdd.name, phases: [], participants: [] };
  await tournamentRepository.saveTournament(tournament);
  respond(res, 201, {id: tournament.id})
};

export const getTournament = async (req: Request, res: Response) => {
  const id:string = req.params['id'];

  const tournament = await tournamentRepository.getTournament(id);
  if (tournament === undefined) {
    respond(res, 404, {error: "Ce tournoi n'existe pas"})
  }

  respond(res, 200, tournament)
};

export const postParticipant = async (req: Request, res: Response) => {
  const id:string = req.params['id'];
  const participant:Participant = {id: uuidv4(), ...req.body};

  if(!participant.name){
    respond(res, 400, {error: "Le nom ne peut pas être vide"})
  }

  if(!participant.elo || !Number.isInteger(participant.elo)){
    respond(res, 400, {error: "elo doit être un nombre entier"})
  }

  const tournament = await tournamentRepository.getTournament(id);
  if (tournament === undefined){
    respond(res, 404, {error: "Le tournoi n'existe pas"})
  }

  const participantAlreadyExists = tournament.participants.some(p => p.name == participant.name)

  if(participantAlreadyExists){
    respond(res, 400, {error: "Le participant existe déjà"})
  }

  const participants:Participant[] = tournament.participants
  participants.push(participant)

  await tournamentRepository.saveTournament(tournament);

  respond(res, 201, {id: participant.id})
};

export const getParticipant = async (req: Request, res: Response) => {
  const id:string = req.params['id'];

  const tournament = await tournamentRepository.getTournament(id);
  if (tournament === undefined) {
    respond(res, 404, {error: "Le tournoi n'existe pas"})
  }

  respond(res, 200, tournament.participants)
};


