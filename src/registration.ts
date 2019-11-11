import { fromEvent, combineLatest } from "rxjs";
import { map, startWith } from 'rxjs/operators'
import { number, object, string, ValidationError } from "yup";
import "./assets/styles/styles.scss";

document.addEventListener("DOMContentLoaded", init);

const mapToTarget = map((e: Event) => (e.target as HTMLInputElement).value);

const createObservables = source =>
  Object.entries(source).map(([key, value]) => {
    const input = document.querySelector(`#${key}`)
    return fromEvent(input, 'input')
      .pipe(
        mapToTarget,
        startWith(value),
        map(value => ({ [key]: value }))
      )
  })

const mapToData = (values) => values.reduce((acc, val) => ({ ...acc, ...val }), {})

function init() {
  const registrationForm = {
    username: "",
    password: "",
    email: "",
    age: ""
  };

  // TODO:  On change of input fields show validation errors, form state - valid/invalid and formData
  // TODO: create fromEvent listeners for username password etc., use mapToTarget, startWith and map to value => ({ [key]: value })
  // TODO: then track form changes (like in balance.ts) and validate form, show errors, current form data on UI
  // TIPS: you can use Object.keys, fromEvent, map, startWith, combineLatest, js reduce operator etc.

  const formErrorsEl = document.querySelector(".form-errors");
  const isValidFormEl = document.querySelector('.is-valid-form')
  const formDataEl = document.querySelector('.form-data')
  const formEl = document.querySelector('#registration-form')
  const registrationValidatoinShema = object().shape({
    username: string()
      .required()
      .min(4, "Should be more than 4 symbols"),
    email: string()
      .required()
      .email("Email is required"),
    password: string()
      .required()
      .min(4, "Password should be more than 4 symbols"),
    age: number().required("Number is required")
  });

  const onFormChange = (data) => {
    formDataEl.innerHTML = JSON.stringify(data)
    registrationValidatoinShema
      .validate(data, { abortEarly: false })
      .then(validData => {
        console.log("--handle valid data", validData);
        formErrorsEl.innerHTML = "";
        isValidFormEl.innerHTML = "true"
      })
      .catch((validationError: ValidationError) => {
        console.log("--errors", validationError);
        const erorrsList = validationError.errors.map(
          error => `<div class="alert alert-danger" role="alert">${error}</div>`
        );
        formErrorsEl.innerHTML = erorrsList.join("");
        isValidFormEl.innerHTML = "false"
      });
  }

  const observables = createObservables(registrationForm)

  combineLatest(observables)
    .pipe(map(mapToData))
    .subscribe(onFormChange)

  fromEvent(formEl, 'submit')
    .subscribe(e => e.preventDefault())
}
