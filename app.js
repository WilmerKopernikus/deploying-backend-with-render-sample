const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;

// Database connection
const pool = new Pool({
  connectionString: DATABASE_URL,
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/activities', async (req, res) => {
  const activity = typeof req.body.activity === 'string' ? req.body.activity.trim() : '';

  if (!activity) {
    return res.status(400).json({ status: 'error', message: 'Activity is required.' });
  }

  try {
    const client = await pool.connect();
    const insertResult = await client.query(
      'INSERT INTO my_activities (activity) VALUES ($1) RETURNING id, activity',
      [activity],
    );
    client.release();

    return res.status(201).json({
      status: 'success',
      message: `Activity "${activity}" inserted successfully`,
      activity: insertResult.rows[0],
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

app.get('/api/activities', async (req, res) => {
  try {
    const client = await pool.connect();

    const activitiesResult = await client.query('SELECT id, activity FROM my_activities ORDER BY id DESC');
    client.release();

    return res.json({
      activity_count: activitiesResult.rowCount,
      activities: activitiesResult.rows,
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
