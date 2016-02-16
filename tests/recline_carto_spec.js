import * as Backend from '../src/recline.backend.js';

describe('Make sure backend loads', () => {
  it('Should have type cartodb', () => {
    expect(Backend.__type__).toBe('cartodb');
  });

  it('Should have a working copy of cartoDB library', () => {
    expect(typeof Backend.$.get).toBe('function');
  });
});

