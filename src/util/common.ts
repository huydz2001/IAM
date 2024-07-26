import * as crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { delay } from 'lodash';
import ms from 'ms';
const { JWT_KEY_EXPIRED } = process.env;

export const randomQueueName = (): string => {
  return `cms-be.${crypto.randomBytes(10).toString('hex')}`;
};

export function getDurationExpired(exp: number): number {
  return exp
    ? exp - Math.floor(Date.now() / 1000)
    : Math.floor(ms(JWT_KEY_EXPIRED) / 1000);
}

export const decodeJwtToken = (token: string): any => {
  return jwt.decode(token);
};

export const rename = (name: string, toUpperCase = false): string => {
  name = name
    .trim()
    .toLowerCase()
    .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
    .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
    .replace(/ì|í|ị|ỉ|ĩ/g, 'i')
    .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
    .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
    .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
    .replace(/đ/g, 'd')
    // Some system encode vietnamese combining accent as individual utf-8 characters
    .replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '') // Huyền sắc hỏi ngã nặng
    .replace(/\u02C6|\u0306|\u031B/g, '');

  return toUpperCase ? name.toUpperCase() : name;
};

export const promiseDelay = (ms: number) => {
  new Promise((resolve) =>
    delay(() => {
      resolve(undefined);
    }, ms),
  );
};
