import * as crypto from 'crypto';

export const now = (unit) => {
  const hrTime = process.hrtime();

  switch (unit) {
    case 'milli':
      return hrTime[0] * 1000 + hrTime[1] / 1000000;

    case 'micro':
      return hrTime[0] * 1000000 + hrTime[1] / 1000;

    case 'nano':
    default:
      return hrTime[0] * 1000000000 + hrTime[1];
  }
};

export const md5 = (data: string) =>
  crypto.createHash('md5').update(data).digest('hex');

export function excludeField(obj: any, keys: string[]) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key)),
  );
}
