angular.module('ParkingApp').factory('InventoryService', ['$http', '$q', InventoryService])

function InventoryService ($http, $q) {
  var service = {}

  service.get = function (t) {
    var deferred = $q.defer()

    url = '/inventory/' + t

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
