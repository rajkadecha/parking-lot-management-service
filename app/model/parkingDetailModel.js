import mongoose from 'mongoose';

const parkingDetailSchema = new mongoose.Schema({
  vehicleNumber: String,
  vehicleType: {
    type: String,
    enum: ['hatchback', 'twoWheeler', 'suv'],
  },
  totalDuration: {
    type: Number,
    default: 0,
  },
  lastDuration: {
    type: Number,
    default: 0,
  },
  totalAmountPaid: {
    type: Number,
    default: 0,
  },
  lastAmountPaid: {
    type: Number,
    default: 0,
  },
  parkingLot: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ParkingLot' }],
  entryTime: Date,
  isParked: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: new Date(),
    select: false,
  },
});

const ParkingDetail = mongoose.model('ParkingDetail', parkingDetailSchema);

export default ParkingDetail;
