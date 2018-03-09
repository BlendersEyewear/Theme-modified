/*============================================================================
    Start of cart-related functionality
  ==============================================================================*/

function ajaxSubmitCart(cart) {
  $cart = cart;
  $.ajax({
    url: "/cart/update.js",
    dataType: "json",
    type: "post",
    data: $cart.serialize(),
    success: function(data) {
      refreshCart(data);
    }
  });
}

function ajaxUpdateCart(lineID, quantity, parent) {
  $.ajax({
    url: "/cart/change.js",
    dataType: "json",
    type: "post",
    data: { quantity: quantity, line: lineID },
    success: function(data) {
      refreshCart(data);

      var lineIDIndex = lineID - 1;

      //check to see if there are correct amount of products in array
      if (typeof data.items[lineIDIndex] === "undefined") {
        var updated_quantity = 0;
      } else {
        var updated_quantity = data.items[lineIDIndex].quantity;
      }

      if (quantity > 0 && quantity != updated_quantity) {
        if (updated_quantity == 1) {
          items_left_text = "item left";
        } else {
          items_left_text = "items left";
        }

        $(".warning--quantity").remove();

        var warning =
          '<p class="warning warning--quantity animated bounceIn">' +
          updated_quantity +
          " " +
          items_left_text +
          "</p>";
        parent
          .find("input[data-line-id='" + lineID + "']")
          .parent()
          .after(warning);
        parent
          .find("input[data-line-id='" + lineID + "']")
          .val(updated_quantity);
      } else if (parent.is("#cart_form")) {
        $("#cart_form").submit();
      }
    }
  });
}

function refreshCart(cart) {
  $cartBtn = $(".cart_count");
  var value = $cartBtn.text() || "0";
  var cart_items_html = "";
  var cart_action_html = "";
  var $cart = $(".cart_content form");

  $cartBtn.text(value.replace(/[0-9]+/, cart.item_count));

  if (cart.item_count == 0) {
    $(".js-empty-cart__message").removeClass("hidden");
    $(".js-cart_content__form").addClass("hidden");
  } else {
    $(".js-empty-cart__message").addClass("hidden");
    $(".js-cart_content__form").removeClass("hidden");

    $.each(cart.items, function(index, item) {
      var line_id = index + 1;
      cart_items_html +=
        '<li class="cart_item clearfix">' + '<a href="' + item.url + '">';
      if (item.image) {
        cart_items_html +=
          '<div class="cart_image">' +
          '<img src="' +
          item.image.replace(/(\.[^.]*)$/, "_compact$1").replace("http:", "") +
          '" alt="' +
          htmlEncode(item.title) +
          '" />' +
          "</div>";
      }

      cart_items_html +=
        '<strong class="right price"><span class="money">' +
        Shopify.formatMoney(item.price, $cart.data("money-format")) +
        "</span></strong>" +
        '<div class="item_title">' +
        item.title +
        "</div>" +
        "</a>";

      cart_items_html +=
        '<div class="left product-quantity-box">' +
        '<span class="ss-icon product-minus js-change-quantity" data-func="minus"><span class="icon-minus"></span></span>' +
        '<input type="number" min="0" class="quantity" name="updates[]" id="updates_' +
        item.id +
        '" value="' +
        item.quantity +
        '" data-line-id="' +
        line_id +
        '" />' +
        '<span class="ss-icon product-plus js-change-quantity" data-func="plus"><span class="icon-plus"></span></span>' +
        "</div>" +
        "</li>";
    });

    cart_action_html +=
      '<span class="right"><span class="money">' +
      Shopify.formatMoney(cart.total_price, $cart.data("money-format")) +
      "</span></span>" +
      "<span>Subtotal</span>";
  }

  $(".js-cart_items").html(cart_items_html);
  $(".js-cart_subtotal").html(cart_action_html);

  convertCurrencies();
}

$("body").on("change", "#cart_form input.quantity", function() {
  ajaxUpdateCart(
    $(this).data("line-id"),
    $(this).val(),
    $(this).parents("#cart_form")
  );
});

$("body").on("change", ".cart_content input.quantity", function() {
  ajaxUpdateCart(
    $(this).data("line-id"),
    $(this).val(),
    $(this).parents(".cart_content")
  );
});


console.log('ajax cart js loaded');
