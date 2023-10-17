
const dropdown = document.querySelector(".dropdown");
const feature_item_dropdown = dropdown.querySelector(".feature-item-dropdown");
const dropdown_menu = dropdown.querySelectorAll(".dropdown-item-li");
const sBtn_text_price = dropdown.querySelector(".sBtn-text-price");

feature_item_dropdown.addEventListener("click", () => dropdown.classList.toggle("active"));

dropdown_menu.forEach(option => {
    option.addEventListener("click", () => {
        let selectedOption = option.querySelector(".dropdown-item").innerText;
        sBtn_text_price.innerText = selectedOption;

        dropdown.classList.remove("active");
    });
});

window.addEventListener("click", (event) => {
    if (!dropdown.contains(event.target)) {
        dropdown.classList.remove("active");
    }
});



// Add active class to the current button (highlight it)
var feature_dropdow = document.getElementById("feature-dropdow");
var btns1 = feature_dropdow.getElementsByClassName("dropdown-item-li");
for (var i = 0; i < btns1.length; i++) {
  btns1[i].addEventListener("click", function() {
    $(".dropdown-item-li").removeClass("active");
  var current = document.getElementsByClassName("active");
  current[0].className = current[0].className.replace(" active", "");
  this.className += " active";
  });
}
