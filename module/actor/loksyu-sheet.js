import { CDEActorSheet } from "./actor-sheet.js";
/**
 * @extends {CDEActorSheet}
 */
export class CDELoksyuSheet extends CDEActorSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["chroniquesdeletrange", "sheet", "actor", "loksyu"],
      template: "systems/chroniquesdeletrange/templates/actor/loksyu-sheet.html",
      tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "loksyu"}],
      scrollY: [".description"],
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  async getData(options) {
    const context = await super.getData(options);
    return context;
  }
}
