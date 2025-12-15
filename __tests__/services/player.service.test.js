const mongoose = require('mongoose');
const Player = require('../../models/playerModel');
const playerService = require('../../services/playersServices');

describe('Player Service', () => {

  test('countPlayers retourne le nombre correct', async () => {
    await Player.create({ username: 'User1', email: 'user1@test.com', password: 'pwd123', role: 'player' });
    await Player.create({ username: 'User2', email: 'user2@test.com', password: 'pwd123', role: 'player' });

    const count = await playerService.countPlayers();
    expect(count).toBe(2);
  });

  test('getSortPlayers retourne tous les joueurs triés', async () => {
    await Player.create({ username: 'B', email: 'b@test.com', password: 'pwd123', role: 'player' });
    await Player.create({ username: 'A', email: 'a@test.com', password: 'pwd123', role: 'player' });

    const result = await playerService.getSortPlayers('username', 1, 10);
    expect(result.players.length).toBe(2);
    expect(result.players[0].username).toBe('A');
  });

  test('getOnePlayerId retourne un joueur existant', async () => {
    const player = await Player.create({ username: 'Test', email: 'test@test.com', password: 'pwd123', role: 'player' });
    const found = await playerService.getOnePlayerId(player._id);
    expect(found.username).toBe('Test');
  });

  test('getOnePlayerId lance une erreur si joueur introuvable', async () => {
    await expect(playerService.getOnePlayerId(new mongoose.Types.ObjectId()))
      .rejects.toThrow('Player introuvable');
  });

  test('modifyPlayer modifie un joueur existant', async () => {
    const player = await Player.create({ username: 'Old', email: 'old@test.com', password: 'pwd123', role: 'player' });
    const updated = await playerService.modifyPlayer(player._id, { username: 'New', email: 'new@test.com', role: 'admin' });

    expect(updated.username).toBe('New');
    expect(updated.email).toBe('new@test.com');
    expect(updated.role).toBe('admin');
  });

  test('modifyPlayer lance une erreur si email déjà utilisé', async () => {
    const player1 = await Player.create({ username: 'User1', email: 'user1@test.com', password: 'pwd123', role: 'player' });
    const player2 = await Player.create({ username: 'User2', email: 'user2@test.com', password: 'pwd123', role: 'player' });

    await expect(playerService.modifyPlayer(player2._id, { email: 'user1@test.com' }))
      .rejects.toThrow('Email déjà utilisé');
  });

  test('modifyPlayer lance une erreur si username déjà utilisé', async () => {
    const player1 = await Player.create({ username: 'User1', email: 'user1@test.com', password: 'pwd123', role: 'player' });
    const player2 = await Player.create({ username: 'User2', email: 'user2@test.com', password: 'pwd123', role: 'player' });

    await expect(playerService.modifyPlayer(player2._id, { username: 'User1' }))
      .rejects.toThrow('Username déjà utilisé');
  });

  test('deletePlayerById supprime un joueur', async () => {
    const player = await Player.create({ username: 'ToDelete', email: 'delete@test.com', password: 'pwd123', role: 'player' });

    await playerService.deletePlayerById(player._id);
    const found = await Player.findById(player._id);
    expect(found).toBeNull();
  });

  test('deletePlayerById lance une erreur si joueur introuvable', async () => {
    await expect(playerService.deletePlayerById(new mongoose.Types.ObjectId()))
      .rejects.toThrow('Player introuvable');
  });

  test('getInfoPlayerByToken retourne le joueur', async () => {
    const player = await Player.create({ username: 'TokenUser', email: 'token@test.com', password: 'pwd123', role: 'player' });
    const info = await playerService.getInfoPlayerByToken(player._id);
    expect(info.email).toBe('token@test.com');
    expect(info.username).toBe('TokenUser');
  });

  test('getInfoPlayerByToken lance une erreur si joueur introuvable', async () => {
    await expect(playerService.getInfoPlayerByToken(new mongoose.Types.ObjectId()))
      .rejects.toThrow('Player introuvable');
  });

});
