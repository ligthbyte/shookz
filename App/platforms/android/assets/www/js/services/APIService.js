app.service('api', function($http) {

  this.checkLoginStatus = function(id_and_token, callback){
    // $http.post(BASE_URL + 'LoginStatus.php', id_and_token).then(callback);
    $http.get('jsons/loginStatus.json').then(callback);
  };

  this.loginUser = function(user, callback){
    // $http.post(BASE_URL + 'login.php', user).then(callback);
    //$token = bin2hex(openssl_random_pseudo_bytes(64)); in PHP
    $http.get('jsons/login.json').then(callback);
  };

  this.registerUser = function (user, callback) {
    // $http.post(BASE_URL + 'register.php', user).then(callback);
    //$token = bin2hex(openssl_random_pseudo_bytes(64)); in PHP
    $http.get('jsons/register.json').then(callback);
  };  

});
