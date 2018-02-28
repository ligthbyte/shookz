app.controller('HomeCtrl', function($scope){
    $scope.currentView = 'main';
    $scope.mainPopupState = false;
    $scope.mainPopupCaption = 'סתם מלא טקסט סתם מלא טקסט סתם מלא טקסט סתם מלא טקסט סתם מלא טקסט.';
    $scope.mainPopupConfirmBtnText = 'אישור';
    $scope.location = 'טוען את מיקומך...';

    $scope.toggleMainPopup = function (caption = null, onClose = null, confirmBtnText = null){
        if($scope.mainPopupState){
            $scope.mainPopupState = false;
            if (onClose) onClose();
        }
        else{
            if (caption) $scope.mainPopupCaption = caption; 
            if (confirmBtnText) $scope.mainPopupConfirmBtnText = confirmBtnText;
            $scope.mainPopupState = true;
        }
    }

    var getUserLocation = function() {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                nativegeocoder.reverseGeocode(
                    function (result) {
                        var city = result[0].locality;
                        var streetName = result[0].thoroughfare;
                        var streetNumber = result[0].subThoroughfare;
                        $scope.location = streetName + ' ' + streetNumber + ', ' + city;
                        $scope.$apply();
                    },
                    function (err) {
                        console.log(err);
                        $scope.toggleMainPopup('התרחשה שגיאה בעת השגת מיקומך, אנא נסה שנית במועד מאוחר יותר.', getUserLocation());                        

                        $scope.location = 'מיקומך אינו זמין, נא הזן ידנית.';
                        $scope.mainPopupState = true;                        
                        $scope.$apply();
                    },
                    position.coords.latitude,
                    position.coords.longitude,
                    { useLocale: true, maxResults: 1 }
                );
            }, function(error) {
                var errorMsg = '';
                switch(error.code){
                    case 1: $scope.toggleMainPopup('בחלון הבא תתבקש לאשר שירותי מיקום. נא אשר על מנת שנוכל להתאים את המודעות למיקום הנוכחי שלך.', getUserLocation());                
                }
                $scope.toggleMainPopup('התרחשה שגיאה בעת השגת מיקומך, אנא נסה שנית במועד מאוחר יותר.', getUserLocation());                        
                
                $scope.location = 'מיקומך אינו זמין, הזן ידנית.';
                $scope.mainPopupState = true;
                $scope.$apply();
            },
            { timeout: 5000, enableHighAccuracy: true }
        );    
    }
    $scope.toggleMainPopup('בחלון הבא תתבקש לאשר שירותי מיקום. נא אשר על מנת שנוכל להתאים את המודעות למיקום הנוכחי שלך.', getUserLocation());
});
