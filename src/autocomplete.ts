import { fromEvent, Observable, of } from "rxjs";
import { ajax } from "rxjs/ajax";
import { debounceTime, delay, distinctUntilChanged, filter, map, pluck, switchMap, tap, mergeMap } from "rxjs/operators";
import "./assets/styles/autocomplete.scss";
import "./assets/styles/styles.scss";
import { IUser } from "./models/user.model";
import { UserResponse, Result as UserResult } from "./models/user.response";
import { showHideLoader } from "./helpers/spinner.helper";

const autocompleteListEl = document.querySelector(".autocomplete__list");
const userTemplateContent = (document.querySelector("#user-card") as HTMLTemplateElement).content;

const autocompleteUrl = "https://jsonplaceholder.typicode.com/users?username=";
const usersApiUrl = "https://randomuser.me/api/?results=10";

const addUserColumn = (name: string) => {
  return `<li class="list-group-item">${name}</li>`;
};

const fetchUserByName = (userName: string): Observable<IUser[]> =>
  ajax.getJSON(`${autocompleteUrl}${userName}`);

const fetchUsers = (): Observable<UserResponse[]> =>
  ajax.getJSON(`${usersApiUrl}`);

document.addEventListener("DOMContentLoaded", init);

function init() {
  initAutocomplete();
  initUserRender();
}

function initAutocomplete() {
  const autocomplete: HTMLInputElement = document.querySelector(
    "#autocomplete__input"
  );
  const source$ = fromEvent(autocomplete, "input");

  source$
    .pipe(
      map(e => (e.target as HTMLInputElement).value.trim()),
      filter(x => x.length >= 3),
      debounceTime(1000),
      distinctUntilChanged(),
      tap(_ => showHideLoader(true)),
      switchMap(userName => fetchUserByName(userName)),
      delay(300),
      tap(_ => showHideLoader(false)),
    )
    .subscribe(renderAutocomplete);
}

function renderAutocomplete(users: IUser[]) {
  const usersListHtml = users.map(item => {
    return addUserColumn(item.username);
  });

  autocompleteListEl.innerHTML = usersListHtml.join();
}

function initUserRender() {
  of(1)
    .pipe(
      switchMap(_ => fetchUsers()),
      pluck<UserResponse[], UserResult[]>('results'),
      mergeMap(data => data),
      map(createUserTemplate),
    )
    .subscribe(userTemplate => document.querySelector(".users-row").appendChild(userTemplate));
}

function createUserTemplate(item: UserResult, index: number): DocumentFragment {
  const templateClone = document.importNode(userTemplateContent, true);

  const image = templateClone.querySelector(".user-card__image") as HTMLImageElement;
  image.src = item.picture.large;

  const button = templateClone.querySelector(".btn") as HTMLAnchorElement;
  button.href = `${window.location.origin}/profile.html?userId=${index + 1}`;

  const title = templateClone.querySelector(".user-card__title") as HTMLHeadingElement;
  title.textContent = `${item.name.title} ${item.name.first} ${item.name.last}`

  return templateClone;
}
