module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: [
        'plugin:vue/vue3-essential',
        '@vue/standard',
        '@vue/typescript/recommended'
    ],
    parserOptions: {
        ecmaVersion: 2020
    },
    rules: {
        'indent': [ 'error', 4 ],
        'vue/script-indent': [
            'error', 4, {
                'baseIndent': 1
            }
        ],
        'array-bracket-spacing': [
            'error', 'always'
        ],
        'vue/array-bracket-spacing': [ 'error', 'always' ],
        'vue/key-spacing': [
            'error', {
                'afterColon': true
            }
        ],
        'object-curly-spacing': [
            'error', 'always'
        ],
        'padded-blocks': [
            'error', 'always'
        ],
        'template-curly-spacing': [
            'error', 'always'
        ],
        'space-before-function-paren': [
            'error', 'never'
        ],
        'vue/object-curly-spacing': [ 'error', 'always' ],
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/ban-ts-comment': 0,
        '@typescript-eslint/explicit-module-boundary-types': 0
    },
    'overrides': [
        {
            'files': [ '*.vue' ],
            'rules': {
                'indent': 'off'
            }
        }
    ]
}
