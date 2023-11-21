import { CDEActor } from "./actor/actor.js";
import { CDEItem } from "./item/item.js";

import { CDECharacterSheet } from "./actor/character-sheet.js";
import { CDEPNJSheet } from "./actor/npc-sheet.js";
import { CDELoksyuSheet } from "./actor/loksyu-sheet.js";
import { CDEItemSheet } from "./item/item-sheet.js";
import { CDEKungFuSheet } from "./item/kungfu-sheet.js";
import { CDESpellSheet } from "./item/spell-sheet.js";
import { CDESupernaturalSheet } from "./item/supernatural-sheet.js";

import { CDE } from "./config.js";
import { preloadHandlebarsTemplates } from "./templates.js";
import { registerHandlebarsHelpers } from "./helpers.js";
/**
 * Adds custom dice to Dice So Nice!.
 */
Hooks.once("diceSoNiceReady", (dice3d) => {
  //Called once the module is ready to listen to new rolls and display 3D animations.
  //dice3d: Main class, instantiated and ready to use.

  dice3d.addSystem({ id: "chroniquesdeletrangedigit", name: "Chroniques de l'étrange digits" }, "preferred");
  dice3d.addDicePreset({
    type: "d10",
    labels: [
      "systems/chroniquesdeletrange/images/dice-so-nice/digit/d10-1.webp",
      "systems/chroniquesdeletrange/images/dice-so-nice/digit/d10-2.webp",
      "systems/chroniquesdeletrange/images/dice-so-nice/digit/d10-3.webp",
      "systems/chroniquesdeletrange/images/dice-so-nice/digit/d10-4.webp",
      "systems/chroniquesdeletrange/images/dice-so-nice/digit/d10-5.webp",
      "systems/chroniquesdeletrange/images/dice-so-nice/digit/d10-6.webp",
      "systems/chroniquesdeletrange/images/dice-so-nice/digit/d10-7.webp",
      "systems/chroniquesdeletrange/images/dice-so-nice/digit/d10-8.webp",
      "systems/chroniquesdeletrange/images/dice-so-nice/digit/d10-9.webp",
      "systems/chroniquesdeletrange/images/dice-so-nice/digit/d10-10.webp",
    ],

    system: "chroniquesdeletrangedigit",
  });

  dice3d.addSystem({ id: "chroniquesdeletrange", name: "Chroniques de l'étrange" }, "preferred");
  dice3d.addDicePreset({
    type: "d10",
    labels: [
      "systems/chroniquesdeletrange/images/dice-so-nice/d10-1.webp",
      "systems/chroniquesdeletrange/images/dice-so-nice/d10-2.webp",
      "systems/chroniquesdeletrange/images/dice-so-nice/d10-3.webp",
      "systems/chroniquesdeletrange/images/dice-so-nice/d10-4.webp",
      "systems/chroniquesdeletrange/images/dice-so-nice/d10-5.webp",
      "systems/chroniquesdeletrange/images/dice-so-nice/d10-6.webp",
      "systems/chroniquesdeletrange/images/dice-so-nice/d10-7.webp",
      "systems/chroniquesdeletrange/images/dice-so-nice/d10-8.webp",
      "systems/chroniquesdeletrange/images/dice-so-nice/d10-9.webp",
      "systems/chroniquesdeletrange/images/dice-so-nice/d10-10.webp",
    ],

    system: "chroniquesdeletrange",
  });
});

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

/**
 * Init hook.
 */
Hooks.once("init", async function () {
  console.log(`CHRONIQUESDELETRANGE System | Initializing`);

  game.system.CONST = CDE;

  // Define custom Document classes
  CONFIG.Actor.documentClass = CDEActor;
  CONFIG.Item.documentClass = CDEItem;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("chroniquesdeletrange", CDECharacterSheet, { types: ["character"], makeDefault: true }); // ligne modifiée selon directives de LeRatierBretonnien
  Actors.registerSheet("chroniquesdeletrange", CDEPNJSheet, { types: ["npc"], makeDefault: true });
  Actors.registerSheet("chroniquesdeletrange", CDELoksyuSheet, { types: ["loksyu"], makeDefault: true });

  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("chroniquesdeletrange", CDEItemSheet, { types: ["item"], makeDefault: true });
  Items.registerSheet("chroniquesdeletrange", CDEKungFuSheet, { types: ["kungfu"], makeDefault: true });
  Items.registerSheet("chroniquesdeletrange", CDESpellSheet, { types: ["spell"], makeDefault: true });
  Items.registerSheet("chroniquesdeletrange", CDESupernaturalSheet, { types: ["supernatural"], makeDefault: true });

  // Preload template partials
  await preloadHandlebarsTemplates();

  // Register Handlebars Helpers
  registerHandlebarsHelpers();

  // Modify Runtime configuration settings / Added by MMFO
  await modifyConfigurationSettings();

  console.log(`CHRONIQUESDELETRANGE System | Initialized`);
});

async function modifyConfigurationSettings() {
  /**
   * Runtime configuration settings for Foundry VTT which exposes a large number of variables which determine how
   * aspects of the software behaves.
   *
   * Unlike the CONST analog which is frozen and immutable, the CONFIG object may be updated during the course of a
   * session or modified by system and module developers to adjust how the application behaves.
   *
   **/

  /**
   * Configuration for the Actor document
   */
  CONFIG.Actor.compendiumBanner = "/systems/chroniquesdeletrange/images/banners/actor-banner.webp";

  /**
   * Configuration for the Adventure document
   */
  CONFIG.Adventure.compendiumBanner = "/systems/chroniquesdeletrange/images/banners/adventure-banner.webp";

  /**
   * Configuration for the Cards primary Document type
   */
  CONFIG.Cards.compendiumBanner = "ui/banners/cards-banner.webp";

  /**
   * Configuration for Item document
   */
  CONFIG.Item.compendiumBanner = "/systems/chroniquesdeletrange/images/banners/item-banner.webp";

  /**
   * Configuration for the JournalEntry document
   */
  CONFIG.JournalEntry.compendiumBanner = "/systems/chroniquesdeletrange/images/banners/journalentry-banner.webp";

  /**
   * Configuration for the Macro document
   */
  CONFIG.Macro.compendiumBanner = "ui/banners/macro-banner.webp";

  /**
   * Configuration for the Playlist document
   */
  CONFIG.Playlist.compendiumBanner = "ui/banners/playlist-banner.webp";

  /**
   * Configuration for RollTable random draws
   */
  CONFIG.RollTable.compendiumBanner = "ui/banners/rolltable-banner.webp";

  /**
   * Configuration for the Scene document
   */
  CONFIG.Scene.compendiumBanner = "/systems/chroniquesdeletrange/images/banners/scene-banner.webp";
}

Hooks.once("i18nInit", function () {
  // Prélocalisation des objets de configuration
  preLocalizeConfig();
});

function preLocalizeConfig() {
  const localizeConfigObject = (obj, keys) => {
    for (let o of Object.values(obj)) {
      for (let k of keys) {
        o[k] = game.i18n.localize(o[k]);
      }
    }
  };

  localizeConfigObject(CDE.SUBTYPES, ["label"]);
}