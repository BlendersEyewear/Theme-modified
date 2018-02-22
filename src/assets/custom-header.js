// Custom Header Script by Adam - 2/15

// VARS
const body = document.body;

// Different templates
const pageContent = document.getElementById("pagecontent");
const hyperVis = document.querySelector(".hypervisual__root");
const pageRetail = document.querySelector(".page-retail");

// Header
const promoBanner = document.getElementById("promoBanner");
const promoBannerClose = document.getElementById("promoBannerClose");

//  Third Party Popups
const ribbonContainer = document.getElementById("56d9-a3be_ribbon_container");

const mobHeader = document.getElementById("customHeaderMobile");
const navToggle = document.getElementById("mobileNavToggle");

const mobMenu = document.getElementById("mobileMenu");

const mobMenuCategory = document.querySelectorAll(
  ".custom-header-mobile__sublink"
);
const mobMenuCategoryHeader = document.querySelectorAll(
  ".custom-header-mobile__category"
);

// PREVENT SCROLLING
var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

const preventDefault = e => {
  e = e || window.event;
  if (e.preventDefault) e.preventDefault();
  e.returnValue = false;
};

const preventDefaultForScrollKeys = e => {
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
};

const disableScroll = () => {
  if (window.addEventListener)
    // older FF
    window.addEventListener("DOMMouseScroll", preventDefault, false);
  window.onwheel = preventDefault; // modern standard
  window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
  window.ontouchmove = preventDefault; // mobile
  document.onkeydown = preventDefaultForScrollKeys;
};

// Height offset for mobile menu
const addHeightOffset = headerHeight => {
  document.body.contains(pageContent)
    ? ((pageContent.style.paddingBottom = `${headerHeight}px`),
      (pageContent.style.display = "block"))
    : "";

  document.body.contains(hyperVis)
    ? (hyperVis.style.paddingTop = `${headerHeight}px`)
    : "";

  document.body.contains(pageContent) && document.body.contains(hyperVis)
    ? (hyperVis.style.paddingTop = `0px`)
    : "";

  document.body.classList.contains("page-retail") ||
  document.body.classList.contains("blog")
    ? (body.style.paddingTop = `${headerHeight}px`)
    : "";

  document.body.classList.contains("blog")
    ? ((pageContent.style.paddingBottom = 0),
      (pageContent.style.display = "none"))
    : "";
  // document.body.contains(hyperVis) ? hyperVis.style.paddingTop = `${headerHeight}px` : "";

  mobMenu.style.paddingTop = `${headerHeight}px`;

  console.log(headerHeight);
};

const removeHeightOffset = () => {
  pageContent.style.paddingBottom = `0px`;
  pageContent.style.display = "none";
  // mobMenu.style.paddingTop = `${headerHeight}px`;
};

const enableScroll = () => {
  if (window.removeEventListener)
    window.removeEventListener("DOMMouseScroll", preventDefault, false);
  window.onmousewheel = document.onmousewheel = null;
  window.onwheel = null;
  window.ontouchmove = null;
  document.onkeydown = null;
};

const mobMenuToggle = () => {
  navToggle.addEventListener("click", () => {
    console.log("clicked");
    navToggle.classList.toggle("custom-header-mobile__menu-toggle--open");
    mobMenu.classList.toggle("custom-header-mobile__menu--open");
    mobHeader.classList.toggle("custom-header-mobile--open");

    // Hide Get $20 banne when mobile menu is open
    // mobMenu.classList.contains("custom-header-mobile__menu--open")
    //   ? (ribbonContainer.style.display = "none", console.log('sliding out'))
    //   : (ribbonContainer.style.display = "block");
  });
};

const bannerClose = msg => {
  promoBannerClose.addEventListener("click", () => {
    promoBanner.classList.add(msg);
    let headerHeightShort = mobHeader.offsetHeight;
    addHeightOffset(headerHeightShort);
  });
};

// Making mobile menu dropdowns work
const subMenuDropdown = () => {
  for (let Menu of mobMenuCategoryHeader) {
    let subMenu = Menu.nextElementSibling;
    let arrow = Menu.querySelector(".arrow");

    // subMenu.style.display = "none";

    Menu.addEventListener("click", () => {
      arrow.classList.toggle("arrow--open");
    });
  }
};

// Doc Ready
$(function() {
  console.log("custom js loaded");
  mobMenuToggle();

  // Enabling/Disabling scrolling
  // mobMenu.classList.contains("customer-header-mobile__menu--open") ?
  //     disableScroll() : enableScroll();

  bannerClose("promo_banner_hide");

  // Creating vertical window offset to compensate for fixed header
  let headerHeight = mobHeader.offsetHeight;
  mobHeader.classList.contains("custom-header-mobile--is-mobile")
    ? addHeightOffset(headerHeight)
    : console.log("mobheader isnt mobile");

  // Making Mobile Nav submenus works
  subMenuDropdown();
  $(".custom-header-mobile__category").click(function() {
    $(this)
      .next()
      .slideToggle(250, "swing");
  });
});

// TO ADD
//  - Search submit on desktop
// - Press enter to search sumbit on desktop