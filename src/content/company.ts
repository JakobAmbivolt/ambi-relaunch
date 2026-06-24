export const company = {
  legalName: "AmbiVolt Energietechnik GmbH",
  shortName: "AmbiVolt",
  street: "Oberalmsham 1",
  zip: "84140",
  city: "Gangkofen",
  phoneDisplay: "08722 – 966 85 77",
  phoneHref: "tel:+4987229668577", // korrigiert (Original-tel-Link war fehlerhaft)
  email: "anfrage@ambivolt.de",
  claim:
    "Hersteller für Montagesysteme für Solar- & Photovoltaik-Anlagen, die nach neuestem Stand der Technik entwickelt und hergestellt werden. Mit unserer langjährigen Erfahrung bieten wir Ihnen die besten Lösungen für Ihre Solarprojekte.",
  hours: [
    { days: "Montag – Freitag", time: "08:00 – 12:00 Uhr · 12:30 – 16:30 Uhr" },
    { days: "", time: "Besuche nach Terminvereinbarung" },
  ],
  hoursNote:
    "Wir nehmen uns gerne alle Zeit der Welt für Sie. Daher freuen wir uns, wenn Sie mit uns einen Termin abstimmen.",
  social: {
    facebook: "https://de-de.facebook.com/people/AmbiVolt-Energietechnik-GmbH/100066468475063/",
    linkedin: "https://www.linkedin.com/company/ambivolt-energietechnik-gmbh/about/",
  },
  agency: { name: "Wallner Marketing", url: "https://wallner-marketing.de/" },
} as const;
