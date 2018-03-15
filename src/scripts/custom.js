// CUSTOM SCRIPTS -- Adam 
// Last Updated --  2/14
const detailsBtns = document.querySelectorAll(".feature-details__button");


// Screen Sizes / Measurements
const tabletSize = 768;

// Functions

// Replace the button text to 'Shop Now' on Dekstop
const fpBtnSwap = () => {
    console.log('woohoo, its on deesktop!!');
    for (let btn of detailsBtns){
        btn.innerHTML = `Shop Now`;
    }
}



//  Doc Ready
document.addEventListener("DOMContentLoaded", function() {
    console.log('custom js loaded');

    let screenSize = window.innerWidth;

    // Change Feature Promotion Button text on Desktop
    screenSize >= tabletSize ? fpBtnSwap() : '';

});