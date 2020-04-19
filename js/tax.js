function refreshCalculus() {
  refreshAttuned();
  refreshTreasuryWarning();
  caclulateAllTaxes();
}

function refreshAttuned() {
  document.querySelector("#papers-of-nobility-attuned").style.display =
    document.querySelector("#papers-of-nobility").checked ? "" : "none";
}

function refreshTreasuryWarning() {

  document.querySelector("#treasury-level-warning").style.display =
    parseInt(document.querySelector("#treasury-level").value) > 5 ? "" : "none";
}

function currentTaxRate(money, midpoint) {
  return (money / midpoint + 1)**-1
}

function caclulateAllTaxes() {
  var townMoney = parseInt(document.querySelector("#town-money").value);
  var runMoney = parseInt(document.querySelector("#run-money").value);
  var midpoint = calculateMidpoint();
  var tax;
  var received_money;
  var tax_money;

  document.querySelector("#midpoint .dragon-not-killed").innerText = midpoint;
  tax = calculateTax(townMoney, runMoney, midpoint);
  document.querySelector("#marginal-tax-percent .dragon-not-killed").innerText = parseFloat(((1 - tax.marginal_tax_percent) * 100).toFixed(1)) + "%";
  document.querySelector("#received-amount .dragon-not-killed").innerText = parseInt(tax.received_money);
  tax_money = runMoney - parseInt(tax.received_money);
  document.querySelector("#tax-amount .dragon-not-killed").innerText =
    `${tax_money} (${parseInt(tax_money / runMoney * 100)}%)`;
  document.querySelector("#total-amount .dragon-not-killed").innerText = townMoney + parseInt(tax.received_money);

  midpoint *= 2;

  document.querySelector("#midpoint .dragon-killed").innerText = midpoint;
  tax = calculateTax(townMoney, runMoney, midpoint);
  document.querySelector("#marginal-tax-percent .dragon-killed").innerText = parseFloat(((1 - tax.marginal_tax_percent) * 100).toFixed(1)) + "%";
  document.querySelector("#received-amount .dragon-killed").innerText = parseInt(tax.received_money);
  tax_money = runMoney - parseInt(tax.received_money);
  document.querySelector("#tax-amount .dragon-killed").innerText =
    `${tax_money} (${parseInt(tax_money / runMoney * 100)}%)`;
  document.querySelector("#total-amount .dragon-killed").innerText = townMoney + parseInt(tax.received_money);

  var difference_dragon = parseInt(document.querySelector("#total-amount .dragon-killed").innerText) -
    parseInt(document.querySelector("#total-amount .dragon-not-killed").innerText);
  document.querySelector("#dragon-difference").innerText =
    `${difference_dragon} gold (+${(difference_dragon / parseInt(document.querySelector("#total-amount .dragon-killed").innerText) * 100).toFixed(1)}%)`;
}

//Excludes dragon
function calculateMidpoint() {
  var retval = parseInt(document.querySelector("#treasury-level").value);
  retval = (retval + 1) * 5000;

  if (document.querySelector("#offshore-account").checked) {
    retval *= 4;
  };
  if (document.querySelector("#papers-of-nobility").checked) {
    retval *= 1.25;
  };
  if (document.querySelector("#papers-of-nobility-attuned").getClientRects().length &&
      document.querySelector("#papers-of-nobility-attuned input").checked) {
    retval *= 1.25
  }

  return retval;
}

function calculateTax(townMoney, runMoney, midpoint) {
  var retval = {};

  var marginalTaxPercent = 1; //In game getting 0 gold out of 0 is marked as 100% tax
  var money = 0;
  while (runMoney > 0) {
    var tmp_money_for_tax = townMoney + money / 1000;
    marginalTaxPercent = currentTaxRate(tmp_money_for_tax, midpoint);
    var tmp_add = parseInt(Math.min(250, runMoney) * 1000 * marginalTaxPercent);
    money += tmp_add;
    runMoney -= 250;
  }

  retval.received_money = money / 1000;
  retval.marginal_tax_percent = marginalTaxPercent;

  return retval;
}

document.addEventListener("DOMContentLoaded", function() {

  addChangeHooks();
  registerKeyUps();

  refreshCalculus();
});

function addChangeHooks() {
  document.querySelector("#town-money").addEventListener("input", function (e) {
    refreshCalculus();
  });
  document.querySelector("#run-money").addEventListener("input", function (e) {
    refreshCalculus();
  });
  document.querySelector("#treasury-level").addEventListener("input", function (e) {
    refreshCalculus();
  });
  document.querySelector("#offshore-account").addEventListener("input", function (e) {
    refreshCalculus();
  });
  document.querySelector("#papers-of-nobility").addEventListener("input", function (e) {
    refreshCalculus();
  });
  document.querySelector("#papers-of-nobility-attuned input").addEventListener("input", function (e) {
    refreshCalculus();
  });
}

function registerKeyUps() {
  document.onkeyup = function(e) {
    if (!e.altKey) {
      return;
    }
    switch (e.which) {
      case 'T'.charCodeAt(0):
      case 'W'.charCodeAt(0):
        document.querySelector("#town-money").focus();
        break;
      case 'R'.charCodeAt(0):
        document.querySelector("#run-money").focus();
        break;
      case 'Y'.charCodeAt(0):
        document.querySelector("#treasury-level").focus();
        break;
      case 'O'.charCodeAt(0):
        toggleCheckbox(document.querySelector("#offshore-account"));
        refreshCalculus();
        break;
      case 'P'.charCodeAt(0):
        toggleCheckbox(document.querySelector("#papers-of-nobility"));
        refreshCalculus();
        break;
      case 'N'.charCodeAt(0):
        toggleCheckbox(document.querySelector("#papers-of-nobility-attuned input"));
        refreshCalculus();
        break;
    }
  };
}

function toggleCheckbox(checkbox) {
  checkbox.checked = !checkbox.checked;
}
