export function cleanEmptyProperty(object: any) {

    const result: any = {}

    Object.entries(object).forEach(([ key, value ]) => {

        if (value !== null) {

            result[key] = value

        }

    })

    return result

}

export const isBrowserMode: boolean = typeof window === 'object'

export function generateId() {

    return Math.random().toString(36).substr(2, 6)

}
