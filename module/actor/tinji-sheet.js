import { CDEActorSheet } from "./actor-sheet.js";
/**
 * @extends {CDEActorSheet}
 */
export class CDETinJiSheet extends CDEActorSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["chroniquesdeletrange", "sheet", "actor", "tinji"],
      template: "systems/chroniquesdeletrange/templates/actor/tinji-sheet.html",
      tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "tinji"}],
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
