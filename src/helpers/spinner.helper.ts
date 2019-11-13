const spinnerElement = document.querySelector(".fullscreen-loader");

export function showHideLoader(isShow: boolean): void {
    if (!!isShow) {
        spinnerElement.classList.remove("is-hidden");
    } else {
        spinnerElement.classList.add("is-hidden");
    }
}