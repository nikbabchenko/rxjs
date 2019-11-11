import { fromEvent, Observable } from "rxjs";
import { ajax } from "rxjs/ajax";
import { debounceTime, delay, distinctUntilChanged, filter, map, switchMap, tap, finalize, pluck } from "rxjs/operators";
import "./assets/styles/autocomplete.scss";
import "./assets/styles/styles.scss";
import { IRandomUserData, IUser, IUsersResponse } from "./models/user.model";

const autocompleteListEl = document.querySelector(".autocomplete__list");
const templateEl = document.getElementById('user-card') as HTMLTemplateElement
const usersRowEl = document.querySelector('.users-row')
const autocompleteUrl = "https://jsonplaceholder.typicode.com/users?username=";
const usersApiUrl = "https://randomuser.me/api/?results=10";

// TODO: 1. Create a function that makes request to usersApiUrl using ajax.getJSON()
// (the response will be in the following format https://randomuser.me/documentation#format) - `fetchUsers`
// TODO: 2. Create the model of the response of p. 2 as Observable<UsersResponse> using http://www.json2ts.com/
// TODO: 3. Show results using <template> tag with id="user-card", for ex. create method renderUsersCards,
// show user.name.first in Title, user.picture.large in img.src and  link should open `${window.location.origin}/profile.html?userId=${index}`
// where index just user's sequence number

// How to use template tags? - https://developer.mozilla.org/ru/docs/Web/HTML/Element/template

// basically it will look like this:
// Select template
// const template = document.getElementById('user-card') as HTMLTemplateElement;
// const templateContent = template.content;
// Select nodes in template and add content
// Clone it and append to selector
// const clone = document.importNode(templateContent,  true);
// document.querySelector(some-selector).appendChild(clone);

// p.s. in response you can use pipeable operator `pluck` to take `results`
// p.s. Typescript can't understand which Node is the image or anchor etc., so use such syntax to help TS
// template = document.getElementById('user-card') as HTMLTemplateElement
// image = ... as HTMLImageElement
// achor = ... as HTMLAnchorElement

// TODO: finish aftercomplete's logic

const addUserColumn = (name: string) => {
  return `<li class="list-group-item">${name}</li>`;
};

const fetchUserByName = (userName: string): Observable<IUser[]> =>
  ajax.getJSON(`${autocompleteUrl}${userName}`);

const fetchAllUsers = (): Observable<IUsersResponse> =>
  ajax.getJSON(usersApiUrl);

document.addEventListener("DOMContentLoaded", init);

const showLoader = (loader: Element) => loader.classList.remove('is-hidden')
const hideLoader = (loader: Element) => loader.classList.add('is-hidden')

function init() {
  const autocomplete: HTMLInputElement = document.querySelector(
    "#autocomplete__input"
  );
  const source$ = fromEvent(autocomplete, "input");
  const loader = document.querySelector('.fullscreen-loader')

  // LOADER exists in Markup, just toggle class 'is-hidden'
  source$
    .pipe(
      map(e => (e.target as HTMLInputElement).value),
      map(value => value.trim()),
      filter(value => value.length > 3),
      tap(() => showLoader(loader)),
      debounceTime(100),
      distinctUntilChanged(),
      tap(userName => console.log("--next value", userName)),
      switchMap(userName => fetchUserByName(userName)),
      delay(300),
      tap(() => hideLoader(loader))
    )
    .subscribe(renderAutocomplete);

  fetchAllUsers()
    .pipe(pluck('results'))
    .subscribe(renderUsersCards)
}

function renderAutocomplete(users: IUser[]) {
  const usersListHtml = users.map(item => {
    return addUserColumn(item.username);
  });

  autocompleteListEl.innerHTML = usersListHtml.join();
}

const renderUsersCards = (users: IRandomUserData[]) => {
  const titleEl   = templateEl.content.querySelector('.card-title')
  const imageEl   = templateEl.content.querySelector('.card-img-top') as HTMLImageElement
  const buttonEl  = templateEl.content.querySelector('.btn') as HTMLAnchorElement

  users.forEach((user, index) => {
    titleEl.textContent = user.name.first
    imageEl.src         = user.picture.large
    buttonEl.href       = `${window.location.origin}/profile.html?userId=${index + 1}`

    const clone = document.importNode(templateEl.content, true)
    usersRowEl.appendChild(clone)
  })
}
