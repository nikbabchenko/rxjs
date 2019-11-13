import { map, startWith } from "rxjs/operators";
import { fromEvent, Observable } from "rxjs";

export function createPipelineFromValue$(element: HTMLInputElement): Observable<string> {
    return createPipelineFromEventAndValuePoint$(element, "value");
}

export function createPipelineFromInput$(element: HTMLInputElement): Observable<string> {
    return createPipelineFromEventAndValuePoint$(element, "input");
}

function createPipelineFromEventAndValuePoint$(element: HTMLInputElement, event: string): Observable<string> {
    return fromEvent(element, event).pipe(
        map((e: Event) => (e.target as HTMLInputElement).value),
        startWith(element.value)
    );
}