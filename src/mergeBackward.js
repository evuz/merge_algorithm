function mergeBackward(arr1, arr2) {
  const result = [];

  while (arr1.length && arr2.length) {
    const lastIndex1 = arr1.length - 1;
    const lastIndex2 = arr2.length - 1;

    if (arr1[lastIndex1].id === arr2[lastIndex2].id) {
      result.unshift(Object.assign(arr1.pop(), arr2.pop()));
    } else if (arr1[lastIndex1].id > arr2[lastIndex2].id) {
      result.unshift(arr1.pop());
    } else if (arr2[lastIndex2].id > arr1[lastIndex1].id) {
      result.unshift(arr2.pop());
    }

    if (!arr1.length || !arr2.length) {
      Array.prototype.unshift.apply(result, arr1.length ? arr1 : arr2);
    }
  }

  return result;
}

module.exports = {
  mergeBackward,
};
