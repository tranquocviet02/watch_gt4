// Lấy tất cả các phần tử có lớp "dropdown-item-li"
var button = document.getElementsByClassName("div-banner-item");

// Lặp qua từng phần tử và gắn sự kiện click cho chúng
for (var i = 0; i < button.length; i++) {
	button[i].addEventListener("click", function () {
		// Loại bỏ lớp "active" từ tất cả các phần tử có lớp "dropdown-item-li"
		for (var j = 0; j < button.length; j++) {
			button[j].classList.remove("active");
		}

		// Thêm lớp "active" vào phần tử được nhấp vào
		this.classList.add("active");
	});
}

const oppon3 = document.getElementsByClassName('click-oppo-n3')[0];
const ById_oppon3 = document.getElementById('oppo-n3');

const oppon3pro = document.getElementsByClassName('click-oppo-n3-pro')[0];
const ById_oppon3pro = document.getElementById('oppo-n3-pro');

oppon3.addEventListener('click', function() {
  ById_oppon3.style.display = 'block';
  ById_oppon3pro.style.display = 'none';
});

oppon3pro.addEventListener('click', function() {
  ById_oppon3pro.style.display = 'block';
  ById_oppon3.style.display = 'none';
});


