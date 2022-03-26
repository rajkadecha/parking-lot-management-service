import express from 'express';
import cors from 'cors';
import parkingLotRoutes from './routes/parkingLotRoutes';
import parkingRoutes from './routes/parkingRoutes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/parking-lot', parkingLotRoutes);
app.use('/api/v1/parking', parkingRoutes);

export default app;
