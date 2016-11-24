var mongoose = require('mongoose')

var Schema = mongoose.Schema

var ParkingSchema = new Schema({
  brand: String,
  licenseplate: String,
  parkinglotid: String,
  parkingtime: Date,
  parkingyear: String,
  parkingmonth: String,
  parkingday: String
})

ParkingSchema.index({ name: 'parkinglotIdIndex', parkinglotId: 1 })
ParkingSchema.index({ name: 'parkingTimeIndex', parkingTime: 1 })

var Parking = mongoose.model('Parking', ParkingSchema)

module.exports = Parking
