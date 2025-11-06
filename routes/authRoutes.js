const express = require('express');
const router = express.Router();
router.use(express.json());
const validate = require('../middlewares/validate');
const usersSchema = require('../validations/usersSchema');
const authController = require('../controllers/authController');

/**
 * @swagger
 * tags:
 *   name: Authentification
 *   description: Gestion de la connexion
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Permet de se connecter et d'obtenir un token JWT
 *     tags: [Authentification]
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
 *         description: Utilisateur non trouvé
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
 *                     example: "Utilisateur non trouvé"
 *                   timestamp:
 *                     type: string
 *                     example: "2023-10-05T12:34:56.789Z"
 *                   path:
 *                     type: string
 *                     example: "auth/login"
 * 
 */
router.post('/login', validate(usersSchema), authController.login);

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Permet de s'inscrire en tant que nouvel utilisateur
 *     tags: [Authentification]
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
 *                 example: "user"
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Utilisateur créé avec succès"
 *                 code:
 *                   type: integer
 *                   example: 201
 *       400:
 *         description: Utilisateur déjà existant
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
 *                   example: "Utilisateur déjà existant"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-05T12:34:56.789Z"
 *                 path:
 *                  type: string
 *                  example: "auth/register"
 * 
 */
router.post('/register', validate(usersSchema), authController.register);

module.exports = router;