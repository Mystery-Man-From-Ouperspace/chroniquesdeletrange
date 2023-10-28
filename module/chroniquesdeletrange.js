/**
 * A simple and flexible system for world-building using an arbitrary collection of character and item attributes
 * Author: Atropos
 */

// Import Modules
import { CDEActor } from "./actor/actor.js";
import { CDEItem } from "./item/item.js";
import { CDEItemSheet } from "./item/item-sheet.js";
import { CDEActorSheet } from "./actor/actor-sheet.js";
import { preloadHandlebarsTemplates } from "./templates.js";
import { createchroniquesdeletrangeMacro } from "./macro.js";
import { CDEToken, CDETokenDocument } from "./token.js";




// Added MMFO
import { CDEPNJSheet } from "./actor/pnj-sheet.js";
import { CDELoksyuSheet } from "./actor/loksyu-sheet.js";
import { CDEKungFuSheet } from "./item/kungfu-sheet.js";
import { CDESpellSheet } from "./item/spell-sheet.js";
import { CDESupernaturalSheet } from "./item/supernatural-sheet.js";
import { CDESkillPrompt } from "./item/skill-dice-prompt.js";
import { CDEMagicPrompt } from "./item/magic-dice-prompt.js";






/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

/**
 * Init hook.
 */
Hooks.once("init", async function() {
  console.log(`Initializing chroniquesdeletrange System`);

  /**
   * Set an initiative formula for the system. This will be updated later.
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "1d20",
    decimals: 2
  };

  game.chroniquesdeletrange = {
	  createchroniquesdeletrangeMacro
  };

  // Define custom Document classes
  CONFIG.Actor.documentClass = CDEActor;
  CONFIG.Item.documentClass = CDEItem;
  // CONFIG.Token.documentClass = CDETokenDocument;
  // CONFIG.Token.objectClass = CDEToken;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Items.unregisterSheet("core", ItemSheet);

  //Actors.registerSheet("chroniquesdeletrange", CDEActorSheet, { makeDefault: true }); 	// ligne modifiée selon directives de LeRatierBretonnien
  
  Actors.registerSheet("chroniquesdeletrange", CDEActorSheet, { types: ["character"], makeDefault: true });	// ligne modifiée selon directives de LeRatierBretonnien
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("chroniquesdeletrange", CDEItemSheet, { types: ["item"], makeDefault: true });

  // Added MMFO
  Actors.registerSheet("chroniquesdeletrange", CDEPNJSheet, { types: ["pnj"], makeDefault: true });
  Actors.registerSheet("chroniquesdeletrange", CDELoksyuSheet, { types: ["loksyu"], makeDefault: true });
  Items.registerSheet("chroniquesdeletrange", CDEKungFuSheet, { types: ["kungfu"], makeDefault: true });
  Items.registerSheet("chroniquesdeletrange", CDESpellSheet, { types: ["spell"], makeDefault: true });
  Items.registerSheet("chroniquesdeletrange", CDESupernaturalSheet, { types: ["supernatural"], makeDefault: true });
  //Items.registerSheet("chroniquesdeletrange", CDESkillPrompt, { types: ["skillprpt"], makeDefault: true });
  //Items.registerSheet("chroniquesdeletrange", CDEMagicPrompt, { types: ["magicprpt"], makeDefault: true });

  console.log("ACTOR SHEET LOADED !!!!")

  // Register system settings
  game.settings.register("chroniquesdeletrange", "macroShorthand", {
    name: "SETTINGS.CDEMacroShorthandN",
    hint: "SETTINGS.CDEMacroShorthandL",
    scope: "world",
    type: Boolean,
    default: true,
    config: true
  });

  // Register initiative setting.
  game.settings.register("chroniquesdeletrange", "initFormula", {
    name: "SETTINGS.CDEInitFormulaN",
    hint: "SETTINGS.CDEInitFormulaL",
    scope: "world",
    type: String,
    default: "1d20",
    config: true,
    onChange: formula => _simpleUpdateInit(formula, true)
  });

  // Retrieve and assign the initiative formula setting.
  const initFormula = game.settings.get("chroniquesdeletrange", "initFormula");
  _simpleUpdateInit(initFormula);

  /**
   * Update the initiative formula.
   * @param {string} formula - Dice formula to evaluate.
   * @param {boolean} notify - Whether or not to post nofications.
   */
  function _simpleUpdateInit(formula, notify = false) {
    const isValid = Roll.validate(formula);
    if ( !isValid ) {
      if ( notify ) ui.notifications.error(`${game.i18n.localize("SIMPLE.NotifyInitFormulaInvalid")}: ${formula}`);
      return;
    }
    CONFIG.Combat.initiative.formula = formula;
  }

  /**
   * Slugify a string.
   */
  Handlebars.registerHelper('slugify', function(value) {
    return value.slugify({strict: true});
  });

  // Preload template partials
  await preloadHandlebarsTemplates();
});

/**
 * Macrobar hook.
 */
Hooks.on("hotbarDrop", (bar, data, slot) => createchroniquesdeletrangeMacro(data, slot));

/**
 * Adds the actor template context menu.
 */
Hooks.on("getActorDirectoryEntryContext", (html, options) => {

});

/**
 * Adds the item template context menu.
 */
Hooks.on("getItemDirectoryEntryContext", (html, options) => {

});
