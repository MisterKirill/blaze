import express from 'express';

const r = express.Router();

r.post('/users', (req, res) => {
  res.send('hello world');
});

export default r;
