// Lấy tham chiếu đến cửa sổ pop-up và nút mở cửa sổ
var videoPopup = document.getElementById("videoPopup");
var openPopupButton = document.getElementById("openPopup");
var closePopupButton = document.getElementById("closePopup");
var video = document.getElementById("myVideo");
var htmlElement = document.documentElement; // <html>
var bodyElement = document.body; // <body>
// Khi nút mở cửa sổ được nhấp
video.autoplay = false;

// Thiết lập thuộc tính controls để hiển thị các nút điều khiển
video.controls = false;
openPopupButton.addEventListener("click", function () {
    videoPopup.style.display = "block";
    video.load();
    video.autoplay = true;

    // Thiết lập thuộc tính controls để hiển thị các nút điều khiển
    video.controls = true;
    // Khi nút đóng cửa sổ được nhấp
    htmlElement.style.overflow = "hidden";
    bodyElement.style.overflow = "hidden";
});
// Thiết lập thuộc tính autoplay để tự động phát video

closePopupButton.addEventListener("click", function () {
    videoPopup.style.display = "none";
    video.autoplay = false;

    // Thiết lập thuộc tính controls để hiển thị các nút điều khiển
    video.controls = false;
    htmlElement.style.overflow = "auto";
    bodyElement.style.overflow = "auto";
});