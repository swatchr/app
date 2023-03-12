export function loggerPlugin() {
  return {
    name: 'analytics-logger',
    initialize: () => console.log('📊 loading ALogger'),
    loaded: () => true,
    ready: () => console.log('📊 ready: ALogger'),
    page: ({ payload }: { payload: Record<string, any> }) => {
      console.log('📊 APage', payload);
    },
    pageEnd: ({ payload }: { payload: Record<string, any> }) => {
      console.log('📊 APageEnd', payload);
    },
    /* Track event */
    track: ({ payload }: { payload: Record<string, any> }) => {
      console.log('📊 ATrack', payload);
    },
    /* Identify user */
    identify: ({ payload }: { payload: Record<string, any> }) => {
      console.log('📊 AIdentify', payload);
    },
  };
}
