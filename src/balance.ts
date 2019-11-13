import "./assets/styles/styles.scss";

import { combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import { handleUserAuthorization } from "./helpers/auth.helper";
import { createPipelineFromValue$ } from "./helpers/pipeline.helper";

document.addEventListener("DOMContentLoaded", init);

function init() {
  handleUserAuthorization();
  initBalance();
}

function initBalance() {
  const uahInput: HTMLInputElement = document.querySelector("#uah");
  const usdInput: HTMLInputElement = document.querySelector("#usd");
  const balance = document.querySelector("#balance");

  uahInput.value = "30";
  usdInput.value = "50";

  const uahInputSource$ = createPipelineFromValue$(uahInput);
  const usdInputSource$ = createPipelineFromValue$(usdInput);

  combineLatest(uahInputSource$, usdInputSource$)
    .pipe(map(([uah, usd]) => [Number(uah), Number(usd)]))
    .subscribe(([uah, usd]) => {
      balance.innerHTML = uah + usd + "";
    });
}