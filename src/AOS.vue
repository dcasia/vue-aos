<script lang="ts">

    import kebabCase from 'lodash.kebabcase'
    import Vue, { defineComponent, h, PropType, VNode, onUnmounted } from 'vue'
    import { AnchorPlacement } from './AOSAnchorPlacement'
    import { cleanEmptyProperty, isBrowserMode } from './utils'

    const customProps = [ 'order', 'step', 'isGroup', 'tag' ]
    const defaultProps: Record<string, string | number> = {}
    const aosNativeProps = [
        'type',
        'easing',
        'delay',
        'duration',
        'offset',
        'id',
        'disableAnimation',
        'anchor',
        'anchorPlacement'
    ]
    
    let aosEventNames = [] as (string | number)[]

    function initAOSEventTable() {

        aosEventNames = aosEventNames || []

    }

    function checkAOSEvent(id: string | number) {

        return aosEventNames.includes(id)

    }

    function registerAOSEvent(id: string | number) {

        return aosEventNames.push(id)

    }

    function cancelAOSEvent(id: string | number) {

        return aosEventNames.splice(aosEventNames.indexOf(id), 1)

    }

    export default defineComponent({
        name: 'AOS',
        props: {
            type: { default: 'fade-up', type: String },
            easing: { default: null, type: String },
            duration: { default: null, type: [ String, Number ] },
            offset: { default: null, type: [ String, Number ] },
            delay: { default: null, type: [ String, Number ] },
            anchor: { default: null, type: String },
            anchorPlacement: { default: null, type: String as PropType<keyof AnchorPlacement> },
            order: { default: 1, type: [ String, Number ] },
            step: { default: 300, type: [ String, Number ] },
            isGroup: { default: false, type: Boolean },
            tag: { default: 'div', type: String },
            disableAnimation: { default: false, type: Boolean }
        },
        setup(props, { attrs, slots, emit }) {

            props = cleanEmptyProperty(props)

            const extraCustomProps: Record<string, string | number> = {}

            if (attrs.onIn || attrs.onOut) {

                const id = +new Date()

                extraCustomProps.id = id

                const DOMListeners = cleanEmptyProperty({
                    in: attrs.onIn,
                    out: attrs.onOut
                })

                if (isBrowserMode) {

                    initAOSEventTable()

                    if (!checkAOSEvent(id!)) {

                        for (const event in DOMListeners) {

                            document.addEventListener(`aos:${ event }:${ id }`, DOMListeners[event])

                            onUnmounted(() => {

                                document.removeEventListener(`aos:${ event }:${ id }`, DOMListeners[event])
                                cancelAOSEvent(id!)

                            })

                        }

                        registerAOSEvent(id!)

                    }

                }

            }

            const customProps = Object.assign({}, props, extraCustomProps)
            const allPropsForChildren = Object.assign(mergeProps(defaultProps, customProps), attrs)

            if (props.isGroup) {

                return () => h(props.tag, allPropsForChildren, slots)

            } else {

                return () => {

                    const slotsChildren: VNode[] = (slots?.default && slots.default()) || []

                    for (const vnode of slotsChildren) {

                        vnode.props = vnode.props || {}

                        Object.assign(vnode.props, allPropsForChildren)

                    }

                    return slotsChildren

                }

            }

        }

    })

    function mergeProps(defaultValue: Record<string, string | number>, customValue: Record<string, string | number | boolean>) {

        const custom: Record<string, string | number | boolean> = {}

        for (const key in customValue) {

            let internalKey: string

            if (aosNativeProps.includes(key)) {

                if (key === 'type') {

                    internalKey = 'data-aos'

                } else {

                    internalKey = `data-aos-${ kebabCase(key) }`

                }

                if (key === 'anchor') {

                    customValue[key] = `[data-aos-trigger=${ customValue[key] }]`

                }

            } else if (key.includes('data-aos')) {

                internalKey = key

            } else {

                if (key === 'order') {

                    internalKey = 'data-aos-delay'

                    const delay = customValue.delay || customValue['data-aos-delay'] || defaultValue['data-aos-delay'] || 0

                    customValue[key] = `${ +delay + (Math.max((+customValue.order - 1), 0) * +customValue.step) }`

                } else if (customProps.includes(key)) {

                    continue

                } else {

                    internalKey = key

                }

            }

            if (!(internalKey === 'data-aos-delay' && key !== 'order' && Object.hasOwnProperty.call(customValue, 'order'))) {

                custom[internalKey] = customValue[key]

            }

        }

        return Object.assign({}, defaultValue, custom)

    }

</script>

<style lang="scss">
    $aos-distance: 50px;

    @import '~@dcasia/aos/src/sass/aos';

    $aos-easing: (
        ease-out-custom: cubic-bezier(0.05, 0.95, 0.37, 0.95)
    );

    $aos-type: (
        fade-up-small: translate3d(0, 60px, 0)
    );

    [data-aos] {

        @each $key, $val in $aos-easing {
            body[data-aos-easing="#{$key}"] &,
            &[data-aos-easing="#{$key}"] {

                transition-timing-function: $val;

            }

        }

        @each $key, $val in $aos-type {

            body[data-aos="#{$key}"] &,
            [data-aos="#{$key}"] {

                transform: $val;

            }

        }

    }

    html:not(.no-js) {

        @each $key, $val in $aos-type {

            [data-aos="#{$key}"] {

                transform: $val;

            }

        }

    }

</style>
