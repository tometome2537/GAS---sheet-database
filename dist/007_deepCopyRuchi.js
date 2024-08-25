function deepCopyRuchi (val)  {
  if (typeof val !== "object" || val === null) {
    return val;
  } else if (["string", "boolean", "number"].includes(typeof val)) {
    return val;
  } else if (Array.isArray(val)) {
    return val.map((item) => deepCopyRuchi(item));
  } else if(val instanceof Date) {
    return new Date(val.getTime());
  } else {
    return Object.keys(val).reduce((acc, key) => {
      acc[key] = deepCopyRuchi(val[key]);
      return acc;
    }, {});
  }
};