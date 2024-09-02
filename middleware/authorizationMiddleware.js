// Middleware to check if the user is an admin
exports.isAdmin = (req) => {
    if (req.user && req.user.isAdmin) {
        return req.user && req.user.isAdmin;
    } else {
        return {
            code: 401,
            message: 'Only Admin can access '
        };
    }
};

exports.isUser = (req) => {
    
    if (req.user.isAdmin == false) {
        return req.user && req.user.isAdmin;
    } else {
        return {
            code: 401,
            message: 'Only User can access '
        };
    }
};
