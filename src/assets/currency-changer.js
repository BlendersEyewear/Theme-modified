/* Default currency */
var defaultCurrency = "USD" || shopCurrency;

if ($(window).width() >= 768) {
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
});

var original_selectCallback = window.selectCallback;
var selectCallback = function(variant, selector) {
  original_selectCallback(variant, selector);
  Currency.convertAll(shopCurrency, $currencySelector.val());
  jQuery(".selected-currency").text(Currency.currentCurrency);
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
