const { Client, Message, MessageEmbed, Guild } = require("discord.js");
const db = require("quick.db");
const kullaniciverisi = new db.table("aKullanici");
const veri = client.veri;
module.exports = {
    Isim: "isimtemizle",
    Komut: ["it"],
    Kullanim: "isimtemizle @Catcher/ID",
    Aciklama: "Belirlenen üyenin isim ve yaş geçmişini temizler.",
    Kategori: "Yönetim Komutları",
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
    let embed = new MessageEmbed().setColor('0x2f3136').setFooter(client.altbaslik).setAuthor(veri.Tag + " " + veri.sunucuIsmi, message.guild.iconURL({dynamic: true, size: 2048}))
    if(!message.member.roles.cache.has(veri.Roller.kurucuRolu)) return message.channel.send(`Hata: Bu komutunu kullanabilmek için herhangi bir yetkiye sahip değilsin.`).then(x => x.delete({timeout: 5000}));
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!uye) return message.channel.send(`Hata: Lütfen bir üye etiketleyin veya Id giriniz!  __Örn:__  \`${client.sistem.a_Prefix}isimtemizle @Catcher/ID\``).then(sil => sil.delete({timeout: 5000}));
    kullaniciverisi.delete(`k.${uye.id}.isimler`)
    message.channel.send(embed.setDescription(`${uye}, isimli üyenin __isim geçmişi__ temizlendi!`)).then(sil => sil.delete({timeout: 5000}));
    message.react("✅");
    }
};