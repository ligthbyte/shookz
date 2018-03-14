app.controller('PageMainCtrl', function($scope){
    //init swiper
    var mySwiper = new Swiper('.swiper-container', {  
        spaceBetween: 10,  
        observer: true,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }
      })
});
