/* -------------------------------------------------------------------------- */
/*                                ENVIRONMENTS                                */
/* -------------------------------------------------------------------------- */
export const isBrowser = typeof window !== 'undefined';
export const isProd = process.env.NODE_ENV === 'production';
export const isDev = process.env.NODE_ENV === 'development';
export const isClient = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);
export const TEST_ENV = process.env.NEXT_PUBLIC_APP_ENV === 'test';
export const IS_TEST = TEST_ENV || process.env.NODE_ENV === 'test';

/* -------------------------------------------------------------------------- */
/*                                TIME HELPERS                                */
/* -------------------------------------------------------------------------- */
export const ONE_SECOND_MS = 1000;
export const ONE_MIN_MS = 60 * ONE_SECOND_MS;
export const ONE_HOUR_MS = 60 * ONE_MIN_MS;
export const ONE_DAY_MS = 24 * ONE_HOUR_MS;

/* -------------------------------------------------------------------------- */
/*                             REACT QUERY CONFIG                             */
/* -------------------------------------------------------------------------- */
export const PORT = 3000;
export const ACCESS_TOKEN_EXPIRES_IN = 15;
export const REFRESH_TOKEN_EXPIRES_IN = 60;
export const REDIS_CACHE_EXPIRES_INT = 60;
// export const MAX_BATCH_SIZE = 10;
export const DEFAULT_STALE_TIME: number = 5 * ONE_SECOND_MS; // 5secs

/* -------------------------------------------------------------------------- */
/*                                STORAGE KEYS                                */
/* -------------------------------------------------------------------------- */
export const ANON_ID_KEY = '__anon_id';
export const NEXT_AUTH_SESSION_TOKEN_KEY = 'next-auth.session-token';
export const APP_CONSENT = 'app-consent';
export const ALPHA_FEEDBACK_KEY = 'alpha-feedback-shown';

export const PALETTE_KEY = 'palette';
export const PALETTE_NAME_KEY = 'palette-name';
/* -------------------------------------------------------------------------- */
/*                                    REGEX                                   */
/* -------------------------------------------------------------------------- */
export const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
export const PHONE_REGEX = /^\d{3}-\d{3}-\d{4}$/;
export const ZIP_REGEX = /^\d{5}(?:[-\s]\d{4})?$/;
export const URL_REGEX =
  /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
export const SPECIAL_CHAR_REGEX = /[^a-zA-Z ]/g;
export const DASHES_REGEX = /-/g;
export const UNDERSCORES_REGEX = /_/g;
export const SPACES_REGEX = /\s/g;
export const ALPHA_DASHES_REGEX = /^[a-zA-Z-]+$/;
export const ALPHA_DASHES__SPACES_REGEX = /^[a-zA-Z\s-]+$/;
export const NON_ALPHA_NUMERIC_REGEX = /[^a-zA-Z0-9]/g;
export const NON_ALPHA_REGEX = /[^a-zA-Z]/g;
export const NON_NUMERIC_REGEX = /[^0-9]/g;
export const NON_ALPHA_NUMERIC_DASHES_REGEX = /[^a-zA-Z0-9-]/g;
export const NON_ALPHA_NUMERIC_UNDERSCORES_REGEX = /[^a-zA-Z0-9_]/g;
export const NON_ALPHA_NUMERIC_SPACES_REGEX = /[^a-zA-Z0-9\s]/g;
export const NON_ALPHA_NUMERIC_DASHES_UNDERSCORES_REGEX = /[^a-zA-Z0-9-_]/g;
export const NON_ALPHA_NUMERIC_DASHES_SPACES_REGEX = /[^a-zA-Z0-9-\s]/g;
export const NON_ALPHA_NUMERIC_UNDERSCORES_SPACES_REGEX = /[^a-zA-Z0-9_\s]/g;
export const NON_ALPHA_NUMERIC_DASHES_UNDERSCORES_SPACES_REGEX =
  /[^a-zA-Z0-9-_ ]/g;

export const HEX_COLOR_REGEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
export const HEX_COLOR_WITHOUT_HASH_REGEX = /^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

export const HEX_COLOR_REGEX_STRING = '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$';
export const HEX_COLOR_WITHOUT_HASH_REGEX_STRING =
  '^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$';

export const PARENS_REGEX = /\(|\)/g;

export const debug = isDev && false;
