const { Client, Message, MessageEmbed, Guild } = require("discord.js");
const db = require("quick.db");
const kullaniciverisi = new db.table("aKullanici");
const kullanicicinsiyet = new db.table("aCinsiyet");
const veri = client.veri.kayıtRolleri;
const catcherveri = client.veri;
const Ayarlar = client.veri.tepkiId;
const kanallar = client.veri.Kanallar;
module.exports = {
    Isim: "erkek",
    Komut: ["erkek", "e"],
    Kullanim: "erkek @Catcher/ID <isim> <yaş>",
    Aciklama: "Belirlenen üyeyi sunucu da erkek olarak kayıt eder",
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
    if(!uye) return message.channel.send(`Hata: Lütfen bir üye etiketleyin veya Id giriniz!  __Örn:__  \`${client.sistem.a_Prefix}erkek @Catcher/ID isim yaş\``).then(sil => sil.delete({timeout: 5000}));
    if(message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(`Hata: Belirlediğiniz üye sizden yetkili veya aynı yetkidesiniz.`).then(sil => sil.delete({timeout: 5000}));
    if(veri.erkekRolleri.some(erkek => uye.roles.cache.has(erkek))) return message.channel.send(`Hata: Belirlediğiniz üye sunucuda zaten kayıtlı ne için tekrardan kayıt ediyorsun?`).then(sil => sil.delete({timeout: 5000}));
    if(veri.kadinRolleri.some(kadin => uye.roles.cache.has(kadin))) return message.channel.send(`Hata: Belirlediğiniz üye sunucuda zaten kayıtlı ne için tekrardan kayıt ediyorsun?`).then(sil => sil.delete({timeout: 5000}));
    args = args.filter(a => a !== "" && a !== " ").splice(1);
    let BelirlenenIsim;
    let isim = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase()+arg.slice(1)).join(" ");
    let yaş = args.filter(arg => !isNaN(arg))[0] || undefined;
    if(!isim || !yaş) return message.channel.send(`Hata: Lütfen tüm argümanları doldurunuz!  __Örn:__  \`${client.sistem.a_Prefix}erkek @Catcher/ID isim yaş\``).then(sil => sil.delete({timeout: 5000}));
        BelirlenenIsim = `${uye.user.username.includes(catcherveri.Tag) ? catcherveri.Tag : (catcherveri.IkinciTag ? catcherveri.IkinciTag : (catcherveri.Tag || ""))} ${isim} | ${yaş}`;
        uye.setNickname(`${BelirlenenIsim}`).catch();
        if(uye.user.username.includes(catcherveri.Tag)) uye.roles.add(veri.tagRolu).catch();
        let erkek = uye.roles.cache.filter(x => x.managed).map(x => x.id).concat(veri.erkekRolleri)
        uye.roles.set(erkek).catch();
    let isimsorgu = kullaniciverisi.get(`k.${uye.id}.isimler`) || [];
    let Liste = isimsorgu.length || `0`;
   isimsorgu = isimsorgu.reverse();
   let IsimGecmisi;
   IsimGecmisi = isimsorgu.length > 0 ? isimsorgu.map((value, index) => `\`${value.Isim}\``).join("\n") : "\n✅ Üyenin herhangi bir kayıtı bulunamadı.";
             message.channel.send(embed.setDescription(`${uye}, adlı üye başarıyla ${message.author}, tarafından **Erkek** olarak kayıt edildi.\n\n**❌ Bu Kullanıcının Veri Tabanındaki Geçmiş İsimleri; [${Liste}]**\n${IsimGecmisi}`)).then(sil => sil.delete({timeout: 15000}));      
         kullaniciverisi.push(`k.${uye.id}.isimler`, {
        Isim: BelirlenenIsim,
        Yetkili: message.author.id,
        Zaman: Date.now()
    });
  kullaniciverisi.add(`teyit.${message.author.id}.erkekteyit`, 1);
  kullanicicinsiyet.push(`veri.${uye.id}.cinsiyet`, `erkek`);            
message.react("✅");     
     }
 };