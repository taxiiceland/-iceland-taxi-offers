import type { BookingNotification } from "./booking";
import { contact } from "./site-data";

type EmailResult = {
  configured: boolean;
  provider: "resend" | "not-configured";
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function notificationRows(notification: BookingNotification) {
  return [
    ["Customer name", notification.customerName],
    ["Phone", notification.phone],
    ["Email", notification.email],
    ["Route / tour", notification.selectedRoute],
    ["Pickup location", notification.pickup],
    ["Drop-off location", notification.dropoff],
    ["Date", notification.date],
    ["Time", notification.time],
    ["Passengers", notification.passengers],
    ["Suitcases", notification.suitcases],
    ["Special luggage", notification.specialLuggage],
    ["Notes", notification.notes],
    ["Regular price", notification.regularPrice],
    ["Summer discount", notification.summerDiscount],
    ["Final summer price", notification.summerPrice],
    ["You save", notification.youSave],
    ["Time blocked", notification.blockedTime]
  ] as const;
}

function buildTextEmail(notification: BookingNotification) {
  return notificationRows(notification)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");
}

function buildHtmlEmail(notification: BookingNotification) {
  const rows = notificationRows(notification)
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;color:#475569;font-weight:700;">${escapeHtml(label)}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;color:#0f172a;font-weight:800;">${escapeHtml(value)}</td>
        </tr>`
    )
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;color:#0f172a;">
      <h1 style="margin:0 0 16px;font-size:24px;">New Iceland Taxi Offers Booking</h1>
      <p style="margin:0 0 18px;color:#475569;">A customer has reserved a taxi. No online payment was collected.</p>
      <table style="border-collapse:collapse;width:100%;max-width:720px;border:1px solid #e5e7eb;">
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

export async function sendBookingEmail(
  notification: BookingNotification
): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.BOOKING_EMAIL_FROM;
  const to = process.env.BOOKING_EMAIL_TO || contact.email;

  if (!apiKey || !from) {
    console.warn(
      "Booking email not sent: RESEND_API_KEY and BOOKING_EMAIL_FROM are not configured."
    );
    return { configured: false, provider: "not-configured" };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to,
      subject: notification.subject,
      text: buildTextEmail(notification),
      html: buildHtmlEmail(notification),
      reply_to:
        notification.email === "Not provided" ? undefined : notification.email
    })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Booking email failed: ${message}`);
  }

  return { configured: true, provider: "resend" };
}
