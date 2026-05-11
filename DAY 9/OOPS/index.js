class person{
    constructor(name,age){
        this.name=name;
        this.age=age;
    }
    greet(){
        return `hi, i am ${this.name} and i am ${this.age} years old`;
    }
}
const p1=new person("vamsi",22);
console.log(p1.greet());

class product{
    constructor(){
        this.items=[];
    }
    addItem(item){
        this.items.push(item);
    }
    getItem(){
        return this.items.reduce((Sum, item) => Sum + item.price, 0);
    }
}
const cart=new product();
cart.addItem({name:"shoes",price:100});
cart.addItem({name:"shirt",price:50});
cart.addItem({name:"jeans",price:150});
console.log(cart.items);
console.log("the total price is ",cart.getItem());