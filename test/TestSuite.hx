import massive.munit.TestSuite;

import interop.AbstractMapTest;
import interop.AbstractArrayTest;
import interop.AbstractFuncTest;
import interop.ExtenderTest;

/**
 * Auto generated Test Suite for MassiveUnit.
 * Refer to munit command line tool for more information (haxelib run munit)
 */
class TestSuite extends massive.munit.TestSuite
{
	public function new()
	{
		super();

		add(interop.AbstractMapTest);
		add(interop.AbstractArrayTest);
		add(interop.AbstractFuncTest);
		add(interop.ExtenderTest);
	}
}
