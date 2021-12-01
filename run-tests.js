const cypress = require('cypress')

const aberrations = []

cypress.run({
  browser: 'electron',
  parallel: true,
  record: true,
  group: 'all tests',
  ciBuildId: process.env.CI_BUILD_ID,
  key: process.env.CYPRESS_RECORD_KEY,
})
.then((results) => {
  results.runs.forEach((run) => {
    run.hooks.forEach((hook) => {
      if (!hook.title || !hook.title.length || !hook.body) {
        aberrations.push(hook)
      }
    })
    run.tests.forEach((test) => {
      if (!test.title || !test.title.length || !test.body) {
        aberrations.push(test)
      }
    })
  })

  if (aberrations.length) {
    console.log('--- ABERRATIONS ---')
    console.log(aberrations)
    process.exit(1)
  }
})
.catch((err) => {
  console.log('--- RUN ERROR ---')
  console.log(err.stack)
  process.exit(1)
})
