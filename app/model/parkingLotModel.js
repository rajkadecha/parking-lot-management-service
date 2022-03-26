import mongoose from 'mongoose';

const parkingLotSchema = new mongoose.Schema({
  name: String,
  area: String,
  hatchbackRate: Number,
  twoWheelerRate: Number,
  suvRate: Number,
  hatchbackCapacity: Number,
  twoWheelerCapacity: Number,
  suvCapacity: Number,
  createdAt: {
    type: Date,
    default: new Date(),
    select: false,
  },
});

const ParkingLot = mongoose.model('ParkingLot', parkingLotSchema);

export default ParkingLot;
