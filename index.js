const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database');
const setupSwagger = require('./docs/swagger');
const indexRoutes = require('./routes/indexRoutes');
const booksRoutes = require('./routes/booksRoutes');
const authorsRoutes = require('./routes/authorsRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');
const authMiddleware = require('./middlewares/authMiddleware');
const authRoutes = require('./routes/authRoutes');
const playersRoutes = require('./routes/playersRoutes');
const platformsRoutes = require('./routes/platformsRoutes');

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
app.use(booksRoutes);
app.use(authorsRoutes);



app.use(errorMiddleware.errorHandler);

app.listen(process.env.PORT, () => {
    console.log(`Serveur lancé sur ${process.env.API_BASE}`);
});

