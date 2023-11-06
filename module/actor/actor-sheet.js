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
    // html.find(".kungfus .rollable").on("click", this._onKungFuRoll.bind(this));

    html.find(".spell-control").click(this._onSpellControl.bind(this));
    // html.find(".spells .rollable").on("click", this._onSpellRoll.bind(this));



    html.find(".click").click(this._onClickDieRoll.bind(this));

    html.find(".click2").click(this._onClickDieRoll.bind(this));





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
        return cls.create({name: game.i18n.localize("CDE.ItemNew"), type: "item"}, {parent: this.actor});
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
    const item = this.actor.items.get(li?.dataset.kungfuId);

    // Handle different actions
    switch ( button.dataset.action ) {
      case "create":
        const cls = getDocumentClass("Item");
        return cls.create({name: game.i18n.localize("CDE.KFNew"), type: "kungfu"}, {parent: this.actor});
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
    const item = this.actor.items.get(li?.dataset.spellId);

    // Handle different actions
    switch ( button.dataset.action ) {
      case "create":
        const cls = getDocumentClass("Item");
        return cls.create({name: game.i18n.localize("CDE.SpellNew"), type: "spell"}, {parent: this.actor});
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
   * Listen for roll buttons on Clickable d10.
   * @param {MouseEvent} event    The originating left click event
   */
  async _onClickDieRoll(event) {
    const aspectLabel = ["CDE.Metal", "CDE.Water", "CDE.Earth", "CDE.Fire", "CDE.Wood", "CDE.Ramdomize"];
    const myMagicSpecial = {
      essence: { prefix :"ess", name :"essence", aspect :"metal" },
      mind : { prefix :"min", name :"mind", aspect :"water" },
      purification : { prefix :"pur", name :"purification", aspect :"earth" },
      manipulation: { prefix :"man", name :"manipulation", aspect :"fire" },
      aura: { prefix :"aur", name :"aura", aspect :"wood" },
      acupuncture: { prefix :"acu", name :"acupuncture", aspect :"metal" },
      elixirs: { prefix :"eli", name :"elixirs", aspect :"water" },
      poisons: { prefix :"poi", name :"poisons", aspect :"earth" },
      arsenal: { prefix :"ars", name :"arsenal", aspect :"fire" },
      potions: { prefix :"pot", name :"potions", aspect :"wood" },
      curse: { prefix :"cur", name :"curse", aspect :"metal" },
      transfiguration: { prefix :"trn", name :"transfiguration", aspect :"water" },
      necromancy: { prefix :"nec", name :"necromancy", aspect :"earth" },
      climatecontrol: { prefix :"cli", name :"climatecontrol", aspect :"fire" },
      goldenmagic: { prefix :"gol", name :"goldenmagic", aspect :"wood" },
      invocation: { prefix :"inv", name :"Invocation", aspect :"metal" },
      tracking: { prefix :"trc", name :"tracking", aspect :"water" },
      protection: { prefix :"pro", name :"protection", aspect :"earth" },
      punishment: { prefix :"pun", name :"punishment", aspect :"fire" },
      Domination: { prefix :"dom", name :"domination", aspect :"wood" },
      neutralization: { prefix :"neu", name :"neutralization", aspect :"metal" },
      divination: { prefix :"div", name :"divination", aspect :"water" },
      earthlyprayer: { prefix :"ear", name :"earthlyprayer", aspect :"earth" },
      heavenlyprayer: { prefix :"hea", name :"heavenlyprayer", aspect :"fire" },
      fungseoi: { prefix :"fun", name :"fungseoi", aspect :"wood" }
    };

    const metal = 0;
    const water = 1;
    const earth = 2;
    const fire = 3;
    const wood = 4;
    const random = 5;

    const noTypeUsed = -1;
    const skill2BDefined = -999;
    const skillDefined = 999;
    const aspect2BDefined = -999;
    const aspectDefined = 999;
    const noAspectUsed = -1;
    const special2BDefined = -999;
    const specialDefined = 999;
    const noSpecialUsed = -1;

    const wiiAspect = 0;
    const wiiSkill = 1;
    const wiiSpecial = 2;
    const wiiResource = 3;
    const wiiField = 4;
    const wiiMagic = 5;
    const wiiMagicSpecial = 6;
    const wiiRandomize = 7;

    var myTypeUsed = noTypeUsed;
    var myAspectUsed = aspect2BDefined;
    var mySkillUsed = skill2BDefined;
    var mySpecialUsed = special2BDefined;

    var myAspectSpecialUsed = -999;

    var skillUsedLabel = "?";
    var aspectUsedLabel ="?";
    var specialUsedLabel = "?";
    var aspectSpecialUsedLabel = "?";

    var specialUsed = "?";

    var bonusDice = 0;
    var bonusBeneficial = 0;
    var aspectSpecial = 0;
    var difficultySpecial = 0;
    var bonusSpecial = 0;
    
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
    let suite = "~ [";


    const element = event.currentTarget;              // On récupère le clic
    const whatIsIt = element.dataset.libelId;         // Va récupérer 'fire-aspect' par exemple
    console.log("whatIsIt = "+whatIsIt)
    const whatIsItTab = whatIsIt.split('-');
    const skillUsed = whatIsItTab[0];                 // Va récupérer 'fire'
    console.log("skillUsed = "+skillUsed)
    const typeUsed = whatIsItTab[1];                  // Va récupérer 'aspect'
    console.log("typeUsed = "+typeUsed)
    switch( typeUsed ) {                              // Transforme la string en nom de variable
      case "aspect": myTypeUsed = wiiAspect;
      break;
      case "skill": myTypeUsed = wiiSkill;
      break;
      case "special": myTypeUsed = wiiSpecial;
      break;
      case "resource": myTypeUsed = wiiResource;
      break;
      case "field": myTypeUsed = wiiField;
      break;
      case "magic": myTypeUsed = wiiMagic;
      break;
      case "magicspecial":
        myTypeUsed = wiiMagicSpecial;
      break;
      case "randomize":
        myTypeUsed = wiiRandomize;
      break;
      default: console.log("C'est bizarre !");
    };
    console.log("myTypeUsed = "+myTypeUsed);
    //////////////////////////////////////////////////////////////////
    var numberDice = 0;
    switch ( myTypeUsed ) {                             // Recupère la valeur de la compétence (= nbre de dés à lancer de base)
      case wiiAspect:
        numberDice = this.actor.system.aspect[skillUsed].value;
      break;
      case wiiSkill:
        numberDice = this.actor.system.skills[skillUsed].value;
      break;
      case wiiSpecial:
        numberDice = this.actor.system.skills[skillUsed].value;
        //////////////////////////////////////////////////////////////////
        if (this.actor.system.skills[skillUsed].specialities == "") { return; };
        //////////////////////////////////////////////////////////////////
        console.log("specialUsed = "+specialUsed);
      break;
      case wiiResource:
        numberDice = this.actor.system.resources[skillUsed].value;
      break;
      case wiiField:
        numberDice = this.actor.system.resources[skillUsed].value;
        //////////////////////////////////////////////////////////////////
        if (this.actor.system.resources[skillUsed].specialities == "") { return; };
        //////////////////////////////////////////////////////////////////
        console.log("specialUsed = "+specialUsed);
      break;
      case wiiMagic:
        numberDice = this.actor.system.magics[skillUsed].value;
      break;
      case wiiMagicSpecial:
        numberDice = this.actor.system.magics[skillUsed].value;
        mySpecialUsed = specialDefined;
        specialUsed = whatIsItTab[2];
        //////////////////////////////////////////////////////////////////
        if (!this.actor.system.magics[skillUsed].speciality[specialUsed].check) { return; };
        //////////////////////////////////////////////////////////////////
        console.log("specialUsed = "+specialUsed);
        specialUsedLabel = this.actor.system.magics[skillUsed].speciality[specialUsed].label;
      break;
      case wiiRandomize:
        numberDice = 1;
      break;
      default: ;
    };


    console.log("numberDice = "+numberDice);
    //////////////////////////////////////////////////////////////////
    console.log("skillUsed = "+skillUsed);
    switch ( myTypeUsed ) {                         // Transforme la string en nom de variable (uniquement pour les aspects)
      case wiiAspect:                               // Récupère les libellés de la compétence, de l'aspect (s'il est déjà défini)
      switch( skillUsed ) {                         // et de l'éventuelle spécialité (définie càd magies, ou générique càd compétences ou ressources)
        case "wood":                                // Appelle un prompt s'il le faut (càd compétences, ressources ou magies)
        mySkillUsed = wood;
        myAspectUsed = wood;
        skillUsedLabel = aspectLabel[mySkillUsed];
        aspectUsedLabel = aspectLabel[myAspectUsed];
        break;
        case "fire":
        mySkillUsed = fire;
        myAspectUsed = fire;
        skillUsedLabel = aspectLabel[mySkillUsed];
        aspectUsedLabel = aspectLabel[myAspectUsed];
        break;
        case "earth":
        mySkillUsed = earth;
        myAspectUsed = earth;
        skillUsedLabel = aspectLabel[mySkillUsed];
        aspectUsedLabel = aspectLabel[myAspectUsed];
        break;
        case "metal":
        mySkillUsed = metal;
        myAspectUsed = metal;
        skillUsedLabel = aspectLabel[mySkillUsed];
        aspectUsedLabel = aspectLabel[myAspectUsed];
        break;
        case "water":
        mySkillUsed = water;
        myAspectUsed = water;
        skillUsedLabel = aspectLabel[mySkillUsed];
        aspectUsedLabel = aspectLabel[myAspectUsed];
        break;
        default: console.log("C'est bizarre !");
      };
      break;
      case wiiSkill:
        mySkillUsed = skillDefined;
        skillUsedLabel = this.actor.system.skills[skillUsed].label;
        myAspectUsed = aspect2BDefined;
        mySpecialUsed = noSpecialUsed;
        // let data = APPELER LE PROMPT
      break;
      case wiiSpecial:
        mySkillUsed = skillDefined;
        skillUsedLabel = this.actor.system.skills[skillUsed].label;
        myAspectUsed = aspect2BDefined;
        mySpecialUsed = specialDefined;
        specialUsedLabel = "CDE.Speciality";
        // let data = APPELER LE PROMPT
        break;
      case wiiResource:
        mySkillUsed = skillDefined;
        skillUsedLabel = this.actor.system.resources[skillUsed].label;
        myAspectUsed = aspect2BDefined;
        mySpecialUsed = noSpecialUsed;
        // let data = APPELER LE PROMPT
      break;
      case wiiField:
        mySkillUsed = skillDefined;
        skillUsedLabel = this.actor.system.resources[skillUsed].label;
        myAspectUsed = aspect2BDefined;
        mySpecialUsed = specialDefined;
        specialUsedLabel = "CDE.Field";
        // let data = APPELER LE PROMPT
      break;
      case wiiMagic:
        mySkillUsed = skillDefined;
        skillUsedLabel = this.actor.system.magics[skillUsed].label;
        switch( skillUsed ){                        // et de l'éventuelle spécialité (définie càd magies, ou générique càd compétences ou ressources)
          case "internalcinnabar":                  // Appelle un prompt s'il le faut (càd compétences, ressources ou magies)
          myAspectUsed = metal;
          aspectUsedLabel = aspectLabel[myAspectUsed];
          break;
          case "alchemy":
          myAspectUsed = water;
          aspectUsedLabel = aspectLabel[myAspectUsed];
          break;
          case "masteryoftheway":
          myAspectUsed = earth;
          aspectUsedLabel = aspectLabel[myAspectUsed];
          break;
          case "exorcism":
          myAspectUsed = fire;
          aspectUsedLabel = aspectLabel[myAspectUsed];
          break;
          case "geomancy":
          myAspectUsed = wood;
          aspectUsedLabel = aspectLabel[myAspectUsed];
          break;
          default: console.log("C'est bizarre !");
        };
        // let data = APPELER LE PROMPT
      break;
      case wiiMagicSpecial:
        console.log("I'm here!");
        mySkillUsed = skillDefined;
        skillUsedLabel = this.actor.system.magics[skillUsed].label;
        switch( skillUsed ){                        // et de l'éventuelle spécialité (définie càd magies, ou générique càd compétences ou ressources)
          case "internalcinnabar":                  // Appelle un prompt s'il le faut (càd compétences, ressources ou magies)
          myAspectUsed = metal;
          aspectUsedLabel = aspectLabel[myAspectUsed];
          break;
          case "alchemy":
          myAspectUsed = water;
          aspectUsedLabel = aspectLabel[myAspectUsed];
          break;
          case "masteryoftheway":
          myAspectUsed = earth;
          aspectUsedLabel = aspectLabel[myAspectUsed];
          break;
          case "exorcism":
          myAspectUsed = fire;
          aspectUsedLabel = aspectLabel[myAspectUsed];
          break;
          case "geomancy":
          myAspectUsed = wood;
          aspectUsedLabel = aspectLabel[myAspectUsed];
          break;
          default: console.log("C'est bizarre !");
        };
        console.log("aspectUsedLabel = "+aspectUsedLabel);
        let myAspectSpecialName = "";
        for (var index in myMagicSpecial) {
          if (myMagicSpecial[index].name == specialUsed) {
              myAspectSpecialName = myMagicSpecial[index].aspect;
          };
        };
        console.log("myAspectSpecialName = "+myAspectSpecialName);
        switch( myAspectSpecialName ) {
          case "metal" : myAspectSpecialUsed = metal;
          break;
          case "water" : myAspectSpecialUsed = water;
          break;
          case "earth" : myAspectSpecialUsed = earth;
          break;
          case "fire" : myAspectSpecialUsed = fire;
          break;
          case "wood" : myAspectSpecialUsed = wood;
          break;
          default: console.log("C'est bizarre !");
        };  
        console.log("myAspectSpecialUsed = "+myAspectSpecialUsed);
        aspectSpecialUsedLabel = aspectLabel[myAspectSpecialUsed];
        console.log("aspectSpecialUsedLabel = "+aspectSpecialUsedLabel);
        // let data = APPELER LE PROMPT
        // _openSpecialMagicDicePrompt(myTitle, totalDice, myAspectUsed, 0, 0,
        //  myAspectSpecialUsed, 0, 0);
        break;
      case wiiRandomize:
        mySkillUsed = random;
        myAspectUsed = random;
        skillUsedLabel = "CDE.Randomize";
        aspectUsedLabel = "CDE.Randomize";
        mySpecialUsed = special2BDefined;
      break;
      default: console.log("C'est bizarre ! Compétence non-définie...");
    };
    console.log("mySkillUsed = "+mySkillUsed);
    console.log("myAspectUsed = "+myAspectUsed);
    console.log("skillUsedLabel = "+skillUsedLabel);
    console.log("specialUsed = "+specialUsed);
    if (myTypeUsed != wiiAspect) {
      console.log("aspectUsedLabel = "+aspectUsedLabel);
      console.log("specialUsedLabel = "+specialUsedLabel);
    };


    //////////////////////////////////////////////////////////////////
    if (numberDice <= 0) { return; };
    //////////////////////////////////////////////////////////////////


    let totalDice = 0;
    if (numberDice+bonusDice > 0) {
      totalDice = numberDice+bonusDice;
    } ;
    let r = new Roll(numberDice+bonusDice+"d10", this.actor.getRollData());
    await r.evaluate();
    console.log(r);
    let myRDice = r.dice;
    console.log(myRDice);
    console.log(myRDice[0]);
    for (let key in myRDice) {
      console.log(myRDice[key]);
      for (let i=0; i<myRDice[key].number; i++) {
        let myD = myRDice[key].results[i].result;
        console.log(myD);
        if (myD == 10) {
          suite += "0, "
        } else {
          suite += myD + ", ";
        };
        switch ( myD ) {
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
    myResult += "0("+d10_0+") "; // Earth Yin
    myResult += "1("+d10_1+") "; // Water Yang
    myResult += "2("+d10_2+") "; // Fire Yin
    myResult += "3("+d10_3+") "; // Metal Yang
    myResult += "4("+d10_4+") "; // Wood Yin
    myResult += "5("+d10_5+") "; // Earth Yang
    myResult += "6("+d10_6+") "; // Water Yin
    myResult += "7("+d10_7+") "; // Fire Yang
    myResult += "8("+d10_8+") "; // Metal Yin
    myResult += "9("+d10_9+")"; // Wood Yang
    console.log(myResult);

    let message = game.i18n.localize("CDE.Results")+" ";

    switch ( myAspectUsed ) {                       // On fabrique le message de retour du lancer de dés
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
        message += game.i18n.localize("CDE.Earth") + ": ";
        message += d10_0 + " ";
        message += game.i18n.localize("CDE.Yin") + ", ";
        message += d10_5 + " ";
        message += game.i18n.localize("CDE.Yang") + " --- ";
        message += game.i18n.localize("CDE.TinJi") + " ";
        message += (parseInt(d10_3) + parseInt(d10_8)) + " ";
        message += game.i18n.localize("CDE.Metal");
        message += suite;
        break;
        // Results: 3 ㊍ Wood Successes, 2 ㊋ Fire Beneficial-Dice, 0 ㊌ Water Noxious-Dice --- Loksyu : ㊏ Earth 0 ● Yin, 1 ○ Yang --- Tin Ji : 1 ㊎ Metal [4,9,4,5,2,8,7]
      case fire:
        message += (parseInt(d10_2) + parseInt(d10_7)) + " ";
        message += game.i18n.localize("CDE.Fire");
        message += game.i18n.localize("CDE.Successes") + ", ";
        message += (parseInt(d10_0) + parseInt(d10_5)) + " ";
        message += game.i18n.localize("CDE.Earth");
        message += game.i18n.localize("CDE.Beneficial") + ", ";
        message += (parseInt(d10_4) + parseInt(d10_9)) + " ";
        message += game.i18n.localize("CDE.Wood");
        message += game.i18n.localize("CDE.Noxious") + " --- ";
        message += game.i18n.localize("CDE.Loksyu2") + " ";
        message += game.i18n.localize("CDE.Metal") + ": ";
        message += d10_8 + " ";
        message += game.i18n.localize("CDE.Yin") + " ";
        message += d10_3 + " ";
        message += game.i18n.localize("CDE.Yang") + " --- ";
        message += game.i18n.localize("CDE.TinJi") + " ";
        message += (parseInt(d10_1) + parseInt(d10_6)) + " ";
        message += game.i18n.localize("CDE.Water");
        message += suite;
        break;
        // Results: 0 ㊋ Fire Successes, 4 ㊏ Earth Beneficial-Dice, 0 ㊍ Wood Noxious-Dice --- Loksyu : ㊎ Metal 1 ● Yin, 1 ○ Yang --- Tin Ji : 1 ㊌ Water [10,3,8,5,5,5,1]
      case earth:
        message += (parseInt(d10_0) + parseInt(d10_5)) + " ";
        message += game.i18n.localize("CDE.Earth");
        message += game.i18n.localize("CDE.Successes") + ", ";
        message += (parseInt(d10_3) + parseInt(d10_8)) + " ";
        message += game.i18n.localize("CDE.Metal");
        message += game.i18n.localize("CDE.Beneficial") + ", ";
        message += (parseInt(d10_2) + parseInt(d10_7)) + " ";
        message += game.i18n.localize("CDE.Fire");
        message += game.i18n.localize("CDE.Noxious") + " --- ";
        message += game.i18n.localize("CDE.Loksyu2") + " ";
        message += game.i18n.localize("CDE.Water") + ": ";
        message += d10_6 + " ";
        message += game.i18n.localize("CDE.Yin") + ", ";
        message += d10_1 + " ";
        message += game.i18n.localize("CDE.Yang") + " --- ";
        message += game.i18n.localize("CDE.TinJi") + " ";
        message += (parseInt(d10_4) + parseInt(d10_9)) + " ";
        message += game.i18n.localize("CDE.Wood");
        message += suite;
        break;
        // Results: 2 ㊏ Earth Successes, 0 ㊎ Metal Beneficial-Dice, 0 ㊋ Fire Noxious-Dice --- Loksyu : ㊌ Water 2 ● Yin, 1 ○ Yang --- Tin Ji : 2 ㊍ Wood [6,4,9,6,1,10,5]
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
        message += game.i18n.localize("CDE.Wood") + ": ";
        message += d10_4 + " ";
        message += game.i18n.localize("CDE.Yin") + ", ";
        message += d10_9 + " ";
        message += game.i18n.localize("CDE.Yang") + " --- ";
        message += game.i18n.localize("CDE.TinJi") + " ";
        message += (parseInt(d10_2) + parseInt(d10_7)) + " ";
        message += game.i18n.localize("CDE.Fire");
        message += suite;
        break;
        // Results: 1 ㊎ Metal Successes, 0 ㊌ Water Beneficial-Dice, 1 ㊏ Earth Noxious-Dice --- Loksyu : ㊍ Wood 2 ● Yin, 2 ○ Yang --- Tin Ji : 1 ㊋ Fire [9,9,5,4,2,4,3]
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
        message += game.i18n.localize("CDE.Fire") + ": ";
        message += d10_2 + " ";
        message += game.i18n.localize("CDE.Yin") + ", ";
        message += d10_7 + " ";
        message += game.i18n.localize("CDE.Yang") + " --- ";
        message += game.i18n.localize("CDE.TinJi") + " ";
        message += (parseInt(d10_0) + parseInt(d10_5)) + " ";
        message += game.i18n.localize("CDE.Earth");
        message += suite;
        break;
        // Results: 1 ㊌ Water Successes, 2 ㊍ Wood Beneficial-Dice, 1 ㊎ Metal Noxious-Dice --- Loksyu : ㊋ Fire 1 ● Yin, 0 ○ Yang --- Tin Ji : 2 ㊏ Earth [9,5,1,2,4,5,8]
        case random:
          message += game.i18n.localize("CDE.RandomizeSentence");
        break;
        default: console.log("C'est bizarre ! Aspect non-défini...");
    };
 
    let rModif = r;
    if (!(myAspectUsed == random)) {
      rModif._total = 0;
    } else if (rModif._total == 10) {
        rModif._total = 0;
    };

    const msg = await rModif.toMessage({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor })
    });

    console.log(message);

    if (game.modules.get("dice-so-nice")?.active) {
      await game.dice3d.waitFor3DAnimationByMessageID(msg.id);
    };

    let title = "";
    if (mySkillUsed != skill2BDefined) {
      title = game.i18n.localize(skillUsedLabel);
    };
    if (mySpecialUsed == specialDefined) {
      title += " ["+game.i18n.localize(specialUsedLabel)+"]";
    };
    if (myAspectUsed == mySkillUsed || myAspectUsed == aspect2BDefined || myAspectUsed == random) {
      title += " | ";
    } else {
      title += ", "+game.i18n.localize("CDE.Aspect")+" "+game.i18n.localize(aspectUsedLabel);
      if (mySpecialUsed == specialDefined) {
        title += "· "+game.i18n.localize("CDE.SpecialAspect")+" "+game.i18n.localize(aspectSpecialUsedLabel)+"| ";
      }  else {
        title += "| ";
      }
    };

    return (ChatMessage.create({
      user: game.user.id,
      // speaker: ChatMessage.getSpeaker({ token: this.actor }),
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: title+message
    }));
  }

  /**
   * Display prompt for skills or resources or no special magics.
   * myIsSpecial: boolean.
  async _openSkillDicePrompt(myTitle, myNumberOfDice, myIsSpecial, myAspect, myBonus, myBonusAuspiciousDice) {
    let options = "";
    var data = {
      title = myTitle,
      content = {
        numberofdice = myNumberOfDice,
        isspecial = myIsSpecial,
        aspect = myAspect,
        bonus = myBonus,
        bonusauspiciousdice = myBonusAuspiciousDice,
      },
      buttons: {
        click: {
          label: "",
          callback: html => resolve()
        }
      },
      default: "click",
      close: () => resolve({cancelled: true})
    };




    const cls = getDocumentClass("Item");
    cls.create({name: game.i18n.localize("CDE.SpellNew"), type: "skillprpt"}, {parent: this.actor});

    this(data, options).sheet.render(true);





    return data;
  }
*/

  /**
   * Display prompt for special magics.
  async _openSpecialMagicDicePrompt(myTitle, myNumberofdice, myAspectSkill, myBonusMalusSkill, myBonusAuspiciousDice,
    myAspectSpeciality, myRollDifficulty, myBonusMalusSpeciality) {
    let options = "";
    var data = {
      title = myTitle,
      content = {
        numberofdice = myNumberofdice,
        aspectskill = myAspectSkill,
        bonusmalusskill = myBonusMalusSkill,
        bonusauspiciousdice = myBonusAuspiciousDice,
        aspectspeciality = myAspectSpeciality,
        rolldifficulty = myRollDifficulty,
        bonusmalusspeciality = myBonusMalusSpeciality
      },
      buttons: {
        click: {
          label: "",
          callback: html => resolve()
        }
      },
      default: "click",
      close: () => resolve({cancelled: true})
    };



    const cls = getDocumentClass("Item");
    cls.create({name: game.i18n.localize("CDE.SpellNew"), type: "skillprpt"}, {parent: this.actor});

    this(data, options).sheet.render(true);




    return data;

*/

}