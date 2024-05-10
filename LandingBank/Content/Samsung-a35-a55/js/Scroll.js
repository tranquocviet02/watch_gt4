$(document).ready(function () {
    try {
        $(".oppo-n3-Flip").css("display", "none");
        $(".oppo-n3-Default").css("display", "block");

        $('.btn-Flip').click(function (e) {
            $(".oppo-n3-Default").css("display", "none");
            $(".oppo-n3-Flip").css("display", "block");

        });
        $('.btn-Default').click(function (e) {
            $(".oppo-n3-Flip").css("display", "none");
            $(".oppo-n3-Default").css("display", "block");

        });
    } catch (error) {
        // Xử lý lỗi ở đây
        console.error('Có lỗi xảy ra:', error);
    }


    try {
        $('.Flip-feature-item').click(function (e) {
            e.preventDefault();
            var targetId = $(this).attr('data-href');
            var targetOffset = $(targetId).offset().top;
            $('html, body').animate({
                scrollTop: targetOffset
            }, 400);
        });
    } catch (error) {
        // Xử lý lỗi ở đây
        console.error('Có lỗi xảy ra:', error);
    }

    try {
        $('.feature-item').click(function (e) {
            e.preventDefault();
            var targetId = $(this).attr('data-href');
            var targetOffset = $(targetId).position().top;
            $('html, body').animate({
                scrollTop: targetOffset
            }, 400);
        });
    } catch (error) {
        // Xử lý lỗi ở đây
        console.error('Có lỗi xảy ra:', error);
    }

    try {
        // Lấy tất cả các phần tử có lớp "dropdown-item-li"
        var button = document.getElementsByClassName("btn-add-all");

        // Lặp qua từng phần tử và gắn sự kiện click cho chúng
        for (var i = 0; i < button.length; i++) {
            button[i].addEventListener("click", function () {
                // Loại bỏ lớp "active" từ tất cả các phần tử có lớp "dropdown-item-li"
                for (var j = 0; j < button.length; j++) {
                    button[j].classList.remove("background-2CFF73");
                }

                // Thêm lớp "active" vào phần tử được nhấp vào
                this.classList.add("background-2CFF73");
            });
        }
    } catch (error) {
        // Xử lý lỗi ở đây
        console.error('Có lỗi xảy ra:', error);
    }

});