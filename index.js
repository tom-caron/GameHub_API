const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/database');
const setupSwagger = require('./docs/swagger');
const indexRoutes = require('./routes/indexRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');
const authMiddleware = require('./middlewares/authMiddleware');
const authRoutes = require('./routes/authRoutes');
const playersRoutes = require('./routes/playersRoutes');
const platformsRoutes = require('./routes/platformsRoutes');
const genresRoutes = require('./routes/genresRoutes');
const gamesRoutes = require('./routes/gamesRoutes');
const sessionsRoutes = require('./routes/sessionsRoutes');
const statsRoutes = require('./routes/statsRoutes');

connectDB();
setupSwagger(app);

app.use(cors({
    origin: process.env.URL_FRONT,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.use(express.json());

app.use(indexRoutes);
app.use('/auth', authRoutes);
app.use('/api',authMiddleware.authenticate);
app.use('/api/players', playersRoutes);
app.use('/api/platforms', platformsRoutes);
app.use('/api/genres', genresRoutes);
app.use('/api/games', gamesRoutes);
app.use('/api/sessions', sessionsRoutes);
app.use('/api/stats', statsRoutes);



app.use(errorMiddleware.errorHandler);

app.listen(process.env.PORT, () => {
    console.log(`Serveur lancé sur ${process.env.API_BASE}`);
});

