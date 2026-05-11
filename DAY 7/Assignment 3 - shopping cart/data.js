/* import data from './data.json' with { type: 'json' };

// console.log(data.users);

// const result = data.users;

data.users.map((i)=>{
    console.log(i.id)
})
 */

fetch('data.json')
    .then(response => {
        return response.json()
    })
    .then(data => {
            data.users.forEach(users => {
                console.table(users)
            });
    })

    .catch(error => {
        console.log("Error",error)
    })