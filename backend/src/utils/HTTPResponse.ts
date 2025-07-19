export const NotFound = () => {
    return {
        code: 404,
        message: "Not Found"
    }
};

export const BadRequest = () => {
    return {
        code: 400,
        message: "Bad Request"
    }
};

export const Conflict = () => {
    return {
        code: 409,
        message: "Conflict"
    }
};

export const Success = () => {
    return {
        code: 200,
        message: "Success"
    }
};
