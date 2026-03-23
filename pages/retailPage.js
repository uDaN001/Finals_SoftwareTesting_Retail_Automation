const { By, until } = require("selenium-webdriver");

class RetailPage {
  constructor(driver) {
    this.driver = driver;

    // Login & Navigation
    this.username = By.id("user-name");
    this.password = By.name("password");
    this.loginBtn = By.id("login-button");
    this.errorMsg = By.xpath("//h3[@data-test='error']");
    this.menuBtn = By.id("react-burger-menu-btn");
    this.logoutBtn = By.id("logout_sidebar_link");

    // Product Page
    this.inventoryItems = By.className("inventory_item");
    this.sortContainer = By.className("product_sort_container");
    this.item4Link = By.id("item_4_title_link");

    // Cart & Checkout
    this.cartLink = By.className("shopping_cart_link");
    this.cartBadge = By.className("shopping_cart_badge");
    this.addBackpack = By.id("add-to-cart-sauce-labs-backpack");
    this.checkoutBtn = By.id("checkout");

    // Checkout Form
    this.firstName = By.id("first-name");
    this.lastName = By.id("last-name");
    this.zipCode = By.id("postal-code");
    this.continueBtn = By.id("continue");
    this.finishBtn = By.id("finish");
    this.completeHeader = By.className("complete-header");
  }

  async login(user, pass) {
    await this.driver.get("https://www.saucedemo.com/");
    await this.driver.wait(until.elementLocated(this.username), 10000);
    let u = await this.driver.findElement(this.username);
    await u.clear();
    if (user) await u.sendKeys(user);
    let p = await this.driver.findElement(this.password);
    await p.clear();
    if (pass) await p.sendKeys(pass);
    await this.driver.findElement(this.loginBtn).click();
  }
}

module.exports = RetailPage;
