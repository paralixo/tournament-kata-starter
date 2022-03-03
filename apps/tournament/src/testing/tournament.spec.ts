import { app } from '../app';
import * as request from 'supertest';
import { Tournament } from '../app/api/api-model';

const exampleTournament = {
  name: 'Unreal',
} as Tournament;

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
});
