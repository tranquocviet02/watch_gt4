
const fixed = document.querySelectorAll('.fade-fixed');
const textElements = document.querySelectorAll('.fade-in-text');
const imageElements = document.querySelectorAll('.fade-in-image');
const honortwo = document.querySelectorAll(".honor-two");
const honortwo_text = document.querySelectorAll(".honor-two-text");
function checkIfInView() {
    textElements.forEach((textElement) => {
        const textRect = textElement.getBoundingClientRect();
        if (textRect.top <= window.innerHeight && textRect.bottom >= 0) {
            textElement.classList.add('matrix');
        } else {
            textElement.classList.remove('matrix'); // XĂ³a CSS khi ra khá»i táº§m nhĂ¬n
        }
    });

    fixed.forEach((textElement) => {
        const textRect = textElement.getBoundingClientRect();
        if (textRect.top <= window.innerHeight && textRect.bottom >= 0) {
            textElement.classList.add('fade-relative');
        } else {
            textElement.classList.remove('fade-relative'); // XĂ³a CSS khi ra khá»i táº§m nhĂ¬n
        }
    });

    imageElements.forEach((imageElement) => {
        const imageRect = imageElement.getBoundingClientRect();
        if (imageRect.top <= window.innerHeight && imageRect.bottom >= 0) {
            imageElement.classList.add('matrix');
        } else {
            imageElement.classList.remove('matrix'); // XĂ³a CSS khi ra khá»i táº§m nhĂ¬n
        }
    });

    honortwo.forEach((honortwo) => {
        const imagerotate = honortwo.getBoundingClientRect();
        if (imagerotate.top <= window.innerHeight && imagerotate.bottom >= 0) {
            honortwo.classList.add('fade-img');
        } else {
            honortwo.classList.remove('fade-img'); // XĂ³a CSS khi ra khá»i táº§m nhĂ¬n
        }
    });

    honortwo_text.forEach((honortwo_text) => {
        const imagerotate = honortwo_text.getBoundingClientRect();
        if (imagerotate.top <= window.innerHeight && imagerotate.bottom >= 0) {
            honortwo_text.classList.add('fade-text');
        } else {
            honortwo_text.classList.remove('fade-text'); // XĂ³a CSS khi ra khá»i táº§m nhĂ¬n
        }
    });
}

window.addEventListener('scroll', checkIfInView);
window.addEventListener('resize', checkIfInView);

checkIfInView(); // Kiá»ƒm tra láº§n Ä‘áº§u khi trang web táº£i lĂªn