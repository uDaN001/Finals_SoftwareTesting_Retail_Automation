const { Builder, until, By } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const RetailPage = require("../pages/retailPage");
const assert = require("assert");

(async function runProduct() {
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
    console.log("--- STARTING PRODUCT MODULE ---");
    await page.login("standard_user", "secret_sauce");

    // PRD-01: View Product List
    await driver.wait(until.elementLocated(page.inventoryItems), 5000);
    let items = await driver.findElements(page.inventoryItems);
    assert.ok(items.length > 0, "PRD-01 Failed: No products visible");
    console.log("PRD-01: Product list and thumbnails are visible.");

    // PRD-02: View Details
    await driver.findElement(page.item4Link).click();
    await driver.wait(until.urlContains("inventory-item"), 5000);
    let price = await driver
      .findElement(By.className("inventory_details_price"))
      .getText();
    assert.ok(price.length > 0, "PRD-02 Failed: Price not shown in details");
    console.log("PRD-02: Product details page (Price, Desc) verified.");

    // PRD-03 & PRD-04: Search Logic (Simulated)
    // Note: Swag Labs has no search bar. We log this as a limitation or manual check.
    console.log(
      "PRD-03: Search Product (Note: Feature not present in UI - Skipping)",
    );
    console.log(
      "PRD-04: Search No Results (Note: Feature not present in UI - Skipping)",
    );

    // PRD-05: Sort by Price
    await driver.get("https://www.saucedemo.com/inventory.html");
    let sortDropdown = await driver.wait(
      until.elementLocated(page.sortContainer),
      5000,
    );
    await sortDropdown.click();
    await sortDropdown.sendKeys("Price (low to high)");

    // Verify sorting by checking the first item price
    let firstPrice = await driver
      .findElement(By.className("inventory_item_price"))
      .getText();
    assert.strictEqual(firstPrice, "$7.99", "PRD-05 Failed: Sorting incorrect");
    console.log(
      "PRD-05: Products successfully rearranged by price (Low to High).",
    );

    console.log("--- ALL PRODUCT TESTS PASSED ---");
  } catch (err) {
    console.error("TEST FAILED: " + err.message);
  } finally {
    await driver.quit();
  }
})();
