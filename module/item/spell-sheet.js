/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class CDESpellSheet extends ItemSheet {
  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["chroniquesdeletrange", "sheet", "spell"],
      template: "systems/chroniquesdeletrange/templates/item/spell-sheet.html",
      width: 620,
      height: 530,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }],
      scrollY: [".description", ".data", ".components", ".effects", ".examples", ".notes"],
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  async getData(options) {
    const context = await super.getData(options);
    context.systemData = this.item.system;
    context.spellDescriptionHTML = await TextEditor.enrichHTML(this.item.system.description, {
      secrets: this.document.isOwner,
      async: true,
    });
    context.componentsDescriptionHTML = await TextEditor.enrichHTML(this.item.system.components, {
      secrets: this.document.isOwner,
      async: true,
    });
    context.effectsDescriptionHTML = await TextEditor.enrichHTML(this.item.system.effects, {
      secrets: this.document.isOwner,
      async: true,
    });
    context.examplesDescriptionHTML = await TextEditor.enrichHTML(this.item.system.examples, {
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
