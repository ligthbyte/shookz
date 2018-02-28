app.controller('HomeCtrl', function($scope){
    $scope.currentView = 'main';
    $scope.mainPopupState = false;
    $scope.mainPopupCaption = 'סתם מלא טקסט סתם מלא טקסט סתם מלא טקסט סתם מלא טקסט סתם מלא טקסט.';
    $scope.mainPopupConfirmBtnText = 'אישור';
    $scope.location = 'טוען את מיקומך...';

    $scope.toggleMainPopup = function (caption = null, onClose = null, confirmBtnText = null){
        if($scope.mainPopupState){
            $scope.mainPopupState = false;
            if(onClose) onClose();
        }
        else{
            if (caption) $scope.mainPopupCaption = caption; 
            if (confirmBtnText) $scope.mainPopupConfirmBtnText = confirmBtnText;
            $scope.mainPopupState = true;
        }
    }

    $scope.getUserLocation = function() {
        console.log('loading location...');
        navigator.geolocation.getCurrentPosition(
            function(position) {
                console.log('succeed getting coordinates!');
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
                        $scope.toggleMainPopup('התרחשה שגיאה בעת השגת מיקומך, אנא נסה שנית במועד מאוחר יותר.', $scope.getUserLocation);                        

                        $scope.location = 'מיקומך אינו זמין, נא הזן ידנית.';
                        $scope.mainPopupState = true;                        
                        $scope.$apply();
                    },
                    position.coords.latitude,
                    position.coords.longitude,
                    { useLocale: true, maxResults: 1 }
                );
            }, function(error) {
                console.log('failed getting coordinates, error: ', error);
                var errorMsg = '';
                switch(error.code){
                    case 1: $scope.toggleMainPopup('בחלון הבא תתבקש לאשר שירותי מיקום. נא אשר על מנת שנוכל להתאים את המודעות למיקום הנוכחי שלך.', $scope.getUserLocation);                
                    case 2:
                    case 3: $scope.toggleMainPopup('אנא הפעל שירותי מיקום על מנת שנוכל להתאים את המודעות למיקום הנוכחי שלך.', function () { window.cordova.plugins.settings.open("location"); });
                    // case 3: $scope.toggleMainPopup('התרחשה שגיאה בעת השגת מיקומך, אנא נסה שנית.', $scope.getUserLocation());
                }
                
                $scope.location = 'מיקומך אינו זמין, הזן ידנית.';
                $scope.mainPopupState = true;
                $scope.$apply();
            },
            { timeout: 5000, enableHighAccuracy: true }
        );    
    }
    //TODO: save a localstorage that the user confirmed to location services and don't show dialog if confirmed
    $scope.toggleMainPopup('בחלון הבא תתבקש לאשר לנו גישה למיקומך. נא אשר זאת על מנת שנוכל להתאים את המודעות למיקום הנוכחי שלך.');
});
