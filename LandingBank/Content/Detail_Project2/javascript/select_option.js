const optionMenu = document.querySelector(".select-menu"),
       selectBtn = optionMenu.querySelector(".select-btn"),
       options = optionMenu.querySelectorAll(".option"),
       sBtn_text = optionMenu.querySelector(".sBtn-text");

selectBtn.addEventListener("click", () => optionMenu.classList.toggle("active"));       

options.forEach(option =>{
    option.addEventListener("click", ()=>{
        let selectedOption = option.querySelector(".option-text").innerText;
        sBtn_text.innerText = selectedOption;

        optionMenu.classList.remove("active");
    });
});

const optionMenu_detail = document.querySelector(".select-menu-detail");
const selectBtn_detail = optionMenu_detail.querySelector(".select-btn-detail");
const options_detail = optionMenu_detail.querySelectorAll(".option-detail");
const sBtn_text_detail = optionMenu_detail.querySelector(".sBtn-text-detail");

selectBtn_detail.addEventListener("click", () => optionMenu_detail.classList.toggle("active"));

options_detail.forEach(option => {
    option.addEventListener("click", () => {
        let selectedOption = option.querySelector(".option-text-detail").innerText;
        sBtn_text_detail.innerText = selectedOption;

        optionMenu_detail.classList.remove("active");
    });
});

window.addEventListener("click", (event) => {
    if (!optionMenu_detail.contains(event.target)) {
        optionMenu_detail.classList.remove("active");
    }
    if (!optionMenu.contains(event.target)) {
        optionMenu.classList.remove("active");
    }
});


// Add active class to the current button (highlight it)
var province = document.getElementById("province");
var btns = province.getElementsByClassName("option_province");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function() {
    $(".option_province").removeClass("active");
  var current = document.getElementsByClassName("active");
  current[0].className = current[0].className.replace(" active", "");
  this.className += " active";
  });
}

// Add active class to the current button (highlight it)
var District = document.getElementById("District");
var btns1 = District.getElementsByClassName("option_district");
for (var i = 0; i < btns1.length; i++) {
  btns1[i].addEventListener("click", function() {
    $(".option_district").removeClass("active");
  var current = document.getElementsByClassName("active");
  current[0].className = current[0].className.replace(" active", "");
  this.className += " active";
  });
}
