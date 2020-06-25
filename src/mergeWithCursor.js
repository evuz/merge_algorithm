function mergeWithCursor(arr1, arr2) {
  const result = [];
  let arr1Index = 0,
    arr2Index = 0;

  while (arr1Index < arr1.length && arr2Index < arr2.length) {
    if (arr1[arr1Index].id === arr2[arr2Index].id) {
      result.push(Object.assign(arr1[arr1Index], arr2[arr2Index]));
      arr1[arr1Index] = null;
      arr2[arr2Index] = null;
      arr1Index++;
      arr2Index++;
    } else if (arr1[arr1Index].id < arr2[arr2Index].id) {
      result.push(arr1[arr1Index]);
      arr1[arr1Index] = null;
      arr1Index++;
    } else if (arr2[arr2Index].id < arr1[arr1Index].id) {
      result.push(arr2[arr2Index]);
      arr2[arr2Index] = null;
      arr2Index++;
    }

    if (arr1Index >= arr1.length || arr2Index >= arr2.length) {
      Array.prototype.push.apply(result, arr1Index < arr1.length ? arr1.splice(arr1Index) : arr2.splice(arr2Index));
    }
  }

  return result;
}

module.exports = {
  mergeWithCursor,
};
