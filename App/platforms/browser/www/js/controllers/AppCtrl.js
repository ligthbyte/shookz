app.controller('AppCtrl', function ($scope, $location, $route, $timeout, api){
  //check internet connection
  var networkState = navigator.connection.type;
  if (networkState !== Connection.NONE) {
    
  }

  $scope.changeView = function(viewName){
    $location.path(viewName);
  }

  $scope.getPlatform = function(){
    console.log(device.platform);
    return device.platform;
  }

  $scope.loaderState = false;
  $scope.loaderTimeout = true; 
  $scope.showLoader = function(){
    $scope.loaderState = true;
    $scope.loaderTimeout = false;    
    $timeout(function(){ //set a minimum show time for the loader
      $scope.loaderTimeout = true;
    }, 1300);
  }
  $scope.hideLoader = function () {
    $scope.loaderState = false;    
  }

  $scope.$on('$routeChangeStart', function(event, next, prev) {
    //Disable viewing the login page when logged in
    var user = window.localStorage.getItem('user');
    var token = window.localStorage.getItem('token');
    if($location.path() == '/login' && user && token){
      event.preventDefault();
    }
   });

  $scope.updateLoginDetails = function(user, token){
    window.localStorage.setItem('user', JSON.stringify(user));
    window.localStorage.setItem('token', token);
  }

  $scope.checkLoginStatus = function(){
    var user = window.localStorage.getItem('user');
    var token = window.localStorage.getItem('token');

    if(user && token){
      user = JSON.parse(user);
      api.checkLoginStatus({ user_id: user.user_id, token: token }, function(response){
        if(response.data.status == "ok"){
          $scope.loggedUser = user;
          $scope.loggedToken = token;
          $scope.changeView('/');
        }
        else
          $scope.changeView('login');
      });
    }
    else
      $scope.changeView('login');
  }
  $scope.checkLoginStatus();
});
