/* 
Product Cart Summary (LEVEL-1) 
Scenario: 
Build a simple shopping cart summary system. 
 
📌 Requirements  
- Store product objects (name, price, quantity) in an array. 
- Calculate total cart value. 
- Display formatted invoice using template literals. 
- Use arrow functions. 
- Export calculation function from a module. 
 
🛠️ Technical Constraints 
- Use map() and reduce(). 
- Use ES6 modules (export/import). 
- No DOM manipulation required. 
 
🎯 Learning Outcome 
- Work with arrays of objects. 
- Understand modules. 
- Improve functional programming skills.
const cart = [
{ name: "Keyboard", price: 1200, quantity: 1 },
{ name: "Mouse", price: 600, quantity: 2 },
{ name: "Monitor", price: 9000, quantity: 1 }
];
*/

import totalValue from "./totalCart.js";

const products = [
    { name: "Keyboard", price: 1200, quantity: 1 },
    { name: "Mouse", price: 600, quantity: 2 },
    { name: "Monitor", price: 9000, quantity: 1 },
];
// console.log(totalValue(products));

const total = totalValue(products);
const itemsList = products
    .map(
        (p) =>
            `${p.name}: ₹${p.price} x ${p.quantity} = ₹${p.price * p.quantity}`,
    )
    .join("\n");
console.log(`
╔════════════════════════════════╗ 
║      SHOPPING CART INVOICE     ║
╚════════════════════════════════╝
${itemsList}
────────────────────────────────
        TOTAL: ₹${total}
    `);
