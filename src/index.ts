import './assets/styles/styles.scss';
import {timer, fromEvent} from 'rxjs';


document.addEventListener('click', e => {
    console.log('--e', e);
});

fromEvent(document, 'click')
    .subscribe(e => console.log('--e from rxjs', e));


import {filter, take, tap} from 'rxjs/operators';
import { multiplyBy } from './multiply-by-ten';

timer(0, 300)
    .pipe(
        take(12),
        filter(x => x > 5),
        multiplyBy(10),
        tap(x => console.log(x))
    ).subscribe()

// 6---7---8---9---10---11---|



