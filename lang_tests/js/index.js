var { Extender, TestThisClass } = require('./dropecho.interop');


var ttc = new TestThisClass({
  int: 2,
  map: { x:1, y:2 },
  arr: [1, 2, 3, 'test'],
  subarr: [{
    int:1,
    float: 4
  }, {
    int:3,
    float:9
  }]
});

console.log('TestThisClass', ttc);
console.log('TestThisClass.map.x', ttc.map.get('x'));
console.log('TestThisClass.test', ttc.test());


// var testObj = {
//   a: new Map()
// };
//
// var bar = { a: new Map() };
//
// bar.a.set('other', 2);
//
// testObj.a.set('test', 4);
//
// var a = Extender.defaults(bar, testObj);
//
// console.log('weeee', a);

// TestMap.setMap({ test:1 });
// console.log('test', TestMap.map.get('test'));
//
//
// var m = new Map();
// m.set('test', 2);
//
// TestMap.setMap(m);
// console.log('test', TestMap.map.get('test'));
