const { Builder, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome"); // CRITICAL: Added this line
const RetailPage = require("../pages/retailPage");
const assert = require("assert");

(async function runAuth() {
  // Set Chrome options to block "Data Breach" and "Save Password" popups
  let options = new chrome.Options();
  options.addArguments("--disable-save-password-bubble");
  options.addArguments("--disable-notifications");
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
    console.log("--- STARTING AUTHENTICATION MODULE ---");

    // ATH-01: Valid Login
    await page.login("standard_user", "secret_sauce");
    await driver.wait(until.urlContains("inventory"), 5000);
    let url = await driver.getCurrentUrl();
    assert.ok(url.includes("inventory"), "ATH-01 Failed");
    console.log("ATH-01: Valid Login successful.");

    // ATH-05: Masked Password
    await driver.get("https://www.saucedemo.com/");
    let passField = await driver.wait(
      until.elementLocated(page.password),
      5000,
    );
    let passType = await passField.getAttribute("type");
    assert.strictEqual(passType, "password", "ATH-05 Failed");
    console.log("ATH-05: Password masking (type='password') verified.");

    // ATH-04: Logout
    await page.login("standard_user", "secret_sauce");
    await driver.findElement(page.menuBtn).click();
    let logoutLink = await driver.wait(
      until.elementLocated(page.logoutBtn),
      5000,
    );
    await driver.wait(until.elementIsVisible(logoutLink), 5000);
    await logoutLink.click();
    await driver.wait(until.elementLocated(page.loginBtn), 5000);
    console.log("ATH-04: User logout successful.");

    // ATH-02: Invalid Login (Locked out user)
    // Refreshing to ensure popups are cleared
    await driver.get("https://www.saucedemo.com/");
    await page.login("locked_out_user", "secret_sauce");
    let errorBox = await driver.wait(until.elementLocated(page.errorMsg), 8000);
    let text = await errorBox.getText();
    assert.ok(text.includes("locked out"), "ATH-02 Failed");
    console.log("ATH-02: Invalid/Locked-out user error verified.");

    // ATH-03: Empty Fields
    await driver.get("https://www.saucedemo.com/");
    await driver.wait(until.elementLocated(page.loginBtn), 5000);
    await driver.findElement(page.loginBtn).click();
    let emptyError = await driver
      .wait(until.elementLocated(page.errorMsg), 5000)
      .getText();
    assert.ok(emptyError.includes("required"), "ATH-03 Failed");
    console.log("ATH-03: Empty field validation successful.");

    console.log("--- ALL AUTH TESTS PASSED ---");
  } catch (err) {
    console.error("TEST FAILED: " + err.message);
  } finally {
    await driver.quit();
  }
})();
