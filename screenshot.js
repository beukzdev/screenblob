const { captureScreenshot } = require('./screenblob'); // Adjust the path if needed
const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');

// Define default values
const DEFAULTS = {
  url: 'https://example.com', // Default URL
  output: 'screenshot', // Default output file name without extension
  format: 'png', // Default format
  quality: 80, // Default quality for jpeg
  width: 425, // Default width
  height: 1080, // Default height
  delay: 0, // Default delay
  selector: null, // Default selector
  fullpage: true, // Default fullpage screenshot
  hideScrollbars: false // Default hide scrollbars
};

// Parse command line arguments
const argv = yargs(hideBin(process.argv))
  .option('url', {
    type: 'string',
    description: 'URL of the page to screenshot',
    default: DEFAULTS.url
  })
  .option('output', {
    type: 'string',
    description: 'Output file path without extension',
    default: DEFAULTS.output
  })
  .option('format', {
    type: 'string',
    choices: ['png', 'jpeg'],
    description: 'Image format',
    default: DEFAULTS.format
  })
  .option('quality', {
    type: 'number',
    description: 'Image quality for jpeg (0-100)',
    default: DEFAULTS.quality
  })
  .option('width', {
    type: 'number',
    description: 'Browser window width',
    default: DEFAULTS.width
  })
  .option('height', {
    type: 'number',
    description: 'Browser window height',
    default: DEFAULTS.height
  })
  .option('delay', {
    type: 'number',
    description: 'Delay before taking the screenshot (in milliseconds)',
    default: DEFAULTS.delay
  })
  .option('selector', {
    type: 'string',
    description: 'CSS selector to wait for before taking the screenshot',
    default: DEFAULTS.selector
  })
  .option('fullpage', {
    type: 'boolean',
    description: 'Capture full page screenshot',
    default: DEFAULTS.fullpage
  })
  .option('hideScrollbars', {
    type: 'boolean',
    description: 'Hide scrollbars',
    default: DEFAULTS.hideScrollbars
  })
  .argv;

// Capture screenshot with the provided options
(async () => {
  try {
    await captureScreenshot(
      argv.url,
      argv.output,
      argv.format,
      argv.quality,
      argv.width,
      argv.height,
      argv.delay,
      argv.selector,
      argv.fullpage,
      argv.hideScrollbars
    );
    console.log(`Screenshot captured successfully: ${argv.output}.${argv.format}`);
  } catch (error) {
    console.error(`Failed to capture screenshot: ${error.message}`);
  }
})();
