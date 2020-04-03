const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json");
const snekfetch = require("snekfetch");

let status = ['Recrutando', 'WE DO NOT SOW GREYJOY'];

client.on("ready", () => {
    console.log(`O Recrutador conectou-se com sucesso ao servidor de WE DO NOT SOW GREYJOY`);
});

client.on("guildCreate", guild => {
    console.log(`O Recrutador entrou no servidor ${guild.name} (id: ${guild.id}). População: ${guild.memberCount} membros!`);
});

client.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
    
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if(command === "call") {
        message.guild.createchannel(`MAIN SHOTCALLER`, `voice`);
        message.channel.send(`Debug - 01`); 
    }
    if(command === "regear") 
    {
        snekfetch.get("https://gameinfo.albiononline.com/api/gameinfo/events/74296058").then(r => {
            let body = r.body;
            
            if(body.Victim.AverageItemPower >= 1300)_
                message.channel.send(`O jogador tem 1300+`);      
            /*else
            {
                m.edit(`Seja bem-vindo, ${gametag}, você foi confirmado como um dos nosso membros!`);  

                let servidor = client.guilds.get("365576164267524096");
                let membro = servidor.members.get(message.author.id);
                let cargo = servidor.roles.get("589492367812460544");   

                if(membro.roles.has(cargo) || message.member.hasPermission("ADMINISTRATOR")) 
                    return; 
                    
                message.member.setNickname(gametag);             
                membro.addRole(cargo);
            }*/
        });    
    }
    if(command === "registrar") {
        const gametag = args.join(" ");
        if(!gametag) return message.channel.send(`Para se registrar você precisa utilizar o comando !registrar <gametag do albion>`);
        const m = await message.channel.send(`Olá ${gametag}, estou conferindo se já está participando da guilda!`);      
        snekfetch.get("https://gameinfo.albiononline.com/api/gameinfo/guilds/irsvHeMbRZKAmuRxAOZOxQ/members").then(r => {
            let body = r.body;
            let entry = body.find(post => post.Name === gametag);
            if(!entry) m.edit(`Hey, ${gametag}, você não faz parte da guilda ainda, entre em contato com um dos nossos recrutadores.`);       
            else
            {
                m.edit(`Seja bem-vindo, ${gametag}, você foi confirmado como um dos nosso membros!`);  

                let servidor = client.guilds.get("365576164267524096");
                let membro = servidor.members.get(message.author.id);
                let cargo = servidor.roles.get("589492367812460544");   

                if(membro.roles.has(cargo) || message.member.hasPermission("ADMINISTRATOR")) 
                    return; 
                    
                message.member.setNickname(gametag);             
                membro.addRole(cargo);
            }
        });
    }
});

client.login('NjM0NjAxNzg3Mjk0NDgyNDMy.Xh1a7A.hUbToWZa_9bcX9dhm1SKfrwr2W4');
