// Auditoria Lighthouse mobile separada da configuração desktop.
const desktop = require('./lighthouserc.cjs');

module.exports = {
  ci: {
    ...desktop.ci,
    collect: {
      ...desktop.ci.collect,
      settings: {
        chromeFlags: '--no-sandbox --headless=new',
        formFactor: 'mobile',
        screenEmulation: {
          mobile: true,
          width: 390,
          height: 844,
          deviceScaleFactor: 2.75,
          disabled: false,
        },
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: './lighthouse-reports/mobile',
    },
  },
};
