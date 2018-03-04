app.controller('AppCtrl', function ($scope, $location, $route, $timeout, api){
  //main popup
  $scope.mainPopupState = false;
  $scope.mainPopupCaption = '';
  $scope.mainPopupConfirmBtnText = 'אישור';
  $scope.mainPopupOnClose = null;
  $scope.toggleMainPopup = function (caption = '', onClosePopupFunc = null, confirmBtnText = 'אישור') {
    console.log('asked popup to open');
    if ($scope.mainPopupState) {
      $scope.mainPopupState = false;
      if ($scope.mainPopupOnClose) {
        $scope.mainPopupOnClose();
      }
    }
    else {
      $scope.mainPopupCaption = caption;
      $scope.mainPopupConfirmBtnText = confirmBtnText;
      $scope.mainPopupOnClose = onClosePopupFunc;
      $scope.mainPopupState = true;
    }
  }

  //check internet connection
  document.addEventListener("offline", function(){
    $scope.toggleMainPopup('כדי שהאפליקציה תעבוד היא נדרשת לחיבור לאינטרנט. נא הפעל את האינטרנט במכשירך.', null, null);
  }, false);
  document.addEventListener("online", function () {
    $scope.mainPopupState = false;
  }, false);  
  if (navigator.connection.type === Connection.NONE) { //no internet connection
    $scope.toggleMainPopup('כדי שהאפליקציה תעבוד היא נדרשת לחיבור לאינטרנט. נא הפעל את האינטרנט במכשירך.', null, null);
  }
  else{
    console.log('There is an internet connection!');
  }


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
