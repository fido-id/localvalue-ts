# [2.1.0](https://github.com/fido-id/localvalue-ts/compare/v2.0.0...v2.1.0) (2021-04-09)


### Features

* add get-or-else-w ([7c229f3](https://github.com/fido-id/localvalue-ts/commit/7c229f35a84802b772e6cf433d8071d6f0be24aa))

# [2.0.0](https://github.com/fido-id/localvalue-ts/compare/v1.0.0...v2.0.0) (2021-03-23)


* refactor!: return io instead of void ([13afcf7](https://github.com/fido-id/localvalue-ts/commit/13afcf70d59bf23401568a09c9b1077319c2a1a1))


### Bug Fixes

* return type of storage-instance type constructor ([536c332](https://github.com/fido-id/localvalue-ts/commit/536c33215dfd9ffb5429d592ddc16821520052ad))


### Code Refactoring

* remove from-io-ts-codec util ([9113f95](https://github.com/fido-id/localvalue-ts/commit/9113f959376301b4be3ca9245fd3ae675dc24755))


### Features

* add create-store util ([de9cff9](https://github.com/fido-id/localvalue-ts/commit/de9cff97079d3f7483ddadda6f8cb4e585c8b013))
* add husky ([0224f1a](https://github.com/fido-id/localvalue-ts/commit/0224f1a2bfc3a3342bc8ff65884867fba2860874))
* export local-value-modifiers type contructor ([4760c63](https://github.com/fido-id/localvalue-ts/commit/4760c63f6a81f5c3f82e71e9c08554119c52a457))
* export storage-instance type contructor ([db01e31](https://github.com/fido-id/localvalue-ts/commit/db01e3142f2e1933a16399c15f4015a745bf8c9e))
* export usefult type constructors ([135f708](https://github.com/fido-id/localvalue-ts/commit/135f708c0ebcc5f43434550cf3134493eb8143f5))
* remove internal apis from d.ts ([dcbaa13](https://github.com/fido-id/localvalue-ts/commit/dcbaa13a5f22d8c23e800096e52254fdab5d6b1f))


### BREAKING CHANGES

* all LocalValueModifiers as well as other value
manipulation utils now return `IO<void>` instead of void
* removed fromIoTsCodec util

# [2.0.0-beta.2](https://github.com/fido-id/localvalue-ts/compare/v2.0.0-beta.1...v2.0.0-beta.2) (2021-03-12)

# [2.0.0-beta.1](https://github.com/fido-id/localvalue-ts/compare/v1.1.0-beta.7...v2.0.0-beta.1) (2021-03-12)


* refactor!: return io instead of void ([13afcf7](https://github.com/fido-id/localvalue-ts/commit/13afcf70d59bf23401568a09c9b1077319c2a1a1))


### Code Refactoring

* remove from-io-ts-codec util ([9113f95](https://github.com/fido-id/localvalue-ts/commit/9113f959376301b4be3ca9245fd3ae675dc24755))


### Features

* remove internal apis from d.ts ([dcbaa13](https://github.com/fido-id/localvalue-ts/commit/dcbaa13a5f22d8c23e800096e52254fdab5d6b1f))


### BREAKING CHANGES

* all LocalValueModifiers as well as other value
manipulation utils now return `IO<void>` instead of void
* removed fromIoTsCodec util

# [1.1.0-beta.7](https://github.com/fido-id/localvalue-ts/compare/v1.1.0-beta.6...v1.1.0-beta.7) (2021-03-10)


### Features

* export local-value-modifiers type contructor ([4760c63](https://github.com/fido-id/localvalue-ts/commit/4760c63f6a81f5c3f82e71e9c08554119c52a457))

# [1.1.0-beta.6](https://github.com/fido-id/localvalue-ts/compare/v1.1.0-beta.5...v1.1.0-beta.6) (2021-03-10)


### Features

* export storage-instance type contructor ([db01e31](https://github.com/fido-id/localvalue-ts/commit/db01e3142f2e1933a16399c15f4015a745bf8c9e))

# [1.1.0-beta.5](https://github.com/fido-id/localvalue-ts/compare/v1.1.0-beta.4...v1.1.0-beta.5) (2021-03-09)


### Bug Fixes

* return type of storage-instance type constructor ([536c332](https://github.com/fido-id/localvalue-ts/commit/536c33215dfd9ffb5429d592ddc16821520052ad))

# [1.1.0-beta.4](https://github.com/fido-id/localvalue-ts/compare/v1.1.0-beta.3...v1.1.0-beta.4) (2021-03-09)

# [1.1.0-beta.3](https://github.com/fido-id/localvalue-ts/compare/v1.1.0-beta.2...v1.1.0-beta.3) (2021-03-09)


### Features

* add husky ([0224f1a](https://github.com/fido-id/localvalue-ts/commit/0224f1a2bfc3a3342bc8ff65884867fba2860874))

# [1.1.0-beta.2](https://github.com/fido-id/localvalue-ts/compare/v1.1.0-beta.1...v1.1.0-beta.2) (2021-03-09)


### Features

* export usefult type constructors ([135f708](https://github.com/fido-id/localvalue-ts/commit/135f708c0ebcc5f43434550cf3134493eb8143f5))

# [1.1.0-beta.1](https://github.com/fido-id/localvalue-ts/compare/v1.0.0...v1.1.0-beta.1) (2021-03-09)


### Features

* add create-store util ([de9cff9](https://github.com/fido-id/localvalue-ts/commit/de9cff97079d3f7483ddadda6f8cb4e585c8b013))

# 1.0.0 (2021-03-09)


### Bug Fixes

* remove wrong repo reference ([ac0de55](https://github.com/fido-id/localvalue-ts/commit/ac0de55caa992178ec9fd0ea6ec0c58aece94277))


### Features

* initial commit ([1f0fc6e](https://github.com/fido-id/localvalue-ts/commit/1f0fc6e0c2a3b40dd06f68c087c8866cd47d92fa))
* rename package ([e9942b1](https://github.com/fido-id/localvalue-ts/commit/e9942b1f2d935f7a3a3a545f1b5241dee88ac8d2))

# 1.0.0 (2021-03-09)


### Bug Fixes

* remove wrong repo reference ([ac0de55](https://github.com/fido-id/localvalue-ts/commit/ac0de55caa992178ec9fd0ea6ec0c58aece94277))


### Features

* initial commit ([1f0fc6e](https://github.com/fido-id/localvalue-ts/commit/1f0fc6e0c2a3b40dd06f68c087c8866cd47d92fa))
* rename package ([e9942b1](https://github.com/fido-id/localvalue-ts/commit/e9942b1f2d935f7a3a3a545f1b5241dee88ac8d2))
