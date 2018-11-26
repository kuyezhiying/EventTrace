export module GuidGenerator {
    /// <summary>
    ///  Creates a unique id for identification purposes.
    /// </summary>
    /// <param name="separator" type="String" optional="true">
    /// The optional separator for grouping the generated segmants: default "-".
    /// </param>
    export function newGuid(): string {
        const delim = "-";

        // Creates a random number(example 0.122735770236714). Adds 1 (1.122735770236714).
        // Multiply by highest 16 bit (1.122735770236714 * 0x10000 = 73579.61143823329).
        // Then removes decimal by | with 0 (73579). Then converts to string in hexadecimal("11f6b"). Takes the last 4 to get ("1f6b")
        function s4() {
            // tslint:disable:no-bitwise
            // tslint:disable:insecure-random
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return (s4() + s4() + delim + s4() + delim + s4() + delim + s4() + delim + s4() + s4() + s4());
    }

    /// <summary>
    ///  Check if a string is in the format of a Guid.
    /// </summary>
    /// <param name="value" type="String" optional="false">
    /// The value to check.
    /// </param>
    export function isGuid(value: string): boolean {
        if (!value) {
            return false;
        }
        if (value[0] === "{") {
            value = value.substring(1, value.length - 1);
        }
        // This regex is from JSFiddle, ref page: https://jsfiddle.net/bryan_weaver/9WMAB/
        const regexGuid = /^(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$/gi;
        return regexGuid.test(value);
    }
}