'use strict';

module.exports = {
  test_page: 'test/tests.html?hidepassed',
  before_tests: 'npm run build:test:web',
  src_files: ['src/**/*', 'test/tests/**/*'],
  launch_in_ci: ['Chrome'],
  launch_in_dev: ['Chrome'],
  browser_start_timeout: 10,
  serve_files: ['mockServiceWorker.js'],
  browser_args: {
    Chrome: {
      ci: [
        // --no-sandbox is needed when running Chrome inside a container
        process.env.CI ? '--no-sandbox' : null,
        '--headless',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-software-rasterizer',
        '--mute-audio',
        '--remote-debugging-port=0',
        '--window-size=1440,900',
      ].filter(Boolean),
    },
  },
};
