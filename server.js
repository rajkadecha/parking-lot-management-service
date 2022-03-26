import mongoose from 'mongoose';
import app from './app/app';

const DB = '';

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log('DB connection successful'));

const port = 3030;
const server = app.listen(port, () => console.log(`listening on port ${port}`));

export { server };
