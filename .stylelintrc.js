module.exports = {
  "processors": [
    [
      "stylelint-processor-styled-components",
      {
        "moduleName": "@emotion/styled"
      }
    ]
  ],
  "extends": [
    "stylelint-config-standard",
    "stylelint-config-styled-components",
    "stylelint-config-prettier"
  ],
  "rules": {
    // Temporaly disabled, because of an issue with this rule
    // See: - https://github.com/stylelint/stylelint/issues/5904
    //      - https://github.com/niksy/css-functions-list/issues/2
    "function-no-unknown": null,

    "declaration-empty-line-before": null,
    "comment-empty-line-before": null,
    "block-no-empty": null,
    "value-keyword-case": null
  }
}
