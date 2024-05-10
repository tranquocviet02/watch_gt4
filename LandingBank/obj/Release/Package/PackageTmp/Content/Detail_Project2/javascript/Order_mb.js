


$(document).ready(function () {
    // When hovering over the trigger element, show the image
    $(".session-left-detail").mouseover(function () {
        $(".new-product-button-slider_detail").show();
        $(".new-product-button-slider_detail").css("display", "flex");
        $(".detail-product-paginate").css("margin-top", "-45px");
    });

    // When leaving the trigger element, hide the image
    $(".session-left-detail").mouseout(function () {
        $(".new-product-button-slider_detail").hide();
        $(".detail-product-paginate").css("margin-top", "5px");
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
        $(".compare-pp-product-paginate").css("margin-top", "-5px");
    });

    // When leaving the trigger element, hide the image
    $("#product-compare-add").mouseout(function () {
        $(".compare-pp-product-button-slider").hide();
        $(".compare-pp-product-paginate").css("margin-top", "7px");
    });
});



$(document).ready(function () {
    // Lấy tham chiếu đến textarea
    const textarea = document.getElementById('myTextarea');

    // Thêm sự kiện focus
    textarea.addEventListener('focus', function () {
        this.style.border = '2px solid #009981'; // Đổi màu viền khi tập trung
        this.style.backgroundColor = '#fff'; // Đổi màu nền khi tập trung
    });

    // Thêm sự kiện blur (khi mất tập trung)
    textarea.addEventListener('blur', function () {
        this.style.border = '1px solid #ccc'; // Đổi màu viền khi mất tập trung
        this.style.backgroundColor = '#fff'; // Đổi màu nền khi mất tập trung
    });

    //$(".removeCompare").click(function () {
    //    var target = $(this).attr("data-remove");
    //    $('.' + target).css("display", "none");
    //    var target_block = $(this).attr("data-block");
    //    $('.' + target_block).css("display", "flex");
    //    // $('.' + target).html('');
    //    //xóa dữ liệu đi
    //    $('.' + target_block + "-keep-text").html("");
    //    $('.' + target_block + "-keep-img").html("");
    //});
    // Thêm mục mới vào danh sách
    $(".insert-compare").click(function () {
        var target = $(this).attr("data-cl-compare");
        $("#Mymodaladd").css("display", "flex");
        $(".compare-pp-product-detail-img").addClass(target + "-img");
        $(".compare-pp-product-detail-name").addClass(target + "-text");
        $('.compare-pp-product-detail-add').attr('data-target', "." + target);
    });
    // Get the modal
    var modal = document.getElementById("myModal");
    // Get the button that opens the modal
    var btn = document.getElementById("see-more-speci");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks the button, open the modal
    btn.onclick = function () {
        modal.style.display = "block";
    }
    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }


});
