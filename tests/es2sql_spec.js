import * as Es2Sql from '../src/modules/es2sql.js';
let Lib = Es2Sql.privates;

describe('Test es2Sql module load', () => {
  it('Module should be an object', () => {
    expect(typeof Es2Sql).toBe('object');
  });

  it('Privates should be an object', () => {
    expect(typeof Lib).toBe('object');
  });

  it('Test _urlEncode Method', () => {
    let encoded = Lib._urlEncode('there should be no spaces');
    console.log('t-es-1',encoded, Lib._urlEncode);
    expect(encoded.indexOf(' ')).toEqual(-1);
    expect(encoded.indexOf('%')).toBeGreaterThan(0);
  });
});

describe('Test _urlEncode method', () => {
  it('_urlEncode should be a function', () => {
    expect(typeof Lib._urlEncode).toBe('function');
  });
});

describe('Test _buildQuery Method', () => {
  let testQ = ['SELECT', '*', 'FROM', 'table_name', 'WHERE', 'foo', '=', 'bar'];
  let val = Lib._composeQuery(testQ);

  it('Should return a non-empty string', () => {
    expect(typeof val).toBe('string');
    expect(val.length).toBeGreaterThan(0);
  });

  it('Should have the word WHERE in the string', () => {
    expect(val.indexOf('WHERE')).toBeGreaterThan(-1);
  });

  it('Should have no trailing space', () => {
    let l = val.slice(val.length-1, val.length);
    expect(l === ' ').toBeFalsy();
  });
});

describe('Test _addTermFilter Method', () => {
  let data = {foo : 'bar'};
  let val = Lib._addTermFilter(data);
  let data2 = {foo : 'bar', baz : 'bot'};
  let val2 = Lib._addTermFilter(data2);

  it('Should say WHERE foo = bar', () => {
    expect(val).toEqual('WHERE foo = bar');
  });
  
  it('Should also handle multiple termfilters', () => {
    expect(val2).toEqual('WHERE foo = bar AND baz = bot');
  });
});

describe('Test _addRangeFilter', () => {
  let data = {foo: {gte : 100}};
  let val = Lib._addRangeFilter(data);
  let data2 = {foo : {gt : 50}, bar : {lt : 50}};
  let val2 = Lib._addRangeFilter(data2);
  it('Should handle filter with operator', () => {
    expect(val).toBe('WHERE foo >= 100');
  });

  // @@TODO - support from / to syntax
  it('Should handle FROM / TO syntax', () => {
    let data = {field: 'foo', operator: 'gte', value: 50}
  });

  it('Should handle multiple filters', () => {
    expect(val2).toBe('WHERE foo > 50 AND bar < 50');    
  });
});

describe('Test _sort', () => {
  it('Shoud add ORDER BY clause', () => {
    let data = {'foo' : 'ASC'};
    let val = Lib._sort(data);
    expect(val).toBe('ORDER BY foo ASC');
  });
});

describe('Test _filters method - single term filter', () => {
  let data = {term : {foo : 'bar'}};
  let val = Lib._filters(data);
  console.log('t _f', val);
  it('Should say WHERE foo = bar', () => {
    expect(val).toEqual('WHERE foo = bar');
  });
});


