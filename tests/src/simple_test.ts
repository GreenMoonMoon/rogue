import { describe, it, expect } from './framework/unittest'

function adder(a: number, b: number) {
    return a + b;
}

describe('adder', function () {
    it('add two numbers', function () {
        const result = adder(1, 2);
        expect(result).toBe(3);
    })
})
