/* 
Store:
Account balance
Withdrawal amount
Use ternary to check:
Sufficient balance or not
Use if–else to:
Deduct balance if valid
Show error if insufficient
Use loop to:
Simulate 3 withdrawal attempts
Print final balance

//  here account balance is an array

*/

let accountBalance = 15000;

let withdrawals = [2000, 4000, 15000];

for (let i = 0; i < 3; i++) {
    console.log(`attempt ${i + 1}`);
    
    let currentBalance = accountBalance;
    let withdrawAmount = withdrawals[i];

    let isSufficientBalance = withdrawAmount <= currentBalance ? true : false;

    if (isSufficientBalance) {
        accountBalance -= withdrawAmount;
        console.log("withdrawal successful, remaining balance",currentBalance);
    } else {
        console.log("error insufficient balance");
    }
}

console.log("final ac balance:", accountBalance);
