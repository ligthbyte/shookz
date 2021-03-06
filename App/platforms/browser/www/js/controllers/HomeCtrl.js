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
        $scope.location = 'מיקומך אינו זמין, נא הזן ידנית.';            
    }
    function getUserPosition() {
        navigator.geolocation.getCurrentPosition(onGetLocationSuccess, onGetLocationFail, { enableHighAccuracy: true, timeout: 20000 });
    }    
    function watchUserLocation() {
        navigator.geolocation.watchPosition(onGetLocationSuccess, onGetLocationFail, { enableHighAccuracy: true, timeout: 20000 });
    }
    function requestLocationAuthorization() {
        cordova.plugins.diagnostic.requestLocationAuthorization(function (status) {
            switch (status) {
                case cordova.plugins.diagnostic.permissionStatus.GRANTED:
                    watchUserLocation();
                    break;
                case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
                    console.log('Permission permanently denied.');
                    //FIX IT
                    $scope.toggleMainPopup('האפליקציה אינה יכולה לפעול ללא שירותי מיקום, נא הפעל אותם מההגדרות.', function() {                        
                        cordova.plugins.diagnostic.switchToSettings();
                    }, 'קחו אותי להגדרות');
                    break;
                default:
                    requestLocationAuthorization();
                    break;
            }
        }, function (error) {
            console.error(error);
        });
    }   
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
            });            
        }
        else{
            $scope.toggleMainPopup('אנא הפעל שירותי מיקום על מנת שנוכל להתאים את המודעות למיקומך הנוכחי.', function () { window.cordova.plugins.settings.open("location"); });
        }
    }, function (error) {
        $scope.toggleMainPopup('התרחשה שגיאה בעת השגת מיקומך, אנא הזן מיקום ידני.');
    });
});
