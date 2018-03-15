// CUSTOM SCRIPTS -- Adam
// Last Updated --  2/14
const detailsBtns = document.querySelectorAll(".feature-details__button");

// Screen Sizes / Measurements
const tabletSize = 768;

// Functions

// Replace the button text to 'Shop Now' on Dekstop
const fpBtnSwap = () => {
  if (document.body.classList.contains("index")) {
    let homePromosMain = document.querySelector(
      ".js-featured-promotions.featured-promotions.promo-per-row-3"
    );
    let promoBtns = homePromosMain.querySelectorAll(".button");

    for (let btn of promoBtns) {
      btn.innerHTML = `Shop Now`;
    }
  }
};

//  Doc Ready
document.addEventListener("DOMContentLoaded", function() {
  console.log("custom js loaded");

  let screenSize = window.innerWidth;

  // Change Feature Promotion Button text on Desktop
  screenSize >= tabletSize ? fpBtnSwap() : "";
});
