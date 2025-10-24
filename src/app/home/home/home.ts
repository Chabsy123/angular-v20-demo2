import { JsonPipe } from '@angular/common';
import { Component,
   computed,
    inject, 
    signal, 
    effect, 
    linkedSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpClient, httpResource } from '@angular/common/http';
import { interval, map, of, Subscription } from 'rxjs';
import { sign } from 'crypto';

@Component({
  selector: 'app-home',
  imports: [JsonPipe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private http = inject(HttpClient);

  
  counter = 0;

  // signal
  count = signal(0);

  // computed
  doubleCount = computed(() => this.count() * 2);
   
  // effect
  constructor() {
    effect(() => {
      console.log(' Count updated to:', this.count());
    });

    const myValues$ = of('Hello World');
    effect((onCleanup) => {
      const effectSub: Subscription = myValues$.subscribe({
        next: (value) => {
          console.log(value);
      },
    });

    // Cleanup subscription when effect is disposed or re-run
    onCleanup(() => {
      effectSub.unsubscribe();
    });
  });
}
  increment() {
    this.count.set(this.count() + 1);
    this.counter++;
  }

  // toSignal(RxJS to signal)
  currentTime = toSignal(interval(1000).pipe(map(() => new Date().toLocaleTimeString())),
  { initialValue: 'Loading...' }
);

// linkedSignal
a = signal(10);
b = linkedSignal(() => this.a() * 2);

incrementB() {
  // get b value, increment by 1, set b(updating a accordingly)
  this.b.set(this.b() + 1);
}

decrementB() {
  this.b.set(this.b() - 1);
}

// httpResource
// signal to hold user id (could be dynamic)
userId = signal(1);

//  create the resource; request depends on userId
userResource = httpResource<any>(() => ({
  url: `https://jsonplaceholder.typicode.com/users/${this.userId()}`,
method: 'GET',

}));
// fetchData (){
//     console.log(this.userResource.value);
// }
}
