// mock-css-modules is used to mock the react-css-modules
const mockCssModules = require('mock-css-modules')
const jsdom          = require('jsdom').jsdom

mockCssModules.register(['.sass', '.scss', '.css'])

global.document = jsdom('<html><body></body></html>')
global.window = document.defaultView
global.navigator = window.navigator
