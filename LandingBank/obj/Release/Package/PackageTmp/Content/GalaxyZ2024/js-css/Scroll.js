$(document).ready(function () {
    $('.Flip-feature-scroll').click(function (e) {
        e.preventDefault();
        var targetId = $(this).attr('data-href');
        var targetOffset = $(targetId).offset();

        if (targetOffset) {
            var adjustedOffset = targetOffset.top - 100; // Giá trị được điều chỉnh, ví dụ: tăng thêm 100px
            $('html, body').animate({
                scrollTop: adjustedOffset
            }, 200);
        } else {
            console.error('Không tìm thấy phần tử có ID:', targetId);
        }
    });

});