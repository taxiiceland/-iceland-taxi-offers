import { contact } from "./site-data";

export function telLink(phone = contact.phone) {
  return `tel:${phone.replaceAll(" ", "")}`;
}

export function whatsappLink(phone = contact.whatsapp) {
  const number = phone.replace(/[^\d]/g, "");
  const message = encodeURIComponent(
    "Hello Iceland Taxi Offers, I would like to ask about a private transfer."
  );

  return `https://wa.me/${number}?text=${message}`;
}
