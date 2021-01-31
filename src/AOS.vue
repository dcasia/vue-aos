<script lang="ts">

    import kebabCase from 'lodash.kebabcase'
    import { defineComponent, h, PropType, VNode, onUnmounted, ref, getCurrentInstance } from 'vue'
    import { AnchorPlacement } from './AOSAnchorPlacement'
    import { cleanEmptyProperty, generateId, isBrowserMode as _isBrowser } from './utils'

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
        'anchorPlacement',
        'once'
    ]
    const customProps = [
        'order',
        'step',
        'isGroup',
        'tag',
        'persistentAttributes',
        'hiddenOnServer'
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

    const hasInitialized = ref(false)

    export default defineComponent({
        name: 'AOS',
        props: {
            type: { type: String, default: 'fade-up' },
            easing: { type: String, default: null },
            duration: { type: [ String, Number ], default: null },
            offset: { type: [ String, Number ], default: null },
            delay: { type: [ String, Number ], default: null },
            anchor: { type: String, default: null },
            anchorPlacement: { type: String as PropType<keyof AnchorPlacement>, default: null },
            order: { type: [ String, Number ], default: 1 },
            step: { type: [ String, Number ], default: 300 },
            isGroup: { type: Boolean, default: false },
            tag: { type: String, default: 'div' },
            disableAnimation: { type: Boolean, default: false },
            once: { type: Boolean, default: true },
            persistentAttributes: { type: Boolean, default: true },
            hiddenOnServer: { type: Boolean, default: true }
        },
        emits: [ 'in', 'out', 'after-in', 'after-out' ],
        setup(props, { slots, emit }) {

            const internalInstance = getCurrentInstance()
            let { startEvent: aosInitListenerName } = internalInstance?.appContext.config.globalProperties.$aos?.options || {}
            let { isBrowser } = internalInstance?.appContext.config.globalProperties.$aos?.options || {}

            aosInitListenerName ??= 'DOMContentLoaded'
            isBrowser ??= true

            if (aosInitListenerName && !hasInitialized.value) {

                document.addEventListener(
                    aosInitListenerName,
                    () => {

                        hasInitialized.value = true

                    },
                    { once: true }
                )

            }

            props = cleanEmptyProperty(props)

            const extraCustomProps: Record<string, string | number> = {}
            const hasEmitedAfterIn = ref(false)
            const alreadyIn = ref(false)
            const id = generateId()

            extraCustomProps.id = id

            if (_isBrowser || isBrowser) {

                initAOSEventTable()

                if (!checkAOSEvent(id)) {

                    const DOMListeners: Record<string, (e?: Event) => void> = {
                        in: () => {

                            alreadyIn.value = true
                            emit('in')

                        }
                    }

                    if (!props.once) {

                        DOMListeners.out = () => {

                            alreadyIn.value = false
                            emit('out')

                        }

                    }

                    for (const event in DOMListeners) {

                        document.addEventListener(`aos:${ event }:${ id }`, DOMListeners[event])

                        onUnmounted(() => {

                            document.removeEventListener(`aos:${ event }:${ id }`, DOMListeners[event])
                            cancelAOSEvent(id)

                        })

                    }

                    registerAOSEvent(id)

                }

            }

            const customProps = Object.assign({}, props, extraCustomProps)
            const allPropsForChildren = mergeProps(defaultProps, customProps)
            const onTransitionend = (event: Event) => {

                if (event.target === event.currentTarget && alreadyIn.value && !hasEmitedAfterIn.value) {

                    emit('after-in')
                    hasEmitedAfterIn.value = true

                }

            }

            const _onVnodeUpdatedByAOS = (vnode: VNode, cb?: () => void) => {

                if (!props.persistentAttributes && props.once && hasEmitedAfterIn.value) {

                    /**
                     * in some cases we can't find 'el' property in vnode object directly
                     */

                    const el = vnode.el || (vnode.children && (vnode.children as any)[0].el.parentElement)

                    if (!el) return

                    el.removeAttribute('data-aos')

                    aosNativeProps.forEach((attrsName) => {

                        el.removeAttribute(`data-aos-${ kebabCase(attrsName) }`)

                    })

                    cb?.()

                }

            }

            if (props.isGroup) {

                let aosAttrsRemoved = false

                return () => {

                    const vnode = h(
                        props.tag,
                        {
                            ...allPropsForChildren,
                            onTransitionend,
                            class: [
                                { 'aos-init': (!props.once && hasInitialized.value) || (props.once && hasInitialized.value && (!hasEmitedAfterIn.value || props.persistentAttributes)) },
                                { 'aos-animate': (!props.once && alreadyIn.value) || (props.once && alreadyIn.value && (!hasEmitedAfterIn.value || props.persistentAttributes)) },
                                { 'aos-hidden': props.hiddenOnServer && (!_isBrowser || !isBrowser) }
                            ]
                        },
                        slots
                    )

                    mergeLifeHooks(vnode, 'onVnodeUpdated', function onVnodeUpdatedByAOS() {

                        if (!aosAttrsRemoved) {

                            _onVnodeUpdatedByAOS(vnode, () => {

                                aosAttrsRemoved = true

                            })

                        }

                    })

                    return vnode

                }

            } else {

                return () => {

                    const slotsChildren: VNode[] = slots?.default?.() || []

                    slotsChildren.forEach((vnode) => {

                        vnode.props = vnode.props || {}

                        mergeLifeHooks(vnode, 'onVnodeUpdated', function onVnodeUpdatedByAOS() {

                            _onVnodeUpdatedByAOS(vnode)

                        })

                        Object.assign(
                            vnode.props,
                            allPropsForChildren,
                            { onTransitionend }
                        )

                        vnode.props.class = vnode.props.class || ''

                        if ((!props.once && hasInitialized.value) || (props.once && hasInitialized.value && (!hasEmitedAfterIn.value || props.persistentAttributes))) {

                            vnode.props.class += ' ' + 'aos-init'

                        }

                        if ((!props.once && alreadyIn.value) || (props.once && alreadyIn.value && (!hasEmitedAfterIn.value || props.persistentAttributes))) {

                            vnode.props.class += ' ' + 'aos-animate'

                        }

                        if (props.hiddenOnServer && (!_isBrowser || !isBrowser)) {

                            vnode.props.class += ' ' + 'aos-hidden'

                        }

                    })

                    return slotsChildren

                }

            }

        }

    })

    function mergeLifeHooks(vnode: VNode, lifehook: string, cb: () => void) {

        if (vnode.props && vnode.props[lifehook]) {

            if (Array.isArray(vnode.props[lifehook])) {

                if (!vnode.props[lifehook].some((hook: () => void) => hook.name === cb.name)) {

                    vnode.props[lifehook].push(cb)

                }

            } else {

                if (vnode.props[lifehook].name !== cb.name) {

                    vnode.props[lifehook] = [
                        vnode.props[lifehook],
                        cb
                    ]

                }

            }

        } else {

            vnode.props![lifehook] = cb

        }

    }

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

        will-change: transform, opacity;

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

    .aos-hidden {

        opacity: 0;

    }

</style>
