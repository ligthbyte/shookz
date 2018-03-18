app.controller('PageCoinsCtrl', function($scope){
    //init swiper
    var mySwiper = new Swiper('.coins-nav', {
        observer: true,
        autoHeight: true,
        slidesPerView: 'auto',
        slideToClickedSlide: true,
    });
});
