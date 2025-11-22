const express = require('express');
const router = express.Router();
router.use(express.json());
const validate = require('../middlewares/validate');
const {genreCreateSchema, genreUpdateSchema} = require('../validations/genresSchema');
const genresController = require('../controllers/genresController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Genre
 *   description: Gestion des informations des genres de jeux
 */

/**
 * @swagger
 * /api/genres:
 *   post:
 *     summary: Crée un nouveau genre (admin)
 *     tags: [Genre]
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
 *                 description: Nom du genre
 *                 example: "Aventure"
 *               slug:
 *                 type: string
 *                 description: Slug du genre
 *                 example: "aventure"
 *     responses:
 *       201:
 *         description: genre créé avec succès
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
 *                       example: "Aventure"
 *                     slug:
 *                       type: string
 *                       example: "aventure"
 *                 message:
 *                   type: string
 *                   example: "Genre créé avec succès"
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
 *                   example: "/api/genres/"
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
 *                  example: "/api/genre/"
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
 *                  example: "/api/genre/"
 */
router.post('', authMiddleware.authorizeRoles(['admin']), validate(genreCreateSchema), genresController.createGenre);

/**
 * @swagger
 * /api/genres:
 *   get:
 *     summary: Récupère les genres de jeux
 *     tags: [Genre]
 *     responses:
 *       200:
 *         description: Liste des genres de jeux récupérée avec succès
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
 *                       example: "Aventure"
 *                     slug:
 *                       type: string
 *                       example: "aventure"
 *                 message:
 *                   type: string
 *                   example: "Liste des genres de jeux récupérées avec succès"
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
 *                  example: "/api/genres"      
 * 
 */
router.get('', authMiddleware.authorizeRoles(['admin', 'player']), genresController.getAllGenres);

/**
 * @swagger
 * /api/genres/{id}:
 *   get:
 *     summary: Récupère un genre de jeux par son identifiant
 *     tags: [Genre]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant du genre à récupérer
 *     responses:
 *       200:
 *         description: Genre récupéré avec succès
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
 *                       example: "Aventure"
 *                     slug:
 *                       type: string
 *                       example: "aventure"
 *                 message:
 *                   type: string
 *                   example: "Genre récupéré avec succès"
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
 *                  example: "/api/genres/690c8142e30a79d9b01033df"
 *       404:
 *         description: Genre introuvable
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
 *                   example: "Genre introuvable"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-05T12:34:56.789Z"
 *                 path:
 *                   type: string
 *                   example: "/api/genres/690c8142e30a79d9b01033df"
 */
router.get('/:id', authMiddleware.authorizeRoles(['admin', 'player']), genresController.getGenreById);

/**
 * @swagger
 * /genres/{id}:
 *   put:
 *     summary: Permet de modifer les informations dun genre de jeu (admin)
 *     tags: [Genre]
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
 *                 description: nom du genre
 *                 example: "Aventure"
 *               slug:
 *                 type: string
 *                 description: slug du genre
 *                 example: "aventure"
 *     responses:
 *       200:
 *         description: Genre mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Genre mis à jour avec succès"
 *                 code:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Nom de genre déjà utilisé
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
 *                   example: "Nom de genre déjà utilisé"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-05T12:34:56.789Z"
 *                 path:
 *                  type: string
 *                  example: "api/genres/{id}"
 *       404:
 *         description: Genre introuvable
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
 *                   example: "Genre introuvable"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-05T12:34:56.789Z"
 *                 path:
 *                  type: string
 *                  example: "api/genres/{id}"
 * 
 */
router.put('/:id', authMiddleware.authorizeRoles(['admin']), validate(genreUpdateSchema), genresController.updateGenre);

/**
 * @swagger
 * /genres/{id}:
 *   delete:
 *     summary: Supprime un genre de jeux par son identifiant
 *     tags: [Genre]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant du genre à supprimer
 *     responses:
 *       200:
 *         description: Genre supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Genre supprimé avec succès"
 *                 code:
 *                   type: integer
 *                   example: 200
 *       404:
 *         description: Genre introuvable
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
 *                   example: "Genre introuvable"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-05T12:34:56.789Z"
 *                 path:
 *                  type: string
 *                  example: "/api/genres/6909cb645d25fcfd3c0cadd5"
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
 *                  example: "/api/genres/6909cb645d25fcfd3c0cadd5"
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
 *                  example: "/api/genres/6909cb645d25fcfd3c0cadd5"
 */
router.delete('/:id', authMiddleware.authorizeRoles(['admin']), genresController.deleteGenre);

module.exports = router;