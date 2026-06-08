// OTOMATİK ÜRETİLDİ — Çevrende markalı e-posta şablonları (tablo tabanlı, inline CSS).
// Tasarım kaynağı: Cevrende E-posta Sablonlari (standalone). Değişkenler {{...}}.

export type EmailTemplateKey =
  | "verify"
  | "reset"
  | "welcome"
  | "warn"
  | "job"
  | "msg";

export const EMAIL_TEMPLATES: Record<EmailTemplateKey, string> = {
  verify: `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<title>Çevrende — E-posta doğrulama</title>
</head>
<body style="margin:0;padding:0;background-color:#F4F2EB;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#F4F2EB;">Doğrulama kodun: {{kod}} — Çevrende hesabını doğrula.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F4F2EB;">
<tr>
<td align="center" style="padding:32px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">

<!-- Header / logo -->
<tr>
<td style="padding:4px 8px 22px 8px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0">
<tr>
<td style="width:44px;height:44px;background-color:#0F1110;border-radius:12px;text-align:center;vertical-align:middle;font-family:Arial,Helvetica,sans-serif;font-size:24px;font-weight:bold;color:#ffffff;line-height:44px;">Ç</td>
<td style="padding-left:12px;font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:bold;color:#0F1110;letter-spacing:-0.3px;">Çevrende</td>
</tr>
</table>
</td>
</tr>

<!-- Card -->
<tr>
<td style="background-color:#FFFFFF;border:1px solid #E7E3D8;border-radius:14px;padding:38px 40px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:bold;color:#0F1110;line-height:30px;padding-bottom:14px;">E-posta adresini doğrula</td></tr>
<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:24px;color:#3a3a36;padding-bottom:8px;">Merhaba {{isim}},</td></tr>
<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:24px;color:#3a3a36;padding-bottom:24px;">Çevrende hesabını oluşturmak için aşağıdaki doğrulama kodunu uygulamaya gir.</td></tr>

<!-- Code box -->
<tr><td style="padding-bottom:24px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td align="center" style="background-color:#F4F2EB;border:1px solid #E7E3D8;border-radius:12px;padding:22px 16px;">
<div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#8A8A82;letter-spacing:1.5px;text-transform:uppercase;padding-bottom:10px;">Doğrulama kodu</div>
<div style="font-family:'Courier New',Courier,monospace;font-size:36px;font-weight:bold;color:#0F1110;letter-spacing:10px;">{{kod}}</div>
</td>
</tr>
</table>
</td></tr>

<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:20px;color:#8A8A82;">Kod 10 dakika boyunca geçerlidir. Bu isteği sen yapmadıysan bu e-postayı görmezden gelebilirsin.</td></tr>
</table>
</td>
</tr>

<!-- Footer -->
<tr>
<td style="padding:28px 16px 8px 16px;text-align:center;">
<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;color:#0F1110;padding-bottom:6px;">Çevrende.com — Çevrendekiler seni bulsun.</div>
<div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:#8A8A82;padding-bottom:14px;">Pendik ve çevresinde usta, temizlikçi, çilingir, bakıcı, kurye ve daha fazlası. Ücretsiz profil oluştur, çevrendeki insanlar seni bulsun.</div>
<div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;"><a href="https://cevrende.com" style="color:#D4541C;text-decoration:none;font-weight:bold;">cevrende.com</a></div>
<div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:16px;color:#B6B4AC;padding-top:14px;">Bu e-postayı {{eposta}} adresine gönderdik.</div>
</td>
</tr>

</table>
</td>
</tr>
</table>
</body>
</html>`,
  reset: `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<title>Çevrende — Şifre sıfırlama</title>
</head>
<body style="margin:0;padding:0;background-color:#F4F2EB;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#F4F2EB;">Şifre sıfırlama kodun: {{kod}}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F4F2EB;">
<tr>
<td align="center" style="padding:32px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">

<!-- Header / logo -->
<tr>
<td style="padding:4px 8px 22px 8px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0">
<tr>
<td style="width:44px;height:44px;background-color:#0F1110;border-radius:12px;text-align:center;vertical-align:middle;font-family:Arial,Helvetica,sans-serif;font-size:24px;font-weight:bold;color:#ffffff;line-height:44px;">Ç</td>
<td style="padding-left:12px;font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:bold;color:#0F1110;letter-spacing:-0.3px;">Çevrende</td>
</tr>
</table>
</td>
</tr>

<!-- Card -->
<tr>
<td style="background-color:#FFFFFF;border:1px solid #E7E3D8;border-radius:14px;padding:38px 40px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:bold;color:#0F1110;line-height:30px;padding-bottom:14px;">Şifreni sıfırla</td></tr>
<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:24px;color:#3a3a36;padding-bottom:8px;">Merhaba {{isim}},</td></tr>
<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:24px;color:#3a3a36;padding-bottom:24px;">Şifreni sıfırlamak için aşağıdaki kodu kullan. Kodu girdikten sonra yeni şifreni belirleyebilirsin.</td></tr>

<!-- Code box -->
<tr><td style="padding-bottom:24px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr>
<td align="center" style="background-color:#F4F2EB;border:1px solid #E7E3D8;border-radius:12px;padding:22px 16px;">
<div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#8A8A82;letter-spacing:1.5px;text-transform:uppercase;padding-bottom:10px;">Sıfırlama kodu</div>
<div style="font-family:'Courier New',Courier,monospace;font-size:36px;font-weight:bold;color:#0F1110;letter-spacing:10px;">{{kod}}</div>
</td>
</tr>
</table>
</td></tr>

<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:20px;color:#8A8A82;">Kod 10 dakika boyunca geçerlidir. Şifre sıfırlama isteğini sen yapmadıysan hesabın güvende — bu e-postayı görmezden gelebilir, dilersen şifreni değiştirebilirsin.</td></tr>
</table>
</td>
</tr>

<!-- Footer -->
<tr>
<td style="padding:28px 16px 8px 16px;text-align:center;">
<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;color:#0F1110;padding-bottom:6px;">Çevrende.com — Çevrendekiler seni bulsun.</div>
<div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:#8A8A82;padding-bottom:14px;">Pendik ve çevresinde usta, temizlikçi, çilingir, bakıcı, kurye ve daha fazlası. Ücretsiz profil oluştur, çevrendeki insanlar seni bulsun.</div>
<div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;"><a href="https://cevrende.com" style="color:#D4541C;text-decoration:none;font-weight:bold;">cevrende.com</a></div>
<div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:16px;color:#B6B4AC;padding-top:14px;">Bu e-postayı {{eposta}} adresine gönderdik.</div>
</td>
</tr>

</table>
</td>
</tr>
</table>
</body>
</html>`,
  welcome: `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<title>Çevrende — Hoş geldin</title>
</head>
<body style="margin:0;padding:0;background-color:#F4F2EB;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#F4F2EB;">Çevrende'ye hoş geldin — hesabın hazır, giriş bilgilerin içeride.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F4F2EB;">
<tr>
<td align="center" style="padding:32px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">

<!-- Header / logo -->
<tr>
<td style="padding:4px 8px 22px 8px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0">
<tr>
<td style="width:44px;height:44px;background-color:#0F1110;border-radius:12px;text-align:center;vertical-align:middle;font-family:Arial,Helvetica,sans-serif;font-size:24px;font-weight:bold;color:#ffffff;line-height:44px;">Ç</td>
<td style="padding-left:12px;font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:bold;color:#0F1110;letter-spacing:-0.3px;">Çevrende</td>
</tr>
</table>
</td>
</tr>

<!-- Card -->
<tr>
<td style="background-color:#FFFFFF;border:1px solid #E7E3D8;border-radius:14px;padding:38px 40px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:bold;color:#0F1110;line-height:30px;padding-bottom:14px;">Çevrende'ye hoş geldin</td></tr>
<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:24px;color:#3a3a36;padding-bottom:8px;">Merhaba {{isim}},</td></tr>
<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:24px;color:#3a3a36;padding-bottom:24px;">Hesabın hazır. Aşağıdaki bilgilerle giriş yapabilir, profilini oluşturarak çevrendeki insanlara görünür olabilirsin.</td></tr>

<!-- Credentials box -->
<tr><td style="padding-bottom:26px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F4F2EB;border:1px solid #E7E3D8;border-radius:12px;">
<tr>
<td style="padding:18px 20px 12px 20px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#8A8A82;letter-spacing:0.5px;text-transform:uppercase;">E-posta</td>
</tr>
<tr>
<td style="padding:0 20px 16px 20px;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;color:#0F1110;">{{eposta}}</td>
</tr>
<tr><td style="padding:0 20px;"><div style="height:1px;background-color:#E7E3D8;line-height:1px;font-size:1px;">&nbsp;</div></td></tr>
<tr>
<td style="padding:16px 20px 12px 20px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#8A8A82;letter-spacing:0.5px;text-transform:uppercase;">Geçici şifre</td>
</tr>
<tr>
<td style="padding:0 20px 18px 20px;font-family:'Courier New',Courier,monospace;font-size:22px;font-weight:bold;color:#0F1110;letter-spacing:2px;">{{gecici_sifre}}</td>
</tr>
</table>
</td></tr>

<!-- Button -->
<tr><td style="padding-bottom:22px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0">
<tr>
<td align="center" bgcolor="#D4541C" style="border-radius:10px;">
<a href="{{giris_linki}}" style="display:inline-block;padding:14px 30px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:10px;">Giriş yap</a>
</td>
</tr>
</table>
</td></tr>

<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:20px;color:#8A8A82;">Güvenliğin için ilk girişten sonra geçici şifreni değiştirmeni öneririz.</td></tr>
</table>
</td>
</tr>

<!-- Footer -->
<tr>
<td style="padding:28px 16px 8px 16px;text-align:center;">
<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;color:#0F1110;padding-bottom:6px;">Çevrende.com — Çevrendekiler seni bulsun.</div>
<div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:#8A8A82;padding-bottom:14px;">Pendik ve çevresinde usta, temizlikçi, çilingir, bakıcı, kurye ve daha fazlası. Ücretsiz profil oluştur, çevrendeki insanlar seni bulsun.</div>
<div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;"><a href="https://cevrende.com" style="color:#D4541C;text-decoration:none;font-weight:bold;">cevrende.com</a></div>
<div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:16px;color:#B6B4AC;padding-top:14px;">Bu e-postayı {{eposta}} adresine gönderdik.</div>
</td>
</tr>

</table>
</td>
</tr>
</table>
</body>
</html>`,
  warn: `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<title>Çevrende — Hesap uyarısı</title>
</head>
<body style="margin:0;padding:0;background-color:#F4F2EB;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#F4F2EB;">Hesabınla ilgili önemli bir uyarı var.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F4F2EB;">
<tr>
<td align="center" style="padding:32px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">

<!-- Header / logo -->
<tr>
<td style="padding:4px 8px 22px 8px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0">
<tr>
<td style="width:44px;height:44px;background-color:#0F1110;border-radius:12px;text-align:center;vertical-align:middle;font-family:Arial,Helvetica,sans-serif;font-size:24px;font-weight:bold;color:#ffffff;line-height:44px;">Ç</td>
<td style="padding-left:12px;font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:bold;color:#0F1110;letter-spacing:-0.3px;">Çevrende</td>
</tr>
</table>
</td>
</tr>

<!-- Card -->
<tr>
<td style="background-color:#FFFFFF;border:1px solid #E7E3D8;border-radius:14px;padding:38px 40px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:bold;color:#0F1110;line-height:30px;padding-bottom:14px;">Hesabınla ilgili bir uyarı</td></tr>
<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:24px;color:#3a3a36;padding-bottom:22px;">Merhaba {{isim}}, hesabınla ilgili dikkatini çekmek istediğimiz bir konu var.</td></tr>

<!-- Warning box -->
<tr><td style="padding-bottom:24px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#FBF3DC;border:1px solid #EAD8A6;border-radius:12px;">
<tr>
<td style="width:6px;background-color:#E0A92B;border-top-left-radius:12px;border-bottom-left-radius:12px;font-size:1px;line-height:1px;">&nbsp;</td>
<td style="padding:18px 20px;">
<div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:bold;color:#9A6B12;letter-spacing:0.5px;text-transform:uppercase;padding-bottom:8px;">Uyarı</div>
<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:23px;color:#5c4a1e;">{{uyari_metni}}</div>
</td>
</tr>
</table>
</td></tr>

<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:24px;color:#3a3a36;padding-bottom:24px;">Çevrende'nin güvenli ve saygılı bir topluluk olması herkes için önemli. Bir hata olduğunu düşünüyorsan veya sorun olduğunu düşünüyorsan bizimle iletişime geçebilirsin.</td></tr>

<!-- Button -->
<tr><td>
<table role="presentation" cellpadding="0" cellspacing="0" border="0">
<tr>
<td align="center" bgcolor="#D4541C" style="border-radius:10px;">
<a href="{{giris_linki}}" style="display:inline-block;padding:14px 30px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:10px;">Hesabıma git</a>
</td>
</tr>
</table>
</td></tr>
</table>
</td>
</tr>

<!-- Footer -->
<tr>
<td style="padding:28px 16px 8px 16px;text-align:center;">
<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;color:#0F1110;padding-bottom:6px;">Çevrende.com — Çevrendekiler seni bulsun.</div>
<div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:#8A8A82;padding-bottom:14px;">Pendik ve çevresinde usta, temizlikçi, çilingir, bakıcı, kurye ve daha fazlası. Ücretsiz profil oluştur, çevrendeki insanlar seni bulsun.</div>
<div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;"><a href="https://cevrende.com" style="color:#D4541C;text-decoration:none;font-weight:bold;">cevrende.com</a></div>
<div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:16px;color:#B6B4AC;padding-top:14px;">Bu e-postayı {{eposta}} adresine gönderdik.</div>
</td>
</tr>

</table>
</td>
</tr>
</table>
</body>
</html>`,
  job: `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<title>Çevrende — Meslek önerin onaylandı</title>
</head>
<body style="margin:0;padding:0;background-color:#F4F2EB;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#F4F2EB;">Önerdiğin meslek onaylandı: {{meslek_adi}}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F4F2EB;">
<tr>
<td align="center" style="padding:32px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">

<!-- Header / logo -->
<tr>
<td style="padding:4px 8px 22px 8px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0">
<tr>
<td style="width:44px;height:44px;background-color:#0F1110;border-radius:12px;text-align:center;vertical-align:middle;font-family:Arial,Helvetica,sans-serif;font-size:24px;font-weight:bold;color:#ffffff;line-height:44px;">Ç</td>
<td style="padding-left:12px;font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:bold;color:#0F1110;letter-spacing:-0.3px;">Çevrende</td>
</tr>
</table>
</td>
</tr>

<!-- Card -->
<tr>
<td style="background-color:#FFFFFF;border:1px solid #E7E3D8;border-radius:14px;padding:38px 40px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:bold;color:#0F1110;line-height:30px;padding-bottom:14px;">Meslek önerin onaylandı</td></tr>
<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:24px;color:#3a3a36;padding-bottom:8px;">Merhaba {{isim}},</td></tr>
<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:24px;color:#3a3a36;padding-bottom:24px;">Önerdiğin meslek ekibimiz tarafından incelendi ve onaylandı. Teşekkür ederiz — bu sayede çevrendeki daha çok kişi doğru hizmete ulaşacak.</td></tr>

<!-- Success box -->
<tr><td style="padding-bottom:26px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#E9F3EC;border:1px solid #BFE0CA;border-radius:12px;">
<tr>
<td align="center" style="padding:24px 20px;">
<div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:bold;color:#2E7D49;letter-spacing:0.5px;text-transform:uppercase;padding-bottom:10px;">✓ Onaylandı</div>
<div style="font-family:Arial,Helvetica,sans-serif;font-size:24px;font-weight:bold;color:#1E5B33;line-height:30px;">{{meslek_adi}}</div>
<div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#4a7a59;padding-top:8px;">artık Çevrende'de listeleniyor</div>
</td>
</tr>
</table>
</td></tr>

<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:24px;color:#3a3a36;padding-bottom:24px;">Profiline bu mesleği ekleyerek bu alanda hizmet aradığını veya verdiğini gösterebilirsin.</td></tr>

<!-- Button -->
<tr><td>
<table role="presentation" cellpadding="0" cellspacing="0" border="0">
<tr>
<td align="center" bgcolor="#D4541C" style="border-radius:10px;">
<a href="{{giris_linki}}" style="display:inline-block;padding:14px 30px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:10px;">Profilini güncelle</a>
</td>
</tr>
</table>
</td></tr>
</table>
</td>
</tr>

<!-- Footer -->
<tr>
<td style="padding:28px 16px 8px 16px;text-align:center;">
<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;color:#0F1110;padding-bottom:6px;">Çevrende.com — Çevrendekiler seni bulsun.</div>
<div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:#8A8A82;padding-bottom:14px;">Pendik ve çevresinde usta, temizlikçi, çilingir, bakıcı, kurye ve daha fazlası. Ücretsiz profil oluştur, çevrendeki insanlar seni bulsun.</div>
<div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;"><a href="https://cevrende.com" style="color:#D4541C;text-decoration:none;font-weight:bold;">cevrende.com</a></div>
<div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:16px;color:#B6B4AC;padding-top:14px;">Bu e-postayı {{eposta}} adresine gönderdik.</div>
</td>
</tr>

</table>
</td>
</tr>
</table>
</body>
</html>`,
  msg: `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<title>Çevrende — Yönetimden mesaj</title>
</head>
<body style="margin:0;padding:0;background-color:#F4F2EB;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#F4F2EB;">Çevrende ekibinden sana bir mesaj var.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F4F2EB;">
<tr>
<td align="center" style="padding:32px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">

<!-- Header / logo -->
<tr>
<td style="padding:4px 8px 22px 8px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0">
<tr>
<td style="width:44px;height:44px;background-color:#0F1110;border-radius:12px;text-align:center;vertical-align:middle;font-family:Arial,Helvetica,sans-serif;font-size:24px;font-weight:bold;color:#ffffff;line-height:44px;">Ç</td>
<td style="padding-left:12px;font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:bold;color:#0F1110;letter-spacing:-0.3px;">Çevrende</td>
</tr>
</table>
</td>
</tr>

<!-- Card -->
<tr>
<td style="background-color:#FFFFFF;border:1px solid #E7E3D8;border-radius:14px;padding:38px 40px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:bold;color:#0F1110;line-height:30px;padding-bottom:14px;">Çevrende ekibinden bir mesaj</td></tr>
<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:24px;color:#3a3a36;padding-bottom:22px;">Merhaba {{isim}}, yönetim ekibimiz sana bir mesaj iletti:</td></tr>

<!-- Message box -->
<tr><td style="padding-bottom:26px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F4F2EB;border:1px solid #E7E3D8;border-radius:12px;">
<tr>
<td style="padding:20px 22px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="padding-bottom:12px;">
<tr>
<td style="width:30px;height:30px;background-color:#0F1110;border-radius:8px;text-align:center;vertical-align:middle;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;color:#ffffff;line-height:30px;">Ç</td>
<td style="padding-left:10px;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;color:#0F1110;">Çevrende Yönetim<div style="font-size:11px;font-weight:normal;color:#8A8A82;padding-top:2px;">resmi mesaj</div></td>
</tr>
</table>
<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:24px;color:#2a2a27;">{{mesaj}}</div>
</td>
</tr>
</table>
</td></tr>

<!-- Button -->
<tr><td style="padding-bottom:22px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0">
<tr>
<td align="center" bgcolor="#D4541C" style="border-radius:10px;">
<a href="{{giris_linki}}" style="display:inline-block;padding:14px 30px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:10px;">Mesajlara git</a>
</td>
</tr>
</table>
</td></tr>

<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:20px;color:#8A8A82;">Bu mesaja Çevrende üzerinden yanıt verebilirsin. Sorularını yanıtlamaktan memnuniyet duyarız.</td></tr>
</table>
</td>
</tr>

<!-- Footer -->
<tr>
<td style="padding:28px 16px 8px 16px;text-align:center;">
<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;color:#0F1110;padding-bottom:6px;">Çevrende.com — Çevrendekiler seni bulsun.</div>
<div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:#8A8A82;padding-bottom:14px;">Pendik ve çevresinde usta, temizlikçi, çilingir, bakıcı, kurye ve daha fazlası. Ücretsiz profil oluştur, çevrendeki insanlar seni bulsun.</div>
<div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;"><a href="https://cevrende.com" style="color:#D4541C;text-decoration:none;font-weight:bold;">cevrende.com</a></div>
<div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:16px;color:#B6B4AC;padding-top:14px;">Bu e-postayı {{eposta}} adresine gönderdik.</div>
</td>
</tr>

</table>
</td>
</tr>
</table>
</body>
</html>`,
};

// {{degisken}} alanlarını doldurur. Değerler çağırandan ESCAPE EDİLMİŞ gelir.
export function renderEmail(
  key: EmailTemplateKey,
  vars: Record<string, string>,
): string {
  let html = EMAIL_TEMPLATES[key];
  for (const [k, v] of Object.entries(vars)) {
    html = html.split(`{{${k}}}`).join(v ?? "");
  }
  // İsim yoksa "Merhaba ," -> "Merhaba,"
  html = html.replace(/Merhaba\s*,/g, "Merhaba,");
  // Doldurulmamış kalan değişken varsa temizle
  html = html.replace(/\{\{\w+\}\}/g, "");
  return html;
}
