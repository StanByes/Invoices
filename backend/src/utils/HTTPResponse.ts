export const Success = () => {
    return {
        code: 200,
        message: "Success"
    }
};

export const BadRequest = () => {
    return {
        code: 400,
        message: "Bad Request"
    }
};

export const Forbidden = () => {
    return {
        code: 403,
        message: "Forbidden"
    }
};

export const NotFound = () => {
    return {
        code: 404,
        message: "Not Found"
    }
};

export const Conflict = () => {
    return {
        code: 409,
        message: "Conflict"
    }
};
