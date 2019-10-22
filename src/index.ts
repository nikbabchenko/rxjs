import "./assets/styles/styles.scss";
import { Observable, of } from "rxjs";
import { ajax } from "rxjs/ajax";
import { switchMap, catchError, mergeMap, zip } from "rxjs/operators";

const userIds$: Observable<number> = new Observable(observer => {
  observer.next(1);
  setTimeout(() => {
    observer.next(2);
  }, 50);

  setTimeout(() => {
    observer.next(3);
  }, 50);

  setTimeout(() => {
    observer.next(4);
  }, 300);

  setTimeout(() => {
    observer.next(5);
  }, 2000);
});

const fetchUser = (userId: number): Observable<any> =>
  ajax.getJSON(`https://jsonplaceholder.typicode.com/users/${userId}`);

userIds$
  .pipe(
    switchMap(userId => fetchUser(userId)),
    catchError(err => {
      console.log("--error occured", err);
      return of(err);
    })
  )
  .subscribe(data => console.log(data));

// userIds$
// .pipe(
//   mergeMap(userId => fetchUser(userId)),
//   catchError(err => {
//     console.log("--error occured", err);
//     return of(err);
//   })
// )
// .subscribe(data => console.log(data));