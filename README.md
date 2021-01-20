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
        isBrowser: true,
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

### Global Options

| Name | Type | Functionality |
|------|------|---------------|
| disable | Boolean | Whether to disable the effect globally |
| isBrowser | Boolean | Whether the current environment is a browser environment |
| anchorPlacement | …. |               |
| once | Boolean | Whether only have elements fade in and without fading out |
| duration | Number | Animation duration |
| easing | … | Animation easing type | 
| offset | Number | Distance from the trigger point, can be negative |
| startEvent | String | Name of the event dispatched on the document, that AOS should initialize on |
| disableMutationObserver | Boolean | Disables automatic mutations' detections |
| … | … | … |

### Component Options
Options for single instance

| Name | Type | Functionality |
| ------ | ------ | ------ |
| type | String | Animation type |
| easing | String |  | Animation easing type | 
| duration | Number \| String | Animation duration |
| offset | Number \| String | Distance from the trigger point, can be negative |
| delay | Number \| String | Animation delay | 
| anchor | String | The name of the specified trigger anchor point |
| anchorPlacement | … | The position of the trigger point, taken from several key positions of the element and viewport |
| order | Number \| String | The sequential animation order, it basically automatically calculate delay for current instance |
| step | Number \| String | The Interval delay between different order |
| isGroup | Boolean | Whether to create a container element |
| tag | String | The tag name of the container |
| disableAnimation | Boolean | Disable animation on current instance but still can be triggered and emit key events |
| once | Boolean | Whether only have elements fade in and without fading out |
| persistentAttributes | Boolean | Whether to retain aos custom attributes and class names after animation is done |
| hiddenOnServer | Boolean | Whether to hide itself on server side rendering to make it hidden at the very first beginning when it’s showing on client side |  



## API

...