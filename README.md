# Screenblob

Screenblob is a lightweight Node.js library for capturing screenshots of web pages. It does not rely on heavy libraries like Puppeteer or Playwright, making it a streamlined option for your screenshot needs. This library uses Selenium WebDriver with Chrome for capturing screenshots, offering flexibility in screenshot formats and sizes.

## Features
- Capture screenshots of entire pages or specific elements
- Support for different image formats: PNG and JPEG
- Adjustable screenshot quality
- Options for viewport size, delay, and hiding scrollbars

## Installation

To install `screenblob`, you can use npm:

```bash
npm install -g screenblob
# or
npm install screenblob

## Options:

--url (required): URL of the page to capture.
--output: Output file path without extension. Default is screenshot.
--format: Image format, either png or jpeg. Default is png.
--quality: Image quality for JPEG format, from 0 to 100. Default is 80.
--width: Browser window width. Default is 1920.
--height: Browser window height. Default is 1080.
--delay: Delay before taking the screenshot, in milliseconds. Default is 0.
--selector: CSS selector to wait for before taking the screenshot.
--fullpage: Capture a full page screenshot.
--hideScrollbars: Hide scrollbars in the screenshot.