const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const sharp = require('sharp');
const winston = require('winston');

// Initialize logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'screenblob.log' })
  ],
});

async function captureScreenshot(url, output, format = 'png', quality = 80, width = 1920, height = 1080, delay = 0, selector = null, fullpage = false, hideScrollbars = true) {
  let driver;

  try {
    logger.info('Initializing WebDriver');
    const options = new chrome.Options();
    options.addArguments('headless'); // Run in headless mode
    options.addArguments('no-sandbox');
    options.addArguments('disable-dev-shm-usage');

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    logger.info(`Navigating to URL: ${url}`);
    await driver.get(url);

    if (delay > 0) {
      logger.info(`Waiting for ${delay} ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    if (hideScrollbars) {
      logger.info('Hiding scrollbars');
      await driver.executeScript('document.body.style.overflow = "hidden";');
    }

    let screenshot;

    if (fullpage) {
      logger.info('Capturing full page screenshot');
      await driver.manage().window().setRect({ width, height });
      const totalHeight = await driver.executeScript('return document.body.scrollHeight');
      await driver.manage().window().setRect({ width, height: totalHeight });
      screenshot = await driver.takeScreenshot();
    } else if (selector) {
      logger.info(`Locating element by selector: ${selector}`);
      const element = await driver.findElement(By.css(selector));
      await driver.executeScript("arguments[0].scrollIntoView();", element);
      screenshot = await element.takeScreenshot(true);
    } else {
      logger.info('Capturing viewport screenshot');
      await driver.manage().window().setRect({ width, height });
      screenshot = await driver.takeScreenshot();
    }

    await saveScreenshot(screenshot, output, format, quality);

    logger.info(`Screenshot saved to ${output}.${format}`);
  } catch (error) {
    handleCaptureError(error);
  } finally {
    if (driver) {
      logger.info('Quitting WebDriver');
      await driver.quit();
    }
  }
}

async function saveScreenshot(base64Data, output, format, quality) {
  const buffer = Buffer.from(base64Data, 'base64');
  const outputPath = `${output}.${format}`;
  
  if (format === 'jpeg') {
    await sharp(buffer)
      .jpeg({ quality })
      .toFile(outputPath);
  } else {
    await sharp(buffer)
      .toFile(outputPath);
  }
}

function handleCaptureError(error) {
  if (error.name === 'NoSuchElementError') {
    logger.error('Element not found');
  } else if (error.message.includes('net::ERR_INTERNET_DISCONNECTED')) {
    logger.error('Network error: Internet disconnected');
  } else if (error.message.includes('ERR_NAME_NOT_RESOLVED')) {
    logger.error('Network error: Domain name not resolved');
  } else if (error.message.includes('ERR_CONNECTION_TIMED_OUT')) {
    logger.error('Network error: Connection timed out');
  } else {
    logger.error(`Unknown error: ${error.message}`);
  }
  throw error;
}

// Export the function correctly
module.exports = { captureScreenshot };
