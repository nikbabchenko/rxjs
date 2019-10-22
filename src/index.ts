import "./assets/styles/styles.scss";
import { BehaviorSubject, Observable, fromEvent } from "rxjs";

document.addEventListener("DOMContentLoaded", init);

function init() {
  const authorizationToken = "$$$user";
  const loginForm = document.querySelector(".login-form");
  const profile = document.querySelector(".profile");
  const logOutButton = document.querySelector(".logout");
  const user = document.querySelector("#user");
  const email: HTMLInputElement = document.querySelector("#email");
  const userNavBar = document.querySelector("#navbarSupportedContent");

  initAuthService();
  initFormEvents();

  function initFormEvents() {
    fromEvent(loginForm, "submit").subscribe(ev => {
      ev.preventDefault();
      setAuthState(true);
    });

    fromEvent(logOutButton, "click").subscribe(ev => {
      setAuthState(false);
    });
  }

  function initAuthService() {
    const isAuthorized = !!localStorage.getItem(authorizationToken);
    const isAuthorized$: Observable<boolean> = new BehaviorSubject<boolean>(isAuthorized);

    isAuthorized$.subscribe(isAuthorized => {
      setAuthState(isAuthorized);
    });
  }

  function setAuthState(isAuthorized: boolean) {
    if (isAuthorized) {
      if (!localStorage.getItem(authorizationToken)) {
        localStorage.setItem(authorizationToken, email.value);
      }
      showProfile();
      (user as HTMLElement).innerText = localStorage.getItem(
        authorizationToken
      );
    } else {
      showLoginForm();
      localStorage.removeItem(authorizationToken);
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
