import { EntitySheetHelper } from "../helper.js";
import {ATTRIBUTE_TYPES} from "../constants.js";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class CDELoksyuSheet extends ActorSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["chroniquesdeletrange", "sheet", "loksyu"],
      template: "systems/chroniquesdeletrange/templates/loksyu-sheet.html",
      width: 700,
      height: 850,
      tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "loksyu"}],
      scrollY: [".description"],
      // dragDrop: [{dragSelector: ".item-list .item", dropSelector: null}]
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  async getData(options) {
    const context = await super.getData(options);
    //EntitySheetHelper.getAttributeData(context.data);
    context.shorthand = !!game.settings.get("chroniquesdeletrange", "macroShorthand");
    context.systemData = duplicate(this.actor.system);
    context.dtypes = ATTRIBUTE_TYPES;
    context.biographyHTML = await TextEditor.enrichHTML(context.systemData.biography, {
      secrets: this.document.isOwner,
      async: true
    });
    console.log("getData context", context)
    return context;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if ( !this.isEditable ) return;

    // Attribute Management
    //html.find(".attributes").on("click", ".attribute-control", EntitySheetHelper.onClickAttributeControl.bind(this));
    //html.find(".groups").on("click", ".group-control", EntitySheetHelper.onClickAttributeGroupControl.bind(this));
    //html.find(".attributes").on("click", "a.attribute-roll", EntitySheetHelper.onAttributeRoll.bind(this));

    // Item Controls
    // html.find(".item-control").click(this._onItemControl.bind(this));
    // html.find(".items .rollable").on("click", this._onItemRoll.bind(this));



    // html.find(".kungfu-control").click(this._onKungFuControl.bind(this));
    // html.find(".kungfus .rollable").on("click", this._onKungFuRoll.bind(this));

    // html.find(".spell-control").click(this._onSpellControl.bind(this));
    // html.find(".spells .rollable").on("click", this._onSpellRoll.bind(this));



    // Add draggable for Macro creation
    html.find(".attributes a.attribute-roll").each((i, a) => {
      a.setAttribute("draggable", true);
      a.addEventListener("dragstart", ev => {
        let dragData = ev.currentTarget.dataset;
        ev.dataTransfer.setData('text/plain', JSON.stringify(dragData));
      }, false);
    });
  }

  /* -------------------------------------------- */

  /**
   * Handle click events for Item control buttons within the Actor Sheet
   * @param event
   * @private
   */
 
 
  /*  _onItemControl(event) {
    event.preventDefault();

    // Obtain event data
    const button = event.currentTarget;
    const li = button.closest(".item");
    const item = this.actor.items.get(li?.dataset.itemId);

    // Handle different actions
    switch ( button.dataset.action ) {
      case "create":
        const cls = getDocumentClass("Item");
        return cls.create({name: game.i18n.localize("CDE.ItemNew"), type: "item"}, {parent: this.actor});
      case "edit":
        return item.sheet.render(true);
      case "delete":
        return item.delete();
    }
  }


  _onKungFuControl(event) {
    event.preventDefault();

    // Obtain event data
    const button = event.currentTarget;
    const li = button.closest(".kungfu");
    const item = this.actor.items.get(li?.dataset.itemId);

    // Handle different actions
    switch ( button.dataset.action ) {
      case "kungfucreate":
        const cls = getDocumentClass("Item");
        return cls.create({name: game.i18n.localize("CDE.KFNew"), type: "kungfu"}, {parent: this.actor});
      case "kungfuedit":
        return item.sheet.render(true);
      case "kungfudelete":
        return item.delete();
    }
  }


  _onSpellControl(event) {
    event.preventDefault();

    // Obtain event data
    const button = event.currentTarget;
    const li = button.closest(".spell");
    const item = this.actor.items.get(li?.dataset.itemId);

    // Handle different actions
    switch ( button.dataset.action ) {
      case "spellcreate":
        const cls = getDocumentClass("Item");
        return cls.create({name: game.i18n.localize("CDE.SpellNew"), type: "spell"}, {parent: this.actor});
      case "spelledit":
        return item.sheet.render(true);
      case "spelldelete":
        return item.delete(); 
    }
  } */


  /* -------------------------------------------- */

  /**
   * Listen for roll buttons on items.
   * @param {MouseEvent} event    The originating left click event
   */
 /*  _onItemRoll(event) {
    let button = $(event.currentTarget);
    const li = button.parents(".item");
    const item = this.actor.items.get(li.data("itemId"));
    let r = new Roll(button.data('roll'), this.actor.getRollData());
    return r.toMessage({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: `<h2>${item.name}</h2><h3>${button.text()}</h3>`
    });
  } */


 /* _onKungFuRoll(event) {
    let button = $(event.currentTarget);
    const li = button.parents(".kungfu");
    const item = this.actor.items.get(li.data("itemId"));
    let r = new Roll(button.data('roll'), this.actor.getRollData());
    return r.toMessage({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: `<h2>${item.name}</h2><h3>${button.text()}</h3>`
    });
  } */


 /*  _onSpellRoll(event) {
    let button = $(event.currentTarget);
    const li = button.parents(".spell");
    const item = this.actor.items.get(li.data("itemId"));
    let r = new Roll(button.data('roll'), this.actor.getRollData());
    return r.toMessage({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: `<h2>${item.name}</h2><h3>${button.text()}</h3>`
    });
  } */



  /* -------------------------------------------- */

  /** @inheritdoc */
  _getSubmitData(updateData) {
    let formData = super._getSubmitData(updateData);
    //formData = EntitySheetHelper.updateAttributes(formData, this.object);
    //formData = EntitySheetHelper.updateGroups(formData, this.object);
    return formData;
  }
}
