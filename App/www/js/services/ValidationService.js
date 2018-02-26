app.service('validation', function() {

  this.email = function(str){
    return (new RegExp('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')).test(str);
  };

  this.phone = function(str){
    return (new RegExp('^(05)([0|1|2|3|4|5|8])[0-9]{7}$')).test(str);
  };

});
