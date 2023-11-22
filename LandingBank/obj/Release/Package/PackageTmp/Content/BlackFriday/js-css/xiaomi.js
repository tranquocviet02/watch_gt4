var swiper = new Swiper(".mySwiper", {
    slidesPerView: 1,
    centeredSlides: false,
    slidesPerGroupSkip: 1,
    grabCursor: true,
    keyboard: {
        enabled: true,
    },
    breakpoints: {
        769: {
            slidesPerView: 1,
            slidesPerGroup: 1,
        },
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    }, loop: true, // Thêm vòng lặp vô hạn
autoplay: {
delay: 3000, // Đặt thời gian tự chạy giữa các slide, đơn vị là mili giây
disableOnInteraction: false, // Cho phép tự chạy tiếp tục sau khi người dùng tương tác với swiper
},
});