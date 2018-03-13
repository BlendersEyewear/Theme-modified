console.log("custom saso/USO scripts loaded");

const $sasoNotif = $("#saso-notifications");
const $sasoSummary = $(".saso-summary");
const $breaks = $sasoSummary.find("br").length;
const $promoBanner = $(".promo_banner");
const $promoBannerClose = $(".promo_banner-close");

const promoBannerHeight = 30;
const headerHeight = $("#header").height();

const shippingMsgContainer = $(".shippingmessage");
const shippingMsg = $(".shipping-notice");

const shippingMessages = {
  free: "Sweet! You scored Free Shipping…",
  addMore: "Add more items to get Free Shipping! <br>All orders over $40 ship Free"
};

const timeOutTime = 750;
const freeShippingThreshold = 4000;

// FUNCTIONS

// Toggle height if promo banner is closed or present
const promoHeightChange = function() {
  // If saso notifications exists
  if ($sasoNotif) {
    //  wait a sec to fire
    setTimeout(function() {
      // console.log('promogheight change loaded');
      if ($promoBanner.height() > 0) {
        // console.log("promo banner");
      } else {
        if ($sasoNotif.height() > 0) {
          $sasoNotif.addClass("saso-no-promo");
          // console.log("no promo banner");
        }
      }

      if ($promoBannerClose) {
        $promoBannerClose.on("click", function() {
          $sasoNotif.addClass("saso-no-promo");
        });
      }
    }, timeOutTime);
  }
};

// Show free shipping message
const showFreeShippingMsg = function() {
  $(shippingMsgContainer).append($(shippingMsg));

  $(shippingMsg)
    .addClass("shipping-notice--free")
    .html(shippingMessages.free);

  console.log("free shipping msg up for USO total");
};

// get inner pricing and covnert to ineterger
const getPrice = function(element) {
  let innerMoney = $(element).find(".money");

  let innerMoneyRaw = parseInt(
    $(innerMoney)
      .text()
      .replace(/[^\d\.]/g, "") * 100
  );

  // return parseInt($(innerMoneyRaw));
  return $(innerMoneyRaw);
};

// saso Price Updates Function
const sasoPriceUpdate = function(){
  if ($($sasoSummary).length) {
    // Wait a sec for stuff to load
    setTimeout(function() {
      // Remove <br> tags from Saso-Summary tags after they load
      $sasoSummary.find("br").remove();

      let sasoPrice = getPrice(".saso-cart-total");

      const $sasoCartCont = $(".saso-cart-total");
      const $sasoCart = $sasoCartCont.find("money");
      const $sasoCartTotalRaw = parseInt($(".saso-cart-total")
          .find(".money")
          .text()
          .replace(/[^\d\.]/g, "") * 100);

      if ($sasoCartCont.html()) {
        // Remove free shipping message if USO cart total is present
        console.log("removed free shipping message");
        $(shippingMsg).detach();

        console.log($sasoCartTotalRaw);

        if ($sasoCartTotalRaw >= freeShippingThreshold) {
          showFreeShippingMsg();
        } else {
          console.log("no free shipping for you");
          $(shippingMsgContainer)
            .append($(shippingMsg))
            .html(shippingMessages.addMore);
        }
      }
    }, timeOutTime);
  }
}

// Remove Shipping Message
const removeShippingMsg = function(){
  if($sasoSummary.length){
    if($(shippingMsgContainer).length){
      $(shippingMsgContainer).remove();
    }
  }
}

// Doc Ready
$(function() {
  // make sure ppadding is flush with header
  promoHeightChange();
  
  // Add saso price update?
  // Remove Shipping Message
  removeShippingMsg();  

});

// jQuery.get('/cart.js', function(data){
//     console.log(data).responseText;
// });

// const cartData = jQuery.get("/cart.js").responseText;

// $.getJSON("/cart.js", function(data){
//     const totalPrice = data.total_price;
//     console.log(totalPrice, 'old price');
// });
