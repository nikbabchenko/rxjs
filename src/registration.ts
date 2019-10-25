import { number, object, string, ValidationError } from "yup";
import "./assets/styles/styles.scss";

document.addEventListener("DOMContentLoaded", init);

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

  // Example of validation, you have to create the same shape on change of validation fields
  registrationValidatoinShema
    .validate(
      {
        username: "wkdow",
        email: "email@gmail.com",
        password: "",
        age: 2
      },
      { abortEarly: false }
    )
    .then(validData => {
      console.log("--handle valid data", validData);
      formErrorsEl.innerHTML = "";
    })
    .catch((validationError: ValidationError) => {
      console.log("--errors", validationError);
      const erorrsList = validationError.errors.map(
        error => `<div class="alert alert-danger" role="alert">${error}</div>`
      );
      formErrorsEl.innerHTML = erorrsList.join("");
    });
}
