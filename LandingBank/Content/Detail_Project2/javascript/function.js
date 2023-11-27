

function toggleBorder(clickedDiv) {
  const costDiv = document.querySelector('.info-right-price-cost');
  const oldDiv = document.querySelector('.info-right-price-old');
  const costDiv1 = document.querySelector('.info-right-price-cost1');
  const costDiv2 = document.querySelector('.info-right-price-cost2');
  const costDiv3 = document.querySelector('.info-right-price-cost3');

  if (clickedDiv === 'cost') {
    costDiv.style.border = '1.5px solid red';
    oldDiv.style.border = '1.5px solid transparent';

    costDiv.classList.add('active');
    oldDiv.classList.remove('active');
  } else if (clickedDiv === 'old') {
    costDiv.style.border = '1.5px solid transparent';
    oldDiv.style.border = '1.5px solid red';

    oldDiv.classList.add('active');
    costDiv.classList.remove('active');
  }
  else if (clickedDiv === 'cost1') {
    costDiv1.style.border = '1.5px solid red';
    costDiv2.style.border = '1.5px solid transparent';
    costDiv3.style.border = '1.5px solid transparent';

    costDiv1.classList.add('active');
    costDiv2.classList.remove('active');
    costDiv3.classList.remove('active');
  } else if (clickedDiv === 'cost2') {
    costDiv2.style.border = '1.5px solid red';
    costDiv1.style.border = '1.5px solid transparent';
    costDiv3.style.border = '1.5px solid transparent';

    costDiv2.classList.add('active');
    costDiv1.classList.remove('active');
    costDiv3.classList.remove('active');
  } else if (clickedDiv === 'cost3') {
    costDiv3.style.border = '1.5px solid red';
    costDiv2.style.border = '1.5px solid transparent';
    costDiv1.style.border = '1.5px solid transparent';

    costDiv3.classList.add('active');
    costDiv2.classList.remove('active');
    costDiv1.classList.remove('active');
  }
}


document.addEventListener('DOMContentLoaded', function () {
  const oldDiv = document.querySelector('.info-right-price-old');
  const costDiv1 = document.querySelector('.info-right-price-cost1');
  oldDiv.classList.add('active');
  costDiv1.classList.add('active');
});



function changeIcon() {
  var heartIcon = document.getElementById("heart-icon");
  if (heartIcon.classList.contains("fa-regular")) {
    heartIcon.classList.remove("fa-regular");
    heartIcon.classList.add("fa-solid");
  } else {
    heartIcon.classList.remove("fa-solid");
    heartIcon.classList.add("fa-regular");
  }
}



// const districtsByCity = {
//   hanoi: ["Ba Đình", "Hoàn Kiếm", "Hai Bà Trưng", "Đống Đa", "Tây Hồ", "Cầu Giấy", "Thanh Xuân", "Hoàng Mai"],
//   danang: ["Hải Châu", "Thanh Khê", "Sơn Trà", "Ngũ Hành Sơn", "Liên Chiểu"],
//   hochiminh: ["Quận 1", "Quận 2", "Quận 3", "Quận 4", "Quận 5", "Quận 6", "Quận 7", "Quận 8"]
// };

// function populateDistricts() {
//   const citySelect = document.getElementById("city");
//   const districtSelect = document.getElementById("district");
//   const selectedCity = citySelect.value;

//   districtSelect.innerHTML = "";
//   districtsByCity[selectedCity].forEach(district => {
//     const option = document.createElement("option");
//     option.value = district;
//     option.textContent = district;
//     districtSelect.appendChild(option);
//   });
// }

// populateDistricts();


const desContent = document.querySelector('.info-left-des-content-p');
const seeMoreButton = document.getElementById('see-more-content');
let isContentExpanded = false;

seeMoreButton.addEventListener('click', function () {
  const computedStyles = window.getComputedStyle(desContent);

  if (isContentExpanded) {
    // Đang mở rộng, thu gọn nội dung
    desContent.style.maxHeight = '190px'; // Thiết lập lại chiều cao ban đầu
    seeMoreButton.innerHTML = '<h3 class="start_css font-size-13">Xem toàn bộ bài viết</h3> <i class="fa-solid fa-caret-down"></i>';
    desContent.classList.remove('open');
  } else {
    // Đang thu gọn, mở rộng nội dung
    const scrollHeight = desContent.scrollHeight + 'px';
    desContent.style.maxHeight = scrollHeight; // Đặt lại chiều cao thành chiều cao thực tế của nội dung
    seeMoreButton.innerHTML = '<h3 class="start_css font-size-13">Thu gọn bài viết </h3><i class="fa-solid fa-caret-up"></i>';
    desContent.classList.add('open');
  }

  isContentExpanded = !isContentExpanded;
});



const checkboxes = document.querySelectorAll('.option-checkbox');

checkboxes.forEach(checkbox => {
  checkbox.addEventListener('change', function () {
    if (this.checked) {
      checkboxes.forEach(cb => {
        if (cb !== this) {
          cb.checked = false;
        }
      });
    }
  });
});

const checkboxes1 = document.querySelectorAll('.option-checkbox1');

checkboxes1.forEach(checkbox => {
  checkbox.addEventListener('change', function () {
    if (this.checked) {
      checkboxes1.forEach(cb => {
        if (cb !== this) {
          cb.checked = false;
        }
      });
    }
  });
});


const offerContent = document.querySelector('.info-right-offer-content');
const seeMoreOfferButton = document.getElementById('see-more-offer');
let isContentExpandedOffer = false;

seeMoreOfferButton.addEventListener('click', function () {
  const computedStyles = window.getComputedStyle(offerContent);

  if (isContentExpandedOffer) {
    // Đang mở rộng, thu gọn nội dung
    offerContent.style.maxHeight = '270px'; // Thiết lập lại chiều cao ban đầu
    seeMoreOfferButton.style.textTransform = 'uppercase';
    seeMoreOfferButton.innerHTML = '<h3 class="start_css font-size-13">Xem thêm ưu đãi </h3> <i class="fa-solid fa-caret-down"></i>';
    offerContent.classList.remove('open');
  } else {
    // Đang thu gọn, mở rộng nội dung
    const scrollHeight = offerContent.scrollHeight + 'px';
    offerContent.style.maxHeight = scrollHeight; // Đặt lại chiều cao thành chiều cao thực tế của nội dung
    seeMoreOfferButton.style.textTransform = 'uppercase';
    seeMoreOfferButton.innerHTML = '<h3 class="start_css font-size-13">Thu gọn ưu đãi </h3><i class="fa-solid fa-caret-up"></i>';
    offerContent.classList.add('open');
  }

  isContentExpandedOffer = !isContentExpandedOffer;
});



const offerMoreContent = document.querySelector('.info-right-offer-more-content');
const seeMoreOfferMoreButton = document.getElementById('see-more-offer-more');
let isContentExpandedOfferMore = false;

seeMoreOfferMoreButton.addEventListener('click', function () {
  const computedStyles = window.getComputedStyle(offerMoreContent);

  if (computedStyles.maxHeight === '290px') {
        // Đang thu gọn, mở rộng nội dung
    const scrollHeight = offerMoreContent.scrollHeight + 'px';
    offerMoreContent.style.maxHeight = scrollHeight; // Đặt lại chiều cao thành chiều cao thực tế của nội dung
    seeMoreOfferMoreButton.style.textTransform = 'uppercase';
      seeMoreOfferMoreButton.innerHTML = '<h3 class="start_css font-size-13">Thu gọn ưu đãi </h3> <i class="fa-solid fa-caret-up"></i>';
    offerMoreContent.classList.add('open');

  } else {
    offerMoreContent.style.maxHeight = '290px';
    seeMoreOfferMoreButton.style.textTransform = 'uppercase';
      seeMoreOfferMoreButton.innerHTML = '<h3 class="start_css font-size-13">Xem thêm ưu đãi </h3> <i class="fa-solid fa-caret-down"></i>';
    offerMoreContent.classList.remove('open');

  }
});



// Get the modal
var modal = document.getElementById("myModal");
var modal1 = document.getElementById("Mymodaladd");
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




// function onclickSearch(){
//   var element = document.getElementById("formdetail");
//   element.classList.add("input-focus");
//   window.addEventListener("click", function (event) {
//     if (event.target === modal) {
//         modal.classList.remove("input-focus");
//     }
// })
// }

// Get the button that opens the modal
var clearall = document.getElementsByClassName("clearall");
clearall.onclick = function () {
  modal.style.display = "none";
}
function compare_add() {
  document.getElementById("collapse").style.display = "block";
  document.getElementById("popup-ss").style.display = "none";
}

function clearCompare() {
  document.getElementById("collapse").style.display = "none";
  document.getElementById("popup-ss").style.display = "block";
}

function showCompare() {
  document.getElementById("collapse").style.display = "block";
  document.getElementById("popup-ss").style.display = "none";
}

// function removeCompare1() {
//   document.getElementById("drum03090000").style.display = "flex";
//   document.getElementById("have03092000").style.display = "none";
// }
// function removeCompare2() {
//   document.getElementById("drum030900001").style.display = "flex";
//   document.getElementById("have030920001").style.display = "none";
// }
// function removeCompare3() {
//   document.getElementById("drum030900002").style.display = "flex";
//   document.getElementById("have030920002").style.display = "none";
// }
function ClosePopup() {
  document.getElementById("Mymodaladd").style.display = "none";
}

function OpenPopup() {
  document.getElementById("Mymodaladd").style.display = "flex";
}
// function RemoveAllIdCompare() {
//   document.getElementById("have03092000").style.display = "none";
//   document.getElementById("drum03090000").style.display = "flex";
//   document.getElementById("have030920001").style.display = "none";
//   document.getElementById("drum030900001").style.display = "flex";
//   document.getElementById("have030920002").style.display = "none";
//   document.getElementById("drum030900002").style.display = "flex";
//   document.getElementById("popup-ss").style.display = "none";
// }



// xử lí sự kiện xem thêm cmt

var data = document.getElementsByClassName("ask-content-comment");
const loadMoreButton = document.getElementById("btn-xemthem");
let currentIndex = 0;
const itemsPerPage = 2;


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