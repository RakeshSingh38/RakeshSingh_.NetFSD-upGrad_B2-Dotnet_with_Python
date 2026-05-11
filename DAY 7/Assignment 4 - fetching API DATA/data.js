/* fetch(
    "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m",
)
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
    })
    .catch((e) => console.log(e));

 */
//  using async await

/* 
Create an application that fetches weather data asynchronously. 
 
📌 Requirements 
- Fetch data from a public API using fetch(). 
- Implement version using Promises. 
- Implement version using async/await. 
- Handle errors properly. 
- Display formatted weather report. 
 
🛠️ Technical Constraints 
- Use async/await. 
- Use template literals. 
- Use arrow functions. 
- Must include proper error handling using try/catch. 
 
🎯 Learning Outcome 
- Understand Promises and async/await. 
- Handle asynchronous operations. 
- Improve API handling skills.
*/
async function fetchAPI() {
    try {
        const result = await fetch(
            "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m",
        );
        const text = await result.text();
        console.log(text)
        // console.log(result)
        const data = await result.json();
        // console.log(data);
        return data;
    } catch (e) {
        console.log("error", e);
    }
}

// using promises
function fetchAPIPromise() {
    fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m",
    )
        .then((response) => response.json())
        .then((data) => {
            // console.log(data);
            return data;
        })
        .catch((e) => console.log(e));
}
fetchAPI();
// fetchAPIPromise()
