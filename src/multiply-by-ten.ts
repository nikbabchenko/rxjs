import { Observable } from 'rxjs';

export function multiplyBy(number: number) {
  return (observable) => new Observable(observer => {
    const subscription = observable.subscribe({
      next(value) {
        observer.next(number * value);
      },
      error(err) {
        observer.error(err);
      },
      complete() {
        observer.complete();
      }
    });

    return subscription;
  });
}