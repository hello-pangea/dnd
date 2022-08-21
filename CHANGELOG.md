

## [15.0.0-beta.0](https://github.com/react-forked/dnd/compare/v14.0.2...v15.0.0-beta.0) (2022-08-21)


### Docs 📃

* **readme:** fix storybook link ([#346](https://github.com/react-forked/dnd/issues/346)) ([a892bba](https://github.com/react-forked/dnd/commit/a892bba4402120087270083e44d1bca3961ac266))


### Features 🔥

* **peer-deps:** add react and react-dom 18 ([#321](https://github.com/react-forked/dnd/issues/321)) ([36e97cd](https://github.com/react-forked/dnd/commit/36e97cd6307466187696ea152215fd857474ab00)), closes [#319](https://github.com/react-forked/dnd/issues/319)
* **registry:** drop ansyc registry clean for react 18+ ([#392](https://github.com/react-forked/dnd/issues/392)) ([89c7d07](https://github.com/react-forked/dnd/commit/89c7d073e5a0fd801eab916be74a966aac69a775))


### Bug Fixes 🛠

* make sure the droppable exsist in the registry before notify a removal ([#392](https://github.com/react-forked/dnd/issues/392)) ([dc92b26](https://github.com/react-forked/dnd/commit/dc92b269b587ab5b02a79e9c078f3c897362fa19))
* **react:** prevent automatic batching for some state changes ([#392](https://github.com/react-forked/dnd/issues/392)) ([ed0e9c2](https://github.com/react-forked/dnd/commit/ed0e9c259a350f6c29ccb4137af7f94e3e8c1c44))


### Tests 🧪

* adjust test to work for react 16, 17 and 18 ([#392](https://github.com/react-forked/dnd/issues/392)) ([e728b7a](https://github.com/react-forked/dnd/commit/e728b7a2f61ef9685a66e52d308a03aee3206b49))
* **dev-deps:** migrate from enzyme to @testing-library/react ([#323](https://github.com/react-forked/dnd/issues/323)) ([4fa731f](https://github.com/react-forked/dnd/commit/4fa731faa261dab39c2b5eb5bc484549b1105d0f))


### Others 🔧

* **deps:** bump multiple deps and dev-deps ([#392](https://github.com/react-forked/dnd/issues/392)) ([3b22dae](https://github.com/react-forked/dnd/commit/3b22dae75d6f920fe8dba55dfcb5778c75c491de))
* **deps:** support react-redux@8 ([#392](https://github.com/react-forked/dnd/issues/392)) ([82c111e](https://github.com/react-forked/dnd/commit/82c111e90dd84a082f37a84fe4af5ff54f2b7aad))
* **dev-deps:** bump all babel related packages ([#395](https://github.com/react-forked/dnd/issues/395)) ([40bd6bc](https://github.com/react-forked/dnd/commit/40bd6bc5d62cf224ce04b8dfa8c2002b8a7aa32c))
* **dev-deps:** bump all eslint related packages ([#395](https://github.com/react-forked/dnd/issues/395)) ([66d5374](https://github.com/react-forked/dnd/commit/66d5374b79b26fb9374ff9c960cf09d58cbd5a82))
* **dev-deps:** bump commit and release packages ([#395](https://github.com/react-forked/dnd/issues/395)) ([525fb63](https://github.com/react-forked/dnd/commit/525fb63b4a862d61e9ea54d186097cb8daf6c6a2))
* **dev-deps:** bump cypress and fix specs ([#392](https://github.com/react-forked/dnd/issues/392)) ([26bf701](https://github.com/react-forked/dnd/commit/26bf70112dbb99682e369a55ffc0a4332951ddf9))
* **dev-deps:** bump node to 16.17.0 ([#395](https://github.com/react-forked/dnd/issues/395)) ([ee38217](https://github.com/react-forked/dnd/commit/ee38217d3cbd466f1317c650a969dd140ef0d7d8))
* **dev-deps:** bump prettier ([#395](https://github.com/react-forked/dnd/issues/395)) ([68fe9b8](https://github.com/react-forked/dnd/commit/68fe9b8129b76191da5cbb1e0d3e715f540b5866))
* **dev-deps:** bump rollup related packages ([#395](https://github.com/react-forked/dnd/issues/395)) ([811fb88](https://github.com/react-forked/dnd/commit/811fb885110aac8765a81f9eee5cb93a1ef31bb0))
* **dev-deps:** bump styling related packages ([#395](https://github.com/react-forked/dnd/issues/395)) ([b7e5a2f](https://github.com/react-forked/dnd/commit/b7e5a2fd3dffe43d50fab7cd287b5de22ded924b))
* **dev-deps:** bump support packages ([#395](https://github.com/react-forked/dnd/issues/395)) ([e73a8fc](https://github.com/react-forked/dnd/commit/e73a8fc7c638f8f582fd5fa3dc9014d5624f2e74))
* **storybook:** disable telemetry ([#392](https://github.com/react-forked/dnd/issues/392)) ([2d6fba4](https://github.com/react-forked/dnd/commit/2d6fba4b8a1843eba1a7ea7904af0ed57b015d8e))
* **storybook:** enable strict mode ([#392](https://github.com/react-forked/dnd/issues/392)) ([7106efa](https://github.com/react-forked/dnd/commit/7106efa02a959b3d29ab99c34f769d28c9757d65))
* **test:** fix issue when running test with react major version env set ([#392](https://github.com/react-forked/dnd/issues/392)) ([5ce1957](https://github.com/react-forked/dnd/commit/5ce1957e0f06addd89023eea879848b7beb6309d))
* **test:** setup jest test to run against the last three major version of react ([#392](https://github.com/react-forked/dnd/issues/392)) ([5cae0bd](https://github.com/react-forked/dnd/commit/5cae0bd619785a105991dd93ad0cad7661991087))
* **type:** fix react-virtualized type (library does not support react 18) ([#392](https://github.com/react-forked/dnd/issues/392)) ([b990622](https://github.com/react-forked/dnd/commit/b990622b513315fe2b748b085bba40aeb1a58e6d))
* update sizes snapshot ([#392](https://github.com/react-forked/dnd/issues/392)) ([142563e](https://github.com/react-forked/dnd/commit/142563e81f6fccc1a99b24fbd5f9cb70cf8bc45d))

### [14.0.2](https://github.com/react-forked/dnd/compare/v14.0.1...v14.0.2) (2022-04-10)


### CI 🛠

* **orb:** update browser-tools orb to v1.2.5 ([#283](https://github.com/react-forked/dnd/issues/283)) ([ab7daed](https://github.com/react-forked/dnd/commit/ab7daed95f963f0b18783acaa87f58a5147969de))


### Docs 📃

* **storybook:** add welcome page ([#310](https://github.com/react-forked/dnd/issues/310)) ([a4fe553](https://github.com/react-forked/dnd/commit/a4fe553126b9371af31f1539be52a84495f3be91))
* **storybook:** fix documentation links to stories ([#311](https://github.com/react-forked/dnd/issues/311)) ([6b9454d](https://github.com/react-forked/dnd/commit/6b9454d77b094d0a2c68119f457e6ae30ea5c756))


### Others 🔧

* **deps:** update dependency react-redux to ^7.2.8 ([#288](https://github.com/react-forked/dnd/issues/288)) ([2a25710](https://github.com/react-forked/dnd/commit/2a257103e35cd6728b6c00ef66ef10a64fce8bbd))
* **dev-deps:** update actions/cache action to v3 ([#266](https://github.com/react-forked/dnd/issues/266)) ([86dbaa3](https://github.com/react-forked/dnd/commit/86dbaa34cc6fa4bbdb9ea4d14692f9b970540a21))
* **dev-deps:** update babel monorepo to v7.17.9 ([#300](https://github.com/react-forked/dnd/issues/300)) ([9657a46](https://github.com/react-forked/dnd/commit/9657a46969b42f426ff15570d773e5070e3eb452))
* **dev-deps:** update dependency @atlaskit/css-reset to v6.3.10 ([#301](https://github.com/react-forked/dnd/issues/301)) ([dfc0dff](https://github.com/react-forked/dnd/commit/dfc0dff72536291c97be14ee66c77135b104222f))
* **dev-deps:** update dependency @atlaskit/theme to v12.1.6 ([#302](https://github.com/react-forked/dnd/issues/302)) ([3db1267](https://github.com/react-forked/dnd/commit/3db1267bff3950ea86d60bef74e5c0d90563ccb1))
* **dev-deps:** update dependency @emotion/react to v11.9.0 ([#299](https://github.com/react-forked/dnd/issues/299)) ([07ed697](https://github.com/react-forked/dnd/commit/07ed697f2ba5774c7a2690012dcaa5b255f11794))
* **dev-deps:** update dependency @rollup/plugin-commonjs to v21.0.3 ([#281](https://github.com/react-forked/dnd/issues/281)) ([2258df7](https://github.com/react-forked/dnd/commit/2258df7e97c22feb6012c1aa92c7f1cc01cbebea))
* **dev-deps:** update dependency @testing-library/dom to v8.12.0 ([#272](https://github.com/react-forked/dnd/issues/272)) ([42e55b4](https://github.com/react-forked/dnd/commit/42e55b4f47df3a42c1fa0e080a8eed6c15a02fef))
* **dev-deps:** update dependency @testing-library/dom to v8.13.0 ([#296](https://github.com/react-forked/dnd/issues/296)) ([f2d3b0e](https://github.com/react-forked/dnd/commit/f2d3b0e5b3b811e6f3d7f12a85afa1745e08b909))
* **dev-deps:** update dependency @types/enzyme to v3.10.12 ([#314](https://github.com/react-forked/dnd/issues/314)) ([b23929a](https://github.com/react-forked/dnd/commit/b23929a09d101878e1c38da848cabcc0cbe43b24))
* **dev-deps:** update dependency @types/react to v17.0.43 ([#269](https://github.com/react-forked/dnd/issues/269)) ([db9816d](https://github.com/react-forked/dnd/commit/db9816dbc2e430df958ba7e98525d912ce909044))
* **dev-deps:** update dependency @types/react to v17.0.44 ([#305](https://github.com/react-forked/dnd/issues/305)) ([6d79fdc](https://github.com/react-forked/dnd/commit/6d79fdcc4ea1f66b99c0a9eff7e0d54094750087))
* **dev-deps:** update dependency @types/react-dom to v17.0.15 ([#306](https://github.com/react-forked/dnd/issues/306)) ([42169c5](https://github.com/react-forked/dnd/commit/42169c569df70519b39a6b088b356f612e14f638))
* **dev-deps:** update dependency @types/react-virtualized to v9.21.21 ([#307](https://github.com/react-forked/dnd/issues/307)) ([609f9b2](https://github.com/react-forked/dnd/commit/609f9b2055ec29ed524e68b65b0a63e0e5e7dd63))
* **dev-deps:** update dependency @wojtekmaj/enzyme-adapter-react-17 to v0.6.7 ([#280](https://github.com/react-forked/dnd/issues/280)) ([67e7be1](https://github.com/react-forked/dnd/commit/67e7be19137a35619d8a5becfb1004ab16dba5bb))
* **dev-deps:** update dependency babel-loader to v8.2.4 ([#268](https://github.com/react-forked/dnd/issues/268)) ([f51a24c](https://github.com/react-forked/dnd/commit/f51a24c6cfb19c66961e53179fb188e00587afd1))
* **dev-deps:** update dependency cypress to v9.5.3 ([#282](https://github.com/react-forked/dnd/issues/282)) ([bf4539b](https://github.com/react-forked/dnd/commit/bf4539b5c9eed6ebcfb898af7f3302db04e3cc14))
* **dev-deps:** update dependency eslint to v8.13.0 ([#279](https://github.com/react-forked/dnd/issues/279)) ([0ce0d1a](https://github.com/react-forked/dnd/commit/0ce0d1aee466a771195cc83fedeb9626401def38))
* **dev-deps:** update dependency eslint-import-resolver-typescript to v2.7.0 ([#271](https://github.com/react-forked/dnd/issues/271)) ([ec4bc91](https://github.com/react-forked/dnd/commit/ec4bc91b9958880da0f5c115844598209a1caf90))
* **dev-deps:** update dependency eslint-import-resolver-typescript to v2.7.1 ([#292](https://github.com/react-forked/dnd/issues/292)) ([461d770](https://github.com/react-forked/dnd/commit/461d770bab14544fcbd60ba7c1e80a3c541e708d))
* **dev-deps:** update dependency eslint-plugin-import to v2.26.0 ([#298](https://github.com/react-forked/dnd/issues/298)) ([5c8cd3c](https://github.com/react-forked/dnd/commit/5c8cd3ce505ff9e5871df7b1bee48eabf3b6590a))
* **dev-deps:** update dependency eslint-plugin-jest to v26.1.3 ([#273](https://github.com/react-forked/dnd/issues/273)) ([a354a0b](https://github.com/react-forked/dnd/commit/a354a0b8f8aa9c8397586a0d4ddea115976a293f))
* **dev-deps:** update dependency eslint-plugin-jest to v26.1.4 ([#312](https://github.com/react-forked/dnd/issues/312)) ([7cc79e5](https://github.com/react-forked/dnd/commit/7cc79e51d088fd73dce22cf5e7e674edf81e6e92))
* **dev-deps:** update dependency eslint-plugin-react-hooks to v4.4.0 ([#284](https://github.com/react-forked/dnd/issues/284)) ([1a8e469](https://github.com/react-forked/dnd/commit/1a8e469db34c6cbb239e1e6bc626dc8ff9c91514))
* **dev-deps:** update dependency eslint-plugin-storybook to v0.5.8 ([#304](https://github.com/react-forked/dnd/issues/304)) ([6993c77](https://github.com/react-forked/dnd/commit/6993c7714e89c4af8c4448f9fde9d25f1dea5729))
* **dev-deps:** update dependency jest-junit to v13.1.0 ([#297](https://github.com/react-forked/dnd/issues/297)) ([d409723](https://github.com/react-forked/dnd/commit/d409723375cabc35d846e669c97e427d3b33ba81))
* **dev-deps:** update dependency prettier to v2.6.1 ([#277](https://github.com/react-forked/dnd/issues/277)) ([1edcb31](https://github.com/react-forked/dnd/commit/1edcb3101276e85de58238891f5b47c4903ec2da))
* **dev-deps:** update dependency prettier to v2.6.2 ([#291](https://github.com/react-forked/dnd/issues/291)) ([556668b](https://github.com/react-forked/dnd/commit/556668b1ffff66fe3d94011a6393258b6f60d749))
* **dev-deps:** update dependency release-it to v14.13.1 ([#265](https://github.com/react-forked/dnd/issues/265)) ([25a2ebe](https://github.com/react-forked/dnd/commit/25a2ebe6ad2fd5412a8ff6f747f5885e01285ce3))
* **dev-deps:** update dependency release-it to v14.14.0 ([#289](https://github.com/react-forked/dnd/issues/289)) ([210a9a7](https://github.com/react-forked/dnd/commit/210a9a7555110ecfcf5fd63e3f6319836d967b44))
* **dev-deps:** update dependency release-it to v14.14.1 ([#315](https://github.com/react-forked/dnd/issues/315)) ([4d16cc7](https://github.com/react-forked/dnd/commit/4d16cc7aa4129a457d30f8cd6373e20dcee5a3e4))
* **dev-deps:** update dependency rollup-plugin-dts to v4.2.1 ([#313](https://github.com/react-forked/dnd/issues/313)) ([82c7e15](https://github.com/react-forked/dnd/commit/82c7e15388bbeb185178b3bb750d4d649602d1e4))
* **dev-deps:** update dependency styled-components to v5.3.5 ([#274](https://github.com/react-forked/dnd/issues/274)) ([344de45](https://github.com/react-forked/dnd/commit/344de45c39d10f5327033647e2f0c5ebff22d053))
* **dev-deps:** update dependency stylelint to v14.6.1 ([#278](https://github.com/react-forked/dnd/issues/278)) ([d869dd3](https://github.com/react-forked/dnd/commit/d869dd3ca4d2c1596f0d52872ae4c0c839417aee))
* **dev-deps:** update dependency ts-jest to v27.1.4 ([#275](https://github.com/react-forked/dnd/issues/275)) ([b631cb0](https://github.com/react-forked/dnd/commit/b631cb073ee8be3d35eeb27db5d83d3e8484b84a))
* **dev-deps:** update dependency typescript to v4.6.3 ([#276](https://github.com/react-forked/dnd/issues/276)) ([1dc8646](https://github.com/react-forked/dnd/commit/1dc8646d2f80330e0139a3102b2a58e73d6f5d5b))
* **dev-deps:** update dependency webpack to v5.71.0 ([#290](https://github.com/react-forked/dnd/issues/290)) ([92bcb24](https://github.com/react-forked/dnd/commit/92bcb24b6ce6b5a1cb4cde83fde6efaa9c0aec59))
* **dev-deps:** update dependency webpack to v5.72.0 ([#303](https://github.com/react-forked/dnd/issues/303)) ([dff2bbb](https://github.com/react-forked/dnd/commit/dff2bbba94a4ec5f5caa6d7dee3545ce14251816))
* **dev-deps:** update storybook monorepo to v6.5.0-alpha.51 ([#270](https://github.com/react-forked/dnd/issues/270)) ([c6a5bbb](https://github.com/react-forked/dnd/commit/c6a5bbbbb9376a3d3acf69534bac97a686fcbeaf))
* **dev-deps:** update storybook monorepo to v6.5.0-alpha.60 ([#286](https://github.com/react-forked/dnd/issues/286)) ([c19ac49](https://github.com/react-forked/dnd/commit/c19ac493816586a744fa926b3c998f9564baa65b))
* **dev-deps:** update typescript-eslint monorepo to v5.17.0 ([#267](https://github.com/react-forked/dnd/issues/267)) ([a5556e1](https://github.com/react-forked/dnd/commit/a5556e14095736c649791a15dc93319a4e39e1c4))
* **dev-deps:** update typescript-eslint monorepo to v5.18.0 ([#294](https://github.com/react-forked/dnd/issues/294)) ([b07f088](https://github.com/react-forked/dnd/commit/b07f0888b1d7f54724181c17a3b4ff8900e753e9))
* **synk:** prevent cli command injection ([#264](https://github.com/react-forked/dnd/issues/264)) ([bd31f99](https://github.com/react-forked/dnd/commit/bd31f9900fd8ed2bbdf52ec18a99c81e0f8afd74))### [14.0.1](https://github.com/react-forked/dnd/compare/v14.0.0...v14.0.1) (2022-03-20)


### Tests 🧪

* **chromatic:** prevent ui tests on stories with programmatic gragging ([#263](https://github.com/react-forked/dnd/issues/263)) ([d8379f4](https://github.com/react-forked/dnd/commit/d8379f4ab8f5612382ad22968b1a4a984727d7e8))


### Others 🔧

* **dependency manager:** change from dependabot to renovate ([#207](https://github.com/react-forked/dnd/issues/207)) ([2cabf88](https://github.com/react-forked/dnd/commit/2cabf88388c618ba29f33859806ea957288cf8c1))
* **deps:** update babel monorepo ([#213](https://github.com/react-forked/dnd/issues/213)) ([ae41388](https://github.com/react-forked/dnd/commit/ae41388b1b2b0985506a2945c1c0801dcbcf04e5))
* **deps:** update dependency css-box-model to ^1.2.1 ([#219](https://github.com/react-forked/dnd/issues/219)) ([b5c9846](https://github.com/react-forked/dnd/commit/b5c984622591192bffb723a74a5ccbe417989309))
* **dev environment:** bump node to v16 and use pnpm as package manager ([#252](https://github.com/react-forked/dnd/issues/252)) ([a2eff12](https://github.com/react-forked/dnd/commit/a2eff12d2cd139b1ace1fccee35601c9add1b15e))
* **dev-deps:** pin dependency @types/jest to 27.4.1 ([#209](https://github.com/react-forked/dnd/issues/209)) ([f0d3c0a](https://github.com/react-forked/dnd/commit/f0d3c0a6fe24179a26c8c35f2a92234fb2a7b6e8))
* **dev-deps:** pin dev dependencies ([#208](https://github.com/react-forked/dnd/issues/208)) ([77ea270](https://github.com/react-forked/dnd/commit/77ea270659cb1620c1624482ea8df21a92c5a938))
* **dev-deps:** update commitlint monorepo to v16.2.3 ([#246](https://github.com/react-forked/dnd/issues/246)) ([2dcd28b](https://github.com/react-forked/dnd/commit/2dcd28b2f43715663f34775189e2a1b8efbb84c4))
* **dev-deps:** update dependency @atlaskit/css-reset to v6.3.8 ([#211](https://github.com/react-forked/dnd/issues/211)) ([2f932f4](https://github.com/react-forked/dnd/commit/2f932f47ae18d7ac206b499e017d0a25c2a6dd4e))
* **dev-deps:** update dependency @atlaskit/css-reset to v6.3.9 ([#249](https://github.com/react-forked/dnd/issues/249)) ([2e1f817](https://github.com/react-forked/dnd/commit/2e1f81746b511cd3845b6708b78a6608428acbf1))
* **dev-deps:** update dependency @atlaskit/theme to v12.1.4 ([#212](https://github.com/react-forked/dnd/issues/212)) ([5caf1d0](https://github.com/react-forked/dnd/commit/5caf1d0c3dd6ed346549ea10eabf870c73265f93))
* **dev-deps:** update dependency @atlaskit/theme to v12.1.5 ([#250](https://github.com/react-forked/dnd/issues/250)) ([38c1755](https://github.com/react-forked/dnd/commit/38c1755a908d366060d5505bcb52ea5bc463e4f6))
* **dev-deps:** update dependency @emotion/react to v11.8.2 ([#214](https://github.com/react-forked/dnd/issues/214)) ([aeb4e25](https://github.com/react-forked/dnd/commit/aeb4e252f77ac0cc09a834c84187119a47b74e2e))
* **dev-deps:** update dependency @testing-library/react to v12.1.4 ([#215](https://github.com/react-forked/dnd/issues/215)) ([7cd1b65](https://github.com/react-forked/dnd/commit/7cd1b654d6254d06db0df853d3dc673ca9efec46))
* **dev-deps:** update dependency @types/react to v17.0.40 ([#216](https://github.com/react-forked/dnd/issues/216)) ([51871c3](https://github.com/react-forked/dnd/commit/51871c31cd7e66a34676cc0b20bc5b3aab5e0f24))
* **dev-deps:** update dependency @types/react to v17.0.41 ([#256](https://github.com/react-forked/dnd/issues/256)) ([8bfa3c6](https://github.com/react-forked/dnd/commit/8bfa3c68ace85636d346d59f277adfa0157e209a))
* **dev-deps:** update dependency @types/react-dom to v17.0.13 ([#217](https://github.com/react-forked/dnd/issues/217)) ([44e8bfe](https://github.com/react-forked/dnd/commit/44e8bfee2cd3185b7bfe815188c748f62350039c))
* **dev-deps:** update dependency @types/react-dom to v17.0.14 ([#257](https://github.com/react-forked/dnd/issues/257)) ([f7aeffc](https://github.com/react-forked/dnd/commit/f7aeffca53e28701de098dac70499b8d04d67be5))
* **dev-deps:** update dependency @types/react-redux to v7.1.23 ([#218](https://github.com/react-forked/dnd/issues/218)) ([34fee43](https://github.com/react-forked/dnd/commit/34fee43d39db95784cacc20d9edcb0588f3c6d37))
* **dev-deps:** update dependency csstype to v3.0.11 ([#220](https://github.com/react-forked/dnd/issues/220)) ([e620921](https://github.com/react-forked/dnd/commit/e6209216393c736cf808bc763a0a070f68f081b5))
* **dev-deps:** update dependency cypress to v9.5.1 ([#221](https://github.com/react-forked/dnd/issues/221)) ([a6267f9](https://github.com/react-forked/dnd/commit/a6267f97a874d613c3bf28fc534e68784e49bcc6))
* **dev-deps:** update dependency cypress to v9.5.2 ([#245](https://github.com/react-forked/dnd/issues/245)) ([4dfc097](https://github.com/react-forked/dnd/commit/4dfc09714684b16936fd6c9b4d3ffb05967fe0a1))
* **dev-deps:** update dependency eslint to v8.11.0 ([#224](https://github.com/react-forked/dnd/issues/224)) ([b896294](https://github.com/react-forked/dnd/commit/b89629497998d3d6966e86b557a71d7eaf82c0c7))
* **dev-deps:** update dependency eslint-config-prettier to v8.5.0 ([#226](https://github.com/react-forked/dnd/issues/226)) ([2431d1c](https://github.com/react-forked/dnd/commit/2431d1c5d3768e03f553f3b1750e02cec270e875))
* **dev-deps:** update dependency eslint-plugin-jest to v26.1.2 ([#261](https://github.com/react-forked/dnd/issues/261)) ([ef8fa0f](https://github.com/react-forked/dnd/commit/ef8fa0fa67475345d38efa7c2bc92bdcabb7c1ba))
* **dev-deps:** update dependency eslint-plugin-react to v7.29.3 ([#227](https://github.com/react-forked/dnd/issues/227)) ([36c8152](https://github.com/react-forked/dnd/commit/36c81525426f21ea9107eb9b5ed88d3e2e2c5c6f))
* **dev-deps:** update dependency eslint-plugin-react to v7.29.4 ([#239](https://github.com/react-forked/dnd/issues/239)) ([65ed213](https://github.com/react-forked/dnd/commit/65ed213ddd6463b621b6ce3000b55da6b2a2fea1))
* **dev-deps:** update dependency jest-axe to v6 ([#237](https://github.com/react-forked/dnd/issues/237)) ([118cc21](https://github.com/react-forked/dnd/commit/118cc2147190aa24a84b0a144ba0150ef13a4a71))
* **dev-deps:** update dependency lighthouse to v9.5.0 ([#228](https://github.com/react-forked/dnd/issues/228)) ([9a4d3a4](https://github.com/react-forked/dnd/commit/9a4d3a49bc3a251cde9e00afea6254a6e0a5bbe1))
* **dev-deps:** update dependency prettier to v2.6.0 ([#247](https://github.com/react-forked/dnd/issues/247)) ([a61deb8](https://github.com/react-forked/dnd/commit/a61deb8de9c80e406bd321410db1a89f5167cef6))
* **dev-deps:** update dependency release-it to v14.13.0 ([#258](https://github.com/react-forked/dnd/issues/258)) ([0a96782](https://github.com/react-forked/dnd/commit/0a96782e06beefc0eadfe96c32ccfc1329013cba))
* **dev-deps:** update dependency rollup to v2.70.0 ([#229](https://github.com/react-forked/dnd/issues/229)) ([839cc44](https://github.com/react-forked/dnd/commit/839cc449e371df051e789455010a3831d884951c))
* **dev-deps:** update dependency rollup to v2.70.1 ([#243](https://github.com/react-forked/dnd/issues/243)) ([17c229b](https://github.com/react-forked/dnd/commit/17c229b912fd4ad70fbcc63df2f8b656b4e1ef97))
* **dev-deps:** update dependency rollup-plugin-dts to v4.2.0 ([#230](https://github.com/react-forked/dnd/issues/230)) ([2d97b35](https://github.com/react-forked/dnd/commit/2d97b35d2580c8bc5a03b4930bf3dfb959694445))
* **dev-deps:** update dependency stylelint to v14.6.0 ([#248](https://github.com/react-forked/dnd/issues/248)) ([b22da7b](https://github.com/react-forked/dnd/commit/b22da7b5011003af0826be587932b71ff14dec21))
* **dev-deps:** update dependency typescript to v4.6.2 ([#231](https://github.com/react-forked/dnd/issues/231)) ([e0059bb](https://github.com/react-forked/dnd/commit/e0059bb018e4d4eba494fd460c037607e2ef1b8b))
* **dev-deps:** update dependency webpack to v5.70.0 ([#232](https://github.com/react-forked/dnd/issues/232)) ([c8acd39](https://github.com/react-forked/dnd/commit/c8acd3969708644566d194e8e2a93d7ec866fa00))
* **dev-deps:** update Node.js to v16.14.2 ([#234](https://github.com/react-forked/dnd/issues/234)) ([696c5f3](https://github.com/react-forked/dnd/commit/696c5f3aab3baf94e449fb9f2c17dceade82a8c8))
* **dev-deps:** update storybook monorepo to v6.5.0-alpha.47 ([59d2f26](https://github.com/react-forked/dnd/commit/59d2f267617f6a365f73c2fa91010339903baa55))
* **dev-deps:** update storybook monorepo to v6.5.0-alpha.48 ([#241](https://github.com/react-forked/dnd/issues/241)) ([9366dae](https://github.com/react-forked/dnd/commit/9366dae80705b1f5e8fbe592162c78244d2cca8f))
* **dev-deps:** update storybook monorepo to v6.5.0-alpha.49 ([#251](https://github.com/react-forked/dnd/issues/251)) ([dd36340](https://github.com/react-forked/dnd/commit/dd36340ddf0643549ec283fa0d25c14d7a80a9d1))
* **dev-deps:** update typescript-eslint monorepo to v5.14.0 ([#233](https://github.com/react-forked/dnd/issues/233)) ([472a0e9](https://github.com/react-forked/dnd/commit/472a0e95ba1f698dc1c03883f9ab14df365ba988))
* **dev-deps:** update typescript-eslint monorepo to v5.15.0 ([#244](https://github.com/react-forked/dnd/issues/244)) ([b8da913](https://github.com/react-forked/dnd/commit/b8da913d7dab91deca02a82c47a6201b1e494c65))
* **release tool:** improve release toolchain ([#225](https://github.com/react-forked/dnd/issues/225)) ([24db96e](https://github.com/react-forked/dnd/commit/24db96e665a2e295cbea0a4341ec40c75a6e34db))
* **yarn:** remove yarn.lock file ([#254](https://github.com/react-forked/dnd/issues/254)) ([c24d487](https://github.com/react-forked/dnd/commit/c24d487c4ab572c4db38af8087f64d5a99c6da1c))


### CI 🛠

* **chromatic:** automate with github actions ([#259](https://github.com/react-forked/dnd/issues/259)) ([8a11d01](https://github.com/react-forked/dnd/commit/8a11d0134e97c7ce92272f5d056f7f2f8f61740e))
* **dev-deps:** update actions/checkout action to v3 ([#236](https://github.com/react-forked/dnd/issues/236)) ([6b9c79c](https://github.com/react-forked/dnd/commit/6b9c79cbacf41bc2e525c31de87ee6f2aad93c47))
* **github actions:** update actions/setup-node action to v3 ([#262](https://github.com/react-forked/dnd/issues/262)) ([fe21b16](https://github.com/react-forked/dnd/commit/fe21b163998a153d2c312b8c02dc25984b7084ce))
* **image:** update Node.js to v16.14.2 ([#255](https://github.com/react-forked/dnd/issues/255)) ([1b16c35](https://github.com/react-forked/dnd/commit/1b16c357a5b73a263e9f51504b2e620c98070c16))
* **netlify:** make sure it uses pnpm ([#260](https://github.com/react-forked/dnd/issues/260)) ([b8e284c](https://github.com/react-forked/dnd/commit/b8e284c1b9c9d8831da54ed2a3591b25cac07d70))# Changelog

This project adheres to [Semantic Versioning 2.0](http://semver.org/).
All release notes and upgrade notes can be found on our [Github Releases](https://github.com/react-forked/dnd/releases) page.