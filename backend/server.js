// server.js - Entry point
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); // <-- 1. NUEVO: Importamos path

const headerRouter = require('./routes/header');
const createCollectionRouter = require('./routes/collection');

const app = express();
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' }));
app.use(express.json());

// <-- 2. NUEVO: Le decimos a Express que sirva la carpeta frontend
app.use(express.static(path.join(__dirname, 'frontend')));

// Rutas de tu API
app.use('/api/header', headerRouter);
app.use('/api/education', createCollectionRouter('education'));
app.use('/api/work-experience', createCollectionRouter('work-experience'));
app.use('/api/skills', createCollectionRouter('skills'));
app.use('/api/certificates', createCollectionRouter('certificates'));
app.use('/api/languages', createCollectionRouter('languages'));
app.use('/api/interests', createCollectionRouter('interests'));

app.get('/health', (_, res) => res.json({ status: 'ok' }));

// <-- 3. NUEVO: Cuando alguien entre a la raíz (/), le enviamos el index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
