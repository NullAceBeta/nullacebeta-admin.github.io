// server.js — Entry point
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const headerRouter = require('./routes/header');
const createCollectionRouter = require('./routes/collection');

const app = express();

app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' }));
app.use(express.json());

// Rutas
app.use('/api/header', headerRouter);
app.use('/api/education', createCollectionRouter('education'));
app.use('/api/work-experience', createCollectionRouter('work-experience'));
app.use('/api/skills', createCollectionRouter('skills'));
app.use('/api/certificates', createCollectionRouter('certificates'));
app.use('/api/languages', createCollectionRouter('languages'));
app.use('/api/interests', createCollectionRouter('interests'));

app.get('/health', (_, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
