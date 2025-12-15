const gamesService = require('../../services/gamesService');
const Genre = require('../../models/genreModel');
const Platform = require('../../models/platformModel');
const Game = require('../../models/gameModel');
const mongoose = require('mongoose');


describe('GameService – creationGame', () => {

  test('crée un jeu valide', async () => {
    const genre = await Genre.create({ name: 'Action', slug: 'action' });
    const platform = await Platform.create({ name: 'PC', slug: 'pc' });

    const game = await gamesService.creationGame(
      'GameHub Test',
      'gamehub-test',
      genre._id,
      platform._id,
      jest.fn()
    );

    expect(game).toBeDefined();
    expect(game.title).toBe('GameHub Test');
    expect(game.genre.name).toBe('Action');
  });

  test('erreur si champ manquant', async () => {
    await expect(
      gamesService.creationGame(null, null, null, null)
    ).rejects.toThrow('Le champ title, slug, genre et platform est requis');
  });

  test('erreur si genre inexistant', async () => {
    const platform = await Platform.create({ name: 'PC', slug: 'pc' });

    await expect(
      gamesService.creationGame(
        'Test',
        'test',
        '64f000000000000000000000',
        platform._id
      )
    ).rejects.toThrow('Genre avec l\'ID spécifié introuvable');
  });

});


describe('GameService – getOneGameId', () => {

  test('retourne un jeu existant', async () => {
    const genre = await Genre.create({ name: 'RPG', slug: 'rpg' });
    const platform = await Platform.create({ name: 'PS5', slug: 'ps5' });

    const game = await Game.create({
      title: 'Test Game',
      slug: 'test-game',
      genre: genre._id,
      platform: platform._id
    });

    const result = await gamesService.getOneGameId(game._id);

    expect(result).toBeDefined();
    expect(result.title).toBe('Test Game');
    expect(result.genre.name).toBe('RPG');
    expect(result.platform.name).toBe('PS5');
  });

  test('lance une erreur si le jeu n’existe pas', async () => {
    const fakeId = '64f000000000000000000000';

    await expect(
      gamesService.getOneGameId(fakeId)
    ).rejects.toThrow('Jeu introuvable');
  });

});

describe('GameService – modifyGame', () => {

  test('modifie un jeu existant avec succès', async () => {
    const genre = await Genre.create({ name: 'Action', slug: 'action' });
    const newGenre = await Genre.create({ name: 'RPG', slug: 'rpg' });
    const platform = await Platform.create({ name: 'PC', slug: 'pc' });
    const newPlatform = await Platform.create({ name: 'PS5', slug: 'ps5' });

    const game = await Game.create({
      title: 'Original Game',
      slug: 'original-game',
      genre: genre._id,
      platform: platform._id
    });

    const updatedGame = await gamesService.modifyGame(
      game._id,
      'Updated Game',
      'updated-game',
      newGenre._id,
      newPlatform._id
    );

    expect(updatedGame.title).toBe('Updated Game');
    expect(updatedGame.slug).toBe('updated-game');
    expect(updatedGame.genre.name).toBe('RPG');
    expect(updatedGame.platform.name).toBe('PS5');

  });

  test('lance une erreur si le jeu n’existe pas', async () => {
    const fakeId = '64f000000000000000000000';

    await expect(
      gamesService.modifyGame(fakeId, 'Test', 'test', null, null)
    ).rejects.toThrow('Jeu introuvable');
  });

  test('lance une erreur si aucun champ fourni', async () => {
    const genre = await Genre.create({ name: 'Action', slug: 'action' });
    const platform = await Platform.create({ name: 'PC', slug: 'pc' });

    const game = await Game.create({
      title: 'Original Game',
      slug: 'original-game',
      genre: genre._id,
      platform: platform._id
    });

    await expect(
      gamesService.modifyGame(game._id)
    ).rejects.toThrow('Le champ title, slug, genre ou platform est requis');
  });

});


describe('GameService – deleteGame', () => {

  test('supprime un jeu existant', async () => {
    const genre = await Genre.create({ name: 'Action', slug: 'action' });
    const platform = await Platform.create({ name: 'PC', slug: 'pc' });

    const game = await gamesService.creationGame(
      'Delete Test',
      'delete-test',
      genre._id,
      platform._id
    );

    await expect(gamesService.deleteGameById(game._id)).resolves.not.toThrow();

    const found = await Game.findById(game._id);
    expect(found).toBeNull();
  });

  test('erreur si le jeu n’existe pas', async () => {
    const fakeId = '64f000000000000000000000';
    await expect(gamesService.deleteGameById(fakeId)).rejects.toThrow('Jeu introuvable');
  });

});

describe('GameService – getOneGameId', () => {

  test('récupère un jeu existant', async () => {
    const genre = await Genre.create({ name: 'Action', slug: 'action' });
    const platform = await Platform.create({ name: 'PC', slug: 'pc' });

    const game = await Game.create({
      title: 'Test Game',
      slug: 'test-game',
      genre: genre._id,
      platform: platform._id
    });

    const foundGame = await gamesService.getOneGameId(game._id);
    expect(foundGame).toBeDefined();
    expect(foundGame.title).toBe('Test Game');
    expect(foundGame.genre.name).toBe('Action');
    expect(foundGame.platform.name).toBe('PC');
  });

  test('erreur si ID inexistant', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    await expect(gamesService.getOneGameId(fakeId))
      .rejects
      .toThrow('Jeu introuvable');
  });

  test('erreur si ID invalide', async () => {
    await expect(gamesService.getOneGameId('invalid-id'))
      .rejects
      .toThrow();
  });

});
