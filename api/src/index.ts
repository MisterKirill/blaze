import express from 'express';
import usersRouter from './routes/users';

const app = express();
app.use(express.json());

app.use(usersRouter);

app.listen(8080, () => {
  console.log('Server started on port 8080');
});
