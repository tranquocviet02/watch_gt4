$(document).ready(function () {
    $('.single-checkbox').click(function () {
        const clickedCheckbox = $(this).attr('id');
        $('.single-checkbox').each(function () {
            if ($(this).attr('id') !== clickedCheckbox) {
                $(this).prop('checked', false); // Uncheck other checkboxes
            }
        });
    });

    $('#submitBtn').click(function () {
        const name = $('#name').val();
        const phone = $('#phone').val();
        const email = $('#email').val();

        // Kiểm tra xem checkbox nào được chọn
        const note = [];
        $('input[type=checkbox]').each(function () {
            if ($(this).is(':checked')) {
                note.push($(this).attr('id')); // Thêm ID của checkbox được chọn vào mảng 'note'
            }
        });

        // Gửi dữ liệu qua AJAX POST
        $.post('https://hoanghamobile.com/Landing/GalaxyZ2024/Submit', { name: name, phone: phone, email: email, note: note }, function (response) {
            console.log('Data sent successfully:', response);
            // Xử lý phản hồi thành công từ máy chủ nếu cần
        })
            .fail(function (error) {
                console.error('There was a problem with the request:', error);
                // Xử lý lỗi nếu cần
            });
    });
});
