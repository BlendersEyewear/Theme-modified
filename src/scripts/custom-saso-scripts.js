console.log("custom saso/USO scripts loaded");

var $sasoNotif = $("#saso-notifications");
var $sasoSummary = $(".saso-summary");
var $breaks = $sasoSummary.find("br").length;
var $promoBanner = $(".promo_banner");
var $promoBannerClose = $(".promo_banner-close");

var promoBannerHeight = 30;
var headerHeight = $("#header").height();

var shippingMsgContainer = $(".shippingmessage");
var shippingMsgFree = $(".shipping-notice--free");

var showFreeShippingMsg = function showFreeShipping() {
  shippingMsgContainer.append(shippingMsgFree);
  console.log('omg this works');
}

// Doc Ready
$(function() {
  if ($($sasoSummary).length) {

    $(shippingMsgFree).detach();

    // Remove <br> tags from Saso-Summary tags after they load
    setTimeout(function() {
      $sasoSummary.find("br").remove();

      if ($promoBanner.height() > 0) {
        //         $sasoNotif.css('margin-top', headerHeight + promoBannerHeight);
        console.log("promo banner");
      } else {
        if ($sasoNotif.height() > 0) {
          $sasoNotif.addClass("saso-no-promo");
          console.log("no promo banner");
        }
      }

      if ($promoBannerClose) {
        $promoBannerClose.on("click", function() {
          $sasoNotif.addClass("saso-no-promo");
        });
      }
    
    var $sasoCart = $('.saso-cart-total').find('money');
    var $sasoCartTotalRaw = $(".saso-cart-total")
      .find(".money")
      .text()
      .replace(/[^\d\.]/g, "")*100;
    var $sasoCartTotal = parseInt($sasoCartTotalRaw);

    if ($sasoCart) {
      console.log($sasoCartTotal);
      var freeShippingThreshold = 4000;

      if($sasoCartTotal > freeShippingThreshold){showFreeShippingMsg();}
    }
    
    }, 750);

    
  }
});


// jQuery.get('/cart.js', function(data){
//     console.log(data).responseText;
// });

// var cartData = jQuery.get("/cart.js").responseText;

$.getJSON("/cart.js", function(data){
    var totalPrice = data.total_price;
    console.log(totalPrice, 'old price');
});