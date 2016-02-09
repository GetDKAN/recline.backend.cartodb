import * as Module from '../src/modules/foo.js';

describe('Load es module method and member', () => {
  let Bar = Module.foo;

  it('Module.foo should equal bar', () => {
    expect(Bar).toBe('bar');
  });
});
