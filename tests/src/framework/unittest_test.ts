import { describe, it, expect } from "./unittest";

let executes = 0;
function noop(){
    executes += 1;
}

describe('describe', function(){
    it('Execute a callback function', function(){
        const actual = describe('', noop);
        expect(executes).toBe(1);
    });
});

describe('expect', function(){
    it('Return an object with the attribute "toBe"', function(){
        const actual = expect(true);

        expect(typeof actual).toBe('object');
        expect(typeof actual.toBe).toBe('function');
    });
});

describe('matcher.toBe', function(){
    it('Compare give value to the result of the tested funciton', function(){
        const actual = expect(1);

        expect(actual.toBe(1)).toBe(true);
    });
});
