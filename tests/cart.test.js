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

    // CRT-01: Add to Cart
    await driver.wait(until.elementLocated(page.addBackpack), 5000).click();
    let badgeText = await driver.findElement(page.cartBadge).getText();
    assert.strictEqual(badgeText, "1", "CRT-01 Failed");
    console.log("CRT-01: Add to Cart - Badge increased to 1.");

    // CRT-02: Update Quantity (Simulation)
    // Note: SauceDemo cart quantities are read-only.
    console.log(
      "CRT-02: Update Quantity (Note: Site quantity is read-only - Skipping)",
    );

    // CRT-03: Remove Item
    await driver.findElement(page.cartLink).click();
    let removeBtn = await driver.wait(
      until.elementLocated(By.id("remove-sauce-labs-backpack")),
      5000,
    );
    await removeBtn.click();
    let badgeElements = await driver.findElements(page.cartBadge);
    assert.strictEqual(badgeElements.length, 0, "CRT-03 Failed");
    console.log("CRT-03: Remove Item - Item disappeared and badge cleared.");

    // CRT-04: Cart Persistence
    await driver.get("https://www.saucedemo.com/inventory.html");
    await driver.findElement(page.addBackpack).click();
    await driver.navigate().refresh();
    let persistBadge = await driver.findElement(page.cartBadge).getText();
    assert.strictEqual(persistBadge, "1", "CRT-04 Failed");
    console.log("CRT-04: Cart Persistence - Item remains after refresh.");

    // CRT-05: Max Quantity (Simulation)
    // Note: SauceDemo does not have a quantity input field to test 9999 items.
    console.log(
      "CRT-05: Max Quantity (Note: Feature not present in UI - Skipping)",
    );

    console.log("--- ALL CART TESTS PASSED ---");
  } catch (err) {
    console.error("TEST FAILED: " + err.message);
  } finally {
    await driver.quit();
  }
})();
