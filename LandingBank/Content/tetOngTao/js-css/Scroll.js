$(document).ready(function () {

    var isAnimating = false;
    var scrollThreshold = 100; // Ngưỡng cuộn để thêm class

    // Xác định khi nào trang được cuộn
    $(window).scroll(function () {
        if (!isAnimating) {
            $('.nav__item-badge').each(function () {
                var targetId = $(this).attr('data-href');
                var targetElement = $(targetId);

                if (targetElement.length) {
                    var targetOffset = targetElement.offset();
                    var adjustedOffset = targetOffset.top - scrollThreshold;

                    // Kiểm tra xem trang hiện tại đã cuộn đến vị trí mong muốn hay chưa
                    if ($(window).scrollTop() >= adjustedOffset) {
                        $('.nav__item-badge').removeClass('active');
                        $(this).addClass('active');
                        targetElement.addClass('active');
                    }
                }
            });
        }
    });

    // Xử lý sự kiện click
    $('.nav__item-badge').click(function (e) {
        e.preventDefault();

        // Kiểm tra xem có đang có cuộc di chuyển đang diễn ra hay không
        if (isAnimating) {
            return;
        }

        var targetId = $(this).attr('data-href');
        var targetElement = $(targetId);

        if (targetElement.length) {
            isAnimating = true; // Đánh dấu là đang có cuộc di chuyển

            var targetOffset = targetElement.offset();
            var adjustedOffset = targetOffset.top - scrollThreshold;

            $('html, body').animate({
                scrollTop: adjustedOffset
            }, 10, function () {
                // Khi hoàn thành cuộc di chuyển, thêm class "active" vào phần tử đã kéo xuống
                targetElement.addClass('active');
                isAnimating = false; // Đánh dấu là cuộc di chuyển đã kết thúc
            });

            // Loại bỏ class "active" từ tất cả các phần tử trước khi thêm class mới
            $('.nav__item-badge').removeClass('active');
            $(this).addClass('active');
        } else {
            console.error('Không tìm thấy phần tử có ID:', targetId);
        }
    });

});
