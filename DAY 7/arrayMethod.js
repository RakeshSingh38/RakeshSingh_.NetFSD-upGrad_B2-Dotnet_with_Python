let num = [0,1,2,3,4,5,6]

// num.splice(num.length,0,7,8)

// rm first Element
num.shift(0); //  [ 1, 2, 3, 4, 5, 6 ]

// add element to start
num.unshift(0); // [ 0, 1, 2, 3, 4, 5, 6 ]

console.log(num)

// push // ->       add E to the last
// pop // ->       rm E from the last

// filter doesnt modify orignal array
// return the values that meet specified condtion

num.filter ((num) => num%2 === 0) 
console.log(num)

// w     slice
// cuts some parts of array where start is inclusive and end is not inclusive( n-1 )
// can also be used to copy Array Elements
// doesnt modify original array E even after storing in new variable
let ansOfSlice = num.slice(0,num.length)

console.log(ansOfSlice)

// splice
// see    anyhow modifies the original array elements

// let ansOfSplice = num.splice(0,num.length)
// console.log(ansOfSplice)

console.log(num)


console.log(num.indexOf(2))

// loop thorugh each array Element
// but here break, continue doesnt work nor it returns anything so can also be used to traverse array elements once
num.forEach((i)=>{
    console.log(i)
})

console.log(num.includes(3)) // returns true if val exists else false
// note     initial value is optional even if u dont provide it takes it as 0th index of num as initialValue
let sum = num.reduce((total,current)=> total+current)
console.log(sum)

let num2 = [7,6,5,4,3,2,1,0]

// by default .sort() gives ascending result

// to make it rev use .reverse on it .sort.reverse()

// or use liek this below

console.log(num2.sort((a,b)=>{
    return a - b;
}))