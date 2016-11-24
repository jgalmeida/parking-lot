angular.module('ParkingApp').factory('ParkingsService', ['$http', '$q', ParkingsService])

function ParkingsService ($http, $q) {
  var service = {}

  service.get = function (id, t) {
    var deferred = $q.defer()

    url = '/parkinglots/' + id + '/cars/' + t

    $http.get(url).then(
      function (response) {
        deferred.resolve(response.data)
      },

      function (response) {
        deferred.reject(response)
      }
    )
    return deferred.promise
  }

  service.create = function (obj) {
    var deferred = $q.defer()

    var req = {
      method: 'POST',
      url: '/parkinglots/' + obj.parkinglotid + '/cars/',
      data: obj
    }

    $http(req).then(
      function (response) {
        deferred.resolve(response)
      },

      function (response) {
        deferred.reject(response)
      }
    )
    return deferred.promise
  }

  // service API
  return service
}
