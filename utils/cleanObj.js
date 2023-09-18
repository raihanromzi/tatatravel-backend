const cleanObj = (obj) => {
    const newObj = { ...obj };
    Object.keys(newObj).forEach((key) => {
        if (
            newObj[key] === null ||
            newObj[key] === undefined ||
            newObj[key] === '' ||
            (newObj[key] &&
                Object.keys(newObj[key]).length === 0 &&
                newObj[key].constructor === Object)
        ) {
            delete newObj[key];
        }
    });
    return newObj;
};

module.exports = cleanObj;