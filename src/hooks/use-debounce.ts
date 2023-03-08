import { useEffect } from 'react';

import { debounce } from '@/utils';

export const useDebounce = <A = unknown, R = void>(
  fn: (args: A) => R,
  ms: number
): ((args: A) => Promise<R>) => {
  const [debouncedFun, teardown] = debounce(fn, ms);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => teardown(), []);

  return debouncedFun;
};
