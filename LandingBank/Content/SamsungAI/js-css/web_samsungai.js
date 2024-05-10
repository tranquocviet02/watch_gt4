// Lấy tất cả các phần tử có lớp "div-banner-item"
var btns1 = document.getElementsByClassName("div-banner-item");

// Lặp qua từng phần tử và gắn sự kiện click cho chúng
for (var i = 0; i < btns1.length; i++) {
    btns1[i].addEventListener("click", function () {
        // Loại bỏ lớp "active" từ tất cả các phần tử có lớp "div-banner-item"
        for (var j = 0; j < btns1.length; j++) {
            btns1[j].classList.remove("active");
        }

        // Thêm lớp "active" vào phần tử được nhấp vào
        this.classList.add("active");
    });
}

$(document).ready(function () {
    $("#div-a35").click(function () {
        $("#hidden-div-a35").show();
        $("#hidden-div-a55").hide();
    });

    $("#div-a55").click(function () {
        $("#hidden-div-a35").hide();
        $("#hidden-div-a55").show();
    });
});
