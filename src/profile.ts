import "./assets/styles/styles.scss";

// TODO: fix navigation for logged user
// TODO: get userId from query param, fetch users data from api by id, hide loader
// TODO: if there is no userId in query param or user not authorized --> redirect to home page (there is an example in balance page)
// TODO: render user's data on the page (you can find which data to pass on the page in {{ }})

// p.s. double curly brackets doesn't have any functionality for now, just in order to show what data
// should be passed there {{  }}, just replace them with the content

// p.s.2 - profile image is random on this page

const userApiUrl = "https://jsonplaceholder.typicode.com/users/";
// to get user by id 1 -  https://jsonplaceholder.typicode.com/users/1
// to get user by id 2 -  https://jsonplaceholder.typicode.com/users/2

// TODO: use helper function getQueryParam to get userId


// the response will be the following
// {
//     "id": 1,
//     "name": "Leanne Graham",
//     "username": "Bret",
//     "email": "Sincere@april.biz",
//     "address": {
//       "street": "Kulas Light",
//       "suite": "Apt. 556",
//       "city": "Gwenborough",
//       "zipcode": "92998-3874",
//       "geo": {
//         "lat": "-37.3159",
//         "lng": "81.1496"
//       }
//     },
//     "phone": "1-770-736-8031 x56442",
//     "website": "hildegard.org",
//     "company": {
//       "name": "Romaguera-Crona",
//       "catchPhrase": "Multi-layered client-server neural-net",
//       "bs": "harness real-time e-markets"
//     }
//   }

/**
 * Helper function to get query param on the page
 *
 * @param {string} param
 * @returns
 */
function getQueryParam(param: string) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

