const fs = require('fs').promises;
const path = require('path');

const file = path.join(__dirname, 'tasks.json');

async function readData() {
  try {
    const raw = await fs.readFile(file, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') return { tasks: [] };
    throw err;
  }
}

async function writeData(data) {
  await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf8');
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

async function init() {
  const data = await readData();
  if (!data.tasks) data.tasks = [];
  await writeData(data);
}

async function getAllTasks(filter) {
  const data = await readData();
  let tasks = data.tasks || [];
  if (filter && filter.status) tasks = tasks.filter(t => t.status === filter.status);
  return tasks;
}

async function getTaskById(id) {
  const data = await readData();
  return (data.tasks || []).find(t => t.id === id) || null;
}

async function createTask(payload) {
  const data = await readData();
  const task = {
    id: generateId(),
    title: payload.title || 'Untitled',
    description: payload.description || '',
    status: 'todo'
  };
  data.tasks = data.tasks || [];
  data.tasks.push(task);
  await writeData(data);
  return task;
}

async function replaceTask(id, payload) {
  const data = await readData();
  data.tasks = data.tasks || [];
  const idx = data.tasks.findIndex(t => t.id === id);
  if (idx === -1) return null;
  const updated = {
    id,
    title: payload.title || '',
    description: payload.description || '',
    status: payload.status || 'todo'
  };
  data.tasks[idx] = updated;
  await writeData(data);
  return updated;
}

async function updateTaskStatus(id, status) {
  const valid = ['todo', 'doing', 'done'];
  if (!valid.includes(status)) throw new Error('Invalid status');
  const data = await readData();
  const task = (data.tasks || []).find(t => t.id === id);
  if (!task) return null;
  task.status = status;
  await writeData(data);
  return task;
}

async function deleteTask(id) {
  const data = await readData();
  const before = (data.tasks || []).length;
  data.tasks = (data.tasks || []).filter(t => t.id !== id);
  const after = data.tasks.length;
  await writeData(data);
  return before !== after;
}

async function summary() {
  const data = await readData();
  const tasks = data.tasks || [];
  const res = { todo: 0, doing: 0, done: 0 };
  for (const t of tasks) if (res[t.status] !== undefined) res[t.status]++;
  return res;
}

module.exports = { init, getAllTasks, getTaskById, createTask, replaceTask, updateTaskStatus, deleteTask, summary };
