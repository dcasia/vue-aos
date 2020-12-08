import { AosOptions } from 'aos'
import aos from '@dcasia/aos'
import AOS from './AOS.vue'
import { App } from 'vue'
import AOSAnchor from './AOSAnchor'

// let aosOption: AosOptions

// export const mixin = {

//     async beforeMount() {

//         const aos = await import('aos')

//         aos.init(aosOption)

//         Vue.prototype.$aos = aos

//     }

// }

export default {

    async install(app: App, options: AosOptions) {

        app.component('AOS', AOS)
        app.directive('aos-anchor', AOSAnchor)

        // app.directive('aos-anchor', AOSAnchor)

        // const aos = await import('aos')

        aos.init(options)

        app.config.globalProperties.$aos = aos

    }

}
