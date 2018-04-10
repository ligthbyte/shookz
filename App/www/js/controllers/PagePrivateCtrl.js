app.controller('PagePrivateCtrl', function($scope){
    //init swiper
    var mySwiper = new Swiper('.private-nav', {
        observer: true,
        autoHeight: true,
        slidesPerView: 'auto',
        slideToClickedSlide: true,
    });
});
