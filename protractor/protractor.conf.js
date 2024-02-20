exports.config = {
  framework: 'jasmine',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['./test/user-spec.ts'],
  capabilities: {
    'browserName': 'chrome',
	  'acceptInsecureCerts': true,
    'useAutomationExtension': false,
    chromeOptions: {
      args: ["--no-sandbox","--headless", "--disable-gpu","--disable-dev-shm-usage","--disable-web-security","--allow-running-insecure-content"]
    }
  }
};


