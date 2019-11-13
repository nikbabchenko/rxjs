import { number, object, string, ValidationError } from "yup";
import { map, skip, tap } from "rxjs/operators";
import { combineLatest } from "rxjs";
import { createPipelineFromInput$ } from "./helpers/pipeline.helper";
import { createDefaultState, FormError, RegistrationForm, RegistrationFormState } from "./models/form.registration";
import "./assets/styles/styles.scss";

const formErrorsEl = document.querySelector(".form-errors");
const usernameElement = document.querySelector("#username") as HTMLInputElement;
const emailElement = document.querySelector("#email") as HTMLInputElement;
const passwordElement = document.querySelector("#password") as HTMLInputElement;
const ageElement = document.querySelector("#age") as HTMLInputElement;

document.addEventListener("DOMContentLoaded", init);

const registrationValidationSchema = object().shape({
  username: string().required("Username is required").min(4, "Should be more than 4 symbols"),
  email: string().required("Email is required").email("Email is required"),
  password: string().required("Password is required").min(4, "Password should be more than 4 symbols"),
  age: number().required("Number is required").min(0)
});
const formData: RegistrationForm = {
  username: usernameElement.value,
  email: emailElement.value,
  password: passwordElement.value,
  age: Number(ageElement.value),
}
const formState: RegistrationFormState = createDefaultState();

function init() {
  combineLatest(
    createPipelineFromInput$(usernameElement),
    createPipelineFromInput$(emailElement),
    createPipelineFromInput$(passwordElement),
    createPipelineFromInput$(ageElement),
  ).pipe(
    skip(1),
    tap(([username, email, password, age]): void => {
      formData.username = username;
      formData.email = email;
      formData.password = password;

      let ageNumber = parseInt(age);
      if (isNaN(ageNumber)) {
        formData.age = undefined;
        return;
      }

      formData.age = ageNumber;
    }),
    map(_ => registrationValidationSchema.validate(formData, { abortEarly: false })),
    tap(result => result
      .then((_: any): void => {
        formState.isValid = true;
        formState.errors = [];
      })
      .catch((validationError: ValidationError): void => {
        formState.isValid = false;
        formState.errors = validationError.errors.map((error: string): FormError => {
          return { error };
        });
      }))
  ).subscribe(_ => formErrorsEl.innerHTML = formState.createSummaryHtml());
}
