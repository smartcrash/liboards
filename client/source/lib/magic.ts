import { Magic } from 'magic-sdk';
import { OAuthExtension } from '@magic-ext/oauth';
import { MAGIC_PUBLISHABLE_KEY } from '../constants';

const magic = new Magic(MAGIC_PUBLISHABLE_KEY, { extensions: [new OAuthExtension()] })

export { magic }
