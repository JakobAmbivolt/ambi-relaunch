import type { NavItem } from "./types";

export const productSubmenu: NavItem[] = [
  { label: "Flachdach-Systeme", href: "/produkte/flachdachsysteme/" },
  { label: "Ziegel- & Steindach-Systeme", href: "/produkte/ziegel-und-steindachsysteme/" },
  { label: "Trapezblechsysteme", href: "/produkte/trapezblechsysteme/" },
  { label: "Falzblechsysteme", href: "/produkte/falzblechsysteme/" },
  { label: "Welldach-Systeme", href: "/produkte/welldachsysteme/" },
  { label: "Ergänzungsprodukte", href: "/produkte/ergaenzungsprodukte-photovoltaik/" },
];

export const mainNav: NavItem[] = [
  { label: "Produkte", href: "/produkte/", children: productSubmenu },
  { label: "Unternehmen", href: "/unternehmen/" },
  { label: "Referenzen", href: "/unsere-solarprojekte/" },
  { label: "Karriere", href: "/jobs-und-stellenangebote/" },
  { label: "Kontakt", href: "/kontakt/" },
];
