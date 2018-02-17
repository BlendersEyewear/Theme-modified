// Custom Header Script by Adam - 2/15

// VARS
const body = document.body;
const pageContent = document.getElementById('pagecontent');

const promoBanner = document.getElementById("promoBanner");
const promoBannerClose = document.getElementById("promoBannerClose");

const mobHeader = document.getElementById("customHeader");
const navToggle = document.getElementById("mobileNavToggle");

const mobMenu = document.getElementById("mobileMenu");

const mobMenuCategoryHeader = document.querySelectorAll(".custom-header-mobile__category");

// PREVENT SCROLLING
var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

const preventDefault = (e) => {
  e = e || window.event;
  if (e.preventDefault) e.preventDefault();
  e.returnValue = false;
}

const preventDefaultForScrollKeys = (e) => {
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}

const disableScroll = () => {
  if (window.addEventListener)
    // older FF
    window.addEventListener("DOMMouseScroll", preventDefault, false);
  window.onwheel = preventDefault; // modern standard
  window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
  window.ontouchmove = preventDefault; // mobile
  document.onkeydown = preventDefaultForScrollKeys;
}


// Height offset for mobile menu
const addHeightOffset = (headerHeight) => {
  pageContent.style.paddingBottom = `${headerHeight}px`;
  pageContent.style.display = 'block';
  // console.log('offsetted');
}

const removeHeightOffset = () => {
  pageContent.style.paddingBottom = `0px`;
  pageContent.style.display = "none";
};


const enableScroll = () => {
  if (window.removeEventListener)
    window.removeEventListener("DOMMouseScroll", preventDefault, false);
  window.onmousewheel = document.onmousewheel = null;
  window.onwheel = null;
  window.ontouchmove = null;
  document.onkeydown = null;
}

const mobMenuToggle = () => {
    navToggle.addEventListener('click', () => {
        console.log('clicked');
        mobMenu.classList.toggle("customer-header-mobile__menu--open");
        mobHeader.classList.toggle("custom-header-mobile--open");

    })
}
const bannerClose = (msg) => {
    promoBannerClose.addEventListener('click', () => {
        promoBanner.classList.add(msg);
        let headerHeightShort = mobHeader.offsetHeight;
        addHeightOffset(headerHeightShort);
    })
}


// Making mobile menu dropdowns work
const subMenuDropdown = () => {

  for (let subMenu of mobMenuCategoryHeader){ 
    console.log(subMenu.innerHTML);

  }

}

// Doc Ready
$(function() {
    console.log("custom js loaded");
    mobMenuToggle();
    bannerClose("promo_banner_hide");
    console.log(mobHeader.offsetHeight);

    // Creating vertical window offset to compensate for fixed header
    let headerHeight = mobHeader.offsetHeight;
    mobHeader.classList.contains("custom-header-mobile--is-mobile") ? // body.classList.add("custom-header-mobile-offset") :
        addHeightOffset(headerHeight) : console.log("mobheader isnt mobile");
    // console.log(headerHeight);

    // Making Mobile Nav submenus works
    subMenuDropdown();
});