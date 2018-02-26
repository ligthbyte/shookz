app.directive('datepicker', function($cordovaDatePicker){
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel){
          if (device.platform != 'browser'){
          element.bind('click', function(){    
            var options = {
              date: new Date(),
              mode: attrs.datepicker,
              allowOldDates: true,
              allowFutureDates: true,
              doneButtonLabel: 'DONE',
              doneButtonColor: '#F2F3F4',
              cancelButtonLabel: 'CANCEL',
              cancelButtonColor: '#000000'
            };
            $cordovaDatePicker.show(options).then(function(date){
              switch(attrs.datepicker){
                case 'date':
                  date = date.toLocaleDateString();
                  break;
                case 'time':
                  date = date.toLocaleTimeString();
                  break;
                case 'datetime':
                  date = date.toLocaleString();
                  break;
              }

              ngModel.$setViewValue(date);
              ngModel.$render();
            });
          });
        }
        }
    };
});
