import express from 'express';
import { createParkingLot, getAllParkingLot } from '../controller/parkingLotController';

const router = express.Router();

router.route('/create').post(createParkingLot);
router.route('/get-all').get(getAllParkingLot);

export default router;
