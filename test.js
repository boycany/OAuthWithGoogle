//[1,2,4,4] sum=8
//[1,2,3,9] sum=8

function HasPairWithSum(arr, sum) {
  let obj = {};

  for (let i = 0; i < arr.length; i++) {
    if (obj[sum - arr[i]] >= 0) {
      return [obj[sum - arr[i]], i];
    } else {
      obj[arr[i]] = i;
    }
    console.log(obj);
  }
}

// HasPairWithSum([1, 2, 4, 5], 9);
// HasPairWithSum([3, 2, 4], 6);
HasPairWithSum([3, 3], 6);
