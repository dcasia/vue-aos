module.exports = {
    ignoreFiles: [ 'node_modules/**', 'dist/**' ],
    extends: [
        'stylelint-config-recommended-scss'
        // "stylelint-config-rational-order"
    ],
    rules: {
        'scss/at-rule-no-unknown': [
            true,
            {
                ignoreAtRules: [
                    'tailwind',
                    'apply',
                    'variants',
                    'responsive',
                    'screen'
                ]
            }
        ],
        indentation: 4,
        'max-empty-lines': 2,
        'declaration-block-trailing-semicolon': null,
        'no-descending-specificity': null,
        'block-closing-brace-empty-line-before': 'always-multi-line',
        'rule-empty-line-before': 'always',
        'at-rule-empty-line-before': [
            'always', {
                except: [
                    'blockless-after-same-name-blockless'
                ],
                ignore: [
                    'blockless-after-same-name-blockless'
                ]
            }
        ],
        'declaration-empty-line-before': [
            'always', {
                except: [
                    'after-declaration'
                ]
            }
        ],
        'block-no-empty': null,
        'color-no-invalid-hex': true,
        'property-no-unknown': null,
        'selector-pseudo-class-no-unknown': [
            true, {
                ignorePseudoClasses: [
                    'export'
                ]
            }
        ],
        'comment-empty-line-before': [
            'always', {
                ignore: [
                    'stylelint-commands',
                    'after-comment'
                ]
            }
        ],
        'declaration-colon-space-after': 'always'
    }
}
