# Vue AOS

Implementing animation on scroll based on Vue 3

## How to use

1. Install it from NPM
```Command line
npm i @dcasia/vue-aos --save
```

2. Import and register it in your Vue entry file
```js
// main.ts

import { createApp } from 'vue'
import App from './App.vue'
import VueAOS from '@dcasia/vue-aos'
import '@dcasia/vue-aos/dist/vue-aos.css'

createApp(App)
    .use(VueAOS, {
        disable: false,
        isBrowser: true
        anchorPlacement: 'center-bottom',
        once: true,
        duration: 1000,
        easing: 'ease-out',
        offset: 0,
        startEvent: 'init-aos',
        disableMutationObserver: false
    })
    .mount('#app')
```

3. Feel free to use it in your Vue template
```Vue
// app.vue

<AOS>
    <div>
        I'll be animated when you see me in the viewport
    </div>
</AOS>
```


## Options

Updating...

## API

...