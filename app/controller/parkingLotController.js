import ParkingLot from '../model/parkingLotModel';
import AppError from '../utils/appError';

export const createParkingLot = async (req, res, next) => {
  try {
    const { name, area, hatchbackRate, twoWheelerRate, suvRate, hatchbackCapacity, twoWheelerCapacity, suvCapacity } =
      req.body;
    const parkingLot = await ParkingLot.create({
      name,
      area,
      hatchbackRate,
      twoWheelerRate,
      suvRate,
      hatchbackCapacity,
      twoWheelerCapacity,
      suvCapacity,
    });
    res.status(201).json({
      status: 'Parking lot created successfully',
      parkingLot,
    });
  } catch (e) {
    console.log(e);
    return next(new AppError('Error while creating parking lot data', 404));
  }
};

export const getAllParkingLot = async (req, res, next) => {
  try {
    const parkingLots = await ParkingLot.find();
    console.log(parkingLots);
    res.status(200).json({
      status: 'Parking lot fetch successfully',
      results: parkingLots.length,
      parkingLots,
    });
  } catch (e) {
    console.log(e);
    return next(new AppError('Error while fetching parking lot data', 404));
  }
};
