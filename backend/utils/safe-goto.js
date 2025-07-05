// utils/safeGoto.js

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


export async function safeGoto(page, url, options = {}) {
  const {
    timeout = 60000,       // short but reasonable default
    waitUntil = "networkidle2",
    retries = 1,
    delayAfterLoad = 500,  // optional wait after load
    userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
  } = options;

  try {
    await page.setUserAgent(userAgent);
    await page.setViewport({ width: 1280, height: 800 });

    let lastErr;
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        await page.goto(url, { waitUntil, timeout });
        if (delayAfterLoad) await sleep(delayAfterLoad);
        return true; // success
      } catch (err) {
        lastErr = err;
        console.warn(`[safeGoto] Attempt ${attempt + 1} failed:`, err.message);
      }
    }
    throw lastErr;
  } catch (err) {
    console.error(`[safeGoto] Failed to navigate to ${url}:`, err.message);
    return false;
  }
}
