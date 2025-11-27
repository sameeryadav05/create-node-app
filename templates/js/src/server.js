import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDb from './config/db.js';
import mainRouter from './routes/user.routes.js';
import ExpressError from './utils/ExpressError.js';

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Routes
app.use('/api', mainRouter); // http://localhost:5000/api/..

// 404 Handler
app.use((req, res, next) => {
  next(new ExpressError(404, 'Endpoint not found!'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  const { status = 500, message = 'Internal Server Error' } = err;

  res.status(status).json({
    success: false,
    message,
  });
});

// Connect to database and start server
connectDb(process.env.DB_NAME || 'your_database_name')
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to the database', err);
    process.exit(1);
  });

export default app;