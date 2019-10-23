import "./assets/styles/styles.scss";
import { fromEvent } from "rxjs";
import authService from './services/auth.service';

document.addEventListener("DOMContentLoaded", init);

function init() {
  const loginForm = document.querySelector(".login-form");
  const profile = document.querySelector(".profile");
  const logOutButton = document.querySelector(".logout");
  const user = document.querySelector("#user");
  const email: HTMLInputElement = document.querySelector("#email");
  const userNavBar = document.querySelector("#navbarSupportedContent");
  const isAuthorized$ = authService.isAuthorized$;


  isAuthorized$.subscribe(isAuthorized => {
    setAuthState(isAuthorized);
  });

  initFormEvents();

  function initFormEvents() {
    fromEvent(loginForm, "submit").subscribe(ev => {
      ev.preventDefault();
      isAuthorized$.next(true);
    });

    fromEvent(logOutButton, "click").subscribe(ev => {
      isAuthorized$.next(false);
    });
  }

  function setAuthState(isAuthorized: boolean) {
    if (isAuthorized) {
      authService.userToken = email.value;
      showProfile();
      (user as HTMLElement).innerText = authService.userToken;
    } else {
      showLoginForm();
      authService.logout();
    }
  }

  function showProfile() {
    loginForm.classList.add("is-hidden");
    profile.classList.add("is-active");
    userNavBar.classList.remove("is-hidden");
  }

  function showLoginForm() {
    loginForm.classList.remove("is-hidden");
    profile.classList.remove("is-active");
    userNavBar.classList.add("is-hidden");
  }
}
