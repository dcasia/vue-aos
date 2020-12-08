import { Directive } from 'vue'

const directive: Directive = function(el, binding) {

    el.dataset.aosTrigger = binding.arg

}

export default directive
