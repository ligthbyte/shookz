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
                if($scope.watchId){
                    navigator.geolocation.clearWatch($scope.watchId);
                    $scope.watchId = null;
                }
                $scope.$apply();
            },
            function (error) {
                console.log('failed converting coordinates to address, error: ', error);
                $scope.addPopup({
                    name: 'failedCoord',
                    caption: 'התרחשה שגיאה בעת השגת מיקומך. צא מהאפליקציה וסגור אותה ברקע, ולאחר מכן פתח אותה מחדש.',
                    onClose: function () { navigator.app.exitApp(); },
                    confirmBtnText: 'צא מהאפליקציה'
                });
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
        navigator.geolocation.getCurrentPosition(onGetLocationSuccess, onGetLocationFail, { enableHighAccuracy: true, maximumAge: 60000, timeout: 8000 });
    }    
    function watchUserLocation() {
        if(!$scope.watchId){
            $scope.watchId = navigator.geolocation.watchPosition(onGetLocationSuccess, onGetLocationFail, { enableHighAccuracy: true, maximumAge: 60000, timeout: 8000 });
            $scope.$apply();
        }
    }
    function requestLocationAuthorization() {
        cordova.plugins.diagnostic.requestLocationAuthorization(function (status) {
            console.log('auth status: ', status);
            switch (status) {
                case 'GRANTED':
                    $scope.locationAccessible = true;    
                    $scope.closePopup('locationDisabled');
                    $scope.$apply(); 
                    watchUserLocation();
                    break;
                case 'DENIED_ALWAYS':
                    //TODO: FIX IT
                    $scope.addPopup({
                        name: 'locationDenied',
                        caption: 'האפליקציה אינה יכולה לפעול ללא שירותי מיקום, נא הפעל אותם מהגדרות האפליקציה->הרשאות.',
                        onClose: function() {                        
                            cordova.plugins.diagnostic.switchToSettings(function(){
                                // watchUserLocation();
                            });
                        },
                        confirmBtnText: 'להגדרות האפליקציה'
                    });                    
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
                        $scope.locationAccessible = true;
                        $scope.$apply();
                        watchUserLocation();
                    }
                    else{
                        requestLocationAuthorization();
                    }
                }, function (error) {
                    $scope.addPopup({
                        name: 'locationFailed',
                        caption: 'התרחשה שגיאה בעת השגת מיקומך, אנא הזן מיקום ידני.',
                        onClose: null,
                        confirmBtnText: 'אישור'
                    });                      
                    $scope.$apply();
                });            
            }
            else{
                $scope.addPopup({
                    name: 'locationDisabled',
                    caption: 'נא הפעל שירותי מיקום על מנת שנוכל להתאים את המודעות למיקומך הנוכחי.',
                    onClose: function () {
                        window.cordova.plugins.settings.open("location", function() {
                            initLocation();
                        });
                    },
                    confirmBtnText: 'הפעל שירותי מיקום'
                }); 
                $scope.$apply();
            }
        }, function (error) {
            $scope.addPopup({
                name: 'locationFailed',
                caption: 'התרחשה שגיאה בעת השגת מיקומך, אנא הזן מיקום ידני.',
                onClose: null,
                confirmBtnText: 'אישור'
            });                  
        });
    }
    cordova.plugins.diagnostic.registerLocationStateChangeHandler(function(state){
        if(($scope.getPlatform() === "Android" && state !== cordova.plugins.diagnostic.locationMode.LOCATION_OFF)
            || ($scope.getPlatform() === "iOS") && ( state === cordova.plugins.diagnostic.permissionStatus.GRANTED
                || state === cordova.plugins.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE
        )){ //location is availbale
            cordova.plugins.diagnostic.registerLocationStateChangeHandler(false); //stop watching
            $scope.closePopup('locationDisabled');
            $scope.$apply();
            requestLocationAuthorization();
        }
        else{
            initLocation();
        }
    });
    
    initLocation();
});
