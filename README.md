# ParkingLot

###This is a simple project to understand some concepts including Nodejs, Mongodb, Redis.


### Let's start

Developed using

- node **v6.5.0**
- Mongodb **v3.2.10**
- Redis **v3.2.5**

**Download the dependencies**

```
npm install
```

**Start Mongodb**

```
mongod
```

**Start Redis**

```
redis-server
```

**Start your server**

```
//This will run the drop.sh file which empties mongo and redis
npm start
```

##Endpoints

`GET http://localhost:8000/dashboard/`

  This will show a SPA(using angular) that shows some statistics and data regarding parking lots

`GET http://localhost:8000/parkinglots/1/cars/4`

Will return data by parking lot, such as amount due by the car 4 hours after the aplication started

````
[
  {
    brand: "volkswagen",
    licensePlate: "12-abc-34",
    parkingTime: "2016-04-26T11:00:00.000Z",
    value: 3.6,
    discountInCents: 0
  },
  {
    brand: "volkswagen",
    licensePlate: "12-abc-34",
    parkingTime: "2016-04-26T12:10:00.000Z",
    value: 1.2,
    discountInCents: 0
  }
]
````


`GET http://localhost:8000/inventory/4`

Will return data regarding all parking lots, such as total amount due and number of cars

````
{
  totalAmountOfCars: 46,
  value: 103.2,
  discountInCents: 0
}
````

`POST http://localhost:8000/parkinglots/1/cars`

Will park a car in a parking lot

````
{
  brand: 'bmw',
  licenceplate: '12-ab-32',
  parkinglotid: 1,
  parkingtime: '2016-04-26T11:00:00.000Z'
}
````

##Load xml containing parking lots

`node tools/load-parking-lot/index.js <path-to-file.xml>`

## TODO

  - Add websocket notifications server

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
