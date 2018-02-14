function sasoShopifyformatMoney(cents, format) {
  if (typeof cents == "undefined" || cents == null) {
    return "";
  }
  if (typeof cents == "string" && cents.length == 0) {
    return "";
  }
  if (typeof cents == "number" && window.saso_config.tax_percent > 0) {
    cents = cents * (1 + window.saso_config.tax_percent / 100);
  }
  var value = "",
    placeholderRegex = /\{\{\s*(\w+)\s*\}\}/,
    formatString = format || this.money_format;
  if (typeof cents == "string") {
    cents = cents.replace(".", "");
  }

  function defaultOption(opt, def) {
    return typeof opt == "undefined" ? def : opt;
  }

  function formatWithDelimiters(number, precision, thousands, decimal) {
    precision = defaultOption(precision, 2);
    thousands = defaultOption(thousands, ",");
    decimal = defaultOption(decimal, ".");
    if (isNaN(number) || number == null) {
      return 0;
    }
    number = (number / 100).toFixed(precision);
    var parts = number.split("."),
      dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + thousands),
      cents = parts[1] ? decimal + parts[1] : "";
    return dollars + cents;
  }
  switch (formatString.match(placeholderRegex)[1]) {
    case "amount":
      value = formatWithDelimiters(cents, 2);
      break;
    case "amount_no_decimals":
      value = formatWithDelimiters(cents, 0);
      break;
    case "amount_with_comma_separator":
      value = formatWithDelimiters(cents, 2, ".", ",");
      break;
    case "amount_no_decimals_with_comma_separator":
      value = formatWithDelimiters(cents, 0, ".", ",");
      break;
  }
  return formatString.replace(placeholderRegex, value);
}

function sasoHash(s) {
  var hash = 0,
    i,
    chr,
    len;
  if (s.length === 0) return hash;
  for (i = 0, len = s.length; i < len; i++) {
    chr = s.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash.toString();
}

function sasoCleanBuyxHandleJson(product) {
  var variants = [];
  var option_position = -1;
  for (var oi = 0, olen = product.options.length; oi < olen; oi++) {
    if (product.options[oi].name == "BuyXDiscount") {
      option_position = oi + 1;
      break;
    }
  }
  if (option_position == -1) {
    return product;
  }
  if (product.options.length > 1) {
    product.options.splice(option_position - 1, 1);
  } else {
    product.options[0].name = "Title";
  }
  option_position = "option" + option_position;
  product.available = false;
  for (var vi = 0, vlen = product.variants.length; vi < vlen; vi++) {
    if (product.variants[vi][option_position] == "Default") {
      product.variants[vi][option_position] = "";
      variants.push(product.variants[vi]);
      product.available = product.available || product.variants[vi].available;
    }
  }
  product.variants = variants;
  product.price = product.variants[0].price;
  product.price_min = product.price;
  product.price_varies = false;
  return product;
}

function sasoCurrency() {
  if (
    typeof Currency == "object" &&
    typeof Currency.moneyFormats == "object" &&
    typeof mlvedaload == "function"
  ) {
    mlvedaload();
  }
}

function sasoDoActions(data) {
  if (typeof SASOComplete == "function") {
    data = SASOComplete(data);
  }
  window.saso_config.notifications = data.settings_notifications;
  if (typeof window.saso_config.notifications != "object") {
    window.saso_config.notifications = [];
  }
  if (typeof window.saso_config.notifications.position != "string") {
    window.saso_config.notifications.position = "top";
  }
  if (typeof window.saso_config.notifications.background_color != "string") {
    window.saso_config.notifications.background_color = "#73170f";
  }
  if (typeof window.saso_config.notifications.text_color != "string") {
    window.saso_config.notifications.text_color = "#ffffff";
  }
  window.saso_config.tax_percent = data.tax_percent;
  window.saso_config.offers_method = data.offers_method;
  window.saso_config.exclude_order_discount_details = false;
  if (typeof data.exclude_order_discount_details == "boolean") {
    window.saso_config.exclude_order_discount_details =
      data.exclude_order_discount_details;
  }
  if (typeof data.actions != "object") {
    data.actions = [];
  }
  var af = [];
  af = data.actions.filter(function(a) {
    return a.type == "add-cart-items";
  });
  if (af.length) {
    sasoAddCartItems(af[0].items);
  }
  af = data.actions.filter(function(a) {
    return a.type == "volume-discount-tiers";
  });
  if (af.length) {
    sasoShowVolumeDiscountTiers(af[0]);
  }
  var cooka = [];
  var cook = window.sasoDocCookies.getItem("saso_shown_upsells");
  if (cook && typeof cook == "string") {
    cook.split(",").map(function(i) {
      cooka.push(parseInt(i));
    });
  }
  af = data.actions.filter(function(a) {
    if (a.type == "Upsell") {
      if (cooka.indexOf(a.id) == -1) {
        return true;
      }
    }
    return false;
  });
  if (af.length) {
    var af2 = af.filter(function(action) {
      return typeof action.price_discount == "object" && action.price_discount;
    });
    if (af2.length) {
      af = af2;
    }
    sasoPrepareCrossSell(af[Math.floor(Math.random() * af.length)]);
  }
  af = data.actions.filter(function(a) {
    if (a.type == "Bundle") {
      return true;
    }
    return false;
  });
  if (af.length) {
    sasoPrepareBundle(af[Math.floor(Math.random() * af.length)]);
  }
  af = data.actions.filter(function(a) {
    return a.type == "notification";
  });
  if (af.length) {
    sasoShowNotifications(af);
  }
  if (
    typeof data.discounts == "object" &&
    typeof data.discounts.cart == "object" &&
    typeof data.discounts.cart.items == "object"
  ) {
    sasoShowCartDiscounts(data.discounts);
  }
}

function sasoHideNotification(hash) {
  jQuery(".saso-notification").slideUp("fast");
  var cooka = [];
  var cook = window.sasoDocCookies.getItem("saso_notifications_closed");
  if (cook && typeof cook == "string") {
    cooka = cook.split(",");
  }
  if (cooka.indexOf(hash) == -1) {
    cooka.push(hash);
  }
  window.sasoDocCookies.setItem(
    "saso_notifications_closed",
    cooka.join(","),
    window.saso_config.hide_closed_notifications_for,
    "/"
  );
}

function sasoShowNotifications(notifications) {
  if (window.saso_config.notifications.position == "top") {
    var divn = '<div id="saso-notifications" style="padding-top: 0px; "></div>';
    var checks = [".collection_banner"];
    checks.map(function(sel) {
      if (
        jQuery("#saso-notifications").length == 0 &&
        jQuery(sel + ":not(.saso-ignore)").length == 1
      ) {
        jQuery(sel).after(divn);
      }
    });
    if (jQuery("#shopify-section-cart-template .section").length) {
      jQuery("#shopify-section-cart-template .section")
        .first()
        .after(divn);
    }
    var checks = ["main.wrapper.main-content", "main.main-content"];
    checks.map(function(sel) {
      if (
        jQuery("#saso-notifications").length == 0 &&
        jQuery(sel + ":not(.saso-ignore)").length == 1
      ) {
        jQuery(sel).before(divn);
      }
    });
    var checks = ["div.content", "section.main-content"];
    checks.map(function(sel) {
      if (
        jQuery("#saso-notifications").length == 0 &&
        jQuery(sel + ":not(.saso-ignore)").length == 1
      ) {
        jQuery(sel).prepend(divn);
      }
    });
    var checks = ["main"];
    checks.map(function(sel) {
      if (
        jQuery("#saso-notifications").length == 0 &&
        jQuery(sel + ":not(.saso-ignore)").length == 1
      ) {
        jQuery(sel).before(divn);
      }
    });
  }
  var notification_messages = [];
  notifications.map(function(n) {
    if (notification_messages.indexOf(n.message) == -1) {
      notification_messages.push(n.message);
    }
  });
  var message = notification_messages.join("<br>");
  var hash = sasoHash(message);
  var cooka = [];
  var cook = window.sasoDocCookies.getItem("saso_notifications_closed");
  if (cook && typeof cook == "string") {
    cooka = cook.split(",");
  }
  if (cooka.indexOf(hash) > -1) {
    return;
  }
  var style =
    "background-color: " +
    window.saso_config.notifications.background_color +
    "; color: " +
    window.saso_config.notifications.text_color +
    ";";
  var style_container =
    style + "opacity: " + window.saso_config.notifications.opacity + "; ";
  if (jQuery("#saso-notifications").length) {
  } else {
    style_container +=
      "position: fixed; " + window.saso_config.notifications.position + ": 0; ";
  }
  var html =
    '<div class="saso-notification" style="' +
    style_container +
    '"><div class="saso-notification-x"><a href="#" style="" onclick="sasoHideNotification(\'' +
    hash +
    "'); return false;\">X</a></div>";
  html += '<p style="' + style + '">' + message + "</p></div>";
  html += "<style> .saso-notification a { " + style + " }";
  if (jQuery("#saso-notifications").length) {
    jQuery("#saso-notifications").html(html);
  } else {
    jQuery(document.body).append(html);
  }
  jQuery(".saso-notification").slideDown("slow");
}

function sasoAddCartItems(items, callback) {
  if (items.length) {
    var item = items.shift();
    jQuery.ajax({
      type: "POST",
      dataType: "json",
      url: "/cart/add.js",
      data: item,
      success: function(res) {
        sasoAddCartItems(items, callback);
      },
      error: function(res) {
        if (
          typeof res == "object" &&
          typeof res.responseJSON == "object" &&
          typeof res.responseJSON.description == "string"
        ) {
          alert(res.responseJSON.description);
        }
        if (typeof res == "string") {
          alert(res);
        }
      }
    });
  } else {
    if (typeof callback == "function") {
      return callback();
    }
    setTimeout(function() {
      window.location.reload();
    }, 200);
  }
}

function sasoPrepareCrossSell(action) {
  if (
    typeof window.saso_config.show_upsell_only_in == "string" &&
    window.saso_config.show_upsell_only_in.length
  ) {
    if (
      window.saso_config.show_upsell_only_in.indexOf(window.saso.page_type) ==
      -1
    ) {
      return;
    }
  }
  if (typeof window.saso_config.show_upsell_only_width_larger == "number") {
    if (
      Math.max(document.documentElement.clientWidth, window.innerWidth || 0) <
      window.saso_config.show_upsell_only_width_larger
    ) {
      sasoShowNotifications([
        {
          type: "notification",
          message: action.message
        }
      ]);
      return;
    }
  }
  var defs = [];
  var products = [];
  action.products.map(function(p) {
    if (window.saso.page_type == "product" && p.id == window.saso.product.id) {
      return;
    }
    defs.push(
      jQuery
        .getJSON("/products/" + p.handle + ".json", function(data) {
          var product = data.product;
          product = sasoCleanBuyxHandleJson(product);
          for (var i = 0; i < product.variants.length; i++) {
            if (typeof product.variants[i].compare_at_price == "string") {
              product.variants[i].compare_at_price =
                parseFloat(product.variants[i].compare_at_price) * 100;
            }
            if (typeof product.variants[i].price == "string") {
              product.variants[i].price =
                parseFloat(product.variants[i].price) * 100;
            }
            if (
              typeof action.price_discount == "object" &&
              action.price_discount &&
              typeof action.price_discount.amount == "number"
            ) {
              product.variants[i].compare_at_price = product.variants[i].price;
              switch (action.price_discount.type) {
                case "flat":
                  product.variants[i].price =
                    action.price_discount.amount * 100;
                  break;
                case "subtract":
                  product.variants[i].price -=
                    action.price_discount.amount * 100;
                  if (product.variants[i].price < 0) {
                    product.variants[i].price = 0;
                  }
                  break;
                case "percent":
                  product.variants[i].price =
                    product.variants[i].price *
                    (100 - action.price_discount.amount) /
                    100;
                  break;
              }
            }
            product.variants[i].compare_at_price_n =
              product.variants[i].compare_at_price;
            product.variants[i].price_n = product.variants[i].price;
            if (
              product.variants[i].compare_at_price &&
              product.variants[i].compare_at_price > product.variants[i].price
            ) {
              product.variants[i].compare_at_price = sasoShopifyformatMoney(
                product.variants[i].compare_at_price,
                window.saso.money_format
              );
            } else {
              product.variants[i].compare_at_price = "";
            }
            product.variants[i].price = sasoShopifyformatMoney(
              product.variants[i].price,
              window.saso.money_format
            );
          }
          product.variants_style = "";
          product.variants_select = "";
          if (product.variants.length == 1) {
            product.variants_style = "visibility: hidden;";
            product.style_options = "visibility: hidden;";
          } else {
            var variants_html = "";
            product.variants.map(function(v) {
              if (
                typeof v.inventory_management == "string" &&
                v.inventory_management == "shopify"
              ) {
                if (
                  typeof v.inventory_policy == "string" &&
                  v.inventory_policy == "deny" &&
                  typeof v.inventory_quantity == "number" &&
                  v.inventory_quantity <= 0
                ) {
                  return;
                }
              }
              var img = "";
              if (typeof v.image_id == "number" && v.image_id != null) {
                var vimages = product.images.filter(function(pi) {
                  return pi.id == v.image_id;
                });
                if (vimages.length) {
                  img = vimages[0].src;
                }
              } else {
                if (
                  typeof product.image == "object" &&
                  product.image &&
                  typeof product.image.src == "string"
                ) {
                  img = product.image.src;
                }
              }
              var n = img.lastIndexOf(".");
              if (n >= 0) {
                var s = img.substring(0, n) + "_medium." + img.substring(n + 1);
                img = s;
              }
              variants_html +=
                "<option value='" +
                v.id +
                "' data-img='" +
                img +
                "' data-price='" +
                v.price_n +
                "' data-compare-at-price='" +
                v.compare_at_price_n +
                "'>";
              variants_html += sasoEscapeHtml(v.title) + "</option>";
            });
            product.variants_select = "<select class='saso-variants'>";
            if (
              typeof window.saso_config.upsell_variant_choose_option ==
                "string" &&
              window.saso_config.upsell_variant_choose_option.length
            ) {
              product.variants_select +=
                "<option value='0'>" +
                sasoEscapeHtml(
                  window.saso_config.upsell_variant_choose_option
                ) +
                "</option>";
            }
            product.variants_select += variants_html + "</select>";
          }
          if (
            typeof product.image == "object" &&
            product.image &&
            typeof product.image.src == "string"
          ) {
            var n = product.image.src.lastIndexOf(".");
            if (n >= 0) {
              var s =
                product.image.src.substring(0, n) +
                "_medium." +
                product.image.src.substring(n + 1);
              product.image.src = s;
            }
          }
          product.title = sasoTrimLength(
            product.title,
            window.saso_config.product_title_max_length
          );
          products.push(product);
        })
        .fail(function() {})
    );
  });
  if (defs.length == 0) {
    return;
  }
  jQuery.when.apply(jQuery, defs).done(function() {
    if (products.length == 0) {
      return;
    }
    window.saso.action_crosssell_popup_action = action;
    window.saso.ignore_previous_free_gifts = true;
    if (
      typeof action.from_offer_type == "string" &&
      action.from_offer_type == "Free Gift"
    ) {
      window.saso.ignore_previous_free_gifts = false;
    }
    if (
      products.length == 1 &&
      products[0].variants.length == 1 &&
      products[0].variants[0].price_n == 0
    ) {
      sasoRemovePreviousFreeGifts(function() {
        sasoAddCartItems([
          {
            id: products[0].variants[0].id,
            quantity: 1
          }
        ]);
        sasoShowCrossSellClosed();
      });
      return;
    }
    var no_variants = true;
    for (var i = 0; i < products.length; i++) {
      if (products[i].variants.length > 1) {
        no_variants = false;
      }
    }
    if (no_variants) {
      for (var i = 0; i < products.length; i++) {
        products[i].variants_style = "height: 0px;";
      }
    }
    var popup_tpl = Handlebars.compile(jQuery("#saso-cross-sell-popup").html());
    window.saso.action_crosssell_popup_html = popup_tpl({
      notifications_message: action.message,
      products: products,
      click_here: action.click_here
    });
    if (window.saso.page_type == "cart") {
      sasoShowCrossSell(action);
    }
  });
}

function sasoShowCrossSell(action) {
  if (typeof window.saso.action_crosssell_popup_html != "string") {
    return;
  }
  setTimeout(function() {
    window.sasoc.$cart_offers = jQuery(".saso-cart-offers");
    if (window.sasoc.$cart_offers.length) {
      window.sasoc.$cart_offers.each(function(i) {
        jQuery(this).html(window.saso.action_crosssell_popup_html);
      });
      sasoCurrency();
      sasoShowCrossSellClosed();
      return;
    }
    if (window.saso_config.crosssell_never_show_popup) {
      return;
    }
    window.sasoc.magnificPopup.open({
      closeOnContentClick: false,
      closeOnBgClick: false,
      items: {
        src: jQuery.parseHTML(window.saso.action_crosssell_popup_html),
        type: "inline"
      },
      callbacks: {
        afterClose: function() {
          sasoShowCrossSellClosed();
          if (
            window.saso.page_type == "cart" &&
            typeof window.saso.upsell_added == "boolean" &&
            window.saso.upsell_added
          ) {
            location.reload();
          }
        }
      }
    });
    sasoCurrency();
    setTimeout(function() {
      if (jQuery(".saso-products-container table").length) {
        jQuery(".mfp-content").css(
          "max-width",
          jQuery(".saso-products-container table").width() + 100
        );
      }
    }, 100);
    setTimeout(function() {
      sasoShowCrossSellClosed();
    }, 600);
  }, 1500);
}

function sasoShowCrossSellClosed() {
  if (window.sasoc.$cart_offers.length) {
    window.saso_config.hide_shown_upsells_for = 10;
  }
  var cooka = [];
  var cook = window.sasoDocCookies.getItem("saso_shown_upsells");
  if (cook && typeof cook == "string") {
    cook.split(",").map(function(i) {
      cooka.push(parseInt(i));
    });
  }
  var a = window.saso.action_crosssell_popup_action;
  if (cooka.indexOf(a.id) == -1) {
    if (
      typeof window.saso.action_crosssell_popup_action.manually_closed ==
        "boolean" &&
      window.saso.action_crosssell_popup_action.manually_closed
    ) {
      cooka.push(a.id);
    } else if (typeof a.price_discount == "object" && a.price_discount) {
    } else if (typeof a.price_bundle == "object" && a.price_bundle) {
    } else {
      cooka.push(a.id);
    }
  }
  window.sasoDocCookies.setItem(
    "saso_shown_upsells",
    cooka.join(","),
    window.saso_config.hide_shown_upsells_for,
    "/"
  );
}

function sasoPrepareBundle(action) {
  var defs = [];
  var products = [];
  action.products.map(function(p) {
    defs.push(
      jQuery
        .getJSON("/products/" + p.handle + ".json", function(data) {
          var product = data.product;
          for (var i = 0; i < product.variants.length; i++) {
            if (typeof product.variants[i].compare_at_price == "string") {
              product.variants[i].compare_at_price =
                parseFloat(product.variants[i].compare_at_price) * 100;
            }
            if (typeof product.variants[i].price == "string") {
              product.variants[i].price =
                parseFloat(product.variants[i].price) * 100;
            }
            product.variants[i].compare_at_price_n =
              product.variants[i].compare_at_price;
            product.variants[i].price_n = product.variants[i].price;
            if (
              product.variants[i].compare_at_price &&
              product.variants[i].compare_at_price > product.variants[i].price
            ) {
              product.variants[i].compare_at_price = sasoShopifyformatMoney(
                product.variants[i].compare_at_price,
                window.saso.money_format
              );
            } else {
              product.variants[i].compare_at_price = "";
            }
            product.variants[i].price = sasoShopifyformatMoney(
              product.variants[i].price,
              window.saso.money_format
            );
          }
          product.variants_style = "";
          product.variants_select = "";
          if (product.variants.length == 1) {
            product.variants_style = "visibility: hidden;";
            product.style_options = "visibility: hidden;";
          } else {
            var variants_html = "";
            product.variants.map(function(v) {
              if (
                typeof v.inventory_management == "string" &&
                v.inventory_management == "shopify"
              ) {
                if (
                  typeof v.inventory_policy == "string" &&
                  v.inventory_policy == "deny" &&
                  typeof v.inventory_quantity == "number" &&
                  v.inventory_quantity <= 0
                ) {
                  return;
                }
              }
              var img = "";
              if (typeof v.image_id == "number" && v.image_id != null) {
                var vimages = product.images.filter(function(pi) {
                  return pi.id == v.image_id;
                });
                if (vimages.length) {
                  img = vimages[0].src;
                }
              } else {
                if (
                  typeof product.image == "object" &&
                  product.image &&
                  typeof product.image.src == "string"
                ) {
                  img = product.image.src;
                }
              }
              var n = img.lastIndexOf(".");
              if (n >= 0) {
                var s = img.substring(0, n) + "_medium." + img.substring(n + 1);
                img = s;
              }
              variants_html +=
                "<option value='" +
                v.id +
                "' data-img='" +
                img +
                "' data-price='" +
                v.price_n +
                "' data-compare-at-price='" +
                v.compare_at_price_n +
                "'>";
              variants_html += sasoEscapeHtml(v.title) + "</option>";
            });
            product.variants_select = "<select class='saso-variants'>";
            if (
              typeof window.saso_config.upsell_variant_choose_option ==
                "string" &&
              window.saso_config.upsell_variant_choose_option.length
            ) {
              product.variants_select +=
                "<option value='0'>" +
                sasoEscapeHtml(
                  window.saso_config.upsell_variant_choose_option
                ) +
                "</option>";
            }
            product.variants_select += variants_html + "</select>";
          }
          if (
            typeof product.image == "object" &&
            product.image &&
            typeof product.image.src == "string"
          ) {
            var n = product.image.src.lastIndexOf(".");
            if (n >= 0) {
              var s =
                product.image.src.substring(0, n) +
                "_medium." +
                product.image.src.substring(n + 1);
              product.image.src = s;
            }
          }
          product.title = sasoTrimLength(
            product.title,
            window.saso_config.product_title_max_length
          );
          products.push(product);
        })
        .fail(function() {})
    );
  });
  if (defs.length == 0) {
    return;
  }
  jQuery.when.apply(jQuery, defs).done(function() {
    if (products.length == 0) {
      return;
    }
    var no_variants = true;
    for (var i = 0; i < products.length; i++) {
      if (products[i].variants.length > 1) {
        no_variants = false;
      }
      products[i].quantity = 1;
      products[i].quantityx = "";
      var currentp = action.products.filter(function(p) {
        return p.id == products[i].id;
      });
      if (currentp.length == 1 && currentp[0].quantity > 1) {
        products[i].quantityx = currentp[0].quantity + "x";
        products[i].quantity = currentp[0].quantity;
      }
    }
    if (no_variants) {
      for (var i = 0; i < products.length; i++) {
        products[i].variants_style = "height: 0px;";
      }
    }
    if (typeof window.saso_config.translate_percent_off == "string") {
      action.price.title = action.price.title.replace(
        "% Off",
        window.saso_config.translate_percent_off
      );
    }
    var tpl = Handlebars.compile(jQuery("#saso-bundle-popup").html());
    var tpl_data = {
      notifications_message: action.message,
      products: products,
      bundle_price_type: action.price.type,
      bundle_price_title: action.price.title,
      message_after: action.message_after
    };
    var html = tpl(tpl_data);
    jQuery(".saso-bundle").html(html);
    sasoCurrency();
  });
}

function sasoBundleAddToCart(ev) {
  ev.preventDefault();
  var items_to_add = [];
  var items_to_add_count = 0;
  jQuery(".saso-product-container").each(function() {
    var item = {
      id: $(this).data("variant-id"),
      quantity: $(this).data("quantity")
    };
    var product_id = $(this).data("product-id");
    items_to_add_count++;
    var $variants = jQuery(
      ".saso-product-container[data-product-id='" + product_id + "']"
    ).find("select.saso-variants");
    if ($variants.length == 1) {
      var variant_id = parseInt($variants.val());
      if (variant_id == 0) {
        alert(window.saso_config.upsell_variant_choose_message);
        return;
      }
      item.id = variant_id;
    }
    items_to_add.push(item);
  });
  if (items_to_add.length != items_to_add_count) {
    return;
  }
  sasoAddCartItems(items_to_add, function() {
    setTimeout(function() {
      window.location.href = "/cart";
    }, 100);
  });
}

function sasoShowCartDiscounts(discounts) {
  window.saso.discounts = discounts;
  discounts.cart.items.forEach(function(item) {
    if (item.discounted_price < item.original_price) {
      jQuery(
        ".saso-cart-item-discount-notes[data-key='" + item.key + "']"
      ).html(item.discount_notes.join("<br>"));
      jQuery(".saso-cart-item-price[data-key='" + item.key + "']").html(
        "<span class='original_price'>" +
          item.original_price_format +
          "</span>" +
          "<span class='discounted_price'>" +
          item.discounted_price_format +
          "</span>"
      );
      jQuery(".saso-cart-item-line-price[data-key='" + item.key + "']").html(
        "<span class='original_price'>" +
          item.original_line_price_format +
          "</span>" +
          "<span class='discounted_price'>" +
          item.discounted_line_price_format +
          "</span>"
      );
    }
    if (item.upsell_notes.length > 0) {
      var un = item.upsell_notes.join("<br>");
      if (typeof window.saso_config.translate_percent_off == "string") {
        un = un.replace("% Off", window.saso_config.translate_percent_off);
      }
      jQuery(".saso-cart-item-upsell-notes[data-key='" + item.key + "']").html(
        un
      );
    }
  });
  if (typeof discounts.discounted_price_html != "string") {
    return;
  }
  if (
    typeof discounts.allow_use_discount_code_cart == "boolean" &&
    discounts.allow_use_discount_code_cart
  ) {
    var html_d =
      '<div class="saso-use-discount-code-cart-container"><input type="text" class="saso-use-discount-code-cart-code" placeholder="Discount code"> ' +
      '<button type="button" class="saso-use-discount-code-cart-apply btn btn--secondary">Apply</button></div>';
    if (jQuery("#saso-use-discount-code-cart").length == 1) {
      html_d = jQuery("#saso-use-discount-code-cart").html();
    }
    discounts.summary_html += html_d;
  }
  if (
    typeof discounts.allow_use_discount_code_instead == "boolean" &&
    discounts.allow_use_discount_code_instead
  ) {
    var html_d =
      '<div><label style="font-weight: normal; cursor: pointer;"><input type="checkbox" id="saso-use-discount-code-instead-check"> I will be using a coupon instead</label></div>';
    if (jQuery("#saso-use-discount-instead").length == 1) {
      html_d = jQuery("#saso-use-discount-instead").html();
    }
    discounts.summary_html += html_d;
  }
  jQuery(".saso-summary").html(discounts.summary_html);
  if (window.sasoDocCookies.getItem("saso_discount_code")) {
    if (typeof discounts.discount_code_cart_valid != "boolean") {
      window.sasoDocCookies.removeItem("saso_discount_code");
      if (typeof window.saso.discount_code_cart == "string") {
        delete window.saso.discount_code_cart;
      }
    } else {
      jQuery(".saso-use-discount-code-cart-code").val(
        window.sasoDocCookies.getItem("saso_discount_code")
      );
      jQuery("#saso-use-discount-code-cart-code").val(
        window.sasoDocCookies.getItem("saso_discount_code")
      );
    }
  }
  jQuery(".saso-note").val(discounts.cart.summary_note);
  jQuery(".saso-cart-original-total").css("text-decoration", "line-through");
  jQuery(".saso-cart-total").html(discounts.discounted_price_html);
  sasoCurrency();
  var checkout_selectors = [
    "input[name='checkout']:not(.bold_clone)",
    "button[name='checkout']",
    "[href$='checkout']",
    "input[name='goto_pp']",
    "button[name='goto_pp']",
    "input[name='goto_gc']",
    "button[name='goto_gc']",
    ".additional-checkout-button",
    ".google-wallet-button-holder",
    ".amazon-payments-pay-button"
  ];
  checkout_selectors.forEach(function(selector) {
    var els = document.querySelectorAll(selector);
    if (typeof els == "object" && els) {
      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        if (typeof el.addEventListener != "function") {
          return;
        }
        el.addEventListener(
          "click",
          function(ev) {
            var did = document.getElementById(
              "saso-use-discount-code-instead-check"
            );
            if (typeof did == "object" && did && did.checked) {
              return true;
            }
            ev.preventDefault();
            var elsbold = document.querySelectorAll(
              "input[name='checkout'].bold_clone"
            );
            if (typeof elsbold == "object" && elsbold && elsbold.length) {
              jQuery.ajax({
                cache: false,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                type: "GET",
                url: "/cart.js",
                success: function(res) {
                  window.saso.cart = res;
                  sasoCheckout();
                }
              });
            } else {
              sasoCheckout();
            }
          },
          false
        );
        el.dataset.saso = true;
        el.dataset.ocuCheckout = true;
      }
    }
  });
  checkout_selectors = [".alt-payment-list-amazon-button-image"];
  checkout_selectors.forEach(function(selector) {
    jQuery(selector).remove();
  });
}

function sasoCheckout() {
  if (
    jQuery("input[type='checkbox'].saso_agree").length > 0 &&
    jQuery("input[type='checkbox'].saso_agree:checked").length !=
      jQuery("input[type='checkbox'].saso_agree").length
  ) {
    return;
  }
  if (
    typeof window.saso_config.force_required_fields == "boolean" &&
    window.saso_config.force_required_fields
  ) {
    var required_field_names = [];
    var required_pass = true;
    jQuery("[name^='attributes'][required]:visible").each(function() {
      if (jQuery(this).val() == "" || jQuery(this).val() == null) {
        if (jQuery(this).attr("placeholder")) {
          required_field_names.push(jQuery(this).attr("placeholder"));
        } else {
          required_field_names.push(
            jQuery(this)
              .attr("name")
              .replace("attributes[", "")
              .replace("]", "")
          );
        }
        required_pass = false;
      }
    });
    jQuery("textarea[required]:visible").each(function() {
      if (jQuery(this).val() == "" || jQuery(this).val() == null) {
        if (jQuery(this).attr("placeholder")) {
          required_field_names.push(jQuery(this).attr("placeholder"));
        } else {
          required_field_names.push(
            jQuery(this)
              .attr("name")
              .replace("attributes[", "")
              .replace("]", "")
          );
        }
        required_pass = false;
      }
    });
    if (!required_pass) {
      alert(
        "Please fill in required fields: " + required_field_names.join(", ")
      );
      return;
    }
  }
  var note_attributes = [];
  jQuery("[name^='attributes']").each(function() {
    var $a = jQuery(this);
    var name = jQuery(this).attr("name");
    name = name.replace(/^attributes\[/i, "").replace(/\]$/i, "");
    var v = {
      name: name,
      value: $a.val()
    };
    if (v.value == "") {
      return;
    }
    switch ($a[0].tagName.toLowerCase()) {
      case "input":
        if ($a.attr("type") == "checkbox") {
          if ($a.is(":checked")) {
            note_attributes.push(v);
          }
        } else {
          note_attributes.push(v);
        }
        break;
      default:
        note_attributes.push(v);
    }
  });
  if (typeof window.saso.discount_code_cart == "string") {
    note_attributes.push({
      name: "discount_code",
      value: window.saso.discount_code_cart
    });
  }
  if (window.sasoDocCookies.getItem("saso_link_code")) {
    note_attributes.push({
      name: "discount_link_code",
      value: window.sasoDocCookies.getItem("saso_link_code")
    });
  }
  if (
    typeof window.saso.discounts == "object" &&
    typeof window.saso.discounts.cart == "object" &&
    typeof window.saso.discounts.cart.summary_note == "string"
  ) {
    note_attributes.push({
      name: "discount_details",
      value: window.saso.discounts.cart.summary_note.substring(0, 500)
    });
  }
  var note = "";
  if (jQuery("[name='note']").length == 1 && jQuery("[name='note']")[0].value) {
    note = jQuery("[name='note']")[0].value;
  }
  if (window.saso_config.exclude_order_discount_details) {
    note_attributes = [];
  }
  window.saso.cart.note_attributes = note_attributes;
  window.saso.cart.note = note;
  for (var i = 0; i < window.saso.cart.items.length; i++) {
    var item = window.saso.cart.items[i];
    var el = document.querySelectorAll("[id='updates_" + item.key + "']");
    if (el.length != 1) {
      el = document.querySelectorAll("[id='updates_" + item.variant_id + "']");
    }
    if (el.length == 1) {
      if (el[0].value != window.saso.cart.items[i].quantity) {
        console.log(
          "el[0].value != window.saso.cart.items[i].quantity",
          el[0].value
        );
        window.saso.cart.items[i].quantity_before_saso_update =
          window.saso.cart.items[i].quantity;
        window.saso.cart.items[i].quantity = el[0].value;
      }
    }
  }
  var invoice_url_params = [];
  if (note.length) {
    invoice_url_params.push("note=" + encodeURIComponent(note));
  }
  if (typeof window.gaclientId == "string") {
    invoice_url_params.push("clientId=" + window.gaclientId);
    invoice_url_params.push("_ga=" + window.gaclientId);
  }
  if (
    typeof Zapiet == "object" &&
    typeof Zapiet.Cart == "object" &&
    typeof Zapiet.Cart.getUrlParams == "function"
  ) {
    var zup = Zapiet.Cart.getUrlParams();
    if (typeof zup == "object" && zup) {
      Object.keys(zup).map(function(k) {
        invoice_url_params.push(k + "=" + encodeURIComponent(zup[k]));
      });
    }
    if (
      typeof Zapiet.Widget == "object" &&
      typeof Zapiet.Widget.checkoutEnabled == "function"
    ) {
      if (Zapiet.Widget.checkoutEnabled() == false) {
        alert("Please complete delivery info");
        return;
      }
    }
  }
  if (
    typeof window.currentLanguageCode == "string" &&
    window.currentLanguageCode.length > 1 &&
    window.currentLanguageCode.length < 9
  ) {
    invoice_url_params.push(
      "locale=" + encodeURIComponent(window.currentLanguageCode)
    );
  }
  if (note_attributes.length) {
    note_attributes.map(function(a) {
      invoice_url_params.push(
        "attributes" +
          encodeURIComponent("[" + a.name + "]") +
          "=" +
          encodeURIComponent(a.value)
      );
    });
  }
  if (typeof window.saso_config.checkout_start != "number") {
    window.saso_config.checkout_start = Date.now();
  } else {
    if (Date.now() - window.saso_config.checkout_start < 4e3) {
      return;
    }
    var invoice_url =
      "/checkout?discount=&clear_discount=1&discount_issue=checkout_clicked_after_3sec_delay";
    if (invoice_url_params.length) {
      invoice_url += "&" + invoice_url_params.join("&");
    }
    window.location.href = invoice_url.substring(0, 2e3);
    return;
  }
  if (window.saso_config.offers_method == "discount_code") {
    jQuery.ajax({
      cache: false,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "POST",
      url:
        "https://" +
        sasoGetHost() +
        "/api/v2/page-actions?checkout=discount_code",
      data: JSON.stringify(window.saso),
      success: function(res) {
        res.invoice_url = "/checkout";
        if (typeof res.discount_code == "string") {
          invoice_url_params.unshift("discount=" + res.discount_code);
          window.sasoDocCookies.setItem(
            "saso_generated_discount_code",
            res.discount_code,
            Infinity,
            "/"
          );
        }
        if (invoice_url_params.length) {
          res.invoice_url += "?" + invoice_url_params.join("&");
        }
        window.location.href = res.invoice_url.substring(0, 2e3);
      }
    });
  } else {
    jQuery.ajax({
      cache: false,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      type: "POST",
      url: "https://" + sasoGetHost() + "/api/v2/page-actions?checkout=draft",
      data: JSON.stringify(window.saso),
      success: function(res) {
        if (typeof res.invoice_url != "string") {
          res.invoice_url = "/checkout";
        }
        var did = document.getElementById(
          "saso-use-discount-code-instead-check"
        );
        if (typeof did == "object" && did && did.checked) {
          res.invoice_url = "/checkout";
        }
        if (invoice_url_params.length) {
          res.invoice_url += "?" + invoice_url_params.join("&");
        }
        setTimeout(function() {
          window.location.href = res.invoice_url.substring(0, 2e3);
        }, 1e3);
      }
    });
  }
}

function sasoUseDiscountCodeCartApply() {
  var code = "";
  if (jQuery("#saso-use-discount-code-cart-code").length) {
    code = jQuery("#saso-use-discount-code-cart-code").val();
  } else if (jQuery(".saso-use-discount-code-cart-code").length) {
    jQuery(".saso-use-discount-code-cart-code").each(function() {
      if (jQuery(this).val() != "") {
        code = jQuery(this).val();
      }
    });
  }
  code = code.trim();
  if (code.length == 0) {
    window.sasoDocCookies.removeItem("saso_discount_code");
  } else {
    window.sasoDocCookies.setItem("saso_discount_code", code, "/");
  }
  window.location.reload();
}

function sasoUseDiscountCodeInsteadChange() {
  var did = document.getElementById("saso-use-discount-code-instead-check");
  if (typeof did != "object" || !did) {
    return;
  }
  var qty = 1;
  if (did.checked) {
    qty = 0;
    jQuery(".saso-cart-total").hide();
    jQuery(".saso-cart-original-total").css("text-decoration", "none");
    jQuery(".saso-summary-line-buyxgety").css("display", "none");
    window.sasoDocCookies.setItem(
      "saso_use_discount_code_instead",
      true,
      Infinity,
      "/"
    );
  } else {
    jQuery(".saso-cart-total").show();
    jQuery(".saso-cart-original-total").css("text-decoration", "line-through");
    jQuery(".saso-summary-line-buyxgety").css("display", "inline");
    window.sasoDocCookies.removeItem("saso_use_discount_code_instead", "/");
    location.reload();
  }
  if (
    typeof window.saso.discounts != "object" ||
    typeof window.saso.discounts.cart != "object" ||
    typeof window.saso.discounts.cart.items != "object"
  ) {
    return;
  }
  for (var i = 0; i < window.saso.discounts.cart.items.length; i++) {
    var item = window.saso.discounts.cart.items[i];
    if (typeof item.offer_type != "string" || item.offer_type != "Free Gift") {
      continue;
    }
    if (item.discounted_price > 0) {
      continue;
    }
    var el = document.querySelectorAll("[id='updates_" + item.key + "']");
    if (el.length != 1) {
      el = document.querySelectorAll("[id='updates_" + item.variant_id + "']");
    }
    if (el.length == 1) {
      el[0].value = qty;
    }
  }
}

function sasoShowVolumeDiscountTiers(data) {
  if (typeof data == "object") {
    window.saso_extras.volume_discount_tiers = data;
  } else if (typeof window.saso_extras.volume_discount_tiers == "undefined") {
    return;
  }
  if (typeof data == "undefined") {
    data = window.saso_extras.volume_discount_tiers;
    if (typeof window.saso_extras.product.variants == "object") {
      var variant = window.saso_extras.product.variants.filter(function(v) {
        return v.id == window.saso_extras.current_variant_id;
      });
      if (variant.length == 1) {
        window.saso.product.price = variant[0].price;
      }
    }
  }
  var price_type = "flat";
  var tiers_copy = JSON.parse(JSON.stringify(data.tiers));
  for (var i = 0; i < tiers_copy.length; i++) {
    var price = tiers_copy[i].price;
    if (typeof window.saso_config.translate_percent_off == "string") {
      price.title = price.title.replace(
        "% Off",
        window.saso_config.translate_percent_off
      );
    }
    if (price.type == "subtract") {
      price.type = "flat";
      price.amount = window.saso.product.price - price.amount * 100;
      price.title =
        '<span class="saso-price">' +
        sasoShopifyformatMoney(price.amount, window.saso.money_format) +
        "</span>";
    }
    var pf = JSON.parse(JSON.stringify(price));
    if (price.type == "percent") {
      price_type = "percent";
      pf.amount =
        window.saso.product.price * (100 - data.tiers[i].price.amount) / 100;
      pf.title =
        '<span class="saso-price">' +
        sasoShopifyformatMoney(pf.amount, window.saso.money_format) +
        "</span>";
    }
    tiers_copy[i].price_amount = price.amount;
    tiers_copy[i].price_flat = pf;
    tiers_copy[i].price_line = JSON.parse(JSON.stringify(pf));
    tiers_copy[i].price_line.amount =
      tiers_copy[i].price_line.amount * tiers_copy[i].quantity;
    tiers_copy[i].price_line.title =
      '<span class="saso-price">' +
      sasoShopifyformatMoney(
        tiers_copy[i].price_line.amount,
        window.saso.money_format
      ) +
      "</span>";
  }
  var tpl = Handlebars.compile(jQuery("#saso-volume-discount-tiers").html());
  var tpl_data = {
    product_message: data.product_message,
    tiers: tiers_copy
  };
  tpl_data["price_type_" + price_type] = price_type;
  var html = tpl(tpl_data);
  jQuery(".saso-volumes").html(html);
  sasoCurrency();
}

function sasoVolumesAddToCart(ev) {
  ev.preventDefault();
  jQuery("[name='quantity']").remove();
  window.sasoc.$first_add_to_cart_el.after(
    "<input type='hidden' name='quantity' value='" +
      jQuery(this).data("quantity") +
      "'>"
  );
  window.sasoc.$first_add_to_cart_el.click();
}

function sasoUpsellAddToCart(ev) {
  ev.preventDefault();
  var product_id = jQuery(this).data("product-id");
  var variant_id = jQuery(this).data("variant-id");
  var $variants = jQuery(
    ".saso-product-container[data-product-id='" + product_id + "']"
  ).find("select.saso-variants");
  if ($variants.length == 1) {
    var variant_id = parseInt($variants.val());
    if (variant_id == 0) {
      alert(window.saso_config.upsell_variant_choose_message);
      return;
    }
  }
  sasoRemovePreviousFreeGifts(function() {
    jQuery.ajax({
      type: "POST",
      dataType: "json",
      url: "/cart/add.js",
      data: {
        quantity: 1,
        id: variant_id
      },
      success: function(res) {
        window.saso.upsell_added = true;
        sasoShowCrossSellClosed();
        var a = window.saso.action_crosssell_popup_action;
        if (
          (window.sasoc.$cart_offers && window.sasoc.$cart_offers.length) ||
          (typeof a.price_discount == "object" &&
            a.price_discount &&
            typeof a.price_discount.amount == "number") ||
          (typeof a.price_bundle == "object" && a.price_bundle)
        ) {
          setTimeout(function() {
            window.location.href = "/cart";
          }, 100);
        } else {
          jQuery(
            ".saso-product-container[data-product-id=" + product_id + "]"
          ).fadeOut("slow", function() {
            jQuery(
              ".saso-product-container[data-product-id=" + product_id + "]"
            ).remove();
            if (jQuery(".saso-product-container:visible").length == 0) {
              window.sasoc.magnificPopup.instance.close();
            }
          });
          if (window.saso_config.crosssell_close_after_one_add) {
            window.sasoc.magnificPopup.instance.close();
          }
        }
      },
      error: function(res) {
        if (
          typeof res == "object" &&
          typeof res.responseJSON == "object" &&
          typeof res.responseJSON.description == "string"
        ) {
          alert(res.responseJSON.description);
        }
        if (typeof res == "string") {
          alert(res);
        }
      }
    });
  });
}

function sasoRemovePreviousFreeGifts(callback) {
  if (
    typeof window.saso.discounts != "object" ||
    typeof window.saso.discounts.cart != "object" ||
    typeof window.saso.discounts.cart.items != "object"
  ) {
    return callback();
  }
  if (
    typeof window.saso.discounts.multiple_offers_free_gift != "string" ||
    window.saso.discounts.multiple_offers_free_gift != "one"
  ) {
    return callback();
  }
  if (
    typeof window.saso.ignore_previous_free_gifts == "boolean" &&
    window.saso.ignore_previous_free_gifts
  ) {
    return callback();
  }
  var itemsfg = window.saso.discounts.cart.items.filter(function(item) {
    return typeof item.offer_type == "string" && item.offer_type == "Free Gift";
  });
  var updates_request = [];
  itemsfg.map(function(item) {
    updates_request.push("updates[" + item.variant_id + "]=0");
  });
  if (updates_request.length == 0) {
    return callback();
  }
  jQuery.ajax({
    type: "POST",
    dataType: "text",
    url: "/cart/update.js",
    data: updates_request.join(","),
    success: function(done_data) {
      return callback();
    }
  });
}

function sasoOnAjaxComplete(event, xhr, settings) {
  if (typeof settings == "object" && typeof settings.url == "string") {
    if (settings.url == "/cart/change.js") {
      window.location.reload();
    }
  }
}

function sasoGetHost() {
  var sasoHost = ("saso-www" + Math.round(Math.random() * 10))
    .replace("www0", "www")
    .replace("www11", "www9")
    .replace("www10", "www8");
  if (
    typeof sasoGetParameterByName("d") == "string" &&
    sasoGetParameterByName("d") == "y"
  ) {
    sasoHost = "saso-www";
  }
  sasoHost += ".herokuapp.com";
  if (window.saso.shop_slug == "sadev3") {
    sasoHost = "localhost";
  }
  return sasoHost;
}

function sasoStart() {
  window.sasoc = {
    magnificPopup: jQuery.magnificPopup,
    $cart_offers: jQuery(".saso-cart-offers")
  };
  if (window.sasoDocCookies.getItem("saso_link_code")) {
    window.saso.only_special_link_code = window.sasoDocCookies.getItem(
      "saso_link_code"
    );
  }
  if (window.sasoDocCookies.getItem("saso_discount_code")) {
    window.saso.discount_code_cart = window.sasoDocCookies
      .getItem("saso_discount_code")
      .toLowerCase()
      .trim();
  }
  if (window.sasoDocCookies.getItem("saso_generated_discount_code")) {
    window.saso.saso_generated_discount_code = window.sasoDocCookies.getItem(
      "saso_generated_discount_code"
    );
    window.sasoDocCookies.removeItem("saso_generated_discount_code");
  }
  window.saso_magnificPopup = window.sasoc.magnificPopup;
  jQuery("<input>")
    .attr({
      type: "hidden",
      name: "discount",
      value: ""
    })
    .appendTo("form[action='/cart']");
  jQuery("<input>")
    .attr({
      type: "hidden",
      name: "clear_discount",
      value: "1"
    })
    .appendTo("form[action='/cart']");
  setTimeout(function() {
    window.sasoc.$first_add_to_cart_el = null;
    var selectors = [
      "input[name='add']:not(.saso-ignore)",
      "button[name='add']:not(.saso-ignore)",
      "#add-to-cart",
      "#AddToCartText",
      "#AddToCart",
      "#addToCart",
      "button[value='Add to cart']",
      "button[value='Add to Cart']",
      "input[value='Add to cart']",
      "input[value='Add to Cart']",
      "button.addtocart"
    ];
    var found_selectors = 0;
    selectors.forEach(function(selector) {
      found_selectors += jQuery(selector).length;
      if (window.sasoc.$first_add_to_cart_el == null && found_selectors) {
        window.sasoc.$first_add_to_cart_el = jQuery(selector).first();
      }
      if (window.saso_config.crosssell_popup_on_add) {
        jQuery(selector).on("click", function(e) {
          window.saso.action_crosssell_el = {
            $el: $(this)
          };
          window.saso.action_crosssell_el.variant_id = null;
          var ids = window.saso.action_crosssell_el.$el
            .parents("form:first")
            .find("[name='id']");
          if (ids.length == 1) {
            window.saso.action_crosssell_el.variant_id = $(ids[0]).val();
          }
          sasoShowCrossSell({
            variant_id: window.saso.action_crosssell_el.variant_id
          });
        });
      }
    });
    if (
      (window.saso.page_type == "collection" ||
        window.saso.page_type == "product") &&
      found_selectors == 0
    ) {
    }
    if (
      jQuery(".saso-summary").length == 0 &&
      jQuery(".saso-cart-total").length > 0
    ) {
      jQuery('<div class="saso-summary"></div>').insertBefore(
        ".saso-cart-total"
      );
    }
    if (
      window.saso.page_type == "product" &&
      (jQuery(".saso-volumes").length == 0 ||
        jQuery(".saso-bundle").length == 0)
    ) {
      var vol_el_after = null;
      if (window.sasoc.$first_add_to_cart_el != null) {
        vol_el_after = window.sasoc.$first_add_to_cart_el;
        if (vol_el_after.parent().is("div")) {
          vol_el_after = vol_el_after.parent();
        }
      }
      if (vol_el_after && jQuery(".saso-volumes").length == 0) {
        vol_el_after.after('<div class="saso-volumes"></div>');
      }
      if (vol_el_after && jQuery(".saso-bundle").length == 0) {
        vol_el_after.after('<div class="saso-bundle"></div>');
      }
    }
    jQuery("body").on(
      "click",
      ".saso-volume-discount-tiers .saso-add-to-cart",
      sasoVolumesAddToCart
    );
    jQuery("body").on(
      "click",
      ".saso-cross-sell-popup .saso-add-to-cart:not(.saso-bundle-add-to-cart)",
      sasoUpsellAddToCart
    );
    jQuery("body").on("click", ".saso-bundle-add-to-cart", sasoBundleAddToCart);
    jQuery("body").on(
      "click",
      ".saso-volume-discount-tiers .add-to-cart",
      sasoVolumesAddToCart
    );
    jQuery("body").on(
      "click",
      ".saso-cross-sell-popup .add-to-cart",
      sasoUpsellAddToCart
    );
    jQuery("body").on(
      "click",
      "#saso-use-discount-code-cart-apply",
      sasoUseDiscountCodeCartApply
    );
    jQuery("body").on(
      "click",
      ".saso-use-discount-code-cart-apply",
      sasoUseDiscountCodeCartApply
    );
    jQuery("body").on(
      "change",
      "#saso-use-discount-code-instead-check",
      sasoUseDiscountCodeInsteadChange
    );
    jQuery("body").on("click", ".saso-crosssell-nav", function() {
      var saso_product_id = jQuery(this).data("product-id");
      jQuery.ajax({
        type: "POST",
        dataType: "json",
        url: "https://" + sasoGetHost() + "/api/v1/cross-sell-add",
        data: {
          shop_slug: window.saso.shop_slug,
          product_id: saso_product_id,
          cart_token: window.saso.cart.token
        },
        success: function(done_data) {}
      });
    });
    jQuery("body").on("change", ".saso-variants", function(ev) {
      var img = jQuery(this)
        .find(":selected")
        .data("img");
      if (typeof img == "string" && img.length) {
        jQuery(ev.target)
          .closest(".saso-product-container")
          .find("img")
          .attr("src", img);
      }
      var price = sasoShopifyformatMoney(
        jQuery(this)
          .find(":selected")
          .data("price"),
        window.saso.money_format
      );
      var compare_at_price = sasoShopifyformatMoney(
        jQuery(this)
          .find(":selected")
          .data("compare-at-price"),
        window.saso.money_format
      );
      jQuery(ev.target)
        .closest(".saso-product-container")
        .find(".saso-price")
        .html(price);
      jQuery(ev.target)
        .closest(".saso-product-container")
        .find(".saso-was-price")
        .html(compare_at_price);
    });
    if (window.saso.page_type == "cart") {
      jQuery(document).ajaxComplete(sasoOnAjaxComplete);
      jQuery("body").on(
        "change",
        'input[name="updates[]"]:not(.saso-ignore)',
        function(ev) {
          jQuery('[name="update"]').click();
        }
      );
      setTimeout(function() {
        if (typeof window.QtySelector == "function") {
          window.QtySelector.prototype.updateCartItemCallback = function(cart) {
            location.reload();
          };
        }
      }, 2e3);
    }
    jQuery("body").on("click", ".saso-cross-sell-popup .close", function(ev) {
      ev.preventDefault();
      window.sasoc.magnificPopup.instance.close();
    });
    jQuery("body").on("click", ".saso-cross-sell-popup .saso-close", function(
      ev
    ) {
      ev.preventDefault();
      if (typeof window.saso.action_crosssell_popup_action == "object") {
        window.saso.action_crosssell_popup_action.manually_closed = true;
      }
      window.sasoc.magnificPopup.instance.close();
    });
  }, 1);
  if (window.saso.page_type == "product") {
    if (typeof window.saso_extras.product.variants == "object") {
      window.saso_extras.current_variant_id =
        window.saso_extras.product.variants[0].id;
    }
    if (sasoGetParameterByName("variant") != "") {
      window.saso_extras.current_variant_id = parseFloat(
        sasoGetParameterByName("variant")
      );
    }
    if (
      typeof window.saso_extras.current_variant_id == "number" &&
      typeof window.saso_extras.product.variants == "object"
    ) {
      var variant = window.saso_extras.product.variants.filter(function(v) {
        return v.id == window.saso_extras.current_variant_id;
      });
      if (variant.length == 1) {
        window.saso.product.price = variant[0].price;
      }
    }
  }
  var cooka = [];
  var cook = window.sasoDocCookies.getItem("saso_shown_upsells");
  if (cook && typeof cook == "string") {
    cooka = cook.split(",");
  }
  window.saso.saso_shown_upsells = cooka;
  if (window.saso.page_type == "cart") {
    if (window.sasoDocCookies.getItem("saso_use_discount_code_instead")) {
      var html_d =
        '<div><label style="font-weight: normal; cursor: pointer;"><input type="checkbox" id="saso-use-discount-code-instead-check"> I will be using a coupon instead</label></div>';
      if (jQuery("#saso-use-discount-instead").length == 1) {
        html_d = jQuery("#saso-use-discount-instead").html();
      }
      jQuery(".saso-cart-total").html(html_d);
      if (document.getElementById("saso-use-discount-code-instead-check")) {
        document.getElementById(
          "saso-use-discount-code-instead-check"
        ).checked = true;
      }
      return;
    }
  }
  jQuery.ajax({
    cache: false,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    type: "POST",
    url: "https://" + sasoGetHost() + "/api/v2/page-actions",
    data: JSON.stringify(window.saso),
    success: function(data) {
      setTimeout(function() {
        sasoDoActions(data);
      }, 1);
    }
  });
  setTimeout(function() {
    if (jQuery("button[onclick=\"window.location='/checkout'\"]").length) {
      console.log(
        "WARNING: buttons with onclick=\"window.location='/checkout'\" will skip Ultimate Special Offers. Replace with /cart instead."
      );
    }
  }, 1e3);
}
sasoStart();
setTimeout(function() {
  if (typeof ga == "function") {
    ga(function(tracker) {
      window.gaclientId = tracker.get("clientId");
    });
  }
}, 1e3);
if (typeof window.history == "object") {
  (function(history) {
    var replaceState = history.replaceState;
    history.replaceState = function(state) {
      var rs_arguments = arguments;
      setTimeout(function() {
        if (
          typeof sasoCheckout == "function" &&
          typeof window.saso.page_type == "string" &&
          window.saso.page_type == "product"
        ) {
          if (window.location.href.indexOf("variant=") > -1) {
            window.saso_extras.current_variant_id = parseFloat(
              window.location.href.match(/variant=([0-9]+)/)[1]
            );
            sasoShowVolumeDiscountTiers();
          }
        }
      }, 300);
      return replaceState.apply(history, rs_arguments);
    };
  })(window.history);
}
