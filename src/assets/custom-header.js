// Custom Header Script by Adam - 2/15


// VARS
const promoBanner = document.getElementById("promoBanner");
const promoBannerClose = document.getElementById("promoBannerClose");


const mobHeader = document.getElementById("customHeader");
const navToggle = document.getElementById("mobileNavToggle");

const mobMenu = document.getElementById("mobileMenu");

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
    })
}

// Doc Ready
$(function() {
    console.log('ready');
    mobMenuToggle();
    bannerClose("promo_banner_hide");
});