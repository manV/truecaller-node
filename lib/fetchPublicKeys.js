// lib/fetchPublicKey.js

const { promisify } = require('util');
const request = promisify(require('request'));
const moize = require('moize');

const publicKeyUrl = 'https://api4.truecaller.com/v1/key';
const defaultExpire = 1000 * 60 * 60 * 24; // 24 hours

const internalFetchPublicKeys = async (url = publicKeyUrl) => {
  const { body } = await request({
    url,
    method: 'GET',
    json: true,
  });

  if (!Array.isArray(body) || body.length === 0) {
    throw Error(`Invalid public key received from ${url}`);
  }

  return body.map(({ key }) => {
    return "-----BEGIN PUBLIC KEY-----\n" + key.match(/.{1,64}/g).join("\n") + "\n-----END PUBLIC KEY-----";
  });
};

const fetchPublicKeys = moize.default(
  internalFetchPublicKeys,
  {
    maxAge: defaultExpire,
    isPromise: true,
    updateExpire: true,
  },
);

module.exports = fetchPublicKeys;
