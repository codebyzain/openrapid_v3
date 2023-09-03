const is = {
    isMatch: (regExp) => {
        return regExp.test(string);
    },
    isEmpty: () => {
        return string == undefined || string.length == 0;
    },
};

module.exports = is;
