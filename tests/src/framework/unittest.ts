export function describe(description: string, test: Function) {
    console.log(description);
    test();
}

export function it(description: string, callback: Function) {
    describe('\t' + description, callback);
}

export function expect(value: any): any {
    return matcher(value);
}

function matcher(expected: any): {toBe: Function} {
    return {
        toBe: function (assertion: any) {
            if (expected === assertion) {
                console.log('pass');
                return true;
            } else {
                console.log('fail');
                return false;
            }
        }
    }
}
