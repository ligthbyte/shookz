app.controller('RegisterCtrl', function($scope, api, validation){
  $scope.registerUser = {};
  $scope.registerUser.avatar = 1;
  $scope.chosenGender = 'm';
  $scope.registerUser.gender = 'm';
  
  //TODO: DELETE IN PROD
  $scope.registerUser.name = 'שלומי כהן';
  $scope.registerUser.phone = '0548885475';
  $scope.registerUser.email = 'esgw@egwer.com';
  $scope.registerUser.birth_date = '20.12.1985';
  // --------------------

  $scope.errorFields = [];

  $scope.$watch('registerUser.image', function(newValue, oldValue){
    if(newValue){
      var reader = new FileReader();
      reader.readAsDataURL(newValue);
      reader.onloadend = function () {
        $scope.$apply(function(){
          $scope.imageUrl = reader.result;
          $scope.registerUser.avatar = 0;
        });
      }
    }
  });

  $scope.goBackToLogin = function(){
    $scope.changeView('login');    
  }

  $scope.isAvatarSelected = function(i){
    if(i == 0)
      return ($scope.registerUser.avatar == i && $scope.registerUser.image) ? 'selected' : '';
    return ($scope.registerUser.avatar == i) ? 'selected' : '';
  }
  $scope.setSelectedAvatar = function(i){
    $scope.registerUser.avatar = i;
  }

  $scope.submitForm = function(){
    $scope.errorFields = [];
    $scope.errorMsg = null;

    if (!$scope.registerUser.name || $scope.registerUser.name.length < 2){
      $scope.errorFields.push('name');
      $scope.errorMsg = 'נא הכנס שם מלא תקין.';
      return;
    }
    
    if (!validation.email($scope.registerUser.email)){
      $scope.errorFields.push('email');
      $scope.errorMsg = 'נא הכנס כתובת אימייל תקינה.';
      return;
    }

    if (!validation.phone($scope.registerUser.phone)) {
      $scope.errorFields.push('phone');
      $scope.errorMsg = 'נא הכנס מספר נייד תקין.';
      return;
    }  
    
    if (!$scope.registerUser.birth_date || $scope.registerUser.birth_date == '') {
      $scope.errorFields.push('date');
      $scope.errorMsg = 'נא בחר תאריך לידה.';
      return;
    }      

    $scope.showLoader();

    api.registerUser($scope.registerUser, function(response){
        $scope.hideLoader();
        var unregister = $scope.$watch('loaderTimeout', function (newValue, oldValue) {
          if (newValue === true) { //check if the loader has timed out
            if (response.data.status == 'ok') {
              $scope.updateLoginDetails(response.data.data.user, response.data.data.token);
              $scope.changeView('/');
            }
            else {
              $scope.errorMsg = 'התרחשה שגיאה בעת ההרשמה, אנא נסה שנית מאוחר יותר.'; 
            }
            unregister();
          }
        });
    });
  }
});
