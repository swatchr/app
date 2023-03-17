export function crispPlugin(userConfig: { crispId: string; enabled: boolean }) {
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

// usage:
// crispPlugin({
//   crispId: String(process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID),
//   enabled: !!process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID && getConsent(),
// }),
