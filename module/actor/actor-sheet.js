import { EntitySheetHelper } from "../helper.js";
import {ATTRIBUTE_TYPES} from "../constants.js";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class CDEActorSheet extends ActorSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["chroniquesdeletrange", "sheet", "actor"],
      template: "systems/chroniquesdeletrange/templates/actor-sheet.html",
      width: 700,
      height: 850,
      tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description"}],
      scrollY: [".biography", ".items", ".attributes", ".spells", "kungfus"],
      dragDrop: [{dragSelector: ".item-list .item .spell .kungfu", dropSelector: null}]
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
    html.find(".item-control").click(this._onItemControl.bind(this));
    html.find(".items .rollable").on("click", this._onItemRoll.bind(this));



    html.find(".kungfu-control").click(this._onKungFuControl.bind(this));
   //  html.find(".kungfus .rollable").on("click", this._onKungFuRoll.bind(this));

    html.find(".spell-control").click(this._onSpellControl.bind(this));
    // html.find(".spells .rollable").on("click", this._onSpellRoll.bind(this));



    html.find(".click").click(this._onClickDieRoll.bind(this));






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
   * Handle click events for Item item control buttons within the Actor Sheet
   * @param event
   * @private
   */
  _onItemControl(event) {
    event.preventDefault();

    // Obtain event data
    const button = event.currentTarget;
    const li = button.closest(".item");
    const item = this.actor.items.get(li?.dataset.itemId);

    // Handle different actions
    switch ( button.dataset.action ) {
      case "create":
        const cls = getDocumentClass("Item");
        return cls.create({name: game.i18n.game.i18n.localize("CDE.ItemNew"), type: "item"}, {parent: this.actor});
      case "edit":
        return item.sheet.render(true);
      case "delete":
        return item.delete();
    }
  }


   /**
   * Handle click events for Item kungfu control buttons within the Actor Sheet
   * @param event
   * @private
   */
  _onKungFuControl(event) {
    event.preventDefault();

    // Obtain event data
    const button = event.currentTarget;
    const li = button.closest(".kungfu");
    const item = this.actor.items.get(li?.dataset.itemId);

    // Handle different actions
    switch ( button.dataset.action ) {
      case "create":
        const cls = getDocumentClass("Item");
        return cls.create({name: game.i18n.game.i18n.localize("CDE.KFNew"), type: "kungfu"}, {parent: this.actor});
      case "edit":
        return item.sheet.render(true);
      case "delete":
        return item.delete();
    }
  }


  /**
   * Handle click events for Item spell control buttons within the Actor Sheet
   * @param event
   * @private
   */
  _onSpellControl(event) {
    event.preventDefault();

    // Obtain event data
    const button = event.currentTarget;
    const li = button.closest(".spell");
    const item = this.actor.items.get(li?.dataset.itemId);

    // Handle different actions
    switch ( button.dataset.action ) {
      case "create":
        const cls = getDocumentClass("Item");
        return cls.create({name: game.i18n.game.i18n.localize("CDE.SpellNew"), type: "spell"}, {parent: this.actor});
      case "edit":
        return item.sheet.render(true);
      case "delete":
        return item.delete(); 
    }
  }


  /* -------------------------------------------- */

  /**
   * Listen for roll buttons on items.
   * @param {MouseEvent} event    The originating left click event
   */
  _onItemRoll(event) {
    let button = $(event.currentTarget);
    const li = button.parents(".item");
    const item = this.actor.items.get(li.data("itemId"));
    let r = new Roll(button.data('roll'), this.actor.getRollData());
    return r.toMessage({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: `<h2>${item.name}</h2><h3>${button.text()}</h3>`
    });
  }


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





  /**
   * Listen for roll buttons on Clickable D10.
   * @param {MouseEvent} event    The originating left click event
   */
  async _onClickDieRoll(event) {
    const wood = 0;
    const fire = 1;
    const earth = 2;
    const metal = 3;
    const water = 4;
    const elements = ["CDE.Wood", "CDE.Fire", "CDE.Earth", "㊏", "CDE.Metal"];

    var elementChoice = wood;
 
    let d10_1 = 0;
    let d10_2 = 0;
    let d10_3 = 0;
    let d10_4 = 0;
    let d10_5 = 0;
    let d10_6 = 0;
    let d10_7 = 0;
    let d10_8 = 0;
    let d10_9 = 0;
    let d10_0 = 0;
    let suite = "[";

    let button = $(event.currentTarget);
    const tr = button.parents(".clickondie");
    const item = this.actor.items.get(tr.data("itemId"));

    let r = new Roll("15d10", this.actor.getRollData());
    // let r = new Roll("15d10+2d20", this.actor.getRollData());
    await r.evaluate();
    let myR = r.dice;
    console.log(myR);
    console.log(myR[0]);
    for (let key in myR) {
      console.log(myR[key]);
      for (let i=0; i<myR[key].number; i++) {
        let myD = myR[key].results[i].result;
        console.log(myD);
        if (myD == 10) {
          suite += "0, "
        } else {
          suite += myD + ", ";
        };
        switch (myD) {
          case 1: d10_1 += 1;
          break;
          case 2: d10_2 += 1;
          break;
          case 3: d10_3 += 1;
          break;
          case 4: d10_4 += 1;
          break;
          case 5: d10_5 += 1;
          break;
          case 6: d10_6 += 1;
          break;
          case 7: d10_7 += 1;
          break;
          case 8: d10_8 += 1;
          break;
          case 9: d10_9 += 1;
          break;
          case 10: d10_0 += 1;
          break;
          default: console.log("C'est bizarre !");
        };
      };
    };

    if (suite.length >= 2) {
      suite += "%";
      suite = suite.replace(', %', ']');
    } else {
      suite = "";
    };

    let myResult = "";
    myResult += "0("+d10_0+") "; // Terre Yin
    myResult += "1("+d10_1+") "; // Eau Yang
    myResult += "2("+d10_2+") "; // Feu Yin
    myResult += "3("+d10_3+") "; // Métal Yang
    myResult += "4("+d10_4+") "; // Bois Yin
    myResult += "5("+d10_5+") "; // Terre Yang
    myResult += "6("+d10_6+") "; // Eau Yin
    myResult += "7("+d10_7+") "; // Feu Yang
    myResult += "8("+d10_8+") "; // Métal Yin
    myResult += "9("+d10_9+")"; // Bois Yang
    console.log(myResult);

    let message = game.i18n.localize("CDE.Results")+" ";

    switch (elementChoice) {
      case wood:
        message += (parseInt(d10_4) + parseInt(d10_9)) + " ";
        message += game.i18n.localize("CDE.Wood");
        message += game.i18n.localize("CDE.Successes") + ", ";
        message += (parseInt(d10_2) + parseInt(d10_7)) + " ";
        message += game.i18n.localize("CDE.Fire");
        message += game.i18n.localize("CDE.Beneficial") + ", ";
        message += (parseInt(d10_1) + parseInt(d10_6)) + " ";
        message += game.i18n.localize("CDE.Water");
        message += game.i18n.localize("CDE.Noxious") + " --- ";
        message += game.i18n.localize("CDE.Loksyu2") + " ";
        message += game.i18n.localize("CDE.Earth");
        message += d10_0 + " ";
        message += game.i18n.localize("CDE.Yin") + ", ";
        message += d10_5 + " ";
        message += game.i18n.localize("CDE.Yang") + " --- ";
        message += game.i18n.localize("CDE.TinJi") + " ";
        message += (parseInt(d10_3) + parseInt(d10_8)) + " ";
        message += game.i18n.localize("CDE.Metal");
        message += suite;
        break;
        // Results: 4 ㊍ wood successes, 3 ㊋ fire beneficial-dice, 2 ㊌ water noxious-dice --- Loksyu : ㊏ earth 1 ● yin, 1 ○ yang --- Tin Ji : 1 ㊎ metal (7,2,5,9,4,10,6,4,4,2,6,8)      break;
      case fire:
        message += (parseInt(d10_2) + parseInt(d10_8)) + " ";
        message += game.i18n.localize("CDE.Fire");
        message += game.i18n.localize("CDE.Successes") + ", ";
        message += (parseInt(d10_0) + parseInt(d10_5)) + " ";
        message += game.i18n.localize("CDE.Earth");
        message += game.i18n.localize("CDE.Beneficial") + ", ";
        message += (parseInt(d10_4) + parseInt(d10_9)) + " ";
        message += game.i18n.localize("CDE.Wood");
        message += game.i18n.localize("CDE.Noxious") + " --- ";
        message += game.i18n.localize("CDE.Loksyu2") + " ";
        message += game.i18n.localize("CDE.Metal");
        message += d10_8 + " ";
        message += game.i18n.localize("CDE.Yin") + " ";
        message += d10_3 + " ";
        message += game.i18n.localize("CDE.Yang") + " --- ";
        message += game.i18n.localize("CDE.TinJi") + " ";
        message += (parseInt(d10_1) + parseInt(d10_6)) + " ";
        message += game.i18n.localize("CDE.Water");
        message += suite;
        break;
        // Results: 0 ㊋ fire successes, 0 ㊏ earth beneficial-dice, 1 ㊍ wood noxious-dice --- Loksyu : ㊎ metal 0 ● yin, 0 ○ yang --- Tin Ji : 0 ㊌ water (9)
      case earth:
        message += (parseInt(d10_0) + parseInt(d10_5)) + " ";
        message += game.i18n.localize("CDE.Earth");
        message += game.i18n.localize("CDE.Successes") + ", ";
        message += (parseInt(d10_3) + parseInt(d10_8)) + " ";
        message += game.i18n.localize("CDE.Metal");
        message += game.i18n.localize("CDE.Beneficial") + ", ";
        message += (parseInt(d10_2) + parseInt(d10_8)) + " ";
        message += game.i18n.localize("CDE.Fire");
        message += game.i18n.localize("CDE.Noxious") + " --- ";
        message += game.i18n.localize("CDE.Loksyu2") + " ";
        message += game.i18n.localize("CDE.Water");
        message += d10_6 + " ";
        message += game.i18n.localize("CDE.Yin") + ", ";
        message += d10_1 + " ";
        message += game.i18n.localize("CDE.Yang") + " --- ";
        message += game.i18n.localize("CDE.TinJi") + " ";
        message += (parseInt(d10_4) + parseInt(d10_9)) + " ";
        message += game.i18n.localize("CDE.Wood");
        message += suite;
        break;
        // Results: 0 ㊏ earth successes, 0 ㊎ metal beneficial-dice, 1 ㊋ fire noxious-dice --- Loksyu : ㊌ water 0 ● yin, 0 ○ yang --- Tin Ji : 0 ㊍ wood (7)
      case metal:
        message += (parseInt(d10_3) + parseInt(d10_8)) + " ";
        message += game.i18n.localize("CDE.Metal");
        message += game.i18n.localize("CDE.Successes") + ", ";
        message += (parseInt(d10_1) + parseInt(d10_6)) + " ";
        message += game.i18n.localize("CDE.Water");
        message += game.i18n.localize("CDE.Beneficial") + ", ";
        message += (parseInt(d10_0) + parseInt(d10_5)) + " ";
        message += game.i18n.localize("CDE.Earth");
        message += game.i18n.localize("CDE.Noxious") + " --- ";
        message += game.i18n.localize("CDE.Loksyu2") + " ";
        message += game.i18n.localize("CDE.Wood");
        message += d10_4 + " ";
        message += game.i18n.localize("CDE.Yin") + ", ";
        message += d10_9 + " ";
        message += game.i18n.localize("CDE.Yang") + " --- ";
        message += game.i18n.localize("CDE.TinJi") + " ";
        message += (parseInt(d10_2) + parseInt(d10_7)) + " ";
        message += game.i18n.localize("CDE.Fire");
        message += suite;
        break;
        // Results: 2 ㊎ metal successes, 3 ㊌ water beneficial-dice, 1 ㊏ earth noxious-dice --- Loksyu : ㊍ wood 0 ● yin, 1 ○ yang --- Tin Ji : 0 ㊋ fire (10,8,1,8,9,1,1)
      case water:
        message += (parseInt(d10_1) + parseInt(d10_6)) + " ";
        message += game.i18n.localize("CDE.Water");
        message += game.i18n.localize("CDE.Successes") + ", ";
        message += (parseInt(d10_4) + parseInt(d10_9)) + " ";
        message += game.i18n.localize("CDE.Wood");
        message += game.i18n.localize("CDE.Beneficial") + ", ";
        message += (parseInt(d10_3) + parseInt(d10_8)) + " ";
        message += game.i18n.localize("CDE.Metal");
        message += game.i18n.localize("CDE.Noxious") + " --- ";
        message += game.i18n.localize("CDE.Loksyu2") + " ";
        message += game.i18n.localize("CDE.Fire");
        message += d10_2 + " ";
        message += game.i18n.localize("CDE.Yin") + ", ";
        message += d10_7 + " ";
        message += game.i18n.localize("CDE.Yang") + " --- ";
        message += game.i18n.localize("CDE.TinJi") + " ";
        message += (parseInt(d10_0) + parseInt(d10_5)) + " ";
        message += game.i18n.localize("CDE.Earth");
        message += suite;
        break;
      //Results: 1 ㊌ water successes, 0 ㊍ wood beneficial-dice, 2 ㊎ metal noxious-dice --- Loksyu : ㊋ fire 0 ● yin, 1 ○ yang --- Tin Ji : 4 ㊏ earth (8,8,5,1,5,7,10,10)
      default: console.log("C'est bizarre !");
    };

    console.log(message);

    return r.toMessage({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor })
    });
  }
}