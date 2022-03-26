import ParkingDetail from '../model/parkingDetailModel';

export const parkingVehicleData = async (vehicleId) => {
  const vehicleHistory = await ParkingDetail.findOne({ vehicleNumber: vehicleId });
  console.log(vehicleHistory);
  return vehicleHistory;
};
