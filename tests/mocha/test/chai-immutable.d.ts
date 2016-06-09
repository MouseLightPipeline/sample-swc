declare namespace ChaiImmutable {

    export function test(chai: any, utils: any) : void;
}

declare module "chai-immutable" {
    export = ChaiImmutable.test;
}
