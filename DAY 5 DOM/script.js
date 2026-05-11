let someName = "";

if ("a") {
    if (someName) console.log("It runs");
    else if (!someName) console.log("it wont");
    else {
        console.log("nothing to display");
    }
}

// this.fullName = "rakesh";
// this.age = 26;
let user={
    fullName: "Rakesh",
    age:26,
    greetDetails: function(){
        return `hello ${this.fullName} your age is ${this.age} `
    }
}

user.country = "India";
console.log(user)
console.log(user.greetDetails())