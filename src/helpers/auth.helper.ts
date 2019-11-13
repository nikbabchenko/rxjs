import authService from './../services/auth.service';
import { redirectToMain } from "./redirection.helper";

export function handleUserAuthorization(): void {
    if (!authService.isAuthorized) {
        redirectToMain();
    }
}
