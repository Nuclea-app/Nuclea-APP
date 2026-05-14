import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export function buildCapsuleEmailHtml(params: {
  recipientName: string;
  senderName?: string;
  capsuleUrl: string;
}): string {
  const { recipientName, senderName, capsuleUrl } = params;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Alguien te envió una cápsula</title>
</head>
<body style="margin:0;padding:0;background:#ffffff;font-family:'Inter',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
    <tr>
      <td align="center" style="padding:48px 24px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:40px;">
              <span style="font-size:13px;font-weight:700;letter-spacing:0.3em;color:#0a0a0a;text-transform:uppercase;">NUCLEA ✦</span>
            </td>
          </tr>

          <!-- Separador -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:32px;height:1px;background:#e8e8e6;"></td>
                  <td style="padding:0 12px;color:#888;font-size:16px;">✦</td>
                  <td style="width:32px;height:1px;background:#e8e8e6;"></td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Título principal -->
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <h1 style="margin:0;font-size:28px;font-weight:400;color:#0a0a0a;line-height:1.4;font-family:Georgia,serif;">
                Si estás viendo esto...<br/>alguien quiso que llegara hasta ti.
              </h1>
            </td>
          </tr>

          <!-- Cuerpo -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <p style="margin:0;font-size:15px;color:#555;line-height:1.7;text-align:center;max-width:360px;">
                ${senderName ? `<strong>${senderName}</strong> ha preparado` : "Alguien ha preparado"} una cápsula de recuerdos especialmente para ti, <strong>${recipientName}</strong>. Dentro encontrarás momentos, historias y palabras guardadas con cuidado.
              </p>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td align="center" style="padding-bottom:40px;">
              <a href="${capsuleUrl}"
                style="display:inline-block;background:#0a0a0a;color:#ffffff;text-decoration:none;padding:16px 40px;border-radius:50px;font-size:13px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;">
                ✦ ABRIR CÁPSULA
              </a>
            </td>
          </tr>

          <!-- Separador -->
          <tr>
            <td style="height:1px;background:#e8e8e6;padding-bottom:32px;"></td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:32px;">
              <p style="margin:0;font-size:11px;color:#aaa;letter-spacing:0.1em;">
                🔒 Creado especialmente para ti · <a href="${capsuleUrl}" style="color:#aaa;">${capsuleUrl}</a>
              </p>
              <p style="margin:8px 0 0;font-size:10px;color:#ccc;letter-spacing:0.2em;text-transform:uppercase;">
                ✦ NUCLEA
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
