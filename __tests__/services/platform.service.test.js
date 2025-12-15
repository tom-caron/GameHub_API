const mongoose = require('mongoose');
const Platform = require('../../models/platformModel');
const Game = require('../../models/gameModel');
const platformsService = require('../../services/platformsService');

describe('PlatformService', () => {

  test('crée une plateforme avec succès', async () => {
    const platform = await platformsService.creationPlatform('PC', 'pc');
    expect(platform.name).toBe('PC');
    expect(platform.slug).toBe('pc');
  });

  test('erreur si name ou slug manquant', async () => {
    await expect(platformsService.creationPlatform(null, 'pc'))
      .rejects.toThrow('Le champ name et slug est requis');
  });

  test('modifie une plateforme existante', async () => {
    const platform = await Platform.create({ name: 'Console', slug: 'console' });
    const updated = await platformsService.modifyPlatform(platform._id, { name: 'ConsoleX' });
    expect(updated.name).toBe('ConsoleX');
  });

  test('supprime une plateforme sans jeux associés', async () => {
    const platform = await Platform.create({ name: 'Test', slug: 'test' });
    await platformsService.deletePlatformById(platform._id);
    const found = await Platform.findById(platform._id);
    expect(found).toBeNull();
  });

  test('erreur si plateforme a des jeux associés', async () => {
    const platform = await Platform.create({ name: 'Used', slug: 'used' });
    await Game.create({ title: 'Game', slug: 'game', platform: platform._id });
    await expect(platformsService.deletePlatformById(platform._id))
      .rejects.toThrow('Impossible de supprimer une plateforme ayant des jeux associés');
  });

  test('récupère une plateforme par son id', async () => {
    const platform = await Platform.create({ name: 'Switch', slug: 'switch' });
    const found = await platformsService.getOnePlatformId(platform._id);
    expect(found._id.toString()).toBe(platform._id.toString());
  });

});
