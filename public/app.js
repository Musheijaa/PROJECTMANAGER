const API_BASE_URL = '/api';

let tasks = [];

const taskForm = document.getElementById('taskForm');
const taskTitle = document.getElementById('taskTitle');
const taskDescription = document.getElementById('taskDescription');
const tasksList = document.getElementById('tasksList');
const taskCount = document.getElementById('taskCount');

async function fetchTasks() {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`);
    if (!response.ok) throw new Error('Failed to fetch tasks');
    tasks = await response.json();
    renderTasks();
  } catch (error) {
    console.error('Error fetching tasks:', error);
    tasksList.innerHTML = '<div class="loading">Failed to load tasks</div>';
  }
}

async function createTask(title, description) {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description }),
    });

    if (!response.ok) throw new Error('Failed to create task');

    await fetchTasks();
    taskTitle.value = '';
    taskDescription.value = '';
  } catch (error) {
    console.error('Error creating task:', error);
    alert('Failed to create task');
  }
}

async function updateTaskStatus(id, newStatus) {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) throw new Error('Failed to update task');

    await fetchTasks();
  } catch (error) {
    console.error('Error updating task:', error);
    alert('Failed to update task');
  }
}

async function deleteTask(id) {
  if (!confirm('Are you sure you want to delete this task?')) return;

  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Failed to delete task');

    await fetchTasks();
  } catch (error) {
    console.error('Error deleting task:', error);
    alert('Failed to delete task');
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return date.toLocaleDateString();
}

function getNextStatus(currentStatus) {
  const statusFlow = {
    'pending': 'in-progress',
    'in-progress': 'completed',
    'completed': 'pending'
  };
  return statusFlow[currentStatus];
}

function getStatusButtonText(currentStatus) {
  const buttonText = {
    'pending': 'Start',
    'in-progress': 'Complete',
    'completed': 'Restart'
  };
  return buttonText[currentStatus];
}

function renderTasks() {
  taskCount.textContent = `${tasks.length} task${tasks.length !== 1 ? 's' : ''}`;

  if (tasks.length === 0) {
    tasksList.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📝</div>
        <h3>No tasks yet</h3>
        <p>Create your first task to get started</p>
      </div>
    `;
    return;
  }

  tasksList.innerHTML = tasks.map(task => `
    <div class="task-card">
      <div class="task-header">
        <div class="task-title">${escapeHtml(task.title)}</div>
        <span class="status-badge status-${task.status}">${task.status.replace('-', ' ')}</span>
      </div>
      ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
      <div class="task-actions">
        <button class="btn btn-small btn-secondary" onclick="updateTaskStatus('${task.id}', '${getNextStatus(task.status)}')">
          ${getStatusButtonText(task.status)}
        </button>
        <button class="btn btn-small btn-danger" onclick="deleteTask('${task.id}')">
          Delete
        </button>
      </div>
      <div class="task-meta">
        Created ${formatDate(task.created_at)}
      </div>
    </div>
  `).join('');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = taskTitle.value.trim();
  const description = taskDescription.value.trim();

  if (title) {
    await createTask(title, description);
  }
});

fetchTasks();
