"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function describe(description, test) {
    console.log(description);
    test();
}
exports.describe = describe;
function it(description, callback) {
    describe('\t' + description, callback);
}
exports.it = it;
function expect(value) {
    return matcher(value);
}
exports.expect = expect;
function matcher(expected) {
    return {
        toBe: function (assertion) {
            if (expected === assertion) {
                console.log('pass');
                return true;
            }
            else {
                console.log('fail');
                return false;
            }
        }
    };
}
//# sourceMappingURL=unittest.js.map