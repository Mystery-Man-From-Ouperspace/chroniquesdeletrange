/**
 * A simple and flexible system for world-building using an arbitrary collection of character and item attributes
 * Author: Atropos
 */

// Import Modules
import { SimpleActor } from "./actor.js";
import { SimpleItem } from "./item.js";
import { SimpleItemSheet } from "./item-sheet.js";
import { SimpleActorSheet } from "./actor-sheet.js";
import { preloadHandlebarsTemplates } from "./templates.js";
import { createchroniquesdeletrangeMacro } from "./macro.js";
import { SimpleToken, SimpleTokenDocument } from "./token.js";





import { SimpleKungFu } from "./kungfu.js";
import { SimpleKungFuSheet } from "./kungfu-sheet.js";
import { SimpleSpell } from "./spell.js";
import { SimpleSpellSheet } from "./spell-sheet.js";






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
  CONFIG.Actor.documentClass = SimpleActor;
  CONFIG.Item.documentClass = SimpleItem;
  CONFIG.Token.documentClass = SimpleTokenDocument;
  CONFIG.Token.objectClass = SimpleToken;



  /* CONFIG.KungFu.documentClass = SimpleKungFu;
  CONFIG.Spell.documentClass = SimpleSpell; */





  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  //Actors.registerSheet("chroniquesdeletrange", SimpleActorSheet, { makeDefault: true });
  console.log("ACTOR SHEET LOADED !!!!")
  Actors.registerSheet("chroniquesdeletrange", SimpleActorSheet, { types: ["character"], makeDefault: true });	// ligne modifiée selon directives de LeRatierBretonnien
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("chroniquesdeletrange", SimpleItemSheet, { makeDefault: true });






  /* Items.unregisterSheet("core", KungFuSheet, { types: ["kungfu"] });
  Items.registerSheet("chroniquesdeletrange", SimpleKungFuSheet, { types: ["kungfu"], makeDefault: false });

  Items.unregisterSheet("core", SpellSheet, { types: ["spell"] });
  Items.registerSheet("chroniquesdeletrange", SimpleSpellSheet, { types: ["spell"], makeDefault: false }); */




  
  // Register system settings
  game.settings.register("chroniquesdeletrange", "macroShorthand", {
    name: "SETTINGS.SimpleMacroShorthandN",
    hint: "SETTINGS.SimpleMacroShorthandL",
    scope: "world",
    type: Boolean,
    default: true,
    config: true
  });

  // Register initiative setting.
  game.settings.register("chroniquesdeletrange", "initFormula", {
    name: "SETTINGS.SimpleInitFormulaN",
    hint: "SETTINGS.SimpleInitFormulaL",
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
