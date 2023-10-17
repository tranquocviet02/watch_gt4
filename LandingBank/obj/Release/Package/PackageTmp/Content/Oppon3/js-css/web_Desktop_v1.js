// Lấy tất cả các phần tử có lớp "dropdown-item-li"
var btns1 = document.getElementsByClassName("div-banner-item");

// Lặp qua từng phần tử và gắn sự kiện click cho chúng
for (var i = 0; i < btns1.length; i++) {
    btns1[i].addEventListener("click", function () {
        // Loại bỏ lớp "active" từ tất cả các phần tử có lớp "dropdown-item-li"
        for (var j = 0; j < btns1.length; j++) {
            btns1[j].classList.remove("active");
        }

        // Thêm lớp "active" vào phần tử được nhấp vào
        this.classList.add("active");
    });
}
