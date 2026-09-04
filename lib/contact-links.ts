import { contact } from "./site-data";

export function telLink(phone = contact.phone) {
  return `tel:${phone.replaceAll(" ", "")}`;
}
