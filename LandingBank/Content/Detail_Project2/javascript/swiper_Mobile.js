
var swiper = new Swiper(".mySwiper", {
    slidesPerView: 6, // Số lượng slide hiển thị trên thanh trượt
    // spaceBetween: 10, // Khoảng cách giữa các slide
    freeMode: true // Chế độ tự do (có thể cuộn không giới hạn)
    // freeMode: true,
    // watchSlidesProgress: ,
});
var swiper2 = new Swiper(".mySwiper2", {
    loop: true,
    spaceBetween: 10,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    thumbs: {
        swiper: swiper,
    },
});


//    var mainSwiper = new Swiper(".mySwiper", {
//    slidesPerView: 8,
//    spaceBetween: 10,
//    freeMode: true,
//    autoplay: {
//        delay: 3000, // Thời gian chạy mỗi slide (đơn vị: miligiây)
//        disableOnInteraction: true, // Tùy chọn để ngăn chặn tự động chuyển slide khi người dùng tương tác với Swiper
//    },
//});

//var thumbsSwiper = new Swiper(".mySwiper2", {
//    loop: true,
//    spaceBetween: 10,
//    pagination: {
//        el: ".swiper-pagination",
//        clickable: true,
//    },
//    navigation: {
//        nextEl: ".swiper-button-next",
//        prevEl: ".swiper-button-prev",
//    },
//    thumbs: {
//        swiper: mainSwiper,
//    },
//    on: {
//        touchStart: function () {
//            if (thumbsSwiper.autoplay && thumbsSwiper.autoplay.running) {
//                thumbsSwiper.autoplay.stop();
//            }
//        },
//        touchEnd: function () {
//            if (thumbsSwiper.autoplay && !thumbsSwiper.autoplay.running) {
//                thumbsSwiper.autoplay.start();
//            }
//        },
//    },
//    autoplay: {
//        delay: 3000,
//        disableOnInteraction: true,
//    }
//});