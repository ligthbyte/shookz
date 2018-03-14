app.controller('AppCtrl', function ($scope, $location, $route, $timeout, api){
  //main popup
  $scope.shownPopup = null;
  $scope.popups = [];
  $scope.addPopup = function(options) {
    console.log('asked popup to open with caption: "' + options.caption + '"');
    $scope.popups.push(options);
    $scope.shownPopup = options.name;
  }
  $scope.closePopup = function(name) {
    console.log('asked popup to close with name: "' + name + '"');
    for(var i = 0; i < $scope.popups.length; i++){
      if($scope.popups[i].name == name){
        $scope.popups.splice(popupIndex, 1);
        break;
      }  
    }
  }
  $scope.popupConfirmBtnClick = function(name, onClose = null) {
    $scope.closePopup(name);
    if(onClose) onClose();
  }

  //check internet connection
  $scope.connectedToInternet = false;
  document.addEventListener("offline", function(){
    $scope.addPopup({
      name: 'networkState',
      caption: 'כדי שהאפליקציה תעבוד היא נדרשת לחיבור לאינטרנט. נא הפעל את האינטרנט במכשירך.',
      onClose: null,
      confirmBtnText: null
    });
    $scope.connectedToInternet = false;
  }, false);
  document.addEventListener("online", function () {
    $scope.closePopup('networkState');
    $scope.connectedToInternet = true;
  }, false);  

  $scope.changeView = function(viewName){
    $location.path(viewName);
  }

  $scope.getPlatform = function(){
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
