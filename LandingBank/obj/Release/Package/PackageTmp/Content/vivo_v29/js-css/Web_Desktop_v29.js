
// Khởi tạo Swiper ở đây
var swiper = new Swiper(".mySwiper", {
    slidesPerView: 2, // Số lượng slide hiển thị trên thanh trượt
    spaceBetween: 10, // Khoảng cách giữa các slide
    freeMode: true // Chế độ tự do (có thể cuộn không giới hạn)
});
var swiper2 = new Swiper(".mySwiper2", {
    loop: true,
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
var swiper3 = new Swiper(".mySwiper3", {
    loop: true,
pagination: {
    el: ".swiper-pagination",
        clickable: true,
            },
navigation: {
    nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
            }
        });
var swiper4 = new Swiper(".mySwiper4", {
    loop: true,
pagination: {
    el: ".swiper-pagination",
        clickable: true,
            },
navigation: {
    nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
            }
        });