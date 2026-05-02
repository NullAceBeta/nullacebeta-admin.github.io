// routes/collection.js — Fábrica de rutas CRUD para colecciones de arrays
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../firebase');

/**
 * Crea un router Express con CRUD completo para una colección Firestore
 * que almacena un array de objetos bajo el campo "items".
 * @param {string} collectionName - Nombre del documento/colección en Firestore
 */
function createCollectionRouter(collectionName) {
  const router = express.Router();
  const docRef = () => db.collection('portfolio').doc(collectionName);

  // GET — Obtener todos los ítems
  router.get('/', async (req, res) => {
    try {
      const snap = await docRef().get();
      const data = snap.exists ? snap.data().items || [] : [];
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // POST — Agregar un ítem nuevo
  router.post('/', async (req, res) => {
    try {
      const item = { id: uuidv4(), ...req.body };
      const snap = await docRef().get();
      const items = snap.exists ? snap.data().items || [] : [];
      items.push(item);
      await docRef().set({ items });
      res.status(201).json(item);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // PUT — Actualizar un ítem por id
  router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const snap = await docRef().get();
      if (!snap.exists) return res.status(404).json({ error: 'Colección vacía' });

      const items = snap.data().items || [];
      const idx = items.findIndex((i) => i.id === id);
      if (idx === -1) return res.status(404).json({ error: 'Ítem no encontrado' });

      items[idx] = { ...items[idx], ...req.body, id };
      await docRef().set({ items });
      res.json(items[idx]);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // DELETE — Eliminar un ítem por id
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const snap = await docRef().get();
      if (!snap.exists) return res.status(404).json({ error: 'Colección vacía' });

      let items = snap.data().items || [];
      const len = items.length;
      items = items.filter((i) => i.id !== id);
      if (items.length === len) return res.status(404).json({ error: 'Ítem no encontrado' });

      await docRef().set({ items });
      res.json({ deleted: id });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  return router;
}

module.exports = createCollectionRouter;
