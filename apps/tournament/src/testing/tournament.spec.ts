import { app } from '../app';
import * as request from 'supertest';
import {ParticipantToAdd, Tournament} from '../app/api/api-model';
import { v4 as uuidv4 } from 'uuid';
import {initDatabaseConnection} from "../app/db";

describe('/tournament endpoint', () => {
  const apiPrefix = '/api/tournaments';

  beforeAll(() => {
    initDatabaseConnection()
  })

  describe('[POST] when creating a tournament', () => {

    it('should return the correct id', async () => {
      const tournament: Tournament = getRandomTournament()
      const { body } = await request(app).post(apiPrefix).send(tournament).expect(201);

      expect(body.id).not.toBeUndefined();
    });

    it('should have stored the tournament', async () => {
      const tournament: Tournament = getRandomTournament()
      const { body } = await request(app).post(apiPrefix).send(tournament).expect(201);

      const get = await request(app).get(`${apiPrefix}/${body.id}`).expect(200);

      expect(get.body.name).toEqual(tournament.name);
      expect(get.body.id).not.toBeUndefined();
    });

    it('should have a filled tournament name', async () => {
      const { body } = await request(app).post(apiPrefix).send({name: ''} as Tournament).expect(400);

      expect(body.error).toEqual('Le champ nom est manquant ou vide.');
      expect(body.id).toBeUndefined();
    });

    it('should have a tournament name', async () => {
      const { body } = await request(app).post(apiPrefix).send({} as Tournament).expect(400);

      expect(body.error).toEqual('Le champ nom est manquant ou vide.');
      expect(body.id).toBeUndefined();
    });

    it('should have a unique name', async () => {
      const tournament: Tournament = getRandomTournament()
      const validTournament = await request(app).post(apiPrefix).send(tournament).expect(201);

      const invalidTournament = await request(app).post(apiPrefix).send(tournament).expect(400);

      expect(invalidTournament.body.error).toEqual('Le nom est déjà pris.');
      expect(invalidTournament.body.id).toBeUndefined();
      expect(validTournament.body.id).not.toBeUndefined();
    });
  });

  describe('[GET] when getting a tournament', () => {
    it('should be an existing tournament', async () => {
      const tournament: Tournament = getRandomTournament()
      const savedTournament = await request(app).post(`${apiPrefix}`).send(tournament).expect(201);

      const fetchedTournament = await request(app).get(`${apiPrefix}/${savedTournament.body.id}`).expect(200);

      expect(fetchedTournament.body.id).toEqual(savedTournament.body.id)
      expect(fetchedTournament.body.name).toEqual(tournament.name)
    });

    it('should return 404 error if tournament doesn\'t exists', async () => {
      const {body} = await request(app).get(`${apiPrefix}/1234567890`).expect(404);

      expect(body.error).toEqual("Ce tournoi n'existe pas")
    });
  });

  describe('/id/participants endpoint', () => {
    describe('[POST] creating a participant', () => {
      it('should save participant', async () => {
        const tournamentId: string = await createTournament();

        const participant: ParticipantToAdd = {name: 'Jean', elo: 123}
        const savedParticipant = await request(app).post(`${apiPrefix}/${tournamentId}/participants`).send(participant).expect(201);

        expect(savedParticipant.body.id).not.toBeUndefined();
      });

      it('should throw an error if tournament does not exist', async () => {
        const participant: ParticipantToAdd = {name: 'Jean', elo: 123}
        const savedParticipant = await request(app).post(`${apiPrefix}/4567812/participants`).send(participant).expect(404);

        expect(savedParticipant.body.error).toEqual("Le tournoi n'existe pas");
      });

      it('should not save another participant with the same name', async () => {
        const tournamentId: string = await createTournament();

        await createParticipant(tournamentId, 'Jean', 123)

        const second_participant: ParticipantToAdd = {name: 'Jean', elo: 123}
        const saved_secondParticipant = await request(app).post(`${apiPrefix}/${tournamentId}/participants`).send(second_participant).expect(400);

        expect(saved_secondParticipant.body.error).toEqual('Le participant existe déjà');
      });

      it('should have a not empty participant name' , async () => {
        const tournamentId: string = await createTournament();

        const participant: ParticipantToAdd = {name: '', elo: 123}
        const savedParticipant = await request(app).post(`${apiPrefix}/${tournamentId}/participants`).send(participant).expect(400);

        expect(savedParticipant.body.error).toEqual('Le nom ne peut pas être vide')
      });

      it('should have a not empty participant elo' , async () => {
        const tournamentId: string = await createTournament();

        const participant: ParticipantToAdd = {name: 'Jean', elo: 12.03}
        const savedParticipant = await request(app).post(`${apiPrefix}/${tournamentId}/participants`).send(participant).expect(400);

        expect(savedParticipant.body.error).toEqual('elo doit être un nombre entier')
      });
    });

    describe('[GET] when getting a tournament', () => {
      it('should be an existing tournament', async () => {
        const fetchedTournament = await request(app).get(`${apiPrefix}/567812/participants`).expect(404);
        expect(fetchedTournament.body.error).toEqual("Le tournoi n'existe pas")
      });

      it('should return an empty participant list', async () => {
        const tournamentId: string = await createTournament();

        const participants = await request(app).get(`${apiPrefix}/${tournamentId}/participants`).expect(200);
        expect(participants.body).toEqual([])
      });

      it('should return all participants', async () => {
        const tournamentId: string = await createTournament();
        await createParticipant(tournamentId, 'Jean', 123)
        await createParticipant(tournamentId,'Flo', 3)

        const participants = await request(app).get(`${apiPrefix}/${tournamentId}/participants`).expect(200);

        expect(participants.body.length).toEqual(2)
        expect(participants.body[0].name).toEqual('Jean')
        expect(participants.body[1].name).toEqual('Flo')
      });
    });
  });

  const createTournament = async (): Promise<string> => {
    const tournament: Tournament = getRandomTournament()
    const { body } = await request(app).post(`${apiPrefix}`).send(tournament)
    return body.id;
  }

  const createParticipant = async (tournamentId: string, name: string, elo: number): Promise<string> => {
    const participant: ParticipantToAdd = {name, elo}
    const { body } = await request(app).post(`${apiPrefix}/${tournamentId}/participants`).send(participant);
    return body.id;
  }

  function getRandomTournament(): Tournament {
  return {
      name: 'Tournament-' + uuidv4()
    } as Tournament;
  }
});
