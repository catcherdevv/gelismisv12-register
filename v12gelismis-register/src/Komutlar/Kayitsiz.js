﻿const { Client, Message, MessageEmbed, Guild } = require("discord.js");
const veri = client.veri.kayıtRolleri;
const db = require("quick.db");
const kullaniciverisi = new db.table("aKullanici");
const kullanicicinsiyet = new db.table("aCinsiyet");
const catcherveri = client.veri;
module.exports = {
    Isim: "kayıtsız",
    Komut: ["kayitsiz"],
    Kullanim: "kayıtsız @Catcher/ID",
    Aciklama: "Belirlenen üyeyi kayıtsız üye olarak belirler.",
    Kategori: "Kayıt Komutları",
    TekSunucu: true,
  /**
   * @param {Client} client 
   */
  onLoad: function (client) {
  },
  /**
   * @param {Client} client 
   * @param {Message} message 
   * @param {Array<String>} args 
   * @param {Guild} guild
   */
  onRequest: async function (client, message, args, guild) {
    let embed = new MessageEmbed().setColor('0x2f3136').setFooter(client.altbaslik).setAuthor(catcherveri.Tag + " " + catcherveri.sunucuIsmi, message.guild.iconURL({dynamic: true, size: 2048}))
    if((!veri.kayıtsızRolleri) || !veri.kayıtsızYapanRoller) return message.channel.send("Sistemsel hata: Rol bulunamadı veya rol bilgileri girilemedi.").then(sil => sil.delete({timeout: 5000}));
    if(!veri.kayıtsızYapanRoller.some(rol => message.member.roles.cache.has(rol)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(`Hata: Bu komutu kullanabilmek için yeterli yetkiye sahip değilsin.`).then(sil => sil.delete({timeout: 5000}));
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!uye) return message.channel.send(`Hata: Lütfen bir üye etiketleyin veya Id giriniz!  __Örn:__  \`${client.sistem.a_Prefix}kayıtsız @Catcher/ID\``).then(sil => sil.delete({timeout: 5000}));
    if(message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(`Hata: Belirlediğiniz üye sizden yetkili veya aynı yetkidesiniz.`).then(sil => sil.delete({timeout: 5000}));
    if(veri.kayıtsızRolleri.some(kayıtsız => uye.roles.cache.has(kayıtsız))) return message.channel.send(`Hata: Belirlediğiniz üye zaten sunucumuz da kayıtsız üye neden tekrardan kayıtsıza atmak istiyorsun?`).then(sil => sil.delete({timeout: 5000}));
    if(uye.manageable) if(catcherveri.IkinciTag) uye.setNickname(`${catcherveri.IkinciTag} İsim | Yaş`).catch();
    else if(catcherveri.Tag) uye.setNickname(`${catcherveri.Tag} İsim | Yaş`).catch();
    let kayıtsız = uye.roles.cache.filter(x => x.managed).map(x => x.id).concat(veri.kayıtsızRolleri);
    await uye.roles.set(kayıtsız)
    kullanicicinsiyet.delete(`veri.${uye.id}.cinsiyet`, `erkek`);
    kullanicicinsiyet.delete(`veri.${uye.id}.cinsiyet`, `kadin`);
    message.channel.send(`${client.emoji(catcherveri.Emojiler.Onay)} ${uye} \`(${uye.id})\` üyesi, ${message.author} \`(${message.author.id})\` tarafından __kayıtsıza__ atıldı!`).catch().then(x => x.delete({timeout: 10000}));
    if(uye.voice.channel) await uye.voice.kick().catch();
    message.react("✅"); 
       return;
    }
};