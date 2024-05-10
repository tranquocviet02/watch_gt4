
$(document).ready(function () {
    // When hovering over the trigger element, show the image
    $(".session-left-detail").mouseover(function () {
        $(".new-product-button-slider_detail").show();
        $(".new-product-button-slider_detail").css("display", "flex");
        $(".detail-product-paginate").css("margin-top", "-28px");
    });

    // When leaving the trigger element, hide the image
    $(".session-left-detail").mouseout(function () {
        $(".new-product-button-slider_detail").hide();
        $(".detail-product-paginate").css("margin-top", "0px");
    });
    //ẨN hiện phụ kiện thường mua cùng
    $("#accessory").mouseover(function () {
        $(".accessory-product-button-slider").show();
        $(".accessory-product-button-slider").css("display", "flex");
    });

    // When leaving the trigger element, hide the image
    $("#accessory").mouseout(function () {
        $(".accessory-product-button-slider").hide();
    });

    //ẨN hiện so sánh sản phẩm

    $("#compare").mouseover(function () {
        $(".compare-product-button-slider").show();
        $(".compare-product-button-slider").css("display", "flex");
    });

    // When leaving the trigger element, hide the image
    $("#compare").mouseout(function () {
        $(".compare-product-button-slider").hide();
    });

    //ẨN hiện thu cũ đổi mới

    $("#new").mouseover(function () {
        $(".new-product-button-slider").show();
        $(".new-product-button-slider").css("display", "flex");
    });

    // When leaving the trigger element, hide the image
    $("#new").mouseout(function () {
        $(".new-product-button-slider").hide();
    });

    //ẨN hiện máy cũ giá tốt gàn bạn

    $("#machine").mouseover(function () {
        $(".machine-product-button-slider").show();
        $(".machine-product-button-slider").css("display", "flex");
    });

    // When leaving the trigger element, hide the image
    $("#machine").mouseout(function () {
        $(".machine-product-button-slider").hide();
    });

    //ẨN hiện add so sánh sản phẩm

    $("#product-compare-add").mouseover(function () {
        $(".compare-pp-product-button-slider").show();
        $(".compare-pp-product-button-slider").css("display", "flex");
        $(".compare-pp-product-paginate").css("margin-top", "0px");
    });

    // When leaving the trigger element, hide the image
    $("#product-compare-add").mouseout(function () {
        $(".compare-pp-product-button-slider").hide();
        $(".compare-pp-product-paginate").css("margin-top", "0px");
    });

    // script.js
    const swipeArea = document.getElementsByClassName("top-product-detail-all");
    let startX = null;
    let endX = null;

    swipeArea.addEventListener("touchstart", function (e) {
        startX = e.touches[0].clientX;
    });

    swipeArea.addEventListener("touchmove", function (e) {
        endX = e.touches[0].clientX;
    });

    swipeArea.addEventListener("touchend", function () {
        if (startX !== null && endX !== null) {
            const deltaX = endX - startX;
            if (deltaX > 50) {
                swipeArea.textContent = "Swipe right"; // Kéo vuốt sang phải
            } else if (deltaX < -50) {
                swipeArea.textContent = "Swipe left"; // Kéo vuốt sang trái
            } else {
                swipeArea.textContent = "No swipe"; // Không có sự kiện kéo vuốt
            }
        }
        startX = null;
        endX = null;
    });

});