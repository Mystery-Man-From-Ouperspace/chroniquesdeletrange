import { CDE } from "./config.js";

export function registerHandlebarsHelpers() {
  Handlebars.registerHelper("getMagicBackground", function (magic) {
    return game.i18n.localize(CDE.magics[magic].background);
  });

  Handlebars.registerHelper("getMagicLabel", function (magic) {
    return game.i18n.localize(CDE.magics[magic].label);
  });

  Handlebars.registerHelper("getMagicAspectLabel", function (magic) {
    return game.i18n.localize(CDE.magics[magic].aspectlabel);
  });

  Handlebars.registerHelper("getMagicSpecialityLabel", function (magic, speciality) {
    return game.i18n.localize(CDE.magics[magic].speciality[speciality].label);
  });

  Handlebars.registerHelper("getMagicSpecialityClassIcon", function (magic, speciality) {
    return CDE.magics[magic].speciality[speciality].classicon;
  });

  Handlebars.registerHelper("getMagicSpecialityIcon", function (magic, speciality) {
    return CDE.magics[magic].speciality[speciality].icon;
  });

  Handlebars.registerHelper("getMagicSpecialityElementIcon", function (magic, speciality) {
    return CDE.magics[magic].speciality[speciality].elementicon;
  });

  Handlebars.registerHelper("getMagicSpecialityLabelIcon", function (magic, speciality) {
    return CDE.magics[magic].speciality[speciality].labelicon;
  });

  Handlebars.registerHelper("getMagicSpecialityLabelElement", function (magic, speciality) {
    return game.i18n.localize(CDE.magics[magic].speciality[speciality].labelelement);
  });
}
