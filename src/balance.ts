import "./assets/styles/styles.scss";

import { fromEvent, combineLatest } from "rxjs";
import { map, startWith } from "rxjs/operators";

document.addEventListener("DOMContentLoaded", init);

function init() {
  const uahInput: HTMLInputElement = document.querySelector("#uah");
  const usdInput: HTMLInputElement = document.querySelector("#usd");
  const balance = document.querySelector("#balance");

  uahInput.value = "30";
  usdInput.value = "50";

  const mapToTarget = map((e: Event) => (e.target as HTMLInputElement).value);

  const uahInputSource$ = fromEvent(uahInput, "input").pipe(
    mapToTarget,
    startWith(uahInput.value)
  );
  const usdInputSource$ = fromEvent(usdInput, "input").pipe(
    mapToTarget,
    startWith(usdInput.value)
  );

  combineLatest(uahInputSource$, usdInputSource$)
    .pipe(map(([uah, usd]) => [Number(uah), Number(usd)]))
    .subscribe(([uah, usd]) => {
      balance.innerHTML = uah + usd + "";
    });
}
