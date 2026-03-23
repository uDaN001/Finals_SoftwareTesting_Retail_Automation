const { Builder, until, By } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const RetailPage = require("../pages/retailPage");
const assert = require("assert");

(async function runCheckout() {
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
    console.log("--- STARTING CHECKOUT MODULE ---");
    await page.login("standard_user", "secret_sauce");

    // Prepare: Add item and go to checkout
    await driver.wait(until.elementLocated(page.addBackpack), 5000).click();
    await driver.findElement(page.cartLink).click();
    await driver.wait(until.elementLocated(page.checkoutBtn), 5000).click();

    // CHK-01: Verify Step One URL
    let url = await driver.getCurrentUrl(); // Await fixed here
    assert.ok(url.includes("checkout-step-one"), "CHK-01 Failed");
    console.log("CHK-01: Navigation to checkout info page verified.");

    // CHK-02: Validate Information Form
    await driver.findElement(page.firstName).sendKeys("Test");
    await driver.findElement(page.lastName).sendKeys("User");
    await driver.findElement(page.zipCode).sendKeys("12345");
    await driver.findElement(page.continueBtn).click();
    console.log("CHK-02: Checkout information form submitted.");

    // CHK-03: Finalize Order
    await driver.wait(until.elementLocated(page.finishBtn), 5000).click();
    let header = await driver
      .wait(until.elementLocated(page.completeHeader), 5000)
      .getText();
    assert.strictEqual(header, "Thank you for your order!", "CHK-03 Failed");
    console.log("CHK-03: Final order placement successful.");

    console.log("--- ALL CHECKOUT TESTS PASSED ---");
  } catch (err) {
    console.error("TEST FAILED: " + err.message);
  } finally {
    await driver.quit();
  }
})();
