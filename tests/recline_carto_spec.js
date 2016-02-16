import * as Backend from '../src/recline.backend.js';

describe('Make sure backend loads', () => {
  it('Should have type cartodb', () => {
    expect(Backend.__type__).toBe('cartodb');
  });

  it('Should have a working copy of jQuery', () => {
    expect(typeof Backend.$.get).toBe('function');
  });

  it('Should have a working copy of CartoDB.js', () => {
    expect(typeof Backend.cartoDB).toBe('object');
  });

  it('Should have a working copy of Es2SQL', () => {
    expect(typeof Backend.es2Sql).toBe('object');
  });
});

