interface NumberConstructor {
    isInteger(val: Number): boolean;
}

function pad(n, width, z = "0"): string {
    n = n + "";
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function isValidIdNumberValue(val: string): boolean {
    return (val.length > 0) && !isNaN(Number(val)) && Number.isInteger(Number(val)) && (Number(val) > 0);
}

function isValidDateValue(val: any): boolean {
    return !isNaN(val) && val.getFullYear() > 1900;
}

function isValidDouble(val: string): boolean {
    return (val.length > 0) && !isNaN(Number(val));
}

