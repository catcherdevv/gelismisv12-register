const { Client, Message, MessageEmbed, Guild } = require("discord.js");
const db = require("quick.db");
const kullaniciverisi = new db.table("aKullanici");
const veri = client.veri.kayıtRolleri;
const catcherveri = client.veri;
module.exports = {
    Isim: "isim",
    Komut: ["nick", "i"],
    Kullanim: "isim @Catcher/ID <isim> <yaş>",
    Aciklama: "Belirlenen üyenin sununucu içerisindeki isim ve yaşını değiştir.",
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
    if((!veri.erkekRolleri && !veri.kadinRolleri) || !veri.kayıtYapanRoller) return message.channel.send("Sistemsel hata: Rol bulunamadı veya rol bilgileri girilemedi.").then(sil => sil.delete({timeout: 5000}));
    if(!veri.kayıtYapanRoller.some(rol => message.member.roles.cache.has(rol)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(`Hata: Bu komutu kullanabilmek için yeterli yetkiye sahip değilsin.`).then(sil => sil.delete({timeout: 5000}));
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!uye) return message.channel.send(`Hata: Lütfen bir üye etiketleyin veya Id giriniz!  __Örn:__  \`${client.sistem.a_Prefix}isim @Catcher/ID isim yaş\``).then(sil => sil.delete({timeout: 5000}));
    if (message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(`Hata: Belirlediğiniz üye sizden yetkili veya aynı yetkidesiniz.`).then(x => x.delete({timeout: 5000}));
    args = args.filter(a => a !== "" && a !== " ").splice(1);
    let isimdata = kullaniciverisi.get(`k.${uye.id}.isimler`) || [];
    let isimler = isimdata.length > 0 ? isimdata.map((value, index) => `\`${value.Isim}\``).join("\n") : "Sistem de isim kaydı bulunamadı!";
    let BelirlenenIsim;
    let isim = args.filter(argüman => isNaN(argüman)).map(argüman => argüman.charAt(0).replace('i', "İ").toUpperCase()+argüman.slice(1)).join(" ");
    let yaş = args.filter(argüman => !isNaN(argüman))[0] || undefined;
    if(!isim || !yaş) return message.channel.send(`Hata: Lütfen tüm argümanları doldurunuz!  __Örn:__  \`${client.sistem.a_Prefix}isim @Catcher/ID isim yaş\``).then(sil => sil.delete({timeout: 5000}));
        BelirlenenIsim = `${uye.user.username.includes(catcherveri.Tag) ? catcherveri.Tag : (catcherveri.IkinciTag ? catcherveri.IkinciTag : (catcherveri.Tag || ""))} ${isim} | ${yaş}`;
        uye.setNickname(`${BelirlenenIsim}`).catch();
        kullaniciverisi.push(`k.${uye.id}.isimler`, {
            Isim: BelirlenenIsim,
            Yetkili: message.author.id,
            Zaman: Date.now()
        });
  
  message.channel.send(embed.setThumbnail(catcherveri.embedUfakResim).setDescription(`» İsmi Değişen Üye: ${uye}\n» Güncellenen İsim: \`${BelirlenenIsim}\``).addField(`Bu Kullanıcının Geçmiş İsimleri [${isimdata.length}]` || `0`, isimler, true)).then(x => x.delete({timeout: 7500}));
  message.react("✅")
    }
};
