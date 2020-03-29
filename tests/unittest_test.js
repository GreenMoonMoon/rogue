"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unittest_1 = require("./unittest");
let executes = 0;
function noop() {
    executes += 1;
}
unittest_1.describe('describe', function () {
    unittest_1.it('Execute a callback function', function () {
        const actual = unittest_1.describe('', noop);
        unittest_1.expect(executes).toBe(1);
    });
});
unittest_1.describe('expect', function () {
    unittest_1.it('Return an object with the attribute "toBe"', function () {
        const actual = unittest_1.expect(true);
        unittest_1.expect(typeof actual).toBe('object');
        unittest_1.expect(typeof actual.toBe).toBe('function');
    });
});
unittest_1.describe('matcher.toBe', function () {
    unittest_1.it('Compare give value to the result of the tested funciton', function () {
        const actual = unittest_1.expect(1);
        unittest_1.expect(actual.toBe(1)).toBe(true);
    });
});
//# sourceMappingURL=unittest_test.js.map