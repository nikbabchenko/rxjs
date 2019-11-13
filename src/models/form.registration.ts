export interface RegistrationForm {
    username: string;
    email: string;
    password: string;
    age: number;
}

export interface RegistrationFormState {
    isValid: boolean;
    errors: FormError[];

    createSummaryHtml(): string;
}

class DefaultRegistrationFormState implements RegistrationFormState {
    constructor(public isValid: boolean, public errors: FormError[]) { }

    public createSummaryHtml(): string {
        return this.errors.map((item: FormError): string => `<div class="alert alert-danger" role="alert">${item.error}</div>`).join("");
    }
}

export function createDefaultState(): RegistrationFormState {
    return new DefaultRegistrationFormState(false, []);
}

export interface FormError {
    error: string;
}