import { toUpper } from 'lodash';
import ParkingDetail from '../model/parkingDetailModel';
import ParkingLot from '../model/parkingLotModel';
import { parkingVehicleData } from '../utils/parkingVehicleDetail';
import AppError from '../utils/appError';

/**
 * step for exit vehicle
 * step 1: enter vehicle number
 * step 2: get parking details of vehicle
 * step 3: check isParked should true
 * step 4: get rate card from parking lot db
 * step 5: calculate parking time and amount to pay as per vehicle type
 * step 6: add total duration/amountPaid in parking detail db
 * step 7: increment parking space count with 1 as vehicle exit
 * step 8: update both collection with new value
 */
export const parkingExit = async (req, res) => {
  try {
    // step 1: enter vehicle number
    const { vehicleNumber, parkingLotId } = req.body;

    // step 2: get parking details of vehicle
    const parkingVehicleDetail = await parkingVehicleData(toUpper(vehicleNumber));
    if (parkingVehicleDetail === null) return res.status(400).json({ status: 'unable to find vehicle in system' });
    let { vehicleType, totalDuration, totalAmountPaid, entryTime, isParked, parkingLot } = parkingVehicleDetail;

    // step 3: check isParked should true
    if (!isParked) return res.status(400).json({ status: 'wrong exit, vehicle not parked' });

    // wrong entry prevention
    const checkParkingLotId = parkingLot.find((lotId) => lotId.toString() === parkingLotId[0]);
    if (!checkParkingLotId) return res.status(400).json({ status: 'vehicle not parked in this parking lot' });

    // step 4: get rate card from parking lot db
    const { hatchbackRate, twoWheelerRate, suvRate, hatchbackCapacity, twoWheelerCapacity, suvCapacity } =
      await ParkingLot.findById(parkingLotId);

    // step 5: calculate parking time and amount to pay as per vehicle type
    const parkingTime = ((new Date() - entryTime) / 3600000).toFixed(2);
    totalDuration += +parkingTime;
    console.log('Parking time and total duration calculated successfully');

    let amountToBePay = '',
      rate = '';
    if (vehicleType === 'hatchback') {
      rate = hatchbackRate;
    }
    if (vehicleType === 'twoWheeler') {
      rate = twoWheelerRate;
    }
    if (vehicleType === 'suv') {
      rate = suvRate;
    }
    console.log('Rate got successfully as per vehicle type');

    if (Math.floor(parkingTime / 2) < 3) {
      amountToBePay = rate;
    } else if (parkingTime % 2 === 0) {
      amountToBePay = (rate * parkingTime) / 2;
    } else {
      amountToBePay = (rate * parkingTime) / 2;
    }
    totalAmountPaid += +amountToBePay;
    console.log('Amount to pay and total amount calculated successfully');

    const updateParkingDetail = await ParkingDetail.findOneAndUpdate(
      { vehicleNumber: toUpper(vehicleNumber), parkingLot: parkingLotId[0] },
      {
        isParked: false,
        lastDuration: +parkingTime,
        totalDuration,
        lastAmountPaid: +amountToBePay,
        totalAmountPaid,
      },
      { new: true }
    );
    console.log('Parking detail updated');

    // step 7: increment parking space count with 1 as vehicle exit
    let updateParkingLotDetail;
    if (vehicleType === 'hatchback') {
      updateParkingLotDetail = await ParkingLot.findByIdAndUpdate(
        parkingLotId,
        { hatchbackCapacity: hatchbackCapacity + 1 },
        { new: true }
      );
    }
    if (vehicleType === 'twoWheeler') {
      updateParkingLotDetail = await ParkingLot.findByIdAndUpdate(
        parkingLotId,
        { twoWheelerCapacity: twoWheelerCapacity + 1 },
        { new: true }
      );
    }
    if (vehicleType === 'suv') {
      updateParkingLotDetail = await ParkingLot.findByIdAndUpdate(
        parkingLotId,
        { suvCapacity: suvCapacity + 1 },
        { new: true }
      );
    }
    console.log('Parking lot detail updated');

    res.status(200).json({
      status: 'Vehicle exit successfully',
      updateParkingDetail,
    });
  } catch (e) {
    console.log(e);
    return next(new AppError('Error while vehicle exit', 404));
  }
};
