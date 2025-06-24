// puppeteer-setup.js
import puppeteerExtra from "puppeteer-extra";
import Stealth from "puppeteer-extra-plugin-stealth";
import { mkdtempSync } from "fs";
import { tmpdir } from "os";
import path from "path";

puppeteerExtra.use(Stealth());

/**
 * Create a unique temp user data directory for a fresh profile
 * @returns {string} Path to temp profile directory
 */
function createTempUserDataDir() {
  return mkdtempSync(path.join(tmpdir(), "puppeteer-profile-"));
}

/**
 * Launch Puppeteer browser with options
 * @param {object} options
 * @param {boolean} [options.headless=true] Run in headless mode or not
 * @returns {Promise<import('puppeteer').Browser>}
 */
export async function launchBrowser({ headless = true } = {}) {
  const userDataDir = createTempUserDataDir();

  const launchOptions = {
    headless,
    userDataDir,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-gpu",
      "--window-size=1920,1080",
    ],
  };

  const browser = await puppeteerExtra.launch(launchOptions);
  return browser;
}
