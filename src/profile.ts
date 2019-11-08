import { ajax } from "rxjs/ajax";
import { finalize } from 'rxjs/operators'
import "./assets/styles/styles.scss";
import authService from './services/auth.service';
import { IUser } from './models/user.model'

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

document.addEventListener("DOMContentLoaded", init);

function init() {
  checkAuth()
  getUser()
}

function checkAuth() {
  if (!authService.isAuthorized) {
    window.location.href = window.location.origin;
  }
}

const hideLoader = () => {
  const loader = document.querySelector('.fullscreen-loader')
  loader.classList.add('is-hidden')
}

const getUser = () => {
  const userId = getQueryParam('userId')
  if (userId == null) window.location.href = window.location.origin
  ajax.getJSON(`${userApiUrl}${userId}`)
    .pipe(finalize(hideLoader))
    .subscribe(render, onError)
}

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

const render = (user: IUser) => {
  const usernameEl          = document.querySelector('.username')
  const addressEl           = document.querySelector('.user-address')
  const companyNameEl       = document.querySelector('.company-name')
  const zipCodeEl           = document.querySelector('.zip-code')
  const websiteEl           = document.querySelector('.user-website')
  const companyEl           = document.querySelector('.user-company')

  usernameEl.textContent    = user.name
  addressEl.textContent     = `${user.address.street } , ${user.address.city }`
  companyNameEl.textContent = user.company.name
  zipCodeEl.textContent     = user.address.zipcode
  websiteEl.textContent     = user.website
  companyEl.textContent     = `${user.company.name}, ${user.company.catchPhrase}`
}

const onError = () => {
  const alertEl = document.querySelector('.alert-danger')
  alertEl.classList.remove('is-hidden')
}
