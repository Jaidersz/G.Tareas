const express = require('express');
const cors = require('cors');
const path = require('path');
const tasksRouter = require('./routes/tasks');

const app = express();
app.use(cors());
app.use(express.json());

// Servir frontend estático (carpeta /frontend)
app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.use('/tasks', tasksRouter);

// Ruta raíz: servir index.html del frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Gestion Tareas API escuchando en http://localhost:${PORT}`);
});
