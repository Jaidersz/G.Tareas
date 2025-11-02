async function api(path, opts) {
  const res = await fetch(path, opts);
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`${res.status} ${res.statusText} - ${txt}`);
  }
  return res.json();
}

async function loadTasks(){
  try{
    const tasks = await api('/tasks');
    const el = document.getElementById('tasksList');
    el.innerHTML = '';
    tasks.forEach(t => {
      const div = document.createElement('div');
      div.className = 'task';
      div.innerHTML = `
        <div class="meta">
          <div><strong>${t.title}</strong> <small>(${t.status})</small></div>
          <div>${t.description || ''}</div>
        </div>
        <div class="actions">
          <button onclick="changeStatus('${t.id}','todo')">todo</button>
          <button onclick="changeStatus('${t.id}','doing')">doing</button>
          <button onclick="changeStatus('${t.id}','done')">done</button>
          <button onclick="removeTask('${t.id}')">Eliminar</button>
        </div>
      `;
      el.appendChild(div);
    });
    loadSummary();
  }catch(err){
    document.getElementById('tasksList').innerText = 'Error cargando tareas: '+err.message;
  }
}

async function loadSummary(){
  try{
    const s = await api('/tasks/summary');
    document.getElementById('summaryContent').innerText = `todo: ${s.todo} — doing: ${s.doing} — done: ${s.done}`;
  }catch(err){
    document.getElementById('summaryContent').innerText = 'Error: '+err.message;
  }
}

async function createTask(){
  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  if(!title){ alert('El título es obligatorio'); return }
  try{
    await api('/tasks', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ title, description }) });
    document.getElementById('title').value='';
    document.getElementById('description').value='';
    loadTasks();
  }catch(err){ alert('Error creando: '+err.message) }
}

async function changeStatus(id, status){
  try{
    await api(`/tasks/${id}/status`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ status }) });
    loadTasks();
  }catch(err){ alert('Error actualizando: '+err.message) }
}

async function removeTask(id){
  if(!confirm('Eliminar tarea?')) return;
  try{
    await api(`/tasks/${id}`, { method:'DELETE' });
    loadTasks();
  }catch(err){ alert('Error borrando: '+err.message) }
}

document.getElementById('createBtn').addEventListener('click', createTask);
window.addEventListener('load', loadTasks);
