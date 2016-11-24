angular.module('ParkingApp').factory('StatsService', ['$http', '$q', StatsService])

function StatsService ($http, $q) {
  var service = {}

  service.get = function () {
    var deferred = $q.defer()

    url = '/stats/'

    $http.get(url).then(
      function (response) {
        deferred.resolve(response.data)
      },

      function (response) {
        deferred.reject('error')
      }
    )
    return deferred.promise
  }

  // service API
  return service
}
