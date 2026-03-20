document.addEventListener("DOMContentLoaded", function () {
    // 1. Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });

    // 2. Image Modal (Enlarge Diploma)
    const modal = document.getElementById("image-modal");
    const imgWrapper = document.getElementById("diploma-btn");
    const modalImg = document.getElementById("modal-img");
    const closeBtn = document.getElementsByClassName("close-modal")[0];

    // Open Modal when clicking on the diploma wrapper
    if (imgWrapper) {
        imgWrapper.onclick = function () {
            modal.style.display = "block";
            // Get the src of the image inside the wrapper
            const thumbSrc = this.querySelector('img').src;
            modalImg.src = thumbSrc;

            // Prevent scrolling on body
            document.body.style.overflow = "hidden";
        }
    }

    // Close Modal when clicking the X
    if (closeBtn) {
        closeBtn.onclick = function () {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    }

    // Close Modal when clicking anywhere outside the image
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    }
});
