import "./assets/styles/styles.scss";
import "./assets/styles/autocomplete.scss";
import { fromEvent, Observable } from "rxjs";
import { ajax } from "rxjs/ajax";
import { switchMap, map, distinctUntilChanged, debounceTime, filter, pluck, tap } from "rxjs/operators";
import { IUser } from "./models/user.model";


const autocompleteListEl = document.querySelector('.autocomplete__list');
const autocompleteUrl = 'https://jsonplaceholder.typicode.com/users?username=';
const addUserColumn = (name: string) => {
    return `<li class="list-group-item">${name}</li>`
};

const fetchUserByName = (userName: string): Observable<IUser[]> =>
  ajax.getJSON(`${autocompleteUrl}${userName}`);

document.addEventListener('DOMContentLoaded', init)
function init() {
    const autocomplete: HTMLInputElement = document.querySelector("#autocomplete__input");

    const source$ = fromEvent(autocomplete, 'input');

    source$
        .pipe(
            map(e => (e.target as HTMLInputElement).value),
            // TODO: add triming
            // TODO: filter by min length of the 5
            debounceTime(100),
            distinctUntilChanged(),
            tap(userName => console.log('--next value', userName)),
            switchMap(userName => fetchUserByName(userName))
        )
        .subscribe(renderAutocomplete)
}


function renderAutocomplete(users: IUser[]) {

    const usersListHtml = users.map(item => {
        return addUserColumn(item.username);
    });

    autocompleteListEl.innerHTML = usersListHtml.join();
}


