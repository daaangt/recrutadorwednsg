const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const snekfetch = require("snekfetch");

const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

let status = ['Recrutando', 'WE DO NOT SOW GREYJOY'];

client.on("ready", () => {
    console.log(`O Recrutador conectou-se com sucesso ao servidor de WE DO NOT SOW GREYJOY`);
    setInterval(function() {
        let statuses = status[Math.floor(Math.random()*status.length)];
        client.user.setActivity(statuses, { type: 'WATCHING' });
    }, 10000);    
});

client.on("guildCreate", guild => {
    console.log(`O Recrutador entrou no servidor ${guild.name} (id: ${guild.id}). População: ${guild.memberCount} membros!`);
});

client.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
    
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

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

client.login(config.token);