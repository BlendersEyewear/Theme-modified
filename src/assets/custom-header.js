// Custom Header Script by Adam - 2/15

// --------------------------------------
// VARS 
// --------------------------------------
const body = document.body;

// Different templates
const pageContent = document.getElementById("pagecontent");
const hyperVis = document.querySelector(".hypervisual__root");
const pageRetail = document.querySelector(".page-retail");

// Header
const promoBanner = document.getElementById("promoBanner");
const promoBannerClose = document.getElementById("promoBannerClose");

const promoBannerDesktop = document.getElementById("promoBannerDesktop");
const promoBannerDesktopClose = document.getElementById("promoBannerDesktopClose");

//  Third Party Popups
const ribbonContainer = document.getElementById("56d9-a3be_ribbon_container");

// Header DOM
const mobHeader = document.getElementById("customHeaderMobile");
const navToggle = document.getElementById("mobileNavToggle");
const customStickyNav = document.getElementById("customStickyNav");

// Cart
const miniCart = document.querySelector(".custom-header__mini_cart");
const cartContainer = document.querySelector(".custom-header__cart_container");
const headerMiniCart = document.querySelector("#headerCart");

// Class to show its open
const activeCartClass = "cart-is-active";

const mobMenu = document.getElementById("mobileMenu");

const mobMenuCategory = document.querySelectorAll(
  ".custom-header-mobile__sublink"
);
const mobMenuCategoryHeader = document.querySelectorAll(
  ".custom-header-mobile__category"
);

const MenuImg = document.querySelector(".custom-header-desktop__menu-img");
const collectionMenuItems = document.querySelectorAll(
  ".custom-header-desktop__collection-sublink"
);

// WINDOW SIZES
const desktopScreenSize = 960;


// --------------------------------------
// Utilities 
// --------------------------------------
const throttle = (fn, wait) => {
  let time = Date.now();

  return () => {
    if (time + wait - Date.now() < 0) {
      fn();
      time = Date.now();
    }
  }
}

// Height offset for mobile menu
// --------------------------------
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

const mobMenuToggle = () => {
  navToggle.addEventListener("click", () => {
    // console.log("clicked");
    navToggle.classList.toggle("custom-header-mobile__menu-toggle--open");
    mobMenu.classList.toggle("custom-header-mobile__menu--open");
    mobHeader.classList.toggle("custom-header-mobile--open");

    // Close mini cart if its open
    miniCart.classList.contains(activeCartClass)
      ? miniCart.classList.remove(activeCartClass)
      : "";
  });
};

// Making Promo Banner Close
// --------------------------------
const bannerClose = (banner, className) => {
  let bannerDiv = document.getElementById(banner);
  let closeButton = document.getElementById(`${banner.id}Close`);
  // console.log(closeButton);

  closeButton.addEventListener("click", () => {
    // console.log("clicked");
    banner.classList.add(className);
    let headerHeightShort = mobHeader.offsetHeight;
    addHeightOffset(headerHeightShort);
  });
};

// Making mobile menu dropdowns work
// --------------------------------
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
// -----------------------------------------------------------------------------
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
// --------------------------------
const miniCartFunctions = () => {
  console.log("mini cart loaded");

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

  miniCart.addEventListener("click", e => {
    e.preventDefault();
    console.log("clicking");
    let container = miniCart.parentElement;
    miniCart.classList.contains(activeCartClass) ? closeCart() : openCart();
  });
};

// Sticky Header on Desktop
// --------------------------------
const stickyNavDesktopFunc = () => {
  if (window.innerWidth >= desktopScreenSize) {
    let stickyHeight = 850;
    let stickyClass = "custom-header-sticky-nav--sticky";
    // customStickyNav.classList.

    let stickyNavFunc = () => {
      let windowOffset = window.pageYOffset;

      let makeSticky = () => {
        customStickyNav.classList.contains(stickyClass) ? "" : customStickyNav.classList.add(stickyClass);
      };

      let makeunSticky = () => {
        customStickyNav.classList.contains(stickyClass) ? customStickyNav.classList.remove(stickyClass) : "";
      };

      windowOffset > stickyHeight ? makeSticky() : makeunSticky();
    };

    window.addEventListener("scroll", throttle(stickyNavFunc, 350));
  }
}

// Doc Ready
// ----------------------------------------
$(function() {
  console.log("custom header js loaded");
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
    $(this).toggleClass("custom-header-mobile__category--open");
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

  // Mini Cart Functions for Header
  if (window.innerWidth >= desktopScreenSize) {
    console.log("desktop");

    var miniCartDesktopContainer = $(".custom-header__cart_container--desktop");
    var miniCartDesktop = $(".custom-header__mini_cart");

    $(miniCartDesktop).removeClass("active_link");

    $(".dropdown_link").on("click", function(e) {
      e.preventDefault();
    });

    $(miniCartDesktopContainer).on("mouseenter", function(e) {
      $(this).find(miniCartDesktop).addClass("active_link");
    });


    $(miniCartDesktopContainer).on("mouseleave", function(e) {
      $(miniCartDesktop).removeClass("active_link");
    });

    // Close Desktop Mini Cart by click outside of it
    $("html").on("click", function(event) {
      if (
        !$(event.target).closest(".custom-header__mini_cart").length &&
        $(".cart_content").is(":visible")
      ) {
        $(miniCartDesktop).removeClass("active_link");
      }
    });

    $(".dropdown_link").on("mouseenter", function() {
      if (!$(this).hasClass("active_link")) {
        $(".dropdown_container").hide();
        $(this)
          .parents(".main_nav")
          .find('[data-dropdown="' + $(this).data("dropdown-rel") + '"]')
          .show();

        if ($(this).hasClass("mini_cart")) {
          $(this)
            .parent(".cart_container")
            .addClass("active_link");
        } else {
          $(this).addClass("active_link");
          $(".is-absolute")
            .parent()
            .removeClass("feature_image");
        }
      }
    });
  }

  // Sticky Header on Scroll on Dekstop
  // --------------------------------------
  stickyNavDesktopFunc();


  // --------------------------------------
  // Currency Selector
  // --------------------------------------
  //  --> inherited and modified from Turbo Theme
  /* Default currency */
  var defaultCurrency = "USD" || shopCurrency;

  // Increase desktop size from 768 to 960 -- also changed the css classes to what I'm using
  if ($(window).width() >= 960) {
    var $currencySelector = $(".custom-header-desktop__currency .currencies");
  } else {
    var $currencySelector = $(".mobile-bottom-nav__item .currencies");
  }

  /* Cookie currency */
  var cookieCurrency = Currency.cookie.read();

  /* Fix for customer account pages */
  $("span.money span.money").each(function() {
    $(this)
      .parents("span.money")
      .removeClass("money");
  });

  /* Saving the current price */
  $("span.money").each(function() {
    $(this).attr("data-currency-USD", $(this).html());
  });

  // If there's no cookie.
  if (cookieCurrency == null) {
    if (shopCurrency !== defaultCurrency) {
      Currency.convertAll(shopCurrency, defaultCurrency);
    } else {
      Currency.currentCurrency = defaultCurrency;
    }
  } else if (
    $currencySelector.size() &&
    $currencySelector.find("option[value=" + cookieCurrency + "]").size() === 0
  ) {
    // If the cookie value does not correspond to any value in the currency dropdown.
    Currency.currentCurrency = shopCurrency;
    Currency.cookie.write(shopCurrency);
  } else if (cookieCurrency === shopCurrency) {
    Currency.currentCurrency = shopCurrency;
  } else {
    Currency.convertAll(shopCurrency, cookieCurrency);
  }

  $currencySelector.val(Currency.currentCurrency).change(function() {
    var newCurrency = $(this).val();
    Currency.convertAll(Currency.currentCurrency, newCurrency);
    jQuery(".selected-currency").text(Currency.currentCurrency);
    // console.log(Currency.currentCurrency); // <-- Add flag change here
    var flagImg = $(this)
      .find(":selected")
      .data("flag");
    var flagImgUrl = "url('" + flagImg + "')";
    $(this).css("background-image", flagImgUrl);
  });

  var original_selectCallback = window.selectCallback;
  var selectCallback = function(variant, selector) {
    original_selectCallback(variant, selector);
    Currency.convertAll(shopCurrency, $currencySelector.val());
    jQuery(".selected-currency").text(Currency.currentCurrency);
    console.log("here!!");
  };

  function convertCurrencies() {
    if (
      $currencySelector.val() &&
      $currencySelector.val() != $currencySelector.data("default-shop-currency")
    ) {
      Currency.convertAll(
        $currencySelector.data("default-shop-currency"),
        $currencySelector.val()
      );
      jQuery(".selected-currency").text(Currency.currentCurrency);
    }
  }
});

// TO ADD
//  - Search submit on desktop // --> already works. Hooked up to existing theme via css classes
// - Press enter to search sumbit on desktop
