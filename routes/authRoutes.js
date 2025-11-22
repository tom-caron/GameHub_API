const express = require('express');
const router = express.Router();
router.use(express.json());
const validate = require('../middlewares/validate');
const {playerCreateSchema, playerConnectSchema} = require('../validations/playersSchema');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');


/**
 * @swagger
 * tags:
 *   name: Authentification des joueurs
 *   description: Gestion de la connexion des joueurs
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Permet de se connecter et d'obtenir un token JWT
 *     tags: [Authentification des joueurs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: email de l'utilisateur
 *                 example: "tom.caron@ynov.com"
 *               password:
 *                 type: string
 *                 description: Mot de passe de l'utilisateur
 *                 example: "P@ssw0rd!"
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Connexion réussie"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0b20uY2Fyb25AeW5vdi5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTY5OTY4MjU2MCwiZXhwIjoxNjk5Njg2MTYwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
 *                 code:
 *                   type: integer
 *                   example: 200
 *       401:
 *         description: Mot de passe incorrect
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
 *                   example: "Mot de passe incorrect"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-05T12:34:56.789Z"
 *                 path:
 *                  type: string
 *                  example: "auth/login"
 *       404:
 *         description: Joueur non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: "Error"
 *                   message:
 *                     type: string
 *                     example: "Joueur non trouvé"
 *                   timestamp:
 *                     type: string
 *                     example: "2023-10-05T12:34:56.789Z"
 *                   path:
 *                     type: string
 *                     example: "auth/login"
 * 
 */
router.post('/login', validate(playerConnectSchema), authController.login);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Permet de s'inscrire en tant que nouveau joueur
 *     tags: [Authentification des joueurs]
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
 *                 example: "Bot123"
 *     responses:
 *       201:
 *         description: Joueur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Joueur créé avec succès"
 *                 code:
 *                   type: integer
 *                   example: 201
 *       400:
 *         description: Joueur déjà existant
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
 *                   example: "Joueur déjà existant"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-05T12:34:56.789Z"
 *                 path:
 *                  type: string
 *                  example: "auth/register"
 * 
 */
router.post('/register', validate(playerCreateSchema), authController.register);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Permet de récupérer les informations du joueur connecté
 *     tags: [Authentification des joueurs]
 *     responses:
 *       200:
 *         description: Informations récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Informations récupérées avec succès"
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
 *                  example: "auth/me"
 * 
 */
router.get('/me', authMiddleware.authenticate, authController.getMe);


module.exports = router;