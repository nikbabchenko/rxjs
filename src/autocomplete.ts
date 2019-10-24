import { fromEvent, Observable } from "rxjs";
import { ajax } from "rxjs/ajax";
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from "rxjs/operators";
import "./assets/styles/autocomplete.scss";
import "./assets/styles/styles.scss";
import { IUser } from "./models/user.model";

const autocompleteListEl = document.querySelector(".autocomplete__list");
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

document.addEventListener("DOMContentLoaded", init);

function init() {
  const autocomplete: HTMLInputElement = document.querySelector(
    "#autocomplete__input"
  );
  const source$ = fromEvent(autocomplete, "input");

  // LOADER exists in Markup, just toggle class 'is-hidden'
  source$
    .pipe(
      map(e => (e.target as HTMLInputElement).value),
      // TODO: add triming
      // TODO: filter by min length of the 4
      // TODO: show Loader
      debounceTime(100),
      distinctUntilChanged(),
      tap(userName => console.log("--next value", userName)),
      switchMap(userName => fetchUserByName(userName))
      // TODO: add delay 300ms
      // TODO: add finalize operator to hide the loader
    )
    .subscribe(renderAutocomplete);
}

function renderAutocomplete(users: IUser[]) {
  const usersListHtml = users.map(item => {
    return addUserColumn(item.username);
  });

  autocompleteListEl.innerHTML = usersListHtml.join();
}
