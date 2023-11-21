import { CDE } from "../config.js";
/**
 * @extends {ItemSheet}
 */
export class CDEItemSheet extends ItemSheet {
  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["chroniquesdeletrange", "sheet", "item"],
      template: "systems/chroniquesdeletrange/templates/item/item-sheet.html",
      width: 520,
      height: 520,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }],
      scrollY: [".description", ".attributes", ".notes"],
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  async getData(options) {
    const context = await super.getData(options);
    context.systemData = this.item.system;
    context.subtypes = CDE.SUBTYPES
    context.isWeapon = this.item.isWeapon;
    context.isArmor = this.item.isArmor;
    context.isSanhei = this.item.isSanhei;
    context.isOther = this.item.isOther;
    context.descriptionHTML = await TextEditor.enrichHTML(this.item.system.description, {
      secrets: this.document.isOwner,
      async: true,
    });
    context.notesHTML = await TextEditor.enrichHTML(this.item.system.notes, {
      secrets: this.document.isOwner,
      async: true,
    });
    return context;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;
  }
}
