
export interface ZaneAppConfigRaw {
  VITE_GLOB_API_URL: string;
}

export interface ApplicationConfig {
  apiURL: string;
}

declare global {
  interface Window {
    _ZANE_APP_CONF_: ZaneAppConfigRaw;
  }
}
