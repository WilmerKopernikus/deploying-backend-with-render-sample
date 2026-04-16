## Deploying a Back-end with Render

Hello! This GitHub repo is intended to be used with the article [Deploying a Back-end with Render](https://www.codecademy.com/articles/deploying-a-back-end-application-with-render).

Make sure to follow the steps as outlined in the article to see how to use Render for your deployment needs!

You're free to make changes on your own branch, but for the sake of consistency, we will not be merging any external pull requests. Thank you and happy coding!

## Local usage

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up your environment variables:

   - `DATABASE_URL`: Postgres connection string.

3. Start the app:

   ```bash
   node app.js
   ```

4. Open `http://localhost:3000` to use the frontend.

## API endpoints

- `GET /api/activities`: list saved activities and total count.
- `GET /api/insert_activity`: generate one random activity and persist it.
- `GET /health`: health check.
