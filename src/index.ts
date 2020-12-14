import { AosOptions } from 'aos'
import aos from '@dcasia/aos'
import AOS from './AOS.vue'
import { App } from 'vue'
import AOSAnchor from './AOSAnchor'

export default {

    async install(app: App, options: AosOptions) {

        app.component('AOS', AOS)
        app.directive('aos-anchor', AOSAnchor)
        aos.init(options)

        app.config.globalProperties.$aos = {
            ...aos,
            options
        }

    }

}
