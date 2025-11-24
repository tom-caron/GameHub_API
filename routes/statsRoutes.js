const express = require('express');
const router = express.Router();
router.use(express.json());
const authMiddleware = require('../middlewares/authMiddleware');
const statsController = require('../controllers/statsController');

/**
 * @swagger
 * tags:
 *   name: Stats
 *   description: Statistiques de la plateforme GameHub
 */

/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: Récupère les stats de GameHub
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Récupère les stats de GameHub
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 authors:
 *                   type: object
 *                   properties:
 *                     totalPlayer:
 *                       type: integer
 *                       example: 12
 *                     totalGames:
 *                       type: integer
 *                       example: 34
 *                     totalGenres:
 *                       type: integer
 *                       example: 5
 *                     totalPlatforms:
 *                       type: integer
 *                       example: 7
 *                     totalSessions:
 *                       type: integer
 *                       example: 89
 *                 message:
 *                   type: string
 *                   example: "Statistiques récupérées avec succès"
 *                 code:
 *                   type: integer
 *                   example: 200    
 * 
 */
router.get('', authMiddleware.authorizeRoles(['admin', 'player']), statsController.getAllStats);


module.exports = router;