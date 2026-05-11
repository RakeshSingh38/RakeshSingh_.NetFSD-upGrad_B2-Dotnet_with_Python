const arr1 = [1, 2, 3];

const arr2 = [...arr1, 4, 5, 6];
// console.log(arr2)

let str = "rakesh";
let ans = [...str];
// console.log(ans);

const obj = {
    a:1,
    b:"b",
    c:true
}

console.log(Object.keys(obj))
console.log(Object.values(obj))
console.log(Object.entries(obj))

const arrPairs = [['a', 1], ['b', 2], ['c', 3]];
console.log(Object.fromEntries(arrPairs));

try {
    const age = -4;

    if (age < 0) {
        throw new Error("age cannot be -ve");
    }

    console.log("valid age");
} catch (e) {
    console.error("error :", e.message);
}