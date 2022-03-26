import { toUpper } from 'lodash';
import ParkingDetail from '../model/parkingDetailModel';
import AppError from '../utils/appError';

/**
 * step to find out vehicle history
 * step 1: get vehicle number from params
 * step 2: call parking detail db and get all particular vehicle data
 * step 3: Model out data in required info
 */

export const vehicleData = async (req, res, next) => {
  try {
    const vehicleNumber = toUpper(req.params.vehiclenumber);
    const parkingVehicleDetail = await ParkingDetail.find({ vehicleNumber }).populate({
      path: 'parkingLot',
      select: '-__v',
    });

    if (!parkingVehicleDetail.length)
      return res.status(200).json({ status: 'No vehicle available with provided number', parkingVehicleDetail });

    res.status(200).json({ status: 'vehicle data fetch successfuly', parkingVehicleDetail });
  } catch (e) {
    console.log(e);
    return next(new AppError('Error while fetching vehicle data', 404));
  }
};
