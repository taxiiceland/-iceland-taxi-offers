import type { BookingNotification } from "./booking";
import { contact } from "./site-data";

type EmailResult = {
  configured: boolean;
  provider: "resend" | "not-configured";
  skipped?: boolean;
  id?: string;
  status?: number;
  error?: string;
};

type ResendEmailPayload = {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
  reply_to?: string;
};

type ResendResponse = {
  id?: string;
  name?: string;
  message?: string;
  error?: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function maskEmail(email: string) {
  const [name, domain] = email.split("@");

  if (!domain) {
    return email;
  }

  const visible = name.slice(0, 2);

  return `${visible}${name.length > 2 ? "***" : ""}@${domain}`;
}

async function parseResendResponse(response: Response) {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text) as ResendResponse;
  } catch {
    return { message: text };
  }
}

async function sendResendEmail(
  kind: "owner" | "customer",
  payload: ResendEmailPayload
): Promise<EmailResult> {
  console.info(`[email:${kind}] sending`, {
    to: maskEmail(payload.to),
    from: payload.from,
    subject: payload.subject
  });

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  const result = await parseResendResponse(response);

  if (!response.ok) {
    const message =
      result.message ||
      result.error ||
      result.name ||
      "Resend returned an unknown error.";

    console.error(`[email:${kind}] failed`, {
      to: maskEmail(payload.to),
      status: response.status,
      error: message
    });

    throw new Error(`${kind} email failed (${response.status}): ${message}`);
  }

  console.info(`[email:${kind}] sent`, {
    to: maskEmail(payload.to),
    status: response.status,
    id: result.id
  });

  return {
    configured: true,
    provider: "resend",
    id: result.id,
    status: response.status
  };
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

function customerPriceLine(notification: BookingNotification) {
  if (notification.summerPrice === "Price confirmed before booking") {
    return notification.summerPrice;
  }

  return `${notification.summerPrice} (${notification.summerDiscount}; regular price ${notification.regularPrice})`;
}

function customerRows(notification: BookingNotification) {
  return [
    ["Name", notification.customerName],
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
    ["Price / final price", customerPriceLine(notification)],
    ["Time blocked", notification.blockedTime]
  ] as const;
}

function buildCustomerTextEmail(notification: BookingNotification) {
  const details = customerRows(notification)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");

  return `Thank you for choosing Iceland Taxi Offers.

We have received your booking request and will review it shortly.

Please note:
No online payment is required. Payment is made after the ride by card terminal or cash.

Booking details:
${details}

If you need to change anything, reply to this email or contact us.

Best regards,
Iceland Taxi Offers
Licensed Icelandic Taxi Driver`;
}

function buildCustomerHtmlEmail(notification: BookingNotification) {
  const rows = customerRows(notification)
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;color:#475569;font-weight:700;">${escapeHtml(label)}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;color:#0f172a;font-weight:800;">${escapeHtml(value)}</td>
        </tr>`
    )
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;color:#0f172a;line-height:1.6;">
      <h1 style="margin:0 0 16px;font-size:24px;">Your booking has been received</h1>
      <p style="margin:0 0 14px;">Thank you for choosing Iceland Taxi Offers.</p>
      <p style="margin:0 0 18px;">We have received your booking request and will review it shortly.</p>
      <div style="margin:0 0 20px;padding:14px 16px;background:#f8fafc;border:1px solid #e5e7eb;border-radius:12px;">
        <strong>Please note:</strong><br />
        No online payment is required. Payment is made after the ride by card terminal or cash.
      </div>
      <table style="border-collapse:collapse;width:100%;max-width:720px;border:1px solid #e5e7eb;">
        <tbody>${rows}</tbody>
      </table>
      <p style="margin:20px 0 0;">If you need to change anything, reply to this email or contact us.</p>
      <p style="margin:20px 0 0;">Best regards,<br />Iceland Taxi Offers<br />Licensed Icelandic Taxi Driver</p>
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

  return sendResendEmail("owner", {
    from,
    to,
    subject: notification.subject,
    text: buildTextEmail(notification),
    html: buildHtmlEmail(notification),
    reply_to:
      notification.email === "Not provided" ? undefined : notification.email
  });
}

export async function sendCustomerConfirmationEmail(
  notification: BookingNotification
): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.BOOKING_EMAIL_FROM;
  const replyTo = process.env.BOOKING_EMAIL_TO || contact.email;

  if (notification.email === "Not provided") {
    return { configured: true, provider: "resend", skipped: true };
  }

  if (!apiKey || !from) {
    console.warn(
      "Customer booking email not sent: RESEND_API_KEY and BOOKING_EMAIL_FROM are not configured."
    );
    return { configured: false, provider: "not-configured" };
  }

  return sendResendEmail("customer", {
    from,
    to: notification.email,
    subject: "Your booking has been received – Iceland Taxi Offers 🚖",
    text: buildCustomerTextEmail(notification),
    html: buildCustomerHtmlEmail(notification),
    reply_to: replyTo
  });
}

type CustomerStatusEmailType = "confirmed" | "completed" | "cancelled";

const customerStatusSubjects: Record<CustomerStatusEmailType, string> = {
  confirmed: "Your Iceland Taxi Offers booking is confirmed",
  completed: "Thank you for choosing Iceland Taxi Offers",
  cancelled: "Your Iceland Taxi Offers booking has been cancelled"
};

function bookingStatusRows(
  notification: BookingNotification,
  cancellationReason?: string
) {
  const rows = [
    ["Customer name", notification.customerName],
    ["Booking date & time", `${notification.date} ${notification.time}`],
    ["Route", notification.selectedRoute],
    ["Pickup", notification.pickup],
    ["Drop-off", notification.dropoff]
  ];
  const reason = cancellationReason?.trim();

  if (reason) {
    rows.push(["Cancellation reason", reason]);
  }

  return rows;
}

function buildCustomerStatusTextEmail(
  notification: BookingNotification,
  status: CustomerStatusEmailType,
  cancellationReason?: string
) {
  const details = bookingStatusRows(notification, cancellationReason)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");

  if (status === "cancelled") {
    return `Your Iceland Taxi Offers booking has been cancelled.

Booking details:
${details}

We sincerely apologize for the inconvenience.
If you would like to arrange another ride, simply reply to this email.

— Iceland Taxi Offers`;
  }

  if (status === "completed") {
    return `Thank you for choosing Iceland Taxi Offers.

We hope everything went smoothly with your ride. We would be happy to welcome you again whenever you need a private taxi, airport transfer, or private tour in Iceland.

Booking details:
${details}

Best regards,
Iceland Taxi Offers
Licensed Icelandic Taxi Driver`;
  }

  return `Your Iceland Taxi Offers booking is confirmed.

Booking details:
${details}

No online payment is required. Payment is made after the ride by card terminal or cash.

Best regards,
Iceland Taxi Offers
Licensed Icelandic Taxi Driver`;
}

function buildCustomerStatusHtmlEmail(
  notification: BookingNotification,
  status: CustomerStatusEmailType,
  cancellationReason?: string
) {
  const rows = bookingStatusRows(notification, cancellationReason)
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;color:#475569;font-weight:700;">${escapeHtml(label)}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;color:#0f172a;font-weight:800;">${escapeHtml(value)}</td>
        </tr>`
    )
    .join("");

  if (status === "cancelled") {
    return `
      <div style="font-family:Arial,sans-serif;color:#0f172a;line-height:1.6;">
        <h1 style="margin:0 0 16px;font-size:24px;">Your booking has been cancelled</h1>
        <table style="border-collapse:collapse;width:100%;max-width:720px;border:1px solid #e5e7eb;">
          <tbody>${rows}</tbody>
        </table>
        <p style="margin:20px 0 0;">We sincerely apologize for the inconvenience.<br />If you would like to arrange another ride, simply reply to this email.</p>
        <p style="margin:20px 0 0;">— Iceland Taxi Offers</p>
      </div>`;
  }

  if (status === "completed") {
    return `
      <div style="font-family:Arial,sans-serif;color:#0f172a;line-height:1.6;">
        <h1 style="margin:0 0 16px;font-size:24px;">Thank you for choosing Iceland Taxi Offers</h1>
        <p style="margin:0 0 18px;">We hope everything went smoothly with your ride. We would be happy to welcome you again whenever you need a private taxi, airport transfer, or private tour in Iceland.</p>
        <table style="border-collapse:collapse;width:100%;max-width:720px;border:1px solid #e5e7eb;">
          <tbody>${rows}</tbody>
        </table>
        <p style="margin:20px 0 0;">Best regards,<br />Iceland Taxi Offers<br />Licensed Icelandic Taxi Driver</p>
      </div>`;
  }

  return `
    <div style="font-family:Arial,sans-serif;color:#0f172a;line-height:1.6;">
      <h1 style="margin:0 0 16px;font-size:24px;">Your booking is confirmed</h1>
      <table style="border-collapse:collapse;width:100%;max-width:720px;border:1px solid #e5e7eb;">
        <tbody>${rows}</tbody>
      </table>
      <p style="margin:20px 0 0;">No online payment is required. Payment is made after the ride by card terminal or cash.</p>
      <p style="margin:20px 0 0;">Best regards,<br />Iceland Taxi Offers<br />Licensed Icelandic Taxi Driver</p>
    </div>`;
}

export async function sendCustomerStatusEmail(
  notification: BookingNotification,
  status: CustomerStatusEmailType,
  cancellationReason?: string
): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.BOOKING_EMAIL_FROM;
  const replyTo = process.env.BOOKING_EMAIL_TO || contact.email;

  if (notification.email === "Not provided") {
    return { configured: true, provider: "resend", skipped: true };
  }

  if (!apiKey || !from) {
    console.warn(
      "Customer status email not sent: RESEND_API_KEY and BOOKING_EMAIL_FROM are not configured."
    );
    return { configured: false, provider: "not-configured" };
  }

  return sendResendEmail("customer", {
    from,
    to: notification.email,
    subject: customerStatusSubjects[status],
    text: buildCustomerStatusTextEmail(
      notification,
      status,
      cancellationReason
    ),
    html: buildCustomerStatusHtmlEmail(
      notification,
      status,
      cancellationReason
    ),
    reply_to: replyTo
  });
}
