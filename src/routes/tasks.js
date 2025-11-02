const express = require('express');
const router = express.Router();
const db = require('../data');

// Inicializar DB
db.init();

// GET /tasks?status=
router.get('/', async (req, res) => {
  const status = req.query.status;
  const tasks = await db.getAllTasks({ status });
  res.json(tasks);
});

// GET /tasks/summary
router.get('/summary', async (req, res) => {
  const s = await db.summary();
  res.json(s);
});

// GET /tasks/:id
router.get('/:id', async (req, res) => {
  const task = await db.getTaskById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
});

// POST /tasks
router.post('/', async (req, res) => {
  const payload = req.body || {};
  if (!payload.title) return res.status(400).json({ message: 'title is required' });
  const created = await db.createTask(payload);
  res.status(201).json(created);
});

// PUT /tasks/:id (replace)
router.put('/:id', async (req, res) => {
  const payload = req.body || {};
  const updated = await db.replaceTask(req.params.id, payload);
  if (!updated) return res.status(404).json({ message: 'Task not found' });
  res.json(updated);
});

// PATCH /tasks/:id/status
router.patch('/:id/status', async (req, res) => {
  const status = req.body && req.body.status;
  if (!status) return res.status(400).json({ message: 'status is required' });
  try {
    const updated = await db.updateTaskStatus(req.params.id, status);
    if (!updated) return res.status(404).json({ message: 'Task not found' });
    res.json(updated);
  } catch (err) {
    return res.status(400).json({ message: 'Invalid status' });
  }
});

// DELETE /tasks/:id
router.delete('/:id', async (req, res) => {
  const ok = await db.deleteTask(req.params.id);
  if (!ok) return res.status(404).json({ message: 'Task not found' });
  res.json({ message: 'Task deleted successfully' });
});

// GET /tasks/summary
router.get('/summary', async (req, res) => {
  const s = await db.summary();
  res.json(s);
});

module.exports = router;
