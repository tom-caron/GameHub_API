const express = require('express');
const router = express.Router();
router.use(express.json());
const booksController = require('../controllers/booksController');
const validate = require('../middlewares/validate');
const bookSchema = require('../validations/booksSchema');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Livres
 *   description: Gestion des livres
 */

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Récupère les livres
 *     tags: [Livres]
 *     responses:
 *       200:
 *         description: Liste des livres récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 book:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     title:
 *                       type: string
 *                       example: "1984"
 *                     authorId:
 *                       type: integer
 *                       example: 1
 *                     publishedYear:
 *                       type: integer
 *                       example: 1949
 *                 message:
 *                   type: string
 *                   example: "Liste des livres récupérées avec succès"
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
 *                  example: "/api/books/"
 *       404:
 *         description: Aucun livre existant
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
 *                     example: "Aucun livre trouvé"
 *                   timestamp:
 *                     type: string
 *                     example: "2023-10-05T12:34:56.789Z"
 *                   path:
 *                     type: string
 *                     example: "/api/books"
 * 
 */
router.get('/api/books', authMiddleware.authorizeRoles(['admin', 'user']), booksController.getAllBooks);

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Récupère un livre par son identifiant
 *     tags: [Livres]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant du livre à récupérer
 *     responses:
 *       200:
 *         description: Livre récupéré avec succès
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
 *                     title:
 *                       type: string
 *                       example: "1984"
 *                     authorId:
 *                       type: integer
 *                       example: 1
 *                     publishedYear:
 *                       type: integer
 *                       example: 1949
 *                 message:
 *                   type: string
 *                   example: "Livre récupéré avec succès"
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
 *                  example: "/api/books/1"
 *       404:
 *         description: Livre introuvable
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
 *                   example: "Livre introuvable"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-05T12:34:56.789Z"
 *                 path:
 *                   type: string
 *                   example: "/api/books/1"
 */

router.get('/api/books/:id', authMiddleware.authorizeRoles(['admin', 'user']), booksController.getBookById);

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Crée un nouveau livre
 *     tags: [Livres]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - authorId
 *               - publishedYear
 *             properties:
 *               title:
 *                 type: string
 *                 description: Titre du livre
 *                 example: "test"
 *               authorId:
 *                 type: integer
 *                 description: Identifiant de l'auteur qui doit exister
 *                 example: 3
 *               publishedYear:
 *                 type: integer
 *                 description: Année de publication
 *                 example: 1955
 *     responses:
 *       201:
 *         description: Livre créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 book:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 6
 *                     title:
 *                       type: string
 *                       example: "test"
 *                     authorId:
 *                       type: integer
 *                       example: 3
 *                     publishedYear:
 *                       type: integer
 *                       example: 1955
 *                 message:
 *                   type: string
 *                   example: "Livre créé avec succès"
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
 *                   example: "Le champ title, authorId et publishedYear est requis"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-05T12:34:56.789Z"
 *                 path:
 *                   type: string
 *                   example: "/api/books"
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
 *                  example: "/api/books/"
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
 *                  example: "/api/books/"
 */

router.post('/api/books', authMiddleware.authorizeRoles(['admin']), validate(bookSchema), booksController.createBook);

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Met à jour un livre existant
 *     tags: [Livres]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant du livre à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Nouveau titre du livre
 *                 example: "test"
 *               authorId:
 *                 type: string
 *                 description: Nouvel identifiant de l'auteur
 *                 example: 10
 *               publishedYear:
 *                 type: integer
 *                 description: Nouvelle année de publication
 *                 example: 1955
 *             description: Au moins un des champs doit être fourni
 *     responses:
 *       200:
 *         description: Livre mis à jour avec succès
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
 *                     title:
 *                       type: string
 *                       example: "test"
 *                     authorId:
 *                       type: integer
 *                       example: 10
 *                     publishedYear:
 *                       type: integer
 *                       example: 1955
 *                 message:
 *                   type: string
 *                   example: "Livre mis à jour avec succès"
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
 *                   example: "Le champ title, authorId ou publishedYear est requis"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-05T12:34:56.789Z"
 *                 path:
 *                   type: string
 *                   example: "/api/books/1"
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
 *                  example: "/api/books/1"
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
 *                  example: "/api/books/1"
 *       404:
 *         description: Livre introuvable
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
 *                   example: "Livre introuvable"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-05T12:34:56.789Z"
 *                 path:
 *                   type: string
 *                   example: "/api/books/1"
 */

router.put('/api/books/:id', authMiddleware.authorizeRoles(['admin']), validate(bookSchema), booksController.updateBook);

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Supprime un livre par son identifiant
 *     tags: [Livres]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant du livre à supprimer
 *     responses:
 *       200:
 *         description: Livre supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Livre supprimé avec succès"
 *                 code:
 *                   type: integer
 *                   example: 200
 *       404:
 *         description: Livre introuvable
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
 *                   example: "Livre introuvable"
 *                 timestamp:
 *                   type: string
 *                   example: "2023-10-05T12:34:56.789Z"
 *                 path:
 *                  type: string
 *                  example: "/api/books/1"
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
 *                  example: "/api/books/1"
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
 *                  example: "/api/books/1"
 */

router.delete('/api/books/:id', authMiddleware.authorizeRoles(['admin']), booksController.deleteBook);


 module.exports = router;