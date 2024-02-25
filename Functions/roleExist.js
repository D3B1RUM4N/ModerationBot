module.exports = {
    roleExist: async function (roleID, db, serverID) {
        const role = await db.roles.findUnique({
            where: {
                roleID: roleID.toString()
            }
        });
        if (!role) {
            await db.roles.create({
                data: {
                    roleID: roleID,
                    serverID: serverID
                }
            });
        }
    }
}