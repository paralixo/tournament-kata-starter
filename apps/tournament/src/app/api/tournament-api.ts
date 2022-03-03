import { Request, Response } from 'express';
import { TournamentRepository } from '../repository/tournament-repository';
import {Participant, TournamentToAdd} from './api-model';
import { v4 as uuidv4 } from 'uuid';

const tournamentRepository = new TournamentRepository();

export const postTournament = (req: Request, res: Response) => {
  const tournamentToAdd: TournamentToAdd = req.body;

  if (!tournamentToAdd.name || tournamentToAdd.name == '') {
    res.status(400);
    res.send({error: 'Le champ nom est manquant ou vide.'})
  }
  if (tournamentRepository.getTournamentByName(tournamentToAdd.name)) {
    res.status(400);
    res.send({error: 'Le nom est déjà pris.'})
  }

  const tournament = { id: uuidv4(), name: tournamentToAdd.name, phases: [], participants: [] };
  tournamentRepository.saveTournament(tournament);

  res.status(201);
  res.send({ id: tournament.id });
};

export const getTournament = (req: Request, res: Response) => {
  const id = req.params['id'];

  const tournament = tournamentRepository.getTournament(id);
  if (tournament == null) {
    res.status(404);
    res.send({error: "Ce tournoi n'existe pas"})
  }

  res.status(200);
  res.send(tournament);
};

export const postParticipant = (req: Request, res: Response) => {
  const id = req.params['id'];
  const participant:Participant = {id: uuidv4(), ...req.body};

  if(!participant.name || participant.name == ''){
    res.status(400)
    res.send({error: "Le nom ne peut pas être vide"})
  }

  if(!participant.elo || !Number.isInteger(participant.elo)){
   res.status(400)
   res.send({error: "elo doit être un nombre entier"})
  }

  const tournament = tournamentRepository.getTournament(id);
  if (tournament == null){
    res.status(404)
    res.send({error: "Le tournoi n'existe pas"})
  }

  const participantAlreadyExists = tournament.participants.find(p => p.name == participant.name) != undefined

  if(participantAlreadyExists){
    res.status(400)
    res.send({error: "Le participant existe déjà"})
  }

  const participants:Participant[] = tournament.participants
  participants.push(participant)

  tournamentRepository.saveTournament(tournament);

  res.status(201);
  res.send({ id: participant.id });
};

export const getParticipant = (req: Request, res: Response) => {
  const id = req.params['id'];

  const tournament = tournamentRepository.getTournament(id);
  if (tournament == null) {
    res.status(404)
    res.send({error: "Le tournoi n'existe pas"})
  }

  res.status(200);
  res.send(tournament.participants)
};
