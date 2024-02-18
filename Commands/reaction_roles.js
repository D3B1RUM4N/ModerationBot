const Discord = require('discord.js')

module.exports = {
    name: "reaction_roles",
    description: "Role a ajouter a une liste de reaction",
    permission : Discord.PermissionFlagsBits.ManageRoles,
    dm : false,
    category : "Gestion de serveur",
    options : [
        {
            type: "string",
            name: "action",
            description: "add/remove",
            required: true,
            autocomplete : true
        },{
            type: "number",
            name: "reactionrole",
            description: "ID de la liste de reaction (indice : en bas du message)",
            required: true,
            autocomplete : true
        },{
            type: "role",
            name: "role",
            description: "role a ajouter ou retirer",
            required: true,
            autocomplete : false
        },
    ],

    async run(client, message, args, db) {
        let action = args.getString("action")
        if(action !== "add" && action !== "remove") return message.reply({content: "L'action doit être add ou remove", ephemeral: true})

        let role = args.getRole("role")
        if(!message.guild.roles.cache.get(role.id)) return message.reply({content: "Ce role n'existe pas", ephemeral: true})
        if(role.managed) return message.reply({content: "Ce role est géré par un bot", ephemeral: true})

        try{
            if(action === "add"){
                roleDB = await db.roles.findFirst({
                    where: {
                        roleID: role.id.toString(),
                        serverID: message.guild.id.toString()
                    }
                })
                if(!roleDB){
                    await db.roles.create({
                        data: {
                            roleID: role.id.toString(),
                            serverID: message.guild.id.toString()
                        }
                    })
                }
                reactionID = await db.reactionroles.findFirst({
                    where: {
                        reactionRoleID: args.getNumber("reactionrole")
                    }
                })
                if(!reactionID) return message.reply({content: "Cette liste de reaction n'existe pas", ephemeral: true})
                await db.reactionroles.update({
                    where: {
                        reactionRoleID: args.getNumber("reactionrole")
                    },
                    data: {
                        roles: {
                            connect: {
                                roleID: role.id.toString()
                            }
                        }
                    }
                })
                await message.reply({content: "Role ajouté avec succès", ephemeral: true})
            }else{
                reactionID = await db.reactionroles.findFirst({
                    where: {
                        reactionRoleID: args.getNumber("reactionrole")
                    }
                })
                if(!reactionID) return message.reply({content: "Cette liste de reaction n'existe pas", ephemeral: true})
                await db.reactionroles.update({
                    where: {
                        reactionRoleID: args.getNumber("reactionrole")
                    },
                    data: {
                        roles: {
                            disconnect: {
                                roleID: role.id.toString()
                            }
                        }
                    }
                })
                await message.reply({content: "Role retiré avec succès", ephemeral: true})
            }
        }catch(err){
            console.log(err)
            return message.reply({content: "Une erreur est survenue", ephemeral: true})
        }
    }
}