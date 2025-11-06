const express = require('express');
const router = express.Router();
const path = require('path');
const jwt = require('jsonwebtoken'); // <-- ajouté

router.use(express.json());

router.get('/', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.redirect('/login.html'); // redirection si pas de token

    try {
        jwt.verify(token, process.env.SECRET_KEY); // vérifier token
        res.sendFile(path.join(__dirname, '../frontend/index.html'));
    } catch {
        res.redirect('/login.html'); // token invalide
    }
});

module.exports = router;
