export const error = (err, res) => {

    if (err.name === "ValidationError") return res.status(400).send({ status: false, msg: err.message })
    if (err.code == 11000) {
        return res.status(400).send({ status: false, msg: `Duplicate value provided at ${Object.keys(err.keyValue)} ${Object.values(err.keyValue)}` });
    }
    return res.status(500).send({ status: false, msg: err.message })
}