exports.index = async (req, res) => {
    res.json({
        message: 'return a list of boards successful',
        data: req.user,
    });
}
