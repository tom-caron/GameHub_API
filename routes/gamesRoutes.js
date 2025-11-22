const express = require('express');
const router = express.Router();
router.use(express.json());
const validate = require('../middlewares/validate');
const {gameCreateSchema, gameUpdateSchema} = require('../validations/gamesSchema');
const gamesController = require('../controllers/gamesController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Game
 *   description: Gestion des informations des Jeux
 */

/**
 * @swagger
 * /api/games:
 *   post:
 *     summary: Crée un nouveau jeu (admin)
 *     tags: [Game]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - slug
 *               - genre
 *               - platform
 *             properties:
 *               title:
 *                 type: string
 *                 description: Titre du jeu
 *                 example: "Smash Bros Ultimate"
 *               slug:
 *                 type: string
 *                 description: Slug du jeu
 *                 example: "smash-bros-ultimate"
 *               genre:
 *                 type: string
 *                 description: Genre du jeu
 *                 example: "Action"
 *               platform:
 *                 type: string
 *                 description: Plateforme du jeu
 *                 example: "Nintendo Switch"
 *     responses:
 *       201:
 *         description: Jeu créé avec succès
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
 *                     title:
 *                       type: string
 *                       example: "Smash Bros Ultimate"
 *                     slug:
 *                       type: string
 *                       example: "smash-bros-ultimate"
 *                     genre:
 *                       type: string
 *                       example: "Action"
 *                     platform:
 *                       type: string
 *                       example: "Nintendo Switch"
 *                 message:
 *                   type: string
 *                   example: "Jeu créé avec succès"
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
 *                   example: "Le champ title, slug, genre et platform est requis"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-05T12:34:56.789Z"
 *                 path:
 *                   type: string
 *                   example: "/api/games/"
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
 *                  example: "/api/games/"
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
 *                  example: "/api/games/"
 *       409:
 *         description: Conflit lors de la création du jeu (titre ou slug déjà utilisé, genre ou plateforme introuvable)
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
 *                   example: "Plateforme avec l'ID spécifié introuvable"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-05T12:34:56.789Z"
 *                 path:
 *                  type: string
 *                  example: "/api/games/"   
 */
router.post('', authMiddleware.authorizeRoles(['admin']), validate(gameCreateSchema), gamesController.createGame);

/**
 * @swagger
 * /api/games:
 *   get:
 *     summary: Récupère tous les jeux
 *     tags: [Game]
 *     responses:
 *       200:
 *         description: Liste des jeux récupérée avec succès
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
 *                     title:
 *                       type: string
 *                       example: "Smash Bros Ultimate"
 *                     slug:
 *                       type: string
 *                       example: "smash-bros-ultimate"
 *                     genre:
 *                       type: string
 *                       example: "Action"
 *                     platform:
 *                       type: string
 *                       example: "Nintendo Switch"
 *                 message:
 *                   type: string
 *                   example: "Liste des jeux récupérées avec succès"
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
 *                  example: "/api/games/"       
 * 
 */
router.get('', authMiddleware.authorizeRoles(['admin', 'player']), gamesController.getAllGames);

/**
 * @swagger
 * /api/games/{id}:
 *   get:
 *     summary: Récupère un jeu par son identifiant
 *     tags: [Game]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant du jeu à récupérer
 *     responses:
 *       200:
 *         description: Jeu récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 geme:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 690c6b590c78dc05ac975035
 *                     title:
 *                       type: string
 *                       example: "Smash Bros Ultimate"
 *                     slug:
 *                       type: string
 *                       example: "smash-bros-ultimate"
 *                     genre:
 *                       type: string
 *                       example: "Action"
 *                     platform:
 *                       type: string
 *                       example: "Nintendo Switch"
 *                 message:
 *                   type: string
 *                   example: "Jeu récupéré avec succès"
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
 *                  example: "/api/games/690c8142e30a79d9b01033df"
 *       404:
 *         description: Jeu introuvable
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
 *                   example: "Jeu introuvable"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-05T12:34:56.789Z"
 *                 path:
 *                   type: string
 *                   example: "/api/games/690c8142e30a79d9b01033df"
 */
router.get('/:id', authMiddleware.authorizeRoles(['admin', 'player']), gamesController.getGameById);

/**
 * @swagger
 * /api/games/{id}:
 *   put:
 *     summary: Permet de modifer les informations d'un jeu (admin)
 *     tags: [Game]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - slug
 *               - genre
 *               - platform
 *             properties:
 *               title:
 *                 type: string
 *                 description: Titre du jeu
 *                 example: "Smash Bros Ultimate"
 *               slug:
 *                 type: string
 *                 description: Slug du jeu
 *                 example: "smash-bros-ultimate"
 *               genre:
 *                 type: string
 *                 description: Genre du jeu
 *                 example: "Action"
 *               platform:
 *                 type: string
 *                 description: Plateforme du jeu
 *                 example: "Nintendo Switch"
 *     responses:
 *       200:
 *         description: Jeu mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Jeu mis à jour avec succès"
 *                 code:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Titre déjà utilisé ou slug déjà utilisé
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
 *                   example: "Titre déjà utilisé"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-05T12:34:56.789Z"
 *                 path:
 *                  type: string
 *                  example: "auth/{id}"
 *       404:
 *         description: Jeu introuvable
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
 *                   example: "Jeu introuvable"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-05T12:34:56.789Z"
 *                 path:
 *                  type: string
 *                  example: "api/games/{id}"
 * 
 */
router.put('/:id', authMiddleware.requireSelfOrAdmin, validate(gameUpdateSchema), gamesController.updateGame);

/**
 * @swagger
 * /api/games/{id}:
 *   delete:
 *     summary: Supprime un jeu par son identifiant
 *     tags: [Game]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant du jeu à supprimer
 *     responses:
 *       200:
 *         description: Jeu supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Jeu supprimé avec succès"
 *                 code:
 *                   type: integer
 *                   example: 200
 *       404:
 *         description: Jeu introuvable
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
 *                   example: "Jeu introuvable"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-05T12:34:56.789Z"
 *                 path:
 *                  type: string
 *                  example: "/api/games/690c6b590c78dc05ac975035"
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
 *                  example: "/api/books/690c6b590c78dc05ac975035"
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
 *                  example: "/api/games/690c6b590c78dc05ac975035"
 */
router.delete('/:id', authMiddleware.authorizeRoles(['admin']), gamesController.deleteGame);

module.exports = router;