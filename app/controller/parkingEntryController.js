import { toUpper } from 'lodash';
import ParkingDetail from '../model/parkingDetailModel';
import ParkingLot from '../model/parkingLotModel';
import { parkingVehicleData } from '../utils/parkingVehicleDetail';
import AppError from '../utils/appError';

/**
 * Steps for parking entry
 * step 1: get vehicle name, type, parkingLot name
 * step 2: find vehicle entry in Parking detail db
 * step 3: if data available check isParked should false
 * step 4: check space availability with vehicle type
 * step 5: if no space then send respose parking full
 * step 6: if space availabe then update parking lot db with vehicle type capacity - 1, update parking detail entryTime, update isParked true
 *
 */
export const parkingEntry = async (req, res, next) => {
  try {
    // step 1: get vehicle name, type, parkingLot name
    const { vehicleNumber, vehicleType, parkingLotId } = req.body;

    // step 2: find vehicle entry in Parking detail db
    const parkingVehicleDetail = await parkingVehicleData(toUpper(vehicleNumber));
    console.log('parking vehicle detail fetch');

    // step 3: if data available then check isParked should false
    let isAlreadyParked = true;
    if (parkingVehicleDetail && parkingVehicleDetail.isParked === true) {
      return res.status(400).json({ status: 'Duplicate entry not allowed' });
    } else if (parkingVehicleDetail && parkingVehicleDetail.isParked === false) {
      isAlreadyParked = false;
    }

    // step 4: check space availability with vehicle type
    const parkingLotDetail = await ParkingLot.findById(parkingLotId[0]);
    console.log('parkingLotDetail');

    if (!parkingLotDetail) return res.status(404).json({ status: 'Unable to find parking lot with provided id' });

    const availableParking = parkingLotDetail[`${vehicleType}Capacity`];
    console.log('availability of parking check', availableParking);

    // step 5: if no space then send respose parking full
    if (availableParking === 0) {
      return res.status(400).json({
        status: '👎 Parking Full',
      });
    }

    // step 6: if space availabe then update parking lot db with vehicle type capacity - 1, update parking detail entryTime
    let updateParkingLotDetail;
    if (vehicleType === 'hatchback') {
      updateParkingLotDetail = await ParkingLot.findByIdAndUpdate(
        parkingLotId[0],
        { hatchbackCapacity: availableParking - 1 },
        { new: true }
      );
    }
    if (vehicleType === 'twoWheeler') {
      updateParkingLotDetail = await ParkingLot.findByIdAndUpdate(
        parkingLotId[0],
        { twoWheelerCapacity: availableParking - 1 },
        { new: true }
      );
    }
    if (vehicleType === 'suv') {
      updateParkingLotDetail = await ParkingLot.findByIdAndUpdate(
        parkingLotId[0],
        { suvCapacity: availableParking - 1 },
        { new: true }
      );
    }
    console.log('Parking lot detail updated');

    const entryTime = new Date();
    const isParked = true;

    let parkingEntryData;
    if (parkingVehicleDetail === null) {
      parkingEntryData = await ParkingDetail.create({
        vehicleNumber: toUpper(vehicleNumber),
        vehicleType,
        parkingLot: [parkingLotId],
        entryTime,
        isParked,
      });
      console.log('New parking entry created');
    }

    if (!isAlreadyParked) {
      // const vehicleParkingLotHistory = parkingVehicleDetail.parkingLot
      parkingEntryData = await ParkingDetail.findOneAndUpdate(
        {
          vehicleNumber: toUpper(vehicleNumber),
        },
        {
          parkingLot: [parkingLotId],
          entryTime,
          isParked,
        },
        { new: true }
      );
      console.log('Parking entry updated');
    }

    return res.status(201).json({
      status: '🚀 Vehicle entered successfully',
      parkingEntryData,
    });
  } catch (e) {
    console.log(e);
    return next(new AppError('Error while vehicle entry', 404));
  }
};
