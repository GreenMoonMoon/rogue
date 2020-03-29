"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unittest_1 = require("./framework/unittest");
function adder(a, b) {
    return a + b;
}
unittest_1.describe('adder', function () {
    unittest_1.it('add two numbers', function () {
        const result = adder(1, 2);
        unittest_1.expect(result).toBe(3);
    });
});
//# sourceMappingURL=simple_test.js.map