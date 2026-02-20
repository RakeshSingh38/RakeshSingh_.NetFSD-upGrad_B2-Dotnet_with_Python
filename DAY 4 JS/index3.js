let arr1 = ["aa","bb"];
let str = "abc"
let arr2 = [...arr1];

console.log(arr2)

let arr3 = [...str];

console.log(arr3)

let num = 1234;

let arr4=[...num,1];

console.log(arr5);

function patternSpaces(n) {
    for (let row = 1; row <= n; row++) {

        let str = "";
        for (let col = 1; col <= n - row; col++) {
            str += " ";
        }
        for (let col = 1; col <= row; col++) {
            str += "*"
        }
        console.log(str);
    }
}

patternSpaces(5);