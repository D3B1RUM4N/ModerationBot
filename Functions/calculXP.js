module.exports = async (xp, lvl) => {
    let xptotal = 0
    for (let i = 0; i < lvl; i++) {
        xptotal += (lvl + 1) * 100
    }
    xptotal += xp
    return xptotal
}