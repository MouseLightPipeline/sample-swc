interface NumberConstructor {
    isInteger(val: Number): boolean;
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

enum SOMA_LOCATION_PARSE {
    SUCCESS,
    INVALID,
    INVALID_X,
    INVALID_Y,
    INVALID_Z
}

interface ISomaLocation {
    x: number;
    y: number;
    z: number;
}

function parseSomaLocation(location: string): ISomaLocation {
    if (location.length > 2 && location[0] === "(" && location[location.length - 1] === ")") {
        location = location.slice(1, location.length - 1).trim();
    }

    let parts = location.split(",");

    let x = 0;
    let y = 0;
    let z = 0;

    if (parts.length === 3) {
        x = parseFloat(parts[0].trim());
        if (isNaN(x)) {
            throw SOMA_LOCATION_PARSE.INVALID_X;
        }

        y = parseFloat(parts[1].trim());
        if (isNaN(y)) {
            throw SOMA_LOCATION_PARSE.INVALID_Y;
        }

        z = parseFloat(parts[2].trim());
        if (isNaN(z)) {
            throw SOMA_LOCATION_PARSE.INVALID_Z;
        }
    } else {
        throw SOMA_LOCATION_PARSE.INVALID;
    }

    return {x: x, y: y, z: z};
}
