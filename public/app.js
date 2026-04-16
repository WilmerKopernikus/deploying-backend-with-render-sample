const generateBtn = document.getElementById('generate-btn');
const refreshBtn = document.getElementById('refresh-btn');
const statusEl = document.getElementById('status');
const countEl = document.getElementById('count');
const activitiesList = document.getElementById('activities-list');

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.style.color = isError ? '#b91c1c' : '#1d4ed8';
}

function renderActivities(data) {
  countEl.textContent = data.activity_count;
  activitiesList.innerHTML = '';

  if (!Array.isArray(data.activities) || data.activities.length === 0) {
    const item = document.createElement('li');
    item.className = 'empty';
    item.textContent = 'No activities saved yet.';
    activitiesList.appendChild(item);
    return;
  }

  data.activities.forEach((activity) => {
    const item = document.createElement('li');
    item.textContent = activity;
    activitiesList.appendChild(item);
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

async function insertActivity() {
  generateBtn.disabled = true;
  setStatus('Creating and saving a new activity...');

  try {
    const response = await fetch('/api/insert_activity');
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.message || 'Failed to insert activity.');
    }

    setStatus(payload.message);
    await fetchActivities();
  } catch (error) {
    setStatus(error.message, true);
  } finally {
    generateBtn.disabled = false;
  }
}

generateBtn.addEventListener('click', insertActivity);
refreshBtn.addEventListener('click', fetchActivities);

fetchActivities();
