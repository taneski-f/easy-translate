## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```


### Run Unit Tests with [Vitest](https://vitest.dev/)
Unit tests are meant to serve as examples - they do not represent full coverage of the codebase.

```sh
npm run test:unit
```



### Run E2E Tests with [Playwright](https://playwright.dev/)
E2E tests are also provided as sample scenarios and do not cover every possible workflow.

Test execution is controlled by Playwright Inspector (should open by default for all E2E runs—run in debug mode by default). Start every test execution via "Resume (F8)", and each test should end with a pause by design:

```sh
npm run test:e2e
```

Or run in debug mode manually, if the above fails (see: playwright.config.ts):

```sh
npm run test:e2e:debug
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
