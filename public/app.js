const activityInput = document.getElementById('activity-input');
const saveBtn = document.getElementById('save-btn');
const refreshBtn = document.getElementById('refresh-btn');
const statusEl = document.getElementById('status');
const countEl = document.getElementById('count');
const activitiesBody = document.getElementById('activities-body');

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.style.color = isError ? '#b91c1c' : '#1d4ed8';
}

function renderActivities(data) {
  countEl.textContent = data.activity_count;
  activitiesBody.innerHTML = '';

  if (!Array.isArray(data.activities) || data.activities.length === 0) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 2;
    cell.className = 'empty';
    cell.textContent = 'No activities saved yet.';
    row.appendChild(cell);
    activitiesBody.appendChild(row);
    return;
  }

  data.activities.forEach((entry) => {
    const row = document.createElement('tr');

    const idCell = document.createElement('td');
    idCell.textContent = entry.id;

    const activityCell = document.createElement('td');
    activityCell.textContent = entry.activity;

    row.appendChild(idCell);
    row.appendChild(activityCell);
    activitiesBody.appendChild(row);
  });
}

async function fetchActivities() {
  try {
    const response = await fetch('/api/activities');
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.message || 'Failed to fetch activities.');
    }

    renderActivities(payload);
  } catch (error) {
    setStatus(error.message, true);
  }
}

async function saveActivity() {
  const activity = activityInput.value.trim();

  if (!activity) {
    setStatus('Please type an activity before saving.', true);
    return;
  }

  saveBtn.disabled = true;
  setStatus('Saving activity...');

  try {
    const response = await fetch('/api/activities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ activity }),
    });
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.message || 'Failed to save activity.');
    }

    activityInput.value = '';
    setStatus(payload.message);
    await fetchActivities();
  } catch (error) {
    setStatus(error.message, true);
  } finally {
    saveBtn.disabled = false;
  }
}

saveBtn.addEventListener('click', saveActivity);
refreshBtn.addEventListener('click', fetchActivities);
activityInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    saveActivity();
  }
});

fetchActivities();
