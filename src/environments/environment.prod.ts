import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
   URL:"http://localhost:3000/api",
   IP: "http://localhost:3000",
};
