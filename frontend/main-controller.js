angular.module('ParkingApp')
  .controller('MainController', function ($scope, StatsService, ParkingsService, InventoryService) {
    $scope.initTime = ""
    $scope.futureTime = ""
    $scope.futureHours = 0

    $scope.parking = {}
    $scope.errorMessage = ""

    $scope.parkinglotId = 1

    $scope.inventory = {
      totalAmountOfCars: 0,
      value: 0,
      discountInCents: 0
    }

    $scope.totalAmountDue = 0
    $scope.totalDiscount = 0

    $scope.parkingLot = []

    $scope.refresh = function () {
      StatsService.get().then(function (data) {
        $scope.initTime = data.initTime
        $scope.futureTime = moment($scope.initTime).add($scope.futureHours, 'hours').utc().toString()
      })

      ParkingsService.get($scope.parkinglotId, $scope.futureHours).then(function (data) {
        $scope.parkingLot = data

        $scope.totalAmountDue = data.reduce(function (prev, curr) {
          return prev + curr.value
        }, 0)

        $scope.totalAmountDue = $scope.totalAmountDue.toFixed(2)

        $scope.totalDiscount = data.reduce(function (prev, curr) {
          return prev + curr.discountInCents
        }, 0)

        $scope.totalDiscount = $scope.totalDiscount.toFixed(2)
        $scope.totalCars = data.length
      })

      InventoryService.get($scope.futureHours).then(function (data) {
        $scope.inventory = data
      })
    }

    $scope.createParking = function () {
      ParkingsService.create($scope.parking).then(function (data) {
        $scope.errorMessage = ""
        $scope.parking = {}
        $scope.refresh()
      }, function (err) {
        $scope.errorMessage = err.data.message
      })
    }

    $scope.refresh()
  })
