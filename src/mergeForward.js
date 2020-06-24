function mergeForward(arr1, arr2) {
  const result = [];

  while (arr1.length && arr2.length) {
    const id1 = arr1[0].id;
    const id2 = arr2[0].id;

    if (id1 === id2) {
      result.push(Object.assign(arr1.splice(0, 1)[0], arr2.splice(0, 1)[0]));
    } else if (id1 < id2) {
      result.push(arr1.splice(0, 1)[0]);
    } else if (id2 < id1) {
      result.push(arr2.splice(0, 1)[0]);
    }

    if (!arr1.length || !arr2.length) {
      Array.prototype.push.apply(result, arr1.length ? arr1 : arr2);
    }
  }

  return result;
}

module.exports = {
  mergeForward,
};
