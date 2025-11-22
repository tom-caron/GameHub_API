const express = require('express');
const router = express.Router();
router.use(express.json());
const validate = require('../middlewares/validate');
const {playerUpdateSchema} = require('../validations/playersSchema');
const playersController = require('../controllers/playersController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Player
 *   description: Gestion des informations des joueurs
 */

/**
 * @swagger
 * /api/players:
 *   get:
 *     summary: Récupère les joueurs
 *     tags: [Player]
 *     responses:
 *       200:
 *         description: Liste des joueurs récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 players:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 690c6b590c78dc05ac975035
 *                     username:
 *                       type: string
 *                       example: "Coyototo27"
 *                     role:
 *                       type: string
 *                       example: "admin"
 *                     email:
 *                       type: string
 *                       example: "test@gmail.com"
 *                     totalScore:
 *                       type: integer
 *                       example: 1500
 *                     createdAt:
 *                       type: string
 *                       example: "2023-10-05T12:34:56.789Z"
 *                     updatedAt:
 *                       type: string
 *                       example: "2023-10-05T12:34:56.789Z"
 *                 message:
 *                   type: string
 *                   example: "Liste des joueurs récupérées avec succès"
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
 *                  example: "/api/players/"
 * 
 */
router.get('', authMiddleware.authorizeRoles(['admin', 'player']), playersController.getAllPlayers);

/**
 * @swagger
 * /api/players/{id}:
 *   get:
 *     summary: Récupère un joueur par son identifiant
 *     tags: [Player]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant du joueur à récupérer
 *     responses:
 *       200:
 *         description: Joueur récupéré avec succès
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
 *                     email:
 *                       type: string
 *                       example: "test@gmail.com"
 *                     username:
 *                       type: string
 *                       example: "Coyototo27"
 *                     role:
 *                       type: string
 *                       example: "admin"
 *                 message:
 *                   type: string
 *                   example: "Joueur récupéré avec succès"
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
 *                  example: "/api/players/690c8142e30a79d9b01033df"
 *       404:
 *         description: Joueur introuvable
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
 *                   example: "Joueur introuvable"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-05T12:34:56.789Z"
 *                 path:
 *                   type: string
 *                   example: "/api/player/690c8142e30a79d9b01033df"
 */
router.get('/:id', authMiddleware.authorizeRoles(['admin', 'player']), playersController.getPlayerById);

/**
 * @swagger
 * /players/{id}:
 *   put:
 *     summary: Permet de modifer les informations d'un joueur (admin ou soi-même)
 *     tags: [Player]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - role
 *               - username
 *             properties:
 *               email:
 *                 type: string
 *                 description: email de l'utilisateur
 *                 example: "tom.caron@ynov.com"
 *               password:
 *                 type: string
 *                 description: Mot de passe de l'utilisateur
 *                 example: "P@ssw0rd!"
 *               role:
 *                 type: string
 *                 description: Rôle de l'utilisateur
 *                 example: "admin"
 *               username:
 *                 type: string
 *                 description: Nom d'utilisateur
 *                 example: "Coyototo27"
 *     responses:
 *       200:
 *         description: Player mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Player mis à jour avec succès"
 *                 code:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Email déjà utilisé ou Username déjà utilisé
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
 *                   example: "Email déjà utilisé"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-05T12:34:56.789Z"
 *                 path:
 *                  type: string
 *                  example: "players/{id}"
 *       404:
 *         description: Player introuvable
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
 *                   example: "Player introuvable"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-05T12:34:56.789Z"
 *                 path:
 *                  type: string
 *                  example: "players/{id}"
 * 
 */
router.put('/:id', authMiddleware.requireSelfOrAdmin, validate(playerUpdateSchema), playersController.updatePlayer);

/**
 * @swagger
 * /players/{id}:
 *   delete:
 *     summary: Supprime un joueur par son identifiant
 *     tags: [Player]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant du joueur à supprimer
 *     responses:
 *       200:
 *         description: Joueur supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Joueur supprimé avec succès"
 *                 code:
 *                   type: integer
 *                   example: 200
 *       404:
 *         description: Player introuvable
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
 *                   example: "Player introuvable"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-05T12:34:56.789Z"
 *                 path:
 *                  type: string
 *                  example: "/api/players/6909cb645d25fcfd3c0cadd5"
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
 *                  example: "/api/players/6909cb645d25fcfd3c0cadd5"
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
 *                  example: "/players/6909cb645d25fcfd3c0cadd5"
 */
router.delete('/:id', authMiddleware.requireSelfOrAdmin, playersController.deletePlayer);

module.exports = router;