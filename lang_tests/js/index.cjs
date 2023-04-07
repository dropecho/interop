var assert = require('./assert.cjs');
var extenderTests = require('./extenderTests.cjs');

try{
  assert.run(extenderTests);
} catch (error) {
  console.log(error.message);

  // jank?
  var line = error.stack.split('\n')[2];
  var funcName = line.substring(0, line.indexOf('('));
  var fileStart = line.lastIndexOf('/');
  var file = line.substring(fileStart + 1, line.length - 1);
  console.log(`${funcName} (${file})`);

} finally {
  assert.printResults();
}

