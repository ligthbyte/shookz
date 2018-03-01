app.controller('LoginCtrl', function($scope, api){
  if($scope.loggedUser && $scope.loggedToken){
    $scope.changeView('/');
  }

  $scope.user = {};

  $scope.fbLoginUser = function(){

  }

  $scope.loginUser = function(){
    if(!$scope.user.email){
      $scope.loginErrorMsg = 'נא הכנס כתובת מייל';
      return;
    }
    if(!$scope.user.password){
      $scope.loginErrorMsg = 'נא הכנס סיסמא';
      return;
    }

    api.loginUser($scope.user, function(response){
      if(response.data.status == 'ok'){
        $scope.updateLoginDetails(response.data.data.user, response.data.data.token);
        $scope.changeView('/');
      }
      else{
        $scope.loginErrorMsg = response.data.msg;
      }
    });
  }

  $scope.goToRegister = function(){
    $scope.changeView('register');
  }
});
