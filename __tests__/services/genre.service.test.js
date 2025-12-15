const genresService = require('../../services/genresService');
const Genre = require('../../models/genreModel');
const Game = require('../../models/gameModel');
const mongoose = require('mongoose');

describe('GenreService', () => {

  beforeEach(async () => {
    await Genre.deleteMany({});
    await Game.deleteMany({});
  });

  describe('creationGenre', () => {
    test('crée un genre valide', async () => {
      const genre = await genresService.creationGenre('Action', 'action', jest.fn());
      expect(genre).toBeDefined();
      expect(genre.name).toBe('Action');
      expect(genre.slug).toBe('action');
    });

    test('erreur si champs manquants', async () => {
      const next = jest.fn();
      await genresService.creationGenre(null, null, next);
      expect(next).toHaveBeenCalled();
      const err = next.mock.calls[0][0];
      expect(err.message).toBe('Le champ name et slug est requis');
    });
  });

  describe('getOneGenreId', () => {
    test('récupère un genre existant', async () => {
      const genre = await Genre.create({ name: 'RPG', slug: 'rpg' });
      const found = await genresService.getOneGenreId(genre._id, jest.fn());
      expect(found).toBeDefined();
      expect(found.name).toBe('RPG');
    });

    test('erreur si genre inexistant', async () => {
      const next = jest.fn();
      await genresService.getOneGenreId(new mongoose.Types.ObjectId(), next);
      expect(next).toHaveBeenCalled();
      const err = next.mock.calls[0][0];
      expect(err.message).toBe('Genre introuvable');
    });
  });

  describe('modifyGenre', () => {
    test('modifie un genre existant', async () => {
      const genre = await Genre.create({ name: 'Old', slug: 'old' });
      const updated = await genresService.modifyGenre(genre._id, { name: 'New', slug: 'new' });
      expect(updated.name).toBe('New');
      expect(updated.slug).toBe('new');
    });

    test('erreur si nom déjà utilisé', async () => {
      const genre1 = await Genre.create({ name: 'Genre1', slug: 'genre1' });
      const genre2 = await Genre.create({ name: 'Genre2', slug: 'genre2' });
      await expect(genresService.modifyGenre(genre2._id, { name: 'Genre1' }))
        .rejects
        .toThrow('Nom déjà utilisé');
    });
  });

  describe('deleteGenreById', () => {
    test('supprime un genre sans jeux associés', async () => {
      const genre = await Genre.create({ name: 'ToDelete', slug: 'todelete' });
      await genresService.deleteGenreById(genre._id);
      const found = await Genre.findById(genre._id);
      expect(found).toBeNull();
    });

    test('erreur si genre a des jeux', async () => {
      const genre = await Genre.create({ name: 'Used', slug: 'used' });
      await Game.create({ title: 'Game', slug: 'game', genre: genre._id });
      await expect(genresService.deleteGenreById(genre._id))
        .rejects
        .toThrow('Impossible de supprimer un genre ayant des jeux associés');
    });
  });

  describe('countGenres', () => {
    test('compte les genres', async () => {
      await Genre.create({ name: 'A', slug: 'a' });
      await Genre.create({ name: 'B', slug: 'b' });
      const count = await genresService.countGenres();
      expect(count).toBe(2);
    });
  });
});
