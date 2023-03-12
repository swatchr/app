import { isClient } from '@/utils';
import mixpanelPlugin from '@analytics/mixpanel';
import Analytics from 'analytics';

import { getCookie } from '@analytics/cookie-utils';

export function getConsent(): boolean {
  if (!isClient) return false;
  // @TTODO: extract key name to const and use in other places
  const consent = getCookie('app-consent');
  if (consent !== null || consent !== undefined) return JSON.parse(consent);
  localStorage.setItem('app-consent', 'false');
  return false;
}

function crispPlugin(userConfig: { crispId: string; enabled: boolean }) {
  // return object for analytics to use
  return {
    name: 'crisp-plugin',
    config: {
      crispId: userConfig.crispId,
      enabled: userConfig.enabled,
    },
    initialize: ({ config }: any) => {
      // load your script here.
      if (!config.enabled) return;
      (<any>window).$crisp = [];
      (<any>window).CRISP_WEBSITE_ID = config.crispId;
      (function () {
        const d = document;
        // this might be causing an unterminated string literal error
        // @SEE: https://tinyurl.com/2ocvkfvt

        const s = d.createElement('script');
        s.src = 'https://client.crisp.chat/l.js';
        // s.async = 1;
        s.async = true;
        d?.getElementsByTagName('head')[0]?.appendChild(s);
      })();
    },
  };
}

// @TODO: Add ability to disable tracking: -- is this done?
// @link: https://getanalytics.io/plugins/do-not-track/

export const analytics = Analytics({
  app: 'swatchr',
  plugins: [
    mixpanelPlugin({
      token: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN,
      enabled: !!process.env.NEXT_PUBLIC_MIXPANEL_TOKEN && getConsent(),
    }),
    // crispPlugin({
    //   crispId: String(process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID),
    //   enabled: !!process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID && getConsent(),
    // }),
  ],
});
