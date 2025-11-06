const express = require('express');
const router = express.Router();
router.use(express.json());
const authorsController = require('../controllers/authorsController');
const validate = require('../middlewares/validate');
const authorsSchema = require('../validations/authorsSchema');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Auteurs
 *   description: Gestion des auteurs
 */

/**
 * @swagger
 * /api/authors:
 *   get:
 *     summary: Récupère les auteurs
 *     tags: [Auteurs]
 *     responses:
 *       200:
 *         description: Liste des auteurs récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 authors:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Tom Caron"
 *                     birthYear:
 *                       type: integer
 *                       example: 2003
 *                 message:
 *                   type: string
 *                   example: "Liste des auteurs récupérées avec succès"
 *                 code:
 *                   type: integer
 *                   example: 200
 *       401:
 *         description: Clé API invalide ou non autorisée
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
 *                   example: "Clé API invalide ou absente"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-05T12:34:56.789Z"
 *                 path:
 *                  type: string
 *                  example: "/api/authors/"
 *       404:
 *         description: Aucun auteur existant
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
 *                     example: "Aucun auteur trouvé"
 *                   timestamp:
 *                     type: string
 *                     example: "2023-10-05T12:34:56.789Z"
 *                   path:
 *                     type: string
 *                     example: "/api/authors"
 * 
 */
router.get('/api/authors', authMiddleware.authorizeRoles(['admin', 'user']), authorsController.getAllAuthors);

/**
 * @swagger
 * /api/authors/{id}:
 *   get:
 *     summary: Récupère un auteur par son identifiant
 *     tags: [Auteurs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant de l'auteur à récupérer
 *     responses:
 *       200:
 *         description: Auteur récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 book:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 6909cb645d25fcfd3c0cadd5
 *                     name:
 *                       type: string
 *                       example: "Tom Caron"
 *                     birthYear:
 *                       type: integer
 *                       example: 2003
 *                 message:
 *                   type: string
 *                   example: "Auteur récupéré avec succès"
 *                 code:
 *                   type: integer
 *                   example: 200
 *       401:
 *         description: Clé API invalide ou non autorisée
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
 *                   example: "Clé API invalide ou absente"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-05T12:34:56.789Z"
 *                 path:
 *                  type: string
 *                  example: "/api/authors/1"
 *       404:
 *         description: Auteur introuvable
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
 *                   example: "Auteur introuvable"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-05T12:34:56.789Z"
 *                 path:
 *                   type: string
 *                   example: "/api/authors/1"
 */
router.get('/api/authors/:id', authMiddleware.authorizeRoles(['admin', 'user']), authorsController.getAuthorById);

/**
 * @swagger
 * /api/authors:
 *   post:
 *     summary: Crée un nouvelle auteur/autrice
 *     tags: [Auteurs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - birthYear
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nom de l'auteur/autrice
 *                 example: "Tom Caron"
 *               birthYear:
 *                 type: integer
 *                 description: Année de naissance
 *                 example: 2003
 *     responses:
 *       201:
 *         description: Auteur créé avec succès
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
 *                       example: 6
 *                     title:
 *                       type: string
 *                       example: "Tom Caron"
 *                     birthYear:
 *                       type: integer
 *                       example: 2003
 *                 message:
 *                   type: string
 *                   example: "Auteur créé avec succès"
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
 *                   example: "Le champ name et birthYear est requis"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-05T12:34:56.789Z"
 *                 path:
 *                   type: string
 *                   example: "/api/authors"
 *       401:
 *         description: Clé API invalide ou non autorisée
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
 *                   example: "Clé API invalide ou absente"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-05T12:34:56.789Z"
 *                 path:
 *                  type: string
 *                  example: "/api/authors/"
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
 *                  example: "/api/authors/"
 */
router.post('/api/authors', authMiddleware.authorizeRoles(['admin']), validate(authorsSchema), authorsController.createAuthor);

/**
 * @swagger
 * /api/authors/{id}:
 *   put:
 *     summary: Met à jour un auteur existant
 *     tags: [Auteurs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant de l'auteur/autrice à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nouveau nom de l'auteur/autrice
 *                 example: "Axel Caron"
 *               birthYear:
 *                 type: integer
 *                 description: Nouvelle année de niassance
 *                 example: 2001
 *             description: Au moins un des champs doit être fourni
 *     responses:
 *       200:
 *         description: Auteur mis à jour avec succès
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
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Axel Caron"
 *                     birthYear:
 *                       type: integer
 *                       example: 2001
 *                 message:
 *                   type: string
 *                   example: "Auteur mis à jour avec succès"
 *                 code:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Données invalides ou aucune donnée à mettre à jour
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
 *                   example: "Le champ name ou birthYear est requis"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-05T12:34:56.789Z"
 *                 path:
 *                   type: string
 *                   example: "/api/authors/1"
 *       401:
 *         description: Clé API invalide ou non autorisée
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
 *                   example: "Clé API invalide ou absente"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-05T12:34:56.789Z"
 *                 path:
 *                  type: string
 *                  example: "/api/authors/1"
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
 *                  example: "/api/authors/1"
 *       404:
 *         description: Auteur introuvable
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
 *                   example: "Auteur introuvable"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-05T12:34:56.789Z"
 *                 path:
 *                   type: string
 *                   example: "/api/authors/1"
 */
router.put('/api/authors/:id', authMiddleware.authorizeRoles(['admin']), validate(authorsSchema), authorsController.updateAuthor);

/**
 * @swagger
 * /api/authors/{id}:
 *   delete:
 *     summary: Supprime un livrauteur par son identifiant
 *     tags: [Auteurs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant de l'auteur à supprimer
 *     responses:
 *       200:
 *         description: Auteur supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Auteur supprimé avec succès"
 *                 code:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Impossible de supprimer un auteur ayant des livres associés
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
 *                   example: "Impossible de supprimer un auteur ayant des livres associés"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-05T12:34:56.789Z"
 *                 path:
 *                  type: string
 *                  example: "/api/authors/1"
 *       404:
 *         description: Auteur introuvable
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
 *                   example: "Auteur introuvable"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-05T12:34:56.789Z"
 *                 path:
 *                  type: string
 *                  example: "/api/authors/1"
 *       401:
 *         description: Clé API invalide ou non autorisée
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
 *                   example: "Clé API invalide ou absente"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-05T12:34:56.789Z"
 *                 path:
 *                  type: string
 *                  example: "/api/authors/1"
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
 *                  example: "/api/authors/1"
 */
router.delete('/api/authors/:id', authMiddleware.authorizeRoles(['admin']), authorsController.deleteAuthor);

 module.exports = router;