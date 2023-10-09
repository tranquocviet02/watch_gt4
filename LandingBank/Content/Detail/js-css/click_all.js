 // Lấy tham chiếu đến phần tử "Chọn tất cả"
 var selectAllCheckbox = document.getElementById("screen");

 // Lấy tất cả các phần tử có lớp "checkbox"
 var checkboxes = document.querySelectorAll(".screen-item");
 
 // Đặt sự kiện cho phần tử "Chọn tất cả" để kiểm soát tất cả các phần tử checkbox
 selectAllCheckbox.addEventListener("change", function () {
   checkboxes.forEach(function (checkbox) {
     checkbox.checked = selectAllCheckbox.checked;
   });
 });
 
 // Lấy tham chiếu đến phần tử "Chọn tất cả"
 var bin = document.getElementById("bin");
 
 // Lấy tất cả các phần tử có lớp "checkbox"
 var bin_item = document.querySelectorAll(".bin-item");
 
 // Đặt sự kiện cho phần tử "Chọn tất cả" để kiểm soát tất cả các phần tử checkbox
 bin.addEventListener("change", function () {
   bin_item.forEach(function (checkbox) {
     checkbox.checked = bin.checked;
   });
 });
 
 // Lấy tham chiếu đến phần tử "Chọn tất cả"
 var camera = document.getElementById("camera");
 
 // Lấy tất cả các phần tử có lớp "checkbox"
 var camera_item = document.querySelectorAll(".camera-item");
 
 // Đặt sự kiện cho phần tử "Chọn tất cả" để kiểm soát tất cả các phần tử checkbox
 camera.addEventListener("change", function () {
   camera_item.forEach(function (checkbox) {
     checkbox.checked = camera.checked;
   });
 });
 
 // Lấy tham chiếu đến phần tử "Chọn tất cả"
 var chip = document.getElementById("chip");
 
 // Lấy tất cả các phần tử có lớp "checkbox"
 var chip_item = document.querySelectorAll(".chip-item");
 
 // Đặt sự kiện cho phần tử "Chọn tất cả" để kiểm soát tất cả các phần tử checkbox
 chip.addEventListener("change", function () {
   chip_item.forEach(function (checkbox) {
     checkbox.checked = chip.checked;
   });
 });
 
 // Lấy tham chiếu đến phần tử "Chọn tất cả"
 var feature_specal = document.getElementById("feature-specal");
 
 // Lấy tất cả các phần tử có lớp "checkbox"
 var feature_specal_item = document.querySelectorAll(".feature-specal-item");
 
 // Đặt sự kiện cho phần tử "Chọn tất cả" để kiểm soát tất cả các phần tử checkbox
 feature_specal.addEventListener("change", function () {
   feature_specal_item.forEach(function (checkbox) {
     checkbox.checked = feature_specal.checked;
   });
 });
 