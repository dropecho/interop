var totalCount = 0; 
var passedCount = 0; 
var failedCount = 0; 

exports.printResults = () => {
  var results = '';

  results += failedCount == 0 ? 'PASSED' : 'FAILED';
  results += '\n';

  results += `Tests: ${totalCount} `;
  results += `Passed: ${passedCount} `;
  results += `Failed: ${failedCount} `;

  console.log(results);
};

exports.run = (mod) => {
  for(x in mod) {
    if(typeof mod[x] === 'function') {
      mod[x]();
    }
  }
}

exports.areEqual = (actual, expected) => {
      totalCount++;
  if(actual !== expected) {
    failedCount++;
    throw new Error(`Expected ${actual} to equal ${expected}`);
  }
  passedCount++;
};
