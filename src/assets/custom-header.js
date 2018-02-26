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

const promoBannerDesktop = document.getElementById("promoBannerDesktop");
const promoBannerDesktopClose = document.getElementById(
  "promoBannerDesktopClose"
);

//  Third Party Popups
const ribbonContainer = document.getElementById("56d9-a3be_ribbon_container");

// Header DOM
const mobHeader = document.getElementById("customHeaderMobile");
const navToggle = document.getElementById("mobileNavToggle");

// Cart
const miniCart = document.querySelector(".custom-header__mini_cart");
const cartContainer = document.querySelector(".custom-header__cart_container");

// Class to show its open
const activeCartClass = "cart-is-active";

const mobMenu = document.getElementById("mobileMenu");

const mobMenuCategory = document.querySelectorAll(
  ".custom-header-mobile__sublink"
);
const mobMenuCategoryHeader = document.querySelectorAll(
  ".custom-header-mobile__category"
);

const MenuImg = document.getElementById("customHeaderDesktopMenuImg");
const collectionMenuItems = document.querySelectorAll(
  ".custom-header-desktop__collection-sublink"
);

// WINDOW SIZES
const desktopScreenSize = 960;

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

  // console.log(headerHeight);
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

    // Close mini cart if its open
    miniCart.classList.contains(activeCartClass)
      ? miniCart.classList.remove(activeCartClass)
      : "";
  });
};

const bannerClose = (banner, className) => {
  console.log(`${banner.id} ${className}`);

  let bannerDiv = document.getElementById(banner);
  let closeButton = document.getElementById(`${banner.id}Close`);
  console.log(closeButton);

  closeButton.addEventListener("click", () => {
    console.log('clicked');
    banner.classList.add(className);
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

// Making Desktop Colelction Hover change background to current collection image
const menuCollectionHover = () => {
  // Set initial background using first collection;
  MenuImg.style.backgroundImage = `url('${
    collectionMenuItems[0].dataset.menuimg
  }')`;

  // Collection Dropdown Image hoverover change
  for (link of collectionMenuItems) {
    let imgData = link.dataset.menuimg;

    link.addEventListener("mouseover", () => {
      MenuImg.style.backgroundImage = `url('${imgData}')`;
    });
  }
};

// Mini Cart Header Function
const miniCartFunctions = () => {
  console.log("mini cart loadeddd");

  let closeCart = () => {
    miniCart.classList.remove(activeCartClass);
  };

  let openCart = () => {
    mobMenu.classList.contains("custom-header-mobile__menu--open")
      ? mobMenu.classList.remove("custom-header-mobile__menu--open")
      : "";
    navToggle.classList.contains("custom-header-mobile__menu-toggle--open")
      ? navToggle.classList.remove("custom-header-mobile__menu-toggle--open")
      : "";
    mobHeader.classList.contains("custom-header-mobile--open")
      ? mobHeader.classList.remove("custom-header-mobile--open")
      : "";
    miniCart.classList.add(activeCartClass);
  };

  // Mini Cart Function
  miniCart.addEventListener("click", e => {
    e.preventDefault();
    console.log("clicking");
    let container = miniCart.parentElement;
    miniCart.classList.contains(activeCartClass) ? closeCart() : openCart();
  });
};

// Doc Ready
$(function() {
  console.log("custom js loaded");
  mobMenuToggle();

  // Creating vertical window offset to compensate for fixed header
  let headerHeight = mobHeader.offsetHeight;
  // mobHeader.classList.contains("custom-header-mobile--is-mobile")
  //   ? addHeightOffset(headerHeight)
  //   : console.log("mobheader isnt mobile");

  // Making Mobile Nav submenus works
  subMenuDropdown();
  $(".custom-header-mobile__category").click(function() {
    $(this)
      .next()
      .slideToggle(250, "swing");
  });

  // Banner Close on Desktop
  window.innerWidth >= desktopScreenSize
    ? (mobHeader.classList.remove("custom-header-mobile--is-mobile"),
      console.log("desktop"),
      bannerClose(promoBannerDesktop, "promo_banner_hide"),
      addHeightOffset(headerHeight))

    : (bannerClose(promoBanner, "promo_banner_hide"),
      addHeightOffset(headerHeight),
      console.log("this is mobile"));

  menuCollectionHover();

  // Mini Cart Function
  miniCartFunctions();
});

// TO ADD
//  - Search submit on desktop // --> already works. Hooked up to existing theme via css classes
// - Press enter to search sumbit on desktop
