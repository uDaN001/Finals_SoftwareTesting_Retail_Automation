const { Builder, until, By } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const RetailPage = require("../pages/retailPage");
const assert = require("assert");

(async function runCart() {
  let options = new chrome.Options();
  options.addArguments("--disable-save-password-bubble");
  options.setUserPreferences({
    credentials_enable_service: false,
    "profile.password_manager_enabled": false,
  });

  let driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();
  let page = new RetailPage(driver);

  try {
    console.log("--- STARTING CART MODULE ---");
    await page.login("standard_user", "secret_sauce");

    // CRT-01: Add Item to Cart
    await driver.wait(until.elementLocated(page.addBackpack), 5000).click();
    let badgeText = await driver.findElement(page.cartBadge).getText();
    assert.strictEqual(badgeText, "1", "CRT-01 Failed");
    console.log("CRT-01: Item added to cart and badge updated.");

    // CRT-02: View Cart Page
    await driver.findElement(page.cartLink).click();
    await driver.wait(until.urlContains("cart.html"), 5000);
    let url = await driver.getCurrentUrl();
    assert.ok(url.includes("cart.html"), "CRT-02 Failed");
    console.log("CRT-02: Successfully navigated to Cart page.");

    // CRT-03: Remove Item from Cart Page
    let removeBtn = await driver.wait(
      until.elementLocated(By.id("remove-sauce-labs-backpack")),
      5000,
    );
    await removeBtn.click();
    let badgeElements = await driver.findElements(page.cartBadge);
    assert.strictEqual(badgeElements.length, 0, "CRT-03 Failed");
    console.log("CRT-03: Item removed from cart successfully.");

    // CRT-04: Continue Shopping
    await driver.findElement(page.continueShoppingBtn).click();
    await driver.wait(until.urlContains("inventory.html"), 5000);
    console.log("CRT-04: Continue Shopping button navigation verified.");

    console.log("--- ALL CART TESTS PASSED ---");
  } catch (err) {
    console.error("TEST FAILED: " + err.message);
  } finally {
    await driver.quit();
  }
})();
