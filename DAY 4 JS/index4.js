const marks = 52;


if(marks >= 90 ){
    console.log("A")
}else if(marks >=75 && marks <= 89){
    console.log("B")
}else if(marks >=40 && marks<=59){
    console.log("D")
}else{
    console.log("F")
}

console.log(marks < 40? "Fail": "Pass")