const express = require('express');
const router = express.Router();
router.use(express.json());
const validate = require('../middlewares/validate');
const {platformCreateSchema, platformUpdateSchema} = require('../validations/platformSchema');
const platformsController = require('../controllers/platformsController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Platform
 *   description: Gestion des informations des plateformes
 */

/**
 * @swagger
 * /api/platforms:
 *   post:
 *     summary: Crée un nouvelle plateforme (admin)
 *     tags: [Platform]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - slug
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nom de la plateforme
 *                 example: "PC"
 *               slug:
 *                 type: string
 *                 description: Slug de la plateforme
 *                 example: "pc"
 *     responses:
 *       201:
 *         description: Plateforme créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 auteur:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 690c84eb82bfae77c38ae17c
 *                     name:
 *                       type: string
 *                       example: "PC"
 *                     slug:
 *                       type: string
 *                       example: "pc"
 *                 message:
 *                   type: string
 *                   example: "Plateforme créé avec succès"
 *                 code:
 *                   type: integer
 *                   example: 201
 *       400:
 *         description: Données invalides ou manquantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error"
 *                 message:
 *                   type: string
 *                   example: "Le champ name et slug est requis"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-05T12:34:56.789Z"
 *                 path:
 *                   type: string
 *                   example: "/api/platforms/"
 *       401:
 *         description: Vous devez être connecté pour accéder à cette ressource
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error"
 *                 message:
 *                   type: string
 *                   example: "Vous devez être connecté pour accéder à cette ressource"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-05T12:34:56.789Z"
 *                 path:
 *                  type: string
 *                  example: "/api/platforms/"
 *       403:
 *         description: Accès refusé. Rôle insuffisant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error"
 *                 message:
 *                   type: string
 *                   example: "Accès refusé. Rôle insuffisant"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-05T12:34:56.789Z"
 *                 path:
 *                  type: string
 *                  example: "/api/platforms/"
 */
router.post('', authMiddleware.authorizeRoles(['admin']), validate(platformCreateSchema), platformsController.createPlatform);

/**
 * @swagger
 * /api/platforms:
 *   get:
 *     summary: Récupère les plateformes de jeux
 *     tags: [Platform]
 *     responses:
 *       200:
 *         description: Liste des plateformes récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 authors:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 690c6b590c78dc05ac975035
 *                     name:
 *                       type: string
 *                       example: "PC"
 *                     slug:
 *                       type: string
 *                       example: "pc"
 *                 message:
 *                   type: string
 *                   example: "Liste des plateformes récupérées avec succès"
 *                 code:
 *                   type: integer
 *                   example: 200
 *       401:
 *         description: Vous devez être connecté pour accéder à cette ressource
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error"
 *                 message:
 *                   type: string
 *                   example: "Vous devez être connecté pour accéder à cette ressource"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-05T12:34:56.789Z"
 *                 path:
 *                  type: string
 *                  example: "/api/platforms/"    
 * 
 */
router.get('', authMiddleware.authorizeRoles(['admin', 'player']), platformsController.getAllPlatforms);

/**
 * @swagger
 * /api/platforms/{id}:
 *   get:
 *     summary: Récupère une plateforme par son identifiant
 *     tags: [Platform]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant du joueur à récupérer
 *     responses:
 *       200:
 *         description: Platforme récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 player:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 6909cb645d25fcfd3c0cadd5
 *                     name:
 *                       type: string
 *                       example: "PC"
 *                     slug:
 *                       type: string
 *                       example: "pc"
 *                 message:
 *                   type: string
 *                   example: "Plateforme récupéré avec succès"
 *                 code:
 *                   type: integer
 *                   example: 200
 *       401:
 *         description: Vous devez être connecté pour accéder à cette ressource
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error"
 *                 message:
 *                   type: string
 *                   example: "Vous devez être connecté pour accéder à cette ressource"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-05T12:34:56.789Z"
 *                 path:
 *                  type: string
 *                  example: "/api/platforms/690c8142e30a79d9b01033df"
 *       404:
 *         description: Platforme introuvable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error"
 *                 message:
 *                   type: string
 *                   example: "Platforme introuvable"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-05T12:34:56.789Z"
 *                 path:
 *                   type: string
 *                   example: "/api/platforms/690c8142e30a79d9b01033df"
 */
router.get('/:id', authMiddleware.authorizeRoles(['admin', 'player']), platformsController.getPlatformById);

/**
 * @swagger
 * /platforms/{id}:
 *   put:
 *     summary: Permet de modifer les informations d'une platforme (admin)
 *     tags: [Platform]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - slug
 *             properties:
 *               name:
 *                 type: string
 *                 description: nom de la platforme
 *                 example: "PC"
 *               slug:
 *                 type: string
 *                 description: slug de la platforme
 *                 example: "pc"
 *     responses:
 *       200:
 *         description: Plateforme mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Plateforme mis à jour avec succès"
 *                 code:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Nom de plateforme déjà utilisé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error"
 *                 message:
 *                   type: string
 *                   example: "Nom de plateforme déjà utilisé"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-05T12:34:56.789Z"
 *                 path:
 *                  type: string
 *                  example: "platforms/{id}"
 *       401:
 *         description: Vous devez être connecté pour accéder à cette ressource
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error"
 *                 message:
 *                   type: string
 *                   example: "Vous devez être connecté pour accéder à cette ressource"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-05T12:34:56.789Z"
 *                 path:
 *                  type: string
 *                  example: "/api/platforms/"
 *       404:
 *         description: Plateforme introuvable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error"
 *                 message:
 *                   type: string
 *                   example: "Platforme introuvable"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-05T12:34:56.789Z"
 *                 path:
 *                  type: string
 *                  example: "platforms/{id}"
 * 
 */
router.put('/:id', authMiddleware.authorizeRoles(['admin']), validate(platformUpdateSchema), platformsController.updatePlatform);

/**
 * @swagger
 * /platforms/{id}:
 *   delete:
 *     summary: Supprime une plateforme par son identifiant
 *     tags: [Platform]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant de la plateforme à supprimer
 *     responses:
 *       200:
 *         description: Plateforme supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Plateforme supprimé avec succès"
 *                 code:
 *                   type: integer
 *                   example: 200
 *       404:
 *         description: Plateforme introuvable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error"
 *                 message:
 *                   type: string
 *                   example: "Plateforme introuvable"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-05T12:34:56.789Z"
 *                 path:
 *                  type: string
 *                  example: "/api/platforms/6909cb645d25fcfd3c0cadd5"
 *       401:
 *         description: Vous devez être connecté pour accéder à cette ressource
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error"
 *                 message:
 *                   type: string
 *                   example: "Vous devez être connecté pour accéder à cette ressource"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-05T12:34:56.789Z"
 *                 path:
 *                  type: string
 *                  example: "/api/platforms/6909cb645d25fcfd3c0cadd5"
 *       403:
 *         description: Accès refusé. Vous ne pouvez modifier que votre propre compte
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error"
 *                 message:
 *                   type: string
 *                   example: "Accès refusé. Vous ne pouvez modifier que votre propre compte"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-05T12:34:56.789Z"
 *                 path:
 *                  type: string
 *                  example: "/platforms/6909cb645d25fcfd3c0cadd5"
 */
router.delete('/:id', authMiddleware.authorizeRoles(['admin']), platformsController.deletePlatform);

module.exports = router;