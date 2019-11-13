import { IUser } from "./models/user.model";
import { Observable, of } from "rxjs";
import { ajax } from "rxjs/ajax";
import { switchMap, tap } from "rxjs/operators";
import { showHideLoader } from "./helpers/spinner.helper";
import { handleUserAuthorization } from "./helpers/auth.helper";
import { redirectToMain } from "./helpers/redirection.helper";

import "./assets/styles/styles.scss";

document.addEventListener("DOMContentLoaded", init);

// TODO: fix navigation for logged user

const userInfoUrl = "https://jsonplaceholder.typicode.com/users/";

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

const fetchUser = (id: number): Observable<IUser> =>
  ajax.getJSON(`${userInfoUrl}${id}`);

const renderUser = (user: IUser): void => {
  const profileElement = document.querySelector(".container .row .col-md-8") as HTMLElement;

  const usernameElement = profileElement.querySelector("div h2");
  usernameElement.textContent = usernameElement.textContent.replace("{{ name }}", user.name);

  const addressElement = profileElement.querySelector("div address");
  addressElement.innerHTML = addressElement.innerHTML.replace("{{ address.street }}", user.address.street);
  addressElement.innerHTML = addressElement.innerHTML.replace("{{ address.city }}", user.address.city);

  const companyElement = profileElement.querySelector(".company-name");
  companyElement.textContent = companyElement.textContent.replace("{{ company.name }}", user.company.name);

  const zipcodeElement = profileElement.querySelector(".mt-5 div strong");
  zipcodeElement.textContent = zipcodeElement.textContent.replace("{{ address.zipcode }}", user.address.zipcode);

  const contentElement = profileElement.querySelector("#myTabContent div dl");

  const websiteElement = contentElement.querySelector(".user-website");
  websiteElement.textContent = websiteElement.textContent.replace("{{ website }}", user.website);

  const companyContactElement = profileElement.querySelector(".user-company");
  companyContactElement.textContent = companyContactElement.textContent
    .replace("{{ company.name", user.company.name)
    .replace("company.catchPhrase }}", user.company.catchPhrase);
}

const render = (name: string): void => {
  of(1)
    .pipe(
      switchMap(fetchUser),
      tap(renderUser),
    )
    .subscribe(_ => showHideLoader(false));
}

function init() {
  handleUserAuthorization();

  let id = getQueryParam("userId");
  if (!id) {
    redirectToMain();
  } else {
    render(id);
  }
}
