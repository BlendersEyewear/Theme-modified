// CUSTOM SCRIPTS -- Adam
// Last Updated --  2/14
const detailsBtns = document.querySelectorAll(".feature-details__button");
const body = document.body;

// Screen Sizes / Measurements
const tabletSize = 768;

// Helper Functions

// Check if element exists
const exists = (el) => {
  if(typeof(el) != 'undefined' && el != null){
    return true
  } else {
    return false
  }
}

// Core Functions

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

// Remove "Soft Pouch" from product titles pouch upsell
const PouchUpsell = () => {
  
  // Get pouch containers
  let pouchContainers = document.querySelectorAll('.mobile-upsell-container');

  // Remove ' SOFT POUCH' from the Title
  let removeTitle = () => {
    // Loop through all the products in the pouch containers
    for(let container of pouchContainers){
      let productDetails = container.querySelector('.product-details');

      if(exists(productDetails)){
        let title = productDetails.querySelector('.title');

        // Check if span.title exists
        if(exists(title)){
          let text = title.innerHTML;
          let toRemove = " SOFT"
          
          // Remove "BBQ" from Backyard BBQ
          if(text.indexOf(" BBQ SOFT") !== -1 ){
            title.innerHTML = text.replace(" BBQ SOFT", '');
          } else if(text.indexOf(toRemove) !== -1){
            title.innerHTML = text.replace(toRemove, '');
          }
          
        }
      }
      
    }
  }

  body.classList.contains('cart') ? removeTitle() : '';
}

//  Doc Ready
document.addEventListener("DOMContentLoaded", function() {
  console.log("custom js loaded");

  let screenSize = window.innerWidth;

  // Change Feature Promotion Button text on Desktop
  screenSize >= tabletSize ? fpBtnSwap() : "";

  // Run Mobile Only Scripts
  screenSize <= tabletSize ? (PouchUpsell()) : '';
});
