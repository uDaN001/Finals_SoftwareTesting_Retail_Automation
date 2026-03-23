const { Builder, By, Key, until } = require("selenium-webdriver");

async function swagLabsTest() {
  // 1. Initialize the Driver (using Chrome)
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    // 2. Navigate to Swag Labs
    await driver.get("https://www.saucedemo.com/");

    // 3. Login Flow
    // Find Username, Type 'standard_user'
    await driver.findElement(By.id("user-name")).sendKeys("standard_user");

    // Find Password, Type 'secret_sauce'
    await driver.findElement(By.id("password")).sendKeys("secret_sauce");

    // Click Login
    await driver.findElement(By.id("login-button")).click();

    // 4. Validation (Check if we reached the products page)
    await driver.wait(until.elementLocated(By.className("title")), 5000);
    let title = await driver.findElement(By.className("title")).getText();

    if (title === "Products") {
      console.log("Test Passed: Successfully logged in!");
    } else {
      console.log("Test Failed: Unexpected page title.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    // 5. Close the browser
    await driver.quit();
  }
}

swagLabsTest();
