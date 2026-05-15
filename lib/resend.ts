import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export function buildCapsuleEmailHtml(params: {
  recipientName: string;
  senderName?: string;
  capsuleUrl: string;
}): string {
  const { capsuleUrl } = params;

  // Los emails requieren URLs absolutas y públicas. Tomamos el origen de la
  // URL de la cápsula (debe ser el dominio desplegado, no localhost).
  let origin = "https://nuclea.app";
  try {
    origin = new URL(capsuleUrl).origin;
  } catch {
    // se mantiene el fallback
  }
  const capsuleImageUrl = `${origin}/nuclea-logo.png`;

  // Iconos PNG outline negros (estilo line-icon, compatibles con email).
  const icon = (name: string) =>
    `https://img.icons8.com/material-outlined/100/${name}.png`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Alguien te envió una cápsula</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600&display=swap" rel="stylesheet" />
</head>
<body style="margin:0;padding:0;background:#ffffff;font-family:'Inter',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
    <tr>
      <td align="center" style="padding:48px 24px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:460px;">

          <!-- Logo NUCLEA -->
          <tr>
            <td align="center" style="padding-bottom:22px;">
              <span style="font-family:'Inter',Helvetica,Arial,sans-serif;font-size:15px;font-weight:700;letter-spacing:0.38em;color:#0a0a0a;text-transform:uppercase;">NUCLEA</span>
            </td>
          </tr>

          <!-- Estrella -->
          <tr>
            <td align="center" style="padding-bottom:30px;">
              <span style="font-size:17px;color:#0a0a0a;">&#10022;</span>
            </td>
          </tr>

          <!-- Título principal -->
          <tr>
            <td align="center" style="padding-bottom:26px;">
              <h1 style="margin:0;font-size:30px;font-weight:500;color:#0a0a0a;line-height:1.35;font-family:'Playfair Display',Georgia,'Times New Roman',serif;">
                Si estás viendo esto...<br/>alguien quiso que llegara hasta ti.
              </h1>
            </td>
          </tr>

          <!-- Estrella -->
          <tr>
            <td align="center" style="padding-bottom:26px;">
              <span style="font-size:15px;color:#0a0a0a;">&#10022;</span>
            </td>
          </tr>

          <!-- Imagen de la cápsula -->
          <tr>
            <td align="center" style="padding-bottom:34px;">
              <img src="${capsuleImageUrl}" alt="Cápsula Nuclea" width="230" style="display:block;width:230px;max-width:78%;height:auto;border:0;outline:none;" />
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td align="center" style="padding-bottom:30px;">
              <a href="${capsuleUrl}"
                style="display:inline-block;background:#0a0a0a;color:#ffffff;text-decoration:none;padding:17px 44px;border-radius:50px;font-family:'Inter',Helvetica,Arial,sans-serif;font-size:13px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;">
                &#10022;&nbsp;&nbsp;ABRIR CÁPSULA
              </a>
            </td>
          </tr>

          <!-- Icono candado -->
          <tr>
            <td align="center" style="padding-bottom:12px;">
              <img src="${icon("lock")}" alt="" width="22" height="22" style="display:block;border:0;" />
            </td>
          </tr>

          <!-- Texto de privacidad -->
          <tr>
            <td align="center" style="padding-bottom:42px;">
              <p style="margin:0;font-family:'Inter',Helvetica,Arial,sans-serif;font-size:13px;color:#9a9a9a;line-height:1.7;text-align:center;">
                Este regalo es privado y personal.<br/>Solo tú puedes abrir esta cápsula.
              </p>
            </td>
          </tr>

          <!-- Separador -->
          <tr>
            <td style="height:1px;background:#ececea;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:34px;">
              <p style="margin:0 0 8px;font-family:'Inter',Helvetica,Arial,sans-serif;font-size:13px;font-weight:700;color:#0a0a0a;">
                Hecho con &#10022; por Nuclea
              </p>
              <p style="margin:0 0 22px;font-family:'Inter',Helvetica,Arial,sans-serif;font-size:11px;color:#b0b0b0;line-height:1.6;">
                Lo que hoy vives, mañana tendrá aún más significado.
              </p>
              <table cellpadding="0" cellspacing="0" align="center">
                <tr>
                  <td style="padding:0 11px;">
                    <a href="https://instagram.com/nuclea.app">
                      <img src="${icon("instagram-new")}" alt="Instagram" width="21" height="21" style="display:block;border:0;" />
                    </a>
                  </td>
                  <td style="padding:0 11px;">
                    <a href="https://tiktok.com/@nuclea.app">
                      <img src="${icon("tiktok")}" alt="TikTok" width="21" height="21" style="display:block;border:0;" />
                    </a>
                  </td>
                  <td style="padding:0 11px;">
                    <a href="${capsuleUrl}">
                      <img src="${icon("new-post")}" alt="Email" width="21" height="21" style="display:block;border:0;" />
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
