require('es6-shim');
require('weakmap-polyfill');
var Symbol = window['Symbol'] = typeof Symbol !== 'undefined' ? Symbol : require('es6-symbol');
require('reflect-metadata');
require('zone.js/dist/zone');
require('zone.js/dist/long-stack-trace-zone');
require('zone.js/dist/async-test');
require('zone.js/dist/fake-async-test');
require('zone.js/dist/sync-test');
require('zone.js/dist/proxy');
require('zone.js/dist/jasmine-patch');

var browserTesting = require('@angular/platform-browser-dynamic/testing');
var coreTesting = require('@angular/core/testing');
var context = require.context('../../src/', true, /\.spec\.ts$/);

Error.stackTraceLimit = Infinity;
jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000;

coreTesting.TestBed.resetTestEnvironment();
coreTesting.TestBed.initTestEnvironment(
    browserTesting.BrowserDynamicTestingModule,
    browserTesting.platformBrowserDynamicTesting()
);

context.keys().forEach(context);