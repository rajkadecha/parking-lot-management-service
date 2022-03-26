import express from 'express';
import { parkingEntry } from '../controller/parkingEntryController';
import { parkingExit } from '../controller/parkingExitController';
import { vehicleData } from '../controller/vehicleDataController';

const router = express.Router();

router.route('/entry').post(parkingEntry);
router.route('/exit').post(parkingExit);
router.route('/vehicle-data/:vehiclenumber').get(vehicleData);

export default router;
