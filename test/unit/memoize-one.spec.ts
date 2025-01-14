/* eslint-disable @typescript-eslint/ban-ts-comment */

/**
 * Original author: Alex Reardon
 * License: MIT
 * Repo: https://github.com/alexreardon/memoize-one
 * Description: A memoization library which only remembers the latest invocation.
 */

import isDeepEqual from 'lodash.isequal';
import { memoizeOne, EqualityFn } from '../../src/memoize-one';

interface HasA {
  a: number;
}

function getA(this: HasA | null | undefined): number {
  if (this == null) {
    throw new TypeError();
  }
  return this.a;
}

type AddFn = (value1: number, value2: number) => number;

describe('standard behaviour - baseline', () => {
  let add: AddFn;
  let memoizedAdd: AddFn;

  beforeEach(() => {
    add = jest
      .fn()
      .mockImplementation(
        (value1: number, value2: number): number => value1 + value2,
      );
    memoizedAdd = memoizeOne(add);
  });

  it('should return the result of a function', () => {
    expect(memoizedAdd(1, 2)).toBe(3);
  });

  it('should return the same result if the arguments have not changed', () => {
    expect(memoizedAdd(1, 2)).toBe(3);
    expect(memoizedAdd(1, 2)).toBe(3);
  });

  it('should not execute the memoized function if the arguments have not changed', () => {
    memoizedAdd(1, 2);
    memoizedAdd(1, 2);

    expect(add).toHaveBeenCalledTimes(1);
  });

  it('should invalidate a memoize cache if new arguments are provided', () => {
    expect(memoizedAdd(1, 2)).toBe(3);
    expect(memoizedAdd(2, 2)).toBe(4);
    expect(add).toHaveBeenCalledTimes(2);
  });

  it('should resume memoization after a cache invalidation', () => {
    expect(memoizedAdd(1, 2)).toBe(3);
    expect(add).toHaveBeenCalledTimes(1);
    expect(memoizedAdd(2, 2)).toBe(4);
    expect(add).toHaveBeenCalledTimes(2);
    expect(memoizedAdd(2, 2)).toBe(4);
    expect(add).toHaveBeenCalledTimes(2);
  });
});

describe('standard behaviour - dynamic', () => {
  interface Expectation {
    args: unknown[];
    result: unknown;
  }

  interface Input {
    name: string;
    first: Expectation;
    second: Expectation;
  }

  // [JavaScript defines seven built-in types:](https://github.com/getify/You-Dont-Know-JS/blob/master/types%20%26%20grammar/ch1.md)
  //    - null
  //    - undefined
  //    - boolean
  //    - number
  //    - string
  //    - object
  //    - symbol
  const inputs: Input[] = [
    {
      name: 'null',
      first: {
        args: [null, null],
        result: true,
      },
      second: {
        args: [null],
        result: false,
      },
    },
    {
      name: 'undefined',
      first: {
        args: [],
        result: true,
      },
      second: {
        args: [undefined, undefined],
        result: false,
      },
    },
    {
      name: 'boolean',
      first: {
        args: [true, false],
        result: true,
      },
      second: {
        args: [false, true],
        result: false,
      },
    },
    {
      name: 'number',
      first: {
        args: [1, 2],
        result: 3,
      },
      second: {
        args: [1, 5],
        result: 6,
      },
    },
    {
      name: 'number (NaN special case)',
      first: {
        args: [NaN, 2],
        result: 3,
      },
      second: {
        args: [NaN, 5],
        result: 6,
      },
    },
    {
      name: 'string',
      first: {
        args: ['hi', 'there'],
        result: 'greetings',
      },
      second: {
        args: ['luke', 'skywalker'],
        result: 'starwars',
      },
    },

    {
      name: 'object: different values and references',
      first: {
        args: [{ foo: 'bar' }],
        result: { baz: 'bar' },
      },
      second: {
        args: [{ bar: 'test' }],
        result: { baz: true },
      },
    },
    {
      name: 'object: same values but different references',
      first: {
        args: [{ foo: 'bar' }],
        result: { baz: 'bar' },
      },
      second: {
        args: [{ foo: 'bar' }],
        result: { baz: 'bar' },
      },
    },
    {
      name: 'symbols',
      first: {
        args: [Symbol('first')],
        result: true,
      },
      second: {
        args: [Symbol('second')],
        result: false,
      },
    },
  ];

  const isShallowEqual = (array1: Array<any>, array2: Array<any>): boolean => {
    if (array1 === array2) {
      return true;
    }

    return (
      array1.length === array2.length &&
      array1.every((item, i) => {
        if (array2[i] === item) {
          return true;
        }
        if (Number.isNaN(array2[i]) && Number.isNaN(item)) {
          return true;
        }
        return false;
      })
    );
  };

  inputs.forEach(({ name, first, second }) => {
    describe(`type: [${name}]`, () => {
      let mock: (...args: any[]) => unknown;
      let memoized: (...args: any[]) => unknown;

      beforeEach(() => {
        mock = jest.fn().mockImplementation((...args) => {
          if (isShallowEqual(args, first.args)) {
            return first.result;
          }
          if (isShallowEqual(args, second.args)) {
            return second.result;
          }
          throw new Error('unmatched argument');
        });

        memoized = memoizeOne(mock);
      });

      it('should return the result of a function', () => {
        expect(memoized(...first.args)).toEqual(first.result);
      });

      it('should return the same result if the arguments have not changed', () => {
        expect(memoized(...first.args)).toEqual(first.result);
        expect(memoized(...first.args)).toEqual(first.result);
      });

      it('should not execute the memoized function if the arguments have not changed', () => {
        memoized(...first.args);
        memoized(...first.args);

        expect(mock).toHaveBeenCalledTimes(1);
      });

      it('should invalidate a memoize cache if new arguments are provided', () => {
        expect(memoized(...first.args)).toEqual(first.result);
        expect(memoized(...second.args)).toEqual(second.result);
        expect(mock).toHaveBeenCalledTimes(2);
      });

      it('should resume memoization after a cache invalidation', () => {
        expect(memoized(...first.args)).toEqual(first.result);
        expect(mock).toHaveBeenCalledTimes(1);
        expect(memoized(...second.args)).toEqual(second.result);
        expect(mock).toHaveBeenCalledTimes(2);
        expect(memoized(...second.args)).toEqual(second.result);
        expect(mock).toHaveBeenCalledTimes(2);
      });
    });
  });
});

describe('respecting "this" context', () => {
  describe('original function', () => {
    it('should respect new bindings', () => {
      class Foo {
        public bar: string;

        constructor(bar: string) {
          this.bar = bar;
        }
      }

      const memoized = memoizeOne(function toMemoize(bar) {
        return new Foo(bar);
      });

      const result = memoized('baz');

      expect(result instanceof Foo).toBe(true);
      expect(result.bar).toBe('baz');
    });

    it('should respect explicit bindings', () => {
      const temp = {
        a: 10,
      };

      const memoized = memoizeOne(function toMemoize() {
        return getA.call(temp);
      });

      expect(memoized()).toBe(10);
    });

    it('should respect hard bindings', () => {
      const temp = {
        a: 20,
      };

      const memoized = memoizeOne(getA.bind(temp));

      expect(memoized()).toBe(20);
    });

    it('should respect implicit bindings', () => {
      const temp = {
        a: 2,
        getA,
      };

      const memoized = memoizeOne(function toMemoize() {
        return temp.getA();
      });

      expect(memoized()).toBe(2);
    });

    it('should respect fat arrow bindings', () => {
      const temp = {
        a: 50,
      };
      function foo() {
        // return an arrow function
        return (): number => {
          // `this` here is lexically adopted from `foo()`
          // @ts-ignore
          return getA.call(this);
        };
      }
      const bound = foo.call(temp);
      const memoized = memoizeOne(bound);

      expect(memoized()).toBe(50);
    });

    it('should respect ignored bindings', () => {
      const bound = getA.bind(null);
      const memoized = memoizeOne(bound);

      expect(memoized).toThrow(TypeError);
    });
  });

  describe('memoized function', () => {
    it('should respect new bindings', () => {
      const memoizedGetA = memoizeOne(getA);

      class Foo {
        public a: number;
        public result: number;

        constructor(a: number) {
          this.a = a;
          this.result = memoizedGetA.call(this);
        }
      }

      const foo1 = new Foo(10);
      const foo2 = new Foo(20);

      expect(foo1.result).toBe(10);
      expect(foo2.result).toBe(20);
    });

    it('should respect implicit bindings', () => {
      const getAMemoized = memoizeOne(getA);
      const temp = {
        a: 5,
        getAMemoized,
      };

      expect(temp.getAMemoized()).toBe(5);
    });

    it('should respect explicit bindings', () => {
      const temp = {
        a: 10,
      };

      const memoized = memoizeOne(getA);

      expect(memoized.call(temp)).toBe(10);
    });

    it('should respect hard bindings', () => {
      const temp = {
        a: 20,
      };

      const getAMemoized = memoizeOne(getA).bind(temp);

      expect(getAMemoized()).toBe(20);
    });

    it('should memoize hard bound memoized functions', () => {
      const temp = {
        a: 40,
      };
      const spy = jest.fn().mockImplementation(getA);

      const getAMemoized = memoizeOne(spy).bind(temp);

      expect(getAMemoized()).toBe(40);
      expect(getAMemoized()).toBe(40);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should respect fat arrow bindings', () => {
      const temp: HasA = {
        a: 50,
      };
      const memoizedGetA = memoizeOne(getA);
      function foo() {
        // return an arrow function
        return (): number => {
          // `this` here is lexically adopted from `foo()`
          // @ts-ignore
          return memoizedGetA.call(this);
        };
      }
      const bound = foo.call(temp);
      const memoized = memoizeOne(bound);

      expect(memoized()).toBe(50);
    });

    it('should respect ignored bindings', () => {
      const memoized = memoizeOne(getA);

      const getResult = function (): number {
        return memoized.call(null);
      };

      expect(getResult).toThrow(TypeError);
    });
  });
});

describe('context change', () => {
  it('should break the memoization cache if the execution context changes', () => {
    const memoized = memoizeOne(getA);
    const temp1 = {
      a: 20,
      getMemoizedA: memoized,
    };
    const temp2 = {
      a: 30,
      getMemoizedA: memoized,
    };

    expect(temp1.getMemoizedA()).toBe(20);
    expect(temp2.getMemoizedA()).toBe(30);
  });
});

describe('skip equality check', () => {
  it('should not run any equality checks if the "this" context changes', () => {
    const isEqual = jest.fn().mockReturnValue(true);
    const memoized = memoizeOne(getA, isEqual);
    const obj1: HasA = {
      a: 10,
    };
    const obj2: HasA = {
      a: 20,
    };

    // using explicit binding change

    // custom equality function not called on first call
    expect(memoized.apply(obj1)).toBe(10);
    expect(isEqual).not.toHaveBeenCalled();

    // not executed as "this" context has changed
    expect(memoized.apply(obj2)).toBe(20);
    expect(isEqual).not.toHaveBeenCalled();
  });

  it('should run a custom equality check if the arguments length changes', () => {
    const mock = jest.fn();
    const isEqual = jest.fn().mockReturnValue(true);
    const memoized = memoizeOne(mock, isEqual);

    memoized(1, 2);
    // not executed on original call
    expect(isEqual).not.toHaveBeenCalled();

    // executed even though argument length has changed
    memoized(1, 2, 3);
    expect(isEqual).toHaveBeenCalled();
  });
});

describe('custom equality function', () => {
  let add: AddFn;
  let memoizedAdd: AddFn;
  let equalityStub: EqualityFn<AddFn>;

  beforeEach(() => {
    add = jest
      .fn()
      .mockImplementation(
        (value1: number, value2: number): number => value1 + value2,
      );
    equalityStub = jest.fn();
    memoizedAdd = memoizeOne(add, equalityStub);
  });

  it('should call the equality function with the newArgs, lastArgs and lastValue', () => {
    (equalityStub as jest.Mock).mockReturnValue(true);

    // first call does not trigger equality check
    memoizedAdd(1, 2);
    expect(equalityStub).not.toHaveBeenCalled();
    memoizedAdd(1, 4);

    expect(equalityStub).toHaveBeenCalledWith([1, 4], [1, 2]);
  });

  it('should have a nice isDeepEqual consumption story', () => {
    interface Person {
      age: number;
    }
    const clone = (person: Person): Person =>
      JSON.parse(JSON.stringify(person));
    const bob: Person = {
      age: 10,
    };
    const jane: Person = {
      age: 2,
    };
    const tim: Person = {
      age: 1,
    };

    const addAges = jest
      .fn()
      .mockImplementation((...people: Person[]): number =>
        people.reduce((sum: number, person: Person) => sum + person.age, 0),
      );
    const memoized = memoizeOne(addAges, isDeepEqual);

    // addAges executed on first call
    expect(memoized(clone(bob), clone(jane))).toBe(12);
    expect(addAges).toHaveBeenCalled();
    addAges.mockClear();

    // memoized function not called
    expect(memoized(clone(bob), clone(jane))).toBe(12);
    expect(addAges).not.toHaveBeenCalled();

    // memoized function called (we lodash happily handled argument change)
    expect(memoized(clone(bob), clone(jane), clone(tim))).toBe(13);
    expect(addAges).toHaveBeenCalled();
  });

  it('should return the previous value without executing the result fn if the equality fn returns true', () => {
    (equalityStub as jest.Mock).mockReturnValue(true);

    // hydrate the first value
    const first: number = memoizedAdd(1, 2);
    expect(first).toBe(3);
    expect(add).toHaveBeenCalledTimes(1);

    // equality test should not be called yet
    expect(equalityStub).not.toHaveBeenCalled();

    // normally would return false - but our custom equality function returns true
    const second = memoizedAdd(4, 10);

    expect(second).toBe(3);
    // equality test occured
    expect(equalityStub).toHaveBeenCalled();
    // underlying function not called
    expect(add).toHaveBeenCalledTimes(1);
  });

  it('should return execute and return the result of the result fn if the equality fn returns false', () => {
    (equalityStub as jest.Mock).mockReturnValue(false);

    // hydrate the first value
    const first: number = memoizedAdd(1, 2);
    expect(first).toBe(3);
    expect(add).toHaveBeenCalledTimes(1);

    // equality test should not be called yet
    expect(equalityStub).not.toHaveBeenCalled();

    const second = memoizedAdd(4, 10);

    expect(second).toBe(14);
    // equality test occured
    expect(equalityStub).toHaveBeenCalled();
    // underlying function called
    expect(add).toHaveBeenCalledTimes(2);
  });
});

describe('throwing', () => {
  it('should throw when the memoized function throws', () => {
    const willThrow = (message: string): never => {
      throw new Error(message);
    };
    const memoized = memoizeOne(willThrow);

    expect(memoized).toThrow();
  });

  it('should not memoize a thrown result', () => {
    const willThrow = jest.fn().mockImplementation((message: string) => {
      throw new Error(message);
    });
    const memoized = memoizeOne(willThrow);
    let firstError;
    let secondError;

    try {
      memoized('hello');
    } catch (e) {
      firstError = e;
    }

    try {
      memoized('hello');
    } catch (e) {
      secondError = e;
    }

    expect(willThrow).toHaveBeenCalledTimes(2);
    expect(firstError).toEqual(Error('hello'));
    expect(firstError).not.toBe(secondError);
  });

  it('should not break the memoization cache of a successful call', () => {
    const canThrow = jest.fn().mockImplementation((shouldThrow: boolean) => {
      if (shouldThrow) {
        throw new Error('hey friend');
      }
      // will return a new object reference each time
      return { hello: 'world' };
    });
    const memoized = memoizeOne(canThrow);
    let firstError;
    let secondError;

    // standard memoization
    const result1 = memoized(false);
    const result2 = memoized(false);
    expect(result1).toBe(result2);
    expect(canThrow).toHaveBeenCalledTimes(1);
    canThrow.mockClear();

    // a call that throws
    try {
      memoized(true);
    } catch (e) {
      firstError = e;
    }

    expect(canThrow).toHaveBeenCalledTimes(1);
    canThrow.mockClear();

    // call with last successful arguments has not had its cache busted
    const result3 = memoized(false);
    expect(canThrow).not.toHaveBeenCalled();
    expect(result3).toBe(result2);
    canThrow.mockClear();

    // now going to throw again
    try {
      memoized(true);
    } catch (e) {
      secondError = e;
    }

    // underlying function is called
    expect(canThrow).toHaveBeenCalledTimes(1);
    expect(firstError).toEqual(secondError);
    expect(firstError).not.toBe(secondError);
    canThrow.mockClear();

    // last successful cache value is not lost and result fn not called
    const result4 = memoized(false);
    expect(canThrow).not.toHaveBeenCalled();
    expect(result4).toBe(result3);
  });

  it('should throw regardless of the type of the thrown value', () => {
    // [JavaScript defines seven built-in types:](https://github.com/getify/You-Dont-Know-JS/blob/master/types%20%26%20grammar/ch1.md)
    //    - null
    //    - undefined
    //    - boolean
    //    - number
    //    - string
    //    - object
    //    - symbol
    const values: unknown[] = [
      null,
      undefined,
      true,
      false,
      10,
      'hi',
      { name: 'Alex' },
      Symbol('sup'),
    ];

    values.forEach((value: unknown) => {
      const throwValue = jest.fn().mockImplementation(() => {
        throw value;
      });
      const memoized = memoizeOne(throwValue);
      let firstError;
      let secondError;

      try {
        memoized();
      } catch (e) {
        firstError = e;
      }

      try {
        memoized();
      } catch (e) {
        secondError = e;
      }

      // no memoization
      expect(firstError).toEqual(value);

      // validation - no memoization
      expect(throwValue).toHaveBeenCalledTimes(2);
      expect(firstError).toEqual(secondError);
    });
  });
});

describe('caching', () => {
  it('should enable cache clearing', () => {
    const underlyingFn = jest.fn(function add(a: number, b: number) {
      return a + b;
    });

    const memoizedAdd = memoizeOne(underlyingFn);

    // first call - not memoized
    const first = memoizedAdd(1, 2);
    expect(first).toBe(3);
    expect(underlyingFn).toHaveBeenCalledTimes(1);

    // second call - memoized (underlying function not called)
    const second = memoizedAdd(1, 2);
    expect(second).toBe(3);
    expect(underlyingFn).toHaveBeenCalledTimes(1);

    // clearing memoization cache
    memoizedAdd.clear();

    // third call - not memoized (cache was cleared)
    const third = memoizedAdd(1, 2);
    expect(third).toBe(3);
    expect(underlyingFn).toHaveBeenCalledTimes(2);
  });
});

describe('typing', () => {
  it('should maintain the type of the original function', () => {
    // this test will create a type error if the typing is incorrect
    type SubtractFn = (a: number, b: number) => number;
    const subtract: SubtractFn = (a: number, b: number): number => a - b;
    const requiresASubtractFn = (fn: SubtractFn): number => fn(2, 1);

    const memoizedSubtract: SubtractFn = memoizeOne(subtract);

    const result1 = requiresASubtractFn(memoizedSubtract);
    const result2 = requiresASubtractFn(memoizeOne(subtract));

    expect(result1).toBe(1);
    expect(result2).toBe(1);
  });

  it('should support typed equality functions', () => {
    const subtract = (a: number, b: number): number => a - b;

    const valid = [
      (newArgs: readonly number[], lastArgs: readonly number[]): boolean =>
        JSON.stringify(newArgs) === JSON.stringify(lastArgs),
      (): boolean => true,
      (value: unknown[]): boolean => value.length === 5,
    ];

    valid.forEach((isEqual) => {
      const memoized = memoizeOne(subtract, isEqual);
      expect(memoized(3, 1)).toBe(2);
    });
  });
});
