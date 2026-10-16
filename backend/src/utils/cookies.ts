const setCookies = function (
  res: any,
  name: string,
  value: string,
  options: any,
) {
  res.cookie(name, value, options);
};

const getCookies = function (req: any, name: string) {
  return req.cookies[name];
};

export { setCookies, getCookies };
