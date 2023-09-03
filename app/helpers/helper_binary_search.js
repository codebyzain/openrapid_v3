const binarySearch = (data, target) => {
    var left = 0;
    var right = data.length - 1;
    while (left <= right) {
        var middle = Math.floor((left + right) / 2);
        if (target == data[middle]) {
            return middle;
        }
        if (target < data[middle]) {
            right = middle - 1;
        } else {
            left = middle + 1;
        }
    }
    return -1;
};

module.exports = binarySearch;
