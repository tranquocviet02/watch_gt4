
    // xử lí sự kiện xem thêm add

    var data = document.getElementsByClassName("feature-item-add");
    const loadMoreButton = document.getElementById("btn-xemthem");
    let currentIndex = 0;
    const itemsPerPage = 6;


    // Hàm hiển thị 10 bản ghi tiếp theo
    function displayNextItems() {

        const endIndex = currentIndex + itemsPerPage;
        for (let i = currentIndex; i < endIndex && i < data.length; i++) {
            data.itemsPerPage < data[i]
            data[i].style.display = "flex";
        }



        currentIndex = endIndex;

        // Ẩn nút "Xem thêm" nếu đã hiển thị hết dữ liệu
        if (currentIndex >= data.length) {
            loadMoreButton.style.display = "none";
        }
    }

    // Gọi hàm để hiển thị dữ liệu ban đầu
    displayNextItems();

    // Xử lý sự kiện khi người dùng ấn vào nút "Xem thêm"
    loadMoreButton.addEventListener("click", displayNextItems);


    // xử lí sự kiện xem thêm chi tiết

    var feature_data = document.getElementsByClassName("feature-detail-item");
    const feature_see_more = document.getElementById("feature-see-more");
    let featureIndex = 0;
    const featurePage = 5;


    // Hàm hiển thị 10 bản ghi tiếp theo
    function displayNextfeature() {

        const endfeature = featureIndex + featurePage;
        for (let i = featureIndex; i < endfeature && i < feature_data.length; i++) {
            feature_data.featurePage < feature_data[i]
            feature_data[i].style.display = "flex";
        }



        featureIndex = endfeature;

        // Ẩn nút "Xem thêm" nếu đã hiển thị hết dữ liệu
        if (featureIndex >= feature_data.length) {
            feature_see_more.style.display = "none";
        }
    }

    // Gọi hàm để hiển thị dữ liệu ban đầu
    displayNextfeature();

    // Xử lý sự kiện khi người dùng ấn vào nút "Xem thêm"
    feature_see_more.addEventListener("click", displayNextfeature);