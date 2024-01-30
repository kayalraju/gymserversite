const jwt = require("jsonwebtoken")


// exports.jwtAuth = (req, res, next) => {
//     if (req.cookies && req.cookies.membermemberToken) {
//         jwt.verify(req.cookies.membermemberToken, process.env.JWT_SECRET2, (err, member) => {
//             req.member = member;
//             next()
//         })
//     } else {
//         next()
//     }
// }


const verifyMemberToken = async (req, res, next) => {

    const memberToken =
        req.body.memberToken || req.query.memberToken || req.headers["x-access-token"];

    if (!memberToken) {
        return res.status(403).send({ status: false, message: "A memberToken is required for authentication" });
    }
    else {
        try {
            const decoded = jwt.verify(memberToken, process.env.JWT_SECRET2);
            req.user = decoded;
            next()
        } catch (err) {
            return res.status(401).send({ status: false, message: "invalid memberToken Access" });
        }
    }
}

module.exports={
    verifyMemberToken
}