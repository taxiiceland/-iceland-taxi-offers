const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";

function pagePath(path: string) {
  return isStaticExport ? `./${path}.html` : `/${path}`;
}

function homePath(hash: string) {
  return isStaticExport ? `./index.html${hash}` : `/${hash}`;
}

export const links = {
  home: homePath("#home"),
  airport: homePath("#airport-transfer"),
  tours: homePath("#private-tours"),
  offers: homePath("#offers"),
  book: homePath("#book-now"),
  privacy: pagePath("privacy-policy"),
  terms: pagePath("terms-and-conditions"),
  cancellation: pagePath("cancellation-policy"),
  contact: pagePath("contact")
};
