
var slider = document.getElementById("priceslider");
noUiSlider.create(slider, {
    start: [1e6, 5e6],
    connect: true,
    tooltips: true,
    range: {
        min: 0,
        max: 15e6
    },
    format: {
        to: function (value) {
            // return value.toFixed(0); // Định dạng giá trị hiển thị thành số nguyên
            return parseFloat(value).toLocaleString('en-US'); // Định dạng giá trị hiển thị
        },
        from: function (value) {
            // Chuyển đổi giá trị ngược trở lại nếu cần
            return parseFloat(value.replace(/,/g, '')); // Loại bỏ dấu phẩy trước khi chuyển đổi
        }
    }
});


// Tạo một MutationObserver để theo dõi sự thay đổi của thuộc tính aria-valuetext cho phần tử có class "noUi-handle-upper"
var observerUpper = new MutationObserver(function (mutationsList, observer) {
    mutationsList.forEach(function (mutation) {
        if (mutation.attributeName === "aria-valuetext") {
            var inputElementMax = document.getElementById("input-max");
            inputElementMax.value = mutation.target.getAttribute("aria-valuetext");
            $("#input-max").addClass("text-black2");
            // $("#button-add").css("display", "flex");
            $("#button-add").addClass("background-add");
        }
    });
});

// Kích hoạt theo dõi cho các phần tử cụ thể (ở đây là div có class "noUi-handle-upper")
$(".noUi-handle-upper").each(function () {
    observerUpper.observe(this, { attributes: true });
});

// Tạo một MutationObserver để theo dõi sự thay đổi của thuộc tính aria-valuetext cho phần tử có class "noUi-handle-lower"
var observerLower = new MutationObserver(function (mutationsList, observer) {
    mutationsList.forEach(function (mutation) {
        if (mutation.attributeName === "aria-valuetext") {
            var inputElementMin = document.getElementById("input-min");
            inputElementMin.value = mutation.target.getAttribute("aria-valuetext");
            $("#input-min").addClass("text-black2");
            // $("#button-add").css("display", "flex");
            $("#button-add").addClass("background-add");
        }
    });
});




// Kích hoạt theo dõi cho các phần tử cụ thể (ở đây là div có class "noUi-handle-lower")
$(".noUi-handle-lower").each(function () {
    observerLower.observe(this, { attributes: true });
});

// Add active class to the current button (highlight it)
var province = document.getElementById("feature-dropdow");
var btns = province.getElementsByClassName("dropdown-item");
for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function () {
        $(".dropdown-item").removeClass("active");
        var current = document.getElementsByClassName("active");
        current[0].className = current[0].className.replace(" active", "");
        this.className += " active";
    });
}

// Sử dụng jQuery để thêm chức năng collapse resetfont
$(document).ready(function () {
    var feature_dropdow = document.getElementById("feature-dropdow");
    $("#toggleButton").click(function () {
        $("#mycollapse resetfont").slideToggle(); // Hiển thị hoặc ẩn phần tử
    });
    //ẨN hiện dropdow

    $("#dropdownMenuButton").mouseover(function () {
        $(".dropdown-menu").show();
        $(".dropdown-menu").css("display", "block");
    });

    $(".dropdown-menu").mouseover(function () {
        $(".dropdown-menu").show();
        $(".dropdown-menu").css("display", "block");
    });
    // When leaving the trigger element, hide the image
    $("#dropdownMenuButton").mouseout(function () {
        $(".dropdown-menu").hide();
    });
    $(".dropdown-menu").mouseout(function () {
        $(".dropdown-menu").hide();
    });
    $(".apple").addClass("apple-border");
    $(".orange").addClass("orange-border");
    $(".img-178").addClass("img-178-css");


    $("#input-min").on("input", function () {
        // Xóa tất cả các ký tự không phải số
        var value = $(this).val().replace(/[^0-9]/g, '');
        // Cập nhật giá trị của trường input
        $(this).val(value);
        $("#button-add").addClass("background-add");
    });


    $("#input-max").on("input", function () {

        // Xóa tất cả các ký tự không phải số
        var value = $(this).val().replace(/[^0-9]/g, '');
        // Cập nhật giá trị của trường input
        $(this).val(value);
        $("#button-add").addClass("background-add");
    });



});