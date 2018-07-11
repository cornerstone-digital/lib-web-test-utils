exports.config = {
  name: 'web-components',
  tests: './**/*.e2e.js',
  timeout: 10000,
  output: './.test-output/codecept',
  browsers: ['chrome'],
  helpers: {
    CustomPuppeteer: {
      require: '.PuppeteerHelper.js',
      url: 'http://localhost:6060',
      snapshotsDir: '__image_snapshots__',
      breakpoints: [
        {
          name: 'mobile',
          viewport: {
            width: 375,
            height: 667
          }
        },
        {
          name: 'tablet',
          viewport: {
            width: 768,
            height: 1024
          }
        },
        {
          name: 'desktop',
          viewport: {
            width: 1280,
            height: 800
          }
        },
        {
          name: 'large desktop',
          viewport: {
            width: 1920,
            height: 1080
          }
        }
      ],
      devicesToEmulate: [
        'iPhone 5',
        'iPhone 5 landscape',
        'iPhone 6',
        'iPhone 6 landscape',
        'iPhone 8',
        'iPhone 8 landscape',
        'iPhone X',
        'iPhone X landscape',
        'iPad',
        'iPad landscape'
      ],
      show: false,
      // restart: false,
      keepBrowserState: true,
      keepCookies: true,
      disableScreenshots: true,
      waitForNavigation: 'networkidle0',
      waitForAction: 200,
      uniqueScreenshotNames: true,
      chrome: {
        slowMo: 100,
        args: [
          '--start-maximized'
        ]
      }
    }
  },
  include: {},
  bootstrap: false
}

process.on('unhandledRejection', e => console.log(e))
