const express = require('express');
const router = express.Router();
router.use(express.json());
const validate = require('../middlewares/validate');
const {sessionCreateSchema, sessionUpdateSchema} = require('../validations/sessionsSchema');
const sessionsController = require('../controllers/sessionsController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Session
 *   description: Gestion des informations des sessions de jeu
 */

/**
 * @swagger
 * /api/sessions:
 *   post:
 *     summary: Crée une nouvelle session (admin ou soi-même)
 *     tags: [Session]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - player
 *               - game
 *             properties:
 *               player:
 *                 type: string
 *                 description: Joueur de la session
 *                 example: "Coyototo27"
 *               game:
 *                 type: string
 *                 description: Jeu de la session
 *                 example: "smash-bros-ultimate"
 *     responses:
 *       201:
 *         description: Session créé avec succès
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
 *                     player:
 *                       type: string
 *                       description: Joueur de la session
 *                       example: "Coyototo27"
 *                     game:
 *                       type: string
 *                       description: Jeu de la session
 *                       example: "smash-bros-ultimate"
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
 *                   example: "Le champ player et game est requis"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-05T12:34:56.789Z"
 *                 path:
 *                   type: string
 *                   example: "/api/session/"
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
 *                  example: "/api/sessions/"
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
 *                  example: "/api/sessions/"
 */
router.post('', authMiddleware.authorizeRoles(['admin']), validate(sessionCreateSchema), sessionsController.createSession);

/**
 * @swagger
 * /api/sessions:
 *   get:
 *     summary: Récupère toutes les sessions de jeu
 *     tags: [Session]
 *     responses:
 *       200:
 *         description: Liste des sessions récupérée avec succès
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
 *                     player:
 *                       type: string
 *                       example: "Coyototo27"
 *                     game:
 *                       type: string
 *                       example: "DeadByDaylight"
 *                 message:
 *                   type: string
 *                   example: "Liste des sessions de jeux récupérées avec succès"
 *                 code:
 *                   type: integer
 *                   example: 200
 * 
 */
router.get('', authMiddleware.authorizeRoles(['admin', 'player']), sessionsController.getAllSessions);

/**
 * @swagger
 * /api/sessions/{id}:
 *   get:
 *     summary: Récupère une sessions par son identifiant
 *     tags: [Session]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant de la session à récupérer
 *     responses:
 *       200:
 *         description: Session récupéré avec succès
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
 *                     player:
 *                       type: string
 *                       example: "Coyototo27"
 *                     game:
 *                       type: string
 *                       example: "DeadByDaylight"
 *                 message:
 *                   type: string
 *                   example: "Session récupéré avec succès"
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
 *                  example: "/api/sessions/690c8142e30a79d9b01033df"
 *       404:
 *         description: Session introuvable
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
 *                   example: "Session introuvable"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-05T12:34:56.789Z"
 *                 path:
 *                   type: string
 *                   example: "/api/sessions/690c8142e30a79d9b01033df"
 */
router.get('/:id', authMiddleware.authorizeRoles(['admin', 'player']), sessionsController.getSessionById);

/**
 * @swagger
 * /api/sessions/{id}:
 *   put:
 *     summary: Permet de modifer les informations d'une session de jeu (admin ou soi-même)
 *     tags: [Session]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             optional:
 *               - player
 *               - game
 *               - durationSeconds
 *               - score
 *               - active
 *             properties:
 *               player:
 *                 type: string
 *                 description: Pseudo du joueur de la session
 *                 example: "Coyototo27"
 *               game:
 *                 type: string
 *                 example: "Smash Bros Ultimate"
 *               durationSeconds:
 *                 type: integer
 *                 description: Durée de la session en secondes
 *                 example: 3600
 *               score:
 *                 type: integer
 *                 description: Score obtenu lors de la session
 *                 example: 1500
 *               active:
 *                 type: boolean
 *                 description: Indique si la session est active
 *                 example: true
 *     responses:
 *       200:
 *         description: Session mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Session mis à jour avec succès"
 *                 code:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Joueur déjà dans une autre session
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
 *                   example: "Joueur déjà dans une autre session"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-05T12:34:56.789Z"
 *                 path:
 *                  type: string
 *                  example: "api/sessions/{id}"
 *       404:
 *         description: Session introuvable
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
 *                   example: "Session introuvable"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-05T12:34:56.789Z"
 *                 path:
 *                  type: string
 *                  example: "api/sessions/{id}"
 * 
 */
router.put('/:id', authMiddleware.requireSelfOrAdmin, validate(sessionUpdateSchema), sessionsController.updateSession);

/**
 * @swagger
 * /api/sessions/{id}:
 *   delete:
 *     summary: Supprime une session par son identifiant
 *     tags: [Session]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant de la session à supprimer
 *     responses:
 *       200:
 *         description: Session supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Session supprimé avec succès"
 *                 code:
 *                   type: integer
 *                   example: 200
 *       404:
 *         description: Session introuvable
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
 *                   example: "Session introuvable"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-05T12:34:56.789Z"
 *                 path:
 *                  type: string
 *                  example: "/api/sessions/690c6b590c78dc05ac975035"
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
 *                  example: "/api/sessions/690c6b590c78dc05ac975035"
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
 *                  example: "/api/sessions/690c6b590c78dc05ac975035"
 */
router.delete('/:id', authMiddleware.authorizeRoles(['admin', 'player']), sessionsController.deleteSession);

module.exports = router;