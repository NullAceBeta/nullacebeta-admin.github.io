// routes/header.js — Header es un documento singleton (no array de ítems)
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../firebase');
const router = express.Router();

const docRef = () => db.collection('portfolio').doc('header');

// GET — Obtener header completo
router.get('/', async (req, res) => {
  try {
    const snap = await docRef().get();
    res.json(snap.exists ? snap.data() : {});
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PUT — Actualizar campos del header (merge)
router.put('/', async (req, res) => {
  try {
    // Separar socialNetwork del resto para no sobreescribir accidentalmente
    const { socialNetwork, ...fields } = req.body;
    await docRef().set(fields, { merge: true });
    const snap = await docRef().get();
    res.json(snap.data());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /header/social — Agregar red social
router.post('/social', async (req, res) => {
  try {
    const newItem = { id: uuidv4(), ...req.body };
    const snap = await docRef().get();
    const data = snap.exists ? snap.data() : {};
    const socialNetwork = [...(data.socialNetwork || []), newItem];
    await docRef().set({ socialNetwork }, { merge: true });
    res.status(201).json(newItem);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PUT /header/social/:id — Actualizar red social
router.put('/social/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const snap = await docRef().get();
    const data = snap.exists ? snap.data() : {};
    const socialNetwork = data.socialNetwork || [];
    const idx = socialNetwork.findIndex((s) => s.id === id);
    if (idx === -1) return res.status(404).json({ error: 'No encontrado' });
    socialNetwork[idx] = { ...socialNetwork[idx], ...req.body, id };
    await docRef().set({ socialNetwork }, { merge: true });
    res.json(socialNetwork[idx]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /header/social/:id — Eliminar red social
router.delete('/social/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const snap = await docRef().get();
    const data = snap.exists ? snap.data() : {};
    const socialNetwork = (data.socialNetwork || []).filter((s) => s.id !== id);
    await docRef().set({ socialNetwork }, { merge: true });
    res.json({ deleted: id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
