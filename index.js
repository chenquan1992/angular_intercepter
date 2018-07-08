var myApp = angular.module('BlurAdmin', []);

// myApp.factory('timestampMarker', [function () {
//     return {
//         request: function (config) {
//             config.requestTimestamp = new Date().getTime();
//             // alert("开始请求");
//             return config;
//         },
//         response: function (response) {
//             response.config.responseTimestamp = new Date().getTime();
//             // alert("请求结束");
//             return response;
//         }
//     };
// }]);

myApp.factory('timestampMarker', [ '$q', '$injector',function($q, $injector,$scope) {
    var httpInterceptor = {
        'responseError' : function(response) {
            if (response.status == 401) {
                alert("权限不足");
                alert("权限不足"+response.data);
                var rootScope = $injector.get('$rootScope');
                var state = $injector.get('$rootScope').$state.current.name;
                rootScope.stateBeforLogin = state;
                rootScope.$state.go("login");
                return $q.reject(response);
            } else if (response.status === 429) {
                alert("太多请求");
                return $q.reject(response);
            }
        },
        'response' : function(response) {
            return response;
        }
    }
    return httpInterceptor;
}
]);

myApp.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('timestampMarker');
}]);


var app = angular.module('myApp', ['BlurAdmin']);
app.controller('siteCtrl', function ($scope, $http) {
    $http.get('http://192.168.0.103:8081/401').then(function (response) {
        // var time = response.config.responseTimestamp - response.config.requestTimestamp;
        console.log("response:"+response);
    });
});


