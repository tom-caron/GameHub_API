const connectDB = require('./config/database');
const app = require('./app');

connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Serveur lancé sur ${process.env.API_BASE}`);
});
