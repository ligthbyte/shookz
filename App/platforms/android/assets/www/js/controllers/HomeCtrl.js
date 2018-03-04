app.controller('HomeCtrl', function($scope){
    $scope.currentView = 'main';
    $scope.location = 'טוען את מיקומך...';
    
    function onGetLocationSuccess(position) {
        console.log('succeed getting coordinates!', position);
        nativegeocoder.reverseGeocode(
            function (result) {
                console.log('succeed converting coordinates to address!');
                var city = result[0].locality;
                var streetName = result[0].thoroughfare;
                var streetNumber = result[0].subThoroughfare;
                $scope.location = streetName + ' ' + streetNumber + ', ' + city;
                $scope.$apply();
                if($scope.watchId){
                    navigator.geolocation.clearWatch($scope.watchId);
                    $scope.watchId = null;
                }
            },
            function (error) {
                console.log('failed converting coordinates to address, error: ', error);
                $scope.toggleMainPopup('התרחשה שגיאה בעת השגת מיקומך. צא מהאפליקציה וסגור אותה ברקע, ולאחר מכן פתח אותה מחדש.', function () { navigator.app.exitApp(); }, 'צא מהאפליקציה');

                $scope.mainPopupState = true;
                $scope.$apply();
            },
            position.coords.latitude,
            position.coords.longitude,
            { useLocale: true, maxResults: 1 }
        );      
    }
    function onGetLocationFail(error) {
        console.log('failed getting coordinates, error: ', error);

         //TODO: handle timeout
        if(error.code === 1){
            requestLocationAuthorization();
        }
        else{
            initLocation();
        }       
    }
    function getUserPosition() {
        navigator.geolocation.getCurrentPosition(onGetLocationSuccess, onGetLocationFail, { enableHighAccuracy: true, timeout: 8000 });
    }    
    function watchUserLocation() {
        $scope.watchId = navigator.geolocation.watchPosition(onGetLocationSuccess, onGetLocationFail, { enableHighAccuracy: true, timeout: 8000 });
    }
    function requestLocationAuthorization() {
        cordova.plugins.diagnostic.requestLocationAuthorization(function (status) {
            console.log('auth status: ', status);
            switch (status) {
                case 'GRANTED':
                    if(!$scope.watchId) watchUserLocation();
                    break;
                case 'DENIED_ALWAYS':
                    //TODO: FIX IT
                    $scope.toggleMainPopup('האפליקציה אינה יכולה לפעול ללא שירותי מיקום, נא הפעל אותם מהגדרות האפליקציה->הרשאות.', function() {                        
                        cordova.plugins.diagnostic.switchToSettings(function(){
                            watchUserLocation();
                        });
                    }, 'קחו אותי להגדרות האפליקציה');
                    $scope.$apply();
                    break;
                default:
                    requestLocationAuthorization();
                    break;
            }
        }, function (error) {
            console.error(error);
        });
    }   
    function initLocation() {
        cordova.plugins.diagnostic.isLocationEnabled(function(available){
            if(available){
                cordova.plugins.diagnostic.isLocationAuthorized(function(authorized){
                    if(authorized){
                        console.log('location authorized');
                        watchUserLocation();
                    }
                    else{
                        requestLocationAuthorization();
                    }
                }, function (error) {
                    $scope.toggleMainPopup('התרחשה שגיאה בעת השגת מיקומך, אנא הזן מיקום ידני.');
                    $scope.$apply();
                });            
            }
            else{
                //TODO: Handle when user go back to app and dont turn on location (maybe create/search some kind of watcher for location services)
                $scope.toggleMainPopup('נא הפעל שירותי מיקום על מנת שנוכל להתאים את המודעות למיקומך הנוכחי.', function () {
                    window.cordova.plugins.settings.open("location", function() {
                        initLocation();
                    });
                }, 'הפעל שירותי מיקום');
                $scope.$apply();
            }
        }, function (error) {
            $scope.toggleMainPopup('התרחשה שגיאה בעת השגת מיקומך, אנא הזן מיקום ידני.');
        });
    }
    cordova.plugins.diagnostic.registerLocationStateChangeHandler(function(state){
        if(($scope.getPlatform() === "Android" && state !== cordova.plugins.diagnostic.locationMode.LOCATION_OFF)
            || ($scope.getPlatform() === "iOS") && ( state === cordova.plugins.diagnostic.permissionStatus.GRANTED
                || state === cordova.plugins.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE
        )){ //location is availbale
            cordova.plugins.diagnostic.registerLocationStateChangeHandler(false); //stop watching
            watchUserLocation();
        }
        else{
            initLocation();
        }
    });
    $scope.$watch('connectedToInternet', function(){
        if($scope.connectedToInternet){
            initLocation();
        }
    });
});
