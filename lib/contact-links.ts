import { contact } from "./site-data";

export function telLink(phone = contact.phone) {
  return `tel:${phone.replaceAll(" ", "")}`;
}

export function whatsappLink(phone = contact.whatsapp) {
  return `https://wa.me/${phone.replace(/\D/g, "")}`;
}
