export function reverseKeys(obj: any) {
  return Object.keys(obj).reduce((ret, key) => {
    ret[obj[key]] = key;
    return ret;
  }, {});
}
