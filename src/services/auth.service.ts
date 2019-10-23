import { BehaviorSubject } from "rxjs";

const authorizationToken = "$$$user";

class AuthService {
    private userInLocalStorage = !!localStorage.getItem(authorizationToken);
    public isAuthorized$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.userInLocalStorage);

    set userToken(token: string) {
        if (!token) return;
        localStorage.setItem(authorizationToken, token);
    }

    get userToken() {
        return localStorage.getItem(authorizationToken);
    }

    get isAuthorized(): boolean {
        return this.isAuthorized$.getValue();
    }

    logout() {
        localStorage.removeItem(authorizationToken);
    }
}

export default new AuthService();
