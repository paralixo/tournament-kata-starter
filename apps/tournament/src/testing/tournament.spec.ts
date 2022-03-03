import { app } from '../app';
import * as request from 'supertest';
import {Participant, Tournament} from '../app/api/api-model';

describe('/tournament endpoint', () => {

  function getRandomTournament(): Tournament {
    return {
      name: 'Tournament-' + Math.floor(Math.random() * 1001)
    } as Tournament;
  }

  describe('[POST] when creating a tournament', () => {

    it('should return the correct id', async () => {
      const tournament: Tournament = getRandomTournament()
      const { body } = await request(app).post('/api/tournaments').send(tournament).expect(201);

      expect(body.id).not.toBeUndefined();
    });

    it('should have stored the tournament', async () => {
      const tournament: Tournament = getRandomTournament()
      const { body } = await request(app).post('/api/tournaments').send(tournament).expect(201);

      const get = await request(app).get(`/api/tournaments/${body.id}`).expect(200);

      expect(get.body.name).toEqual(tournament.name);
      expect(get.body.id).not.toBeUndefined();
    });

    it('should have a filled tournament name', async () => {
      const { body } = await request(app).post('/api/tournaments').send({name: ''} as Tournament).expect(400);

      expect(body.error).toEqual('Le champ nom est manquant ou vide.');
      expect(body.id).toBeUndefined();
    });

    it('should have a tournament name', async () => {
      const { body } = await request(app).post('/api/tournaments').send({} as Tournament).expect(400);

      expect(body.error).toEqual('Le champ nom est manquant ou vide.');
      expect(body.id).toBeUndefined();
    });

    it('should have a unique name', async () => {
      const tournament: Tournament = getRandomTournament()
      const validTournament = await request(app).post('/api/tournaments').send(tournament).expect(201);

      const invalidTournament = await request(app).post('/api/tournaments').send(tournament).expect(400);

      expect(invalidTournament.body.error).toEqual('Le nom est déjà pris.');
      expect(invalidTournament.body.id).toBeUndefined();
      expect(validTournament.body.id).not.toBeUndefined();
    });
  });

  describe('[GET] when getting a tournament', () => {
    it('should be an existing tournament', async () => {
      const tournament: Tournament = getRandomTournament()
      const savedTournament = await request(app).post(`/api/tournaments`).send(tournament).expect(201);

      const fetchedTournament = await request(app).get(`/api/tournaments/${savedTournament.body.id}`).expect(200);

      expect(fetchedTournament.body.id).toEqual(savedTournament.body.id)
      expect(fetchedTournament.body.name).toEqual(tournament.name)
    });

    it('should return 404 error if tournament doesn\'t exists', async () => {
      const {body} = await request(app).get(`/api/tournaments/1234567890`).expect(404);

      expect(body.error).toEqual("Ce tournoi n'existe pas")
    });
  });

  describe('/id/participants endpoint', () => {
    describe('[POST] creating a participant', () => {
      it('should save participant', async () => {
        const tournament: Tournament = getRandomTournament()
        const savedTournament = await request(app).post(`/api/tournaments`).send(tournament).expect(201);

        const participant: Participant = {name: 'Jean', elo: 123}
        const savedParticipant = await request(app).post(`/api/tournaments/${savedTournament.body.id}/participants`).send(participant).expect(201);

        expect(savedParticipant.body.name).toEqual('Jean')
      });

      it('should throw an error if tournament does not exist', async () => {
        const participant: Participant = {name: 'Jean', elo: 123}
        const savedParticipant = await request(app).post(`/api/tournaments/4567812/participants`).send(participant).expect(404);

        expect(savedParticipant.body.error).toEqual("Le tournoi n'existe pas");
      });

      it('should not save another participant with the same name', async () => {
        const tournament: Tournament = getRandomTournament()
        const savedTournament = await request(app).post(`/api/tournaments`).send(tournament).expect(201);

        const participant: Participant = {name: 'Jean', elo: 123}
        const savedParticipant = await request(app).post(`/api/tournaments/${savedTournament.body.id}/participants`).send(participant).expect(201);

        const second_participant: Participant = {name: 'Jean', elo: 123}
        const saved_secondParticipant = await request(app).post(`/api/tournaments/${savedTournament.body.id}/participants`).send(second_participant).expect(400);

        expect(saved_secondParticipant.body.error).toEqual('Le participant existe déjà');
      });

      it('should have a not empty participant name' , async () => {
        const tournament: Tournament = getRandomTournament()
        const savedTournament = await request(app).post(`/api/tournaments`).send(tournament).expect(201);

        const participant: Participant = {name: '', elo: 123}
        const savedParticipant = await request(app).post(`/api/tournaments/${savedTournament.body.id}/participants`).send(participant).expect(400);

        expect(savedParticipant.body.error).toEqual('Le nom ne peut pas être vide')
      });

      it('should have a not empty participant elo' , async () => {
        const tournament: Tournament = getRandomTournament()
        const savedTournament = await request(app).post(`/api/tournaments`).send(tournament).expect(201);

        const participant: Participant = {name: 'Jean', elo: 12.03}
        const savedParticipant = await request(app).post(`/api/tournaments/${savedTournament.body.id}/participants`).send(participant).expect(400);

        expect(savedParticipant.body.error).toEqual('elo doit être un nombre entier')
      });


    });
  });
});
