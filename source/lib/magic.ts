import { Magic } from '@magic-sdk/admin';
import { MAGIC_SECRET_KEY } from "../constants";

const magic = new Magic(MAGIC_SECRET_KEY)

export { magic };
