
var slideIndex = 1;

var stop_new = 1;
function myfunctionStop_new() {
  stop_new = 2;
} 

if(stop_new == 1) {
    showDivs(slideIndex);
}


function plusDivs(n = 1) {
  showDivs(slideIndex += n);
}

function currentDiv(n) {
  showDivs(slideIndex = n);
}

function showDivs(n) {

  //thu cũ đổi mới 
  var i;
  var x = document.getElementsByClassName("mySlides_new");
  var dots = document.getElementsByClassName("demo_new");

  if (n > x.length) {slideIndex = 1}
  if (n < 1) {slideIndex = x.length}
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";  
  }

  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replaceAll(" w3-badge", "");
  }


x[slideIndex-1].style.display = "flex";  
dots[slideIndex-1].className += " w3-badge";

// if(stop_new == 1) {
//   setTimeout(plusDivs, 15000);
// }
}

//sản phẩm so sánh

var slideIndex_compare = 1;
//nếu chưa dạm vào function thì tự chạy

var stop_compare = 1;
function myfunctionStop_compare() {
  stop_compare = 2;
} 

if(stop_compare == 1) {
  showDivs_compare(slideIndex_compare);
}


function plusDivs_compare(n = 1) {
  showDivs_compare(slideIndex_compare += n);
}

function currentDiv_compare(n) {
  showDivs_compare(slideIndex_compare = n);
}

function showDivs_compare(n) {
  var i;
  var x = document.getElementsByClassName("mySlides_compare");
  var dots_compare = document.getElementsByClassName("demo_compare");
  if (n > x.length) {slideIndex_compare = 1}
  if (n < 1) {slideIndex_compare = x.length}
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";  
  }
  for (i = 0; i < dots_compare.length; i++) {
        dots_compare[i].className = dots_compare[i].className.replaceAll(" w3-badge", "");
      }

  x[slideIndex_compare-1].style.display = "flex";  
  dots_compare[slideIndex_compare-1].className += " w3-badge";
// //chạy
// if(stop_compare == 1) {
//     setTimeout(plusDivs_compare, 15000);
// }

}


// thu cũ đổi mới


var slideIndex_accessory = 1;
//nếu chưa dạm vào function thì tự chạy

var stop_accessory = 1;
function myfunctionStop_accessory() {
  stop_accessory = 2;
} 

if(stop_accessory == 1) {
  showDivs_accessory(slideIndex_accessory);
}


function plusDivs_accessory(n = 1) {
  showDivs_accessory(slideIndex_accessory += n);
}

function currentDiv_accessory(n) {
  showDivs_accessory(slideIndex_accessory = n);
}

function showDivs_accessory(n) {
  var i;
  var x = document.getElementsByClassName("mySlides_accessory");
  var dots_accessory = document.getElementsByClassName("demo_accessory");
  if (n > x.length) {slideIndex_accessory = 1}
  if (n < 1) {slideIndex_accessory = x.length}
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";  
  }
  for (i = 0; i < dots_accessory.length; i++) {
    dots_accessory[i].className = dots_accessory[i].className.replaceAll(" w3-badge", "");
      }

  x[slideIndex_accessory-1].style.display = "flex";  
  dots_accessory[slideIndex_accessory-1].className += " w3-badge";
// //chạy
// if(stop_compare == 1) {
//     // setTimeout(plusDivs_accessory, 3000);
// }

}



// tin tức liên quan

var slideIndex_news = 1;
//nếu chưa dạm vào function thì tự chạy

var stop_news = 1;
function myfunctionStop_news() {
  stop_news = 2;
} 

if(stop_news == 1) {
  showDivs_news(slideIndex_news);
}


function plusDivs_news(n = 1) {
  showDivs_news(slideIndex_news += n);
}

function currentDiv_news(n) {
  showDivs_news(slideIndex_news = n);
}

function showDivs_news(n) {
  var i;
  var x = document.getElementsByClassName("mySlides_news");
  var dots_news = document.getElementsByClassName("demo_news");
  if (n > x.length) {slideIndex_news = 1}
  if (n < 1) {slideIndex_news = x.length}
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";  
  }
  for (i = 0; i < dots_news.length; i++) {
    dots_news[i].className = dots_news[i].className.replaceAll(" w3-badge", "");
      }

  x[slideIndex_news-1].style.display = "grid";  
  dots_news[slideIndex_news-1].className += " w3-badge";
// //chạy
// if(stop_compare == 1) {
//     setTimeout(plusDivs_news, 15000);
// }

}



// tin tức liên quan

var slideIndex_detail = 1;
//nếu chưa dạm vào function thì tự chạy

var stop_detail = 1;
function myfunctionStop_detail() {
  stop_detail = 2;
} 

if(stop_detail == 1) {
  showDivs_detail(slideIndex_detail);
}


function plusDivs_detail(n = 1) {
  showDivs_detail(slideIndex_detail += n);
}

function currentDiv_detail(n) {
  showDivs_detail(slideIndex_detail = n);
}

function showDivs_detail(n) {
  var i;
  var x = document.getElementsByClassName("mySlides_detail");
  var dots_detail = document.getElementsByClassName("demo_detail");
  var dots_img = document.getElementsByClassName("demo_img");
  var img_item = document.getElementsByClassName("img_item");
  var slider_right = document.getElementById("button-slider-right-detail");
  if (n > x.length) {slideIndex_detail = 1}
  if (n < 1) {slideIndex_detail = x.length}
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";  
  }
  for (i = 0; i < dots_detail.length; i++) {
    dots_detail[i].className = dots_detail[i].className.replaceAll(" w3-badge1", "");
    dots_img[i].className = dots_img[i].className.replaceAll(" w3_opacity", "");
    // img_item[i].className = img_item[i].className.replaceAll(" w3_opacity1", "");
      }

  x[slideIndex_detail-1].style.display = "flex";  
  dots_detail[slideIndex_detail-1].className += " w3-badge1";
  dots_img[slideIndex_detail-1].className += " w3_opacity";
// //chạy
// if(stop_compare == 1) {
//      setTimeout(plusDivs_detail, 15000);
// }

}

// máy cũ giá tốt gần bạn


var slideIndex_machine = 1;
//nếu chưa dạm vào function thì tự chạy

var stop_machine = 1;
function myfunctionStop_machine() {
  stop_machine = 2;
} 

if(stop_machine == 1) {
  showDivs_machine(slideIndex_machine);
}


function plusDivs_machine(n = 1) {
  showDivs_machine(slideIndex_machine += n);
}

function currentDiv_machine(n) {
  showDivs_machine(slideIndex_machine = n);
}

function showDivs_machine(n) {
  var i;
  var x = document.getElementsByClassName("mySlides_machine");
  var dots_machine = document.getElementsByClassName("demo_machine");
  if (n > x.length) {slideIndex_machine = 1}
  if (n < 1) {slideIndex_machine = x.length}
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";  
  }
  for (i = 0; i < dots_machine.length; i++) {
    dots_machine[i].className = dots_machine[i].className.replaceAll(" w3-badge", "");
      }

  x[slideIndex_machine-1].style.display = "flex";  
  dots_machine[slideIndex_machine-1].className += " w3-badge";
// //chạy
// if(stop_compare == 1) {
//     // setTimeout(plusDivs_machine, 3000);
// }

}

//sản phẩm so sánh

var slideIndex_compare_pp = 1;
//nếu chưa dạm vào function thì tự chạy

var stop_compare_pp = 1;
function myfunctionStop_compare_pp() {
  stop_compare_pp = 2;
} 

if(stop_compare_pp == 1) {
  showDivs_compare_pp(slideIndex_compare_pp);
}


function plusDivs_compare_pp(n = 1) {
  showDivs_compare_pp(slideIndex_compare_pp += n);
}

function currentDiv_compare_pp(n) {
  showDivs_compare_pp(slideIndex_compare_pp = n);
}

function showDivs_compare_pp(n) {
  var i;
  var x = document.getElementsByClassName("mySlides_compare_pp");
  var dots_compare_pp = document.getElementsByClassName("demo_compare_pp");
  if (n > x.length) {slideIndex_compare_pp = 1}
  if (n < 1) {slideIndex_compare_pp = x.length}
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";  
  }
  for (i = 0; i < dots_compare_pp.length; i++) {
        dots_compare_pp[i].className = dots_compare_pp[i].className.replaceAll(" w3-badge", "");
      }

  x[slideIndex_compare_pp-1].style.display = "grid";  
  dots_compare_pp[slideIndex_compare_pp-1].className += " w3-badge";
// //chạy
if(stop_compare_pp == 1) {
    // setTimeout(plusDivs_compare_pp, 15000);
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
clearall.onclick = function() {
  modal.style.display = "none";
}
function compare_add() {
  document.getElementById("collapse").style.display = "block";
  document.getElementById("popup-ss").style.display = "none";
}

function clearCompare(){
  document.getElementById("collapse").style.display = "none";
  document.getElementById("popup-ss").style.display = "block";
}

function showCompare(){
  document.getElementById("collapse").style.display = "block";
  document.getElementById("popup-ss").style.display = "none";
}

function removeCompare1(){
  document.getElementById("drum03090000").style.display = "flex";
  document.getElementById("have03092000").style.display = "none";
}
function removeCompare2(){
  document.getElementById("drum030900001").style.display = "flex";
  document.getElementById("have030920001").style.display = "none";
}
function removeCompare3(){
  document.getElementById("drum030900002").style.display = "flex";
  document.getElementById("have030920002").style.display = "none";
}
function ClosePopup(){
  document.getElementById("Mymodaladd").style.display = "none";
}

function OpenPopup(){
  document.getElementById("Mymodaladd").style.display = "flex";
}
function RemoveAllIdCompare(){
  document.getElementById("have03092000").style.display = "none";
  document.getElementById("drum03090000").style.display = "flex";
  document.getElementById("have030920001").style.display = "none";
  document.getElementById("drum030900001").style.display = "flex";
  document.getElementById("have030920002").style.display = "none";
  document.getElementById("drum030900002").style.display = "flex";
  document.getElementById("popup-ss").style.display = "none";
}



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