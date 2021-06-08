package interop;

import massive.munit.Assert;
import dropecho.interop.AbstractArray;

class AbstractArrayTest {
	@Test
	public function can_instantiate() {
		var m = new AbstractArray<Int>();
		Assert.isNotNull(m);
	}

	@Test
	public function push() {
		var m = new AbstractArray<Int>();
		m.push(1);

		Assert.areEqual(1, m[0]);
	}

	@Test
	public function unshift() {
		var m = new AbstractArray<Int>();
		m.unshift(1);

		Assert.areEqual(1, m[0]);
	}

	@Test
	public function sort() {
		var m = new AbstractArray<Int>();
		m.unshift(1);
		m.unshift(2);

		// m.sort((a, b) -> b - a);

		Assert.areEqual(2, m[0]);
	}

	// @Test
	// public function sort() {
	//   var m = new AbstractArray<Int>();
	//   m.unshift(1);
	//   m.unshift(2);
  //
	//   m.sort((a, b) -> return a - b);
  //
	//   Assert.areEqual(1, m[0]);
	// }
}
