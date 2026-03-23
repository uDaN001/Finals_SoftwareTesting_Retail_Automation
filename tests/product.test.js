const { Builder, until, By } = require("selenium-webdriver"); // Added By here
const chrome = require("selenium-webdriver/chrome");
const RetailPage = require("../pages/retailPage");
const assert = require("assert");

(async function runProduct() {
  let options = new chrome.Options();
  options.addArguments("--disable-save-password-bubble");
  let driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();
  let page = new RetailPage(driver);

  try {
    console.log("--- STARTING PRODUCT MODULE ---");
    await page.login("standard_user", "secret_sauce");

    // ATH-01: Product list loaded successfully
    await driver.wait(until.elementLocated(page.inventoryItems), 5000);
    let items = await driver.findElements(page.inventoryItems);
    assert.ok(items.length > 0, "ATH-01 Failed");
    console.log("ATH-01: Product list loaded successfully.");

    // ATH-02: Navigation to details
    await driver.findElement(page.item4Link).click();
    await driver.wait(until.urlContains("inventory-item"), 5000);
    console.log("ATH-02: Product details navigation verified.");

    console.log("--- ALL PRODUCT TESTS PASSED ---");
  } catch (err) {
    console.error("TEST FAILED: " + err.message);
  } finally {
    await driver.quit();
  }
})();
