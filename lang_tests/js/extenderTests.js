var { TestThisClass, TestMap } = require('./dropecho.interop');
var assert = require('./assert');

var testMap = new TestMap();

testMap.createDynAcces();

var ttc = new TestThisClass({
  i: 2,
  f: 2,
  map: { x:1, y:2 },
  arr: [1, 2, 3, 'test'],
  subarr: [{
    i:1,
    f: 4
  }, {
    i:3,
    f:9
  }]
});

exports.extenderShouldSetInt = () => {
  assert.areEqual(ttc.i, 2);
};

exports.extenderShouldSetFloat= () => {
  assert.areEqual(ttc.f, 2);
};

exports.extenderShouldSetMap = () => {
  assert.areEqual(ttc.map.x, 1);
  assert.areEqual(ttc.map.y, 2);
};


