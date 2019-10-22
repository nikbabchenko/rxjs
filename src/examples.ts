import { of } from "rxjs";

of(10, 20, 30);

// ---1---2---3--|

import { from } from "rxjs";

from([10, 20, 30]);

// ---1---2---3--|

import { range } from "rxjs";

range(1, 10);

// ---1---2---3---4...---10--|

import { timer } from "rxjs";

timer(1000, 3000);

// ---0---1---2...