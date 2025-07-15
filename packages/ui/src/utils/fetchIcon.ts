import { getAssetPath } from '@stencil/core';

import { ICON_BASE_URL, icons } from '../constants';
import { createCacheFetch } from './createCacheFetch';

export async function fetchIcon(name: string) {
  if (!name) return '';

  const cacheFetch = await createCacheFetch('zane-icons');

  const icon = icons.find((icon: any) => icon.name === name);

  if (!icon) return '';

  const iconBaseUrl: string =
    // eslint-disable-next-line n/prefer-global/process
    process.env.THIRD_PARTY_ASSETS === 'LOCAL'
      ? getAssetPath('./assets/node_modules/@carbon/icons')
      : ICON_BASE_URL;

  return await cacheFetch(`${iconBaseUrl}/svg/${icon.path}`);
}
