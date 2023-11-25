import { CDEActorSheet } from "./actor-sheet.js";
import { CDE } from "../config.js";
/**
 * @extends {CDEActorSheet}
 */
export class CDECharacterSheet extends CDEActorSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["chroniquesdeletrange", "sheet", "actor", "character"],
      template: "systems/chroniquesdeletrange/templates/actor/character-sheet.html",
      tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description"}],
      scrollY: [".biography", ".items", ".attributes", ".spells", ".kungfus"],
      dragDrop: [{dragSelector: ".item-list .item .spell .kungfu", dropSelector: null}]
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  async getData(options) {
    const context = await super.getData(options);
    context.equipments = context.items.filter(item => item.type === "item");
    context.spells = context.items.filter(item => item.type === "spell");
    context.kungfus = context.items.filter(item => item.type === "kungfu");

    context.CDE = CDE;
    return context;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  activateListeners(html) {
    super.activateListeners(html);

    html.find(".click").click(this._onClickDieRoll.bind(this));
    html.find(".click2").click(this._onClickDieRoll.bind(this));
    html.find(".click-prefs").click(this._onClickPrefs.bind(this));
  }

  /**
   * Listen for click on Gear.
   * @param {MouseEvent} event    The originating left click event
   */
  async _onClickPrefs (event) {
    // Render modal dialog
    const template = 'systems/chroniquesdeletrange/templates/form/prefs-prompt.html';
    const title = game.i18n.localize("CDE.Preferences");
    let dialogOptions = "";
    var dialogData = {
      choice: this.actor.system.prefs.typeofthrow.choice,
      check: this.actor.system.prefs.typeofthrow.check
    };
    console.log("Gear dialogData = ", dialogData);
    const html = await renderTemplate(template, dialogData);

    // Create the Dialog window
    let prompt = await new Promise((resolve) => {
      new Dialog(
        {
          title: title,
          content: html,
          buttons: {
            validateBtn: {
              icon: `<div class="tooltip"><i class="fas fa-check"></i>&nbsp;<span class="tooltiptextleft">${game.i18n.localize('CDE.Validate')}</span></div>`,
              callback: (html) => resolve(_computeResult(this.actor, html))
            },
            cancelBtn: {
              icon: `<div class="tooltip"><i class="fas fa-cancel"></i>&nbsp;<span class="tooltiptextleft">${game.i18n.localize('CDE.Cancel')}</span></div>`,
              callback: (html) => resolve(null)
            }
          },
          default: 'validateBtn',
          close: () => resolve(null)
        },
        dialogOptions
      ).render(true, {
        width: 520,
        height: 150
      });
    });
    async function _computeResult(myActor, myHtml) {
      console.log("I'm in _computeResult(myActor, myHtml)");
      const choice =  parseInt(myHtml.find("select[name='choice']").val());
      console.log("choice = ", choice);
      const isChecked = myHtml.find("input[name='check']").is(':checked');
      console.log("isChecked = ", isChecked);
      await myActor.update({ "system.prefs.typeofthrow.choice": choice.toString(), "system.prefs.typeofthrow.check": isChecked });
    }
  }



  /**
   * Listen for roll buttons on Clickable d10.
   * @param {MouseEvent} event    The originating left click event
   */
  async _onClickDieRoll(event) {
    const aspectLabel = ["CDE.Metal", "CDE.Water", "CDE.Earth", "CDE.Fire", "CDE.Wood", "CDE.Ramdomize"];
    const aspectLibel = ["metal", "water", "earth", "fire", "wood"];
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
    const nomySpecialUsed = -1;

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

    var skillUsedLabel = "?";
    var aspectUsedLabel ="?";
    var mySpecialUsedLabel = "?";

    var bonusDice = 0;
    var bonusAuspicious = 0;
    mySpecialUsed = 0;
    var rollDifficulty = 1;
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

    var titleDialog;
    let myIsSpecial;

    var data;

    var dataBis;
  
    let dialogOptions;

    let typeOfThrow = 0;
    typeOfThrow = parseInt(this.actor.system.prefs.typeofthrow.choice);
    if (!( typeOfThrow == 0 || typeOfThrow == 1 || typeOfThrow == 2 || typeOfThrow == 3 )) {
      typeOfThrow = 0; console.log("Zut, erreur !");
    };


    const element = event.currentTarget;              // On récupère le clic
    const whatIsIt = element.dataset.libelId;         // Va récupérer 'fire-aspect' par exemple
    console.log("whatIsIt = "+whatIsIt)
    const whatIsItTab = whatIsIt.split('-');
    const skillUsedLibel = whatIsItTab[0];                 // Va récupérer 'fire'
    console.log("skillUsedLibel = "+skillUsedLibel)
    const typeUsedLibel = whatIsItTab[1];                  // Va récupérer 'aspect'
    console.log("typeUsedLibel = "+typeUsedLibel)
    switch( typeUsedLibel ) {                              // Transforme la string en nom de variable
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
    var mySkillLabUsedLabel ="";
    switch ( myTypeUsed ) {                             // Recupère la valeur de la compétence (= nbre de dés à lancer de base)
      case wiiAspect:
        numberDice = this.actor.system.aspect[skillUsedLibel].value;
        mySkillLabUsedLabel = game.i18n.localize(this.actor.system.aspect[skillUsedLibel].label);
      break;
      case wiiSkill:
        numberDice = this.actor.system.skills[skillUsedLibel].value;
        mySkillLabUsedLabel = game.i18n.localize(this.actor.system.skills[skillUsedLibel].label);
        titleDialog = mySkillLabUsedLabel;
      break;
      case wiiSpecial:
        numberDice = this.actor.system.skills[skillUsedLibel].value;
        mySkillLabUsedLabel = game.i18n.localize(this.actor.system.skills[skillUsedLibel].label);
        mySkillLabUsedLabel += "["+game.i18n.localize("CDE.Speciality")+"]";
        titleDialog = mySkillLabUsedLabel;
        //////////////////////////////////////////////////////////////////
        if (this.actor.system.skills[skillUsedLibel].specialities == "") {
          ui.notifications.warn(game.i18n.localize("CDE.Error2"));
          return;
        } else if (numberDice <= 0) {
          ui.notifications.warn(game.i18n.localize("CDE.Error12"));
          return;

        };
      break;
      case wiiResource:
        numberDice = this.actor.system.resources[skillUsedLibel].value;
        mySkillLabUsedLabel = game.i18n.localize(this.actor.system.resources[skillUsedLibel].label);
      break;
      case wiiField:
        numberDice = this.actor.system.resources[skillUsedLibel].value;
        mySkillLabUsedLabel = game.i18n.localize(this.actor.system.resources[skillUsedLibel].label);
        mySkillLabUsedLabel += "["+game.i18n.localize("CDE.Field")+"]";
        titleDialog = mySkillLabUsedLabel;
        //////////////////////////////////////////////////////////////////
        if (this.actor.system.resources[skillUsedLibel].specialities == "") {
          ui.notifications.warn(game.i18n.localize("CDE.Error4"));
          return;
        } else if (numberDice <= 0) {
          ui.notifications.warn(game.i18n.localize("CDE.Error14"));
          return;
        };
      break;
      case wiiMagic:
        numberDice = this.actor.system.magics[skillUsedLibel].value;
        mySkillLabUsedLabel = game.i18n.localize(CDE.MAGICS[skillUsedLibel].label);
        titleDialog = mySkillLabUsedLabel;
      break;
      case wiiMagicSpecial:
        numberDice = this.actor.system.magics[skillUsedLibel].value;
        mySpecialUsed = specialDefined;
        var specialUsedLibel = whatIsItTab[2];
        mySkillLabUsedLabel = game.i18n.localize(CDE.MAGICS[skillUsedLibel].label);
        var mySkillNonSpecialUsedLabel = mySkillLabUsedLabel;
        var mySkillSpecialUsedLabel = game.i18n.localize(CDE.MAGICS[skillUsedLibel].speciality[specialUsedLibel].label);
        mySkillLabUsedLabel += "["+mySkillSpecialUsedLabel+"]";
        titleDialog = mySkillLabUsedLabel;

        //////////////////////////////////////////////////////////////////
        if (!this.actor.system.magics[skillUsedLibel].speciality[specialUsedLibel].check) {
          ui.notifications.warn(game.i18n.localize("CDE.Error6"));
          return;
        } else if (numberDice <= 0) {
          ui.notifications.warn(game.i18n.localize("CDE.Error16"));
          return;
        };
      break;
      case wiiRandomize:
        numberDice = 1;
        mySkillLabUsedLabel = game.i18n.localize("CDE.Randomize");
      break;
      default: ;
    };


    console.log("numberDice = ", numberDice);
    //////////////////////////////////////////////////////////////////
    console.log("skillUsedLibel = "+skillUsedLibel);
    switch ( myTypeUsed ) {                         // Transforme la string en nom de variable (uniquement pour les aspects)
      case wiiAspect:                               // Récupère les libellés de la compétence, de l'aspect (s'il est déjà défini)
      switch( skillUsedLibel ) {                         // et de l'éventuelle spécialité (définie càd magies, ou générique càd compétences ou ressources)
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
      if (this.actor.system.prefs.typeofthrow.check) {
        typeOfThrow = parseInt(await _whichTypeOfThrow(this.actor, typeOfThrow));
        console.log("typeOfThrow = ", typeOfThrow);
      };
      break;
      case wiiSkill:
        mySkillUsed = skillDefined;
        skillUsedLabel = this.actor.system.skills[skillUsedLibel].label;
        myAspectUsed = metal;
        mySpecialUsed = nomySpecialUsed;
        myIsSpecial = false;
        
        data = await _skillDiceRollDialog(this.actor, "", titleDialog, dialogOptions, numberDice, myIsSpecial, myAspectUsed, bonusDice, bonusAuspicious, typeOfThrow);
        console.log("data après Prompt = ", data);
        if (data == null) {console.log("C'est égal à null"); return;};
        numberDice = parseInt(data.numberofdice);
        myAspectUsed = parseInt(data.aspect);
        bonusDice = parseInt(data.bonusmalus);
        bonusAuspicious = parseInt(data.bonusauspiciousdice);
        typeOfThrow = parseInt(data.typeofthrow);
        console.log("typeOfThrow = ", typeOfThrow);
      break;
      case wiiSpecial:
        mySkillUsed = skillDefined;
        skillUsedLabel = this.actor.system.skills[skillUsedLibel].label;
        myAspectUsed = metal;
        mySpecialUsed = specialDefined;
        mySpecialUsedLabel = "CDE.Speciality";
        myIsSpecial = true;
        
        data = await _skillSpecialDiceRollDialog(this.actor, "", titleDialog, dialogOptions, numberDice, myIsSpecial, myAspectUsed, bonusDice, bonusAuspicious, typeOfThrow);
        console.log("data après Prompt = ", data);
        if (data == null) {console.log("C'est égal à null"); return;};
        numberDice = parseInt(data.numberofdice);
        myAspectUsed = parseInt(data.aspect);
        bonusDice = parseInt(data.bonusmalus);
        bonusAuspicious = parseInt(data.bonusauspiciousdice);
        typeOfThrow = parseInt(data.typeofthrow);
        console.log("typeOfThrow = ", typeOfThrow);
        break;
      case wiiResource:
        mySkillUsed = skillDefined;
        skillUsedLabel = this.actor.system.resources[skillUsedLibel].label;
        myAspectUsed = metal;
        mySpecialUsed = nomySpecialUsed;
        myIsSpecial = false;
        
        data = await _skillDiceRollDialog("", titleDialog, dialogOptions, numberDice, myIsSpecial, myAspectUsed, bonusDice, bonusAuspicious, typeOfThrow);
        console.log("data après Prompt = ", data);
        numberDice = parseInt(data.numberofdice);
        myAspectUsed = parseInt(data.aspect);
        bonusDice = parseInt(data.bonusmalus);
        bonusAuspicious = parseInt(data.bonusauspiciousdice);
        typeOfThrow = parseInt(data.typeofthrow);
        console.log("typeOfThrow = ", typeOfThrow);
      break;
      case wiiField:
        mySkillUsed = skillDefined;
        skillUsedLabel = this.actor.system.resources[skillUsedLibel].label;
        myAspectUsed = metal;
        mySpecialUsed = specialDefined;
        mySpecialUsedLabel = "CDE.Field";
        myIsSpecial = true;
        
        data = await _skillSpecialDiceRollDialog(this.actor, "", titleDialog, dialogOptions, numberDice, myIsSpecial, myAspectUsed, bonusDice, bonusAuspicious, typeOfThrow);
        console.log("data après Prompt = ", data);
        if (data == null) {console.log("C'est égal à null"); return;};
        numberDice = parseInt(data.numberofdice);
        myAspectUsed = parseInt(data.aspect);
        bonusDice = parseInt(data.bonusmalus);
        bonusAuspicious = parseInt(data.bonusauspiciousdice);
        typeOfThrow = parseInt(data.typeofthrow);
        console.log("typeOfThrow = ", typeOfThrow);
      break;
      case wiiMagic:
        mySkillUsed = skillDefined;
        skillUsedLabel = this.actor.system.magics[skillUsedLibel].label;
        switch( skillUsedLibel ){                        // et de l'éventuelle spécialité (définie càd magies, ou générique càd compétences ou ressources)
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
        myIsSpecial = false;

        data = await _skillDiceRollDialog(this.actor, "", titleDialog, dialogOptions, numberDice, myIsSpecial, myAspectUsed, bonusDice, bonusAuspicious, typeOfThrow);
        console.log("data après Prompt = ", data);
        if (data == null) {console.log("C'est égal à null"); return;};
        numberDice = parseInt(data.numberofdice);
        myAspectUsed = parseInt(data.aspect);
        bonusDice = parseInt(data.bonusmalus);
        bonusAuspicious = parseInt(data.bonusauspiciousdice);
        typeOfThrow = parseInt(data.typeofthrow);
        console.log("typeOfThrow = ", typeOfThrow);
      break;
      case wiiMagicSpecial:
        console.log("I'm here!");
        mySkillUsed = skillDefined;
        console.log("skillUsedLibel = ", skillUsedLibel);
        skillUsedLabel = this.actor.system.magics[skillUsedLibel].label;
         console.log("skillUsedLabel = ", skillUsedLabel);
        switch( skillUsedLibel ){                        // et de l'éventuelle spécialité (définie càd magies, ou générique càd compétences ou ressources)
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
          if (myMagicSpecial[index].name == specialUsedLibel) {
              myAspectSpecialName = myMagicSpecial[index].aspect;
          };
        };
        console.log("myAspectSpecialName = "+myAspectSpecialName);
        switch( myAspectSpecialName ) {
          case "metal" : mySpecialUsed = metal;
          break;
          case "water" : mySpecialUsed = water;
          break;
          case "earth" : mySpecialUsed = earth;
          break;
          case "fire" : mySpecialUsed = fire;
          break;
          case "wood" : mySpecialUsed = wood;
          break;
          default: console.log("C'est bizarre !");
        };  
        console.log("mySpecialUsed = "+mySpecialUsed);
        mySpecialUsedLabel = aspectLabel[mySpecialUsed];
        console.log("mySpecialUsedLabel = "+mySpecialUsedLabel);
        myIsSpecial = true;

        dataBis = await _magicDiceRollDialog(this.actor, "", titleDialog, dialogOptions, numberDice, myIsSpecial,
        myAspectUsed, bonusDice, bonusAuspicious, mySpecialUsed, rollDifficulty, bonusSpecial, typeOfThrow);
        console.log("dataBis = ", dataBis);
        numberDice = parseInt(dataBis.numberofdice);
        myAspectUsed = parseInt(dataBis.aspectskill);
        bonusDice = parseInt(dataBis.bonusmalusskill);
        bonusAuspicious = parseInt(dataBis.bonusauspiciousdice);
        mySpecialUsed = parseInt(dataBis.aspectspeciality);
        rollDifficulty = parseInt(dataBis.rolldifficulty);
        bonusSpecial = parseInt(dataBis.bonusmalusspeciality);
        typeOfThrow = parseInt(dataBis.typeofthrow);
        console.log("typeOfThrow = ", typeOfThrow);
        aspectUsedLabel = aspectLabel[myAspectUsed];
        mySpecialUsedLabel = aspectLabel[mySpecialUsed];
        break;
      case wiiRandomize:
        mySkillUsed = random;
        myAspectUsed = random;
        skillUsedLabel = "CDE.Randomize";
        aspectUsedLabel = "CDE.Randomize";
        mySpecialUsed = special2BDefined;
        if (this.actor.system.prefs.typeofthrow.check) {
          typeOfThrow = parseInt(await _whichTypeOfThrow(this.actor, typeOfThrow));
          console.log("typeOfThrow = ", typeOfThrow);
        };
      break;
      default: console.log("C'est bizarre ! Compétence non-définie...");
    };
    console.log("mySkillUsed = ", mySkillUsed);
    console.log("myAspectUsed = ", myAspectUsed);
    console.log("mySpecialUsed = ", mySpecialUsed);
    console.log("bonusDice = ", bonusDice);
    console.log("bonusAuspicious = ", bonusAuspicious);
    console.log("skillUsedLabel = ", skillUsedLabel);
    console.log("mySpecialUsed = ", mySpecialUsed);
    if (myTypeUsed != wiiAspect) {
      console.log("aspectUsedLabel = ", aspectUsedLabel);
      console.log("mySpecialUsedLabel = ", mySpecialUsedLabel);
    };
    console.log("numberDice = ", numberDice);
    console.log("bonusDice = ", bonusDice);
    var aspectDice = 0;
    if (myAspectUsed >= 0 && myAspectUsed <= 4 && myTypeUsed != wiiAspect && myTypeUsed != wiiRandomize) {
      console.log("On ajoute la valeur de l'Aspect aux Dés !");
      switch ( myAspectUsed ) {
        case wood: aspectDice = this.actor.system.aspect.wood.value; break;
        case fire: aspectDice = this.actor.system.aspect.fire.value; break;
        case earth: aspectDice = this.actor.system.aspect.earth.value; break;
        case water: aspectDice = this.actor.system.aspect.water.value; break;
        case metal: aspectDice = this.actor.system.aspect.metal.value; break;
        default: console.log("C'est bizarre !");
      };
    };
    let total = numberDice + aspectDice + bonusDice;
    if (myIsSpecial) { total++; };
    if (myTypeUsed == wiiMagicSpecial) {
      total += bonusSpecial;
    };
    console.log("total = ", total);
    let myRoll = "";
    myRoll += total+"d10";
    console.log("myRoll = ", myRoll);

    //////////////////////////////////////////////////////////////////
    if (total <= 0) {
      ui.notifications.warn(game.i18n.localize("CDE.Error0"));
      return;
      };
    //////////////////////////////////////////////////////////////////

    const r = new Roll(myRoll, this.actor.getRollData());
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
  
    console.log("myAspectUsed = ", myAspectUsed);
    console.log(wood);
    console.log(fire);
    console.log(earth);
    console.log(water);
    console.log(metal);

        
    switch ( myAspectUsed ) {                       // On fabrique le message de retour du lancer de dés
      case wood:
        console.log("C'est le Bois !");
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
        console.log("C'est le Feu !");
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
        console.log("C'est la Terre !");
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
        console.log("C'est le Métal !");
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
        console.log("C'est l'Eau !");
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

    var msg;
    switch ( typeOfThrow ) {
      case 0: msg = await rModif.toMessage({
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        rollMode: 'roll'                      // Public Roll
        });
      break;
      case 1: msg = await rModif.toMessage({
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        rollMode: 'gmroll'                    // Private Roll
        });
      break;
      case 2: msg = await rModif.toMessage({
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        rollMode: 'blindroll'                 // Blind GM Roll
      });As
      break;
      case 3: msg = await rModif.toMessage({
        user: game.user.id,
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        rollMode: 'selfroll'                      // Self Roll
      });
      break;
      default: console.log("C'est bizarre !");
    };

    console.log(message);

    var msgBonusAuspiciousDice = "";
    console.log("bonusAuspicious : ", bonusAuspicious);
    if (bonusAuspicious >= 1) {
      msgBonusAuspiciousDice += " ~ "+game.i18n.localize("CDE.BonusAuspiciousDice")+", ";
      msgBonusAuspiciousDice += bonusAuspicious+" ";
      if (bonusAuspicious <= 1) {
        msgBonusAuspiciousDice += game.i18n.localize("CDE.OneDie")
      } else {
        msgBonusAuspiciousDice += game.i18n.localize("CDE.ManyDice")
      };
      console.log("msgBonusAuspiciousDice : ", msgBonusAuspiciousDice);
    };


    var msgResultMagic = "";
    if (myTypeUsed == wiiMagicSpecial) {
      console.log("msgResultMagic", msgResultMagic);
      const aspectLinked2Speciality = this.actor.system.aspect[aspectLibel[mySpecialUsed]].value;
      msgResultMagic += "…";
      msgResultMagic += game.i18n.localize("CDE.HasCastASpell")+"["+mySkillSpecialUsedLabel+"]. ";
      const spellCast = game.i18n.localize(skillUsedLabel)+" [ "+game.i18n.localize(aspectUsedLabel)+"/"+game.i18n.localize(mySpecialUsedLabel)+"] ";
      msgResultMagic += game.i18n.localize("CDE.MsgMagic1")+spellCast
      +game.i18n.localize("CDE.MsgMagic2")+rollDifficulty
      +game.i18n.localize("CDE.MsgMagic3")+(aspectLinked2Speciality*rollDifficulty)
      +game.i18n.localize("CDE.MsgMagic4");
      console.log("msgResultMagic", msgResultMagic);
    };

    if (game.modules.get("dice-so-nice")?.active) {
      await game.dice3d.waitFor3DAnimationByMessageID(msg.id);
    };

        aspectUsedLabel = aspectLabel[myAspectUsed];
    if (myTypeUsed == wiiMagicSpecial) {
      mySpecialUsedLabel = aspectLabel[mySpecialUsed];
    };

    let title = "";
    if (mySkillUsed != skill2BDefined) {
      title = game.i18n.localize(mySkillLabUsedLabel);
    };
    if (myAspectUsed == mySkillUsed || myAspectUsed == aspect2BDefined || myAspectUsed == random) {
      title += " | ";
    } else {
      title += ", "+game.i18n.localize("CDE.Aspect")+" "+game.i18n.localize(aspectUsedLabel);
      if ( myTypeUsed == wiiMagicSpecial) {
        title += "· "+game.i18n.localize("CDE.SpecialAspect")+" "+game.i18n.localize(mySpecialUsedLabel)+"| ";
      }  else {
        title += "| ";
      }
    };



    switch ( typeOfThrow ) {
      case 0:
        ChatMessage.create({
          user: game.user.id,
          // speaker: ChatMessage.getSpeaker({ token: this.actor }),
          speaker: ChatMessage.getSpeaker({ actor: this.actor }),
          content: title+message+msgBonusAuspiciousDice,
          rollMode: 'roll'                          // Public Roll
        });
        if (myTypeUsed == wiiMagicSpecial) {
          return ChatMessage.create({
            user: game.user.id,
            // speaker: ChatMessage.getSpeaker({ token: this.actor }),
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
            content: msgResultMagic,
            rollMode: 'roll'                          // Public Roll
        })};

      break;
      case 1:
        ChatMessage.create({
          user: game.user.id,
          // speaker: ChatMessage.getSpeaker({ token: this.actor }),
          speaker: ChatMessage.getSpeaker({ actor: this.actor }),
          content: title+message+msgBonusAuspiciousDice,
          rollMode: 'gmroll'                        // Private Roll
        });
        if (myTypeUsed == wiiMagicSpecial) {
          return ChatMessage.create({
            user: game.user.id,
            // speaker: ChatMessage.getSpeaker({ token: this.actor }),
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
            content: msgResultMagic,
            rollMode: 'gmroll'                          // Private Roll
        })};

      break;
      case 2:
        ChatMessage.create({
          user: game.user.id,
          // speaker: ChatMessage.getSpeaker({ token: this.actor }),
          speaker: ChatMessage.getSpeaker({ actor: this.actor }),
          content: title+message+msgBonusAuspiciousDice,
          rollMode: 'blindroll'                       // Blind GM Roll
        });
        if (myTypeUsed == wiiMagicSpecial) {
          return ChatMessage.create({
            user: game.user.id,
            // speaker: ChatMessage.getSpeaker({ token: this.actor }),
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
            content: msgResultMagic,
            rollMode: 'blindroll'                          // Blind Roll
        })};
      break;
      case 3:
        ChatMessage.create({
          user: game.user.id,
          // speaker: ChatMessage.getSpeaker({ token: this.actor }),
          speaker: ChatMessage.getSpeaker({ actor: this.actor }),
          content: title+message+msgBonusAuspiciousDice,
          rollMode: 'selfroll'                        // Self Roll
        });
        if (myTypeUsed == wiiMagicSpecial) {
          return ChatMessage.create({
            user: game.user.id,
            // speaker: ChatMessage.getSpeaker({ token: this.actor }),
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
            content: msgResultMagic,
            rollMode: 'selfroll'                          // Self Roll
        })};

      break;
      default: console.log("C'est bizarre !");
    };


    async function _whichTypeOfThrow (myActor, myTypeOfThrow) {
    // Render modal dialog
    const template = 'systems/chroniquesdeletrange/templates/form/type-throw-prompt.html';
    const title = game.i18n.localize("CDE.TypeOfThrowTitle");
    let dialogOptions = "";
    var choice = 0;
    var dialogData = {
      choice: myTypeOfThrow,
      check: myActor.system.prefs.typeofthrow.check
      // check: true
    };
    console.log(dialogData);
    const html = await renderTemplate(template, dialogData);

    // Create the Dialog window
    let prompt = await new Promise((resolve) => {
      new Dialog(
        {
          title: title,
          content: html,
          buttons: {
            validateBtn: {
              icon: `<div class="tooltip"><i class="fas fa-check"></i>&nbsp;<span class="tooltiptextleft">${game.i18n.localize('CDE.Validate')}</span></div>`,
              callback: (html) => resolve( choice = _computeResult(myActor, html) )
            },
            cancelBtn: {
              icon: `<div class="tooltip"><i class="fas fa-cancel"></i>&nbsp;<span class="tooltiptextleft">${game.i18n.localize('CDE.CancelChanges')}</span></div>`,
              callback: (html) => resolve(null)
            }
          },
          default: 'validateBtn',
          close: () => resolve(null)
        },
        dialogOptions
      ).render(true, {
        width: 520,
        height: 180
      });
    });

    if (prompt != null) {
    return choice;
    } else {
      return parseInt(dialogData.choice);
    };


    async function _computeResult(myActor, myHtml) {
      console.log("I'm in _computeResult(myActor, myHtml)");
      const choice =  parseInt(myHtml.find("select[name='choice']").val());
      console.log("choice = ", choice);
      const isChecked = myHtml.find("input[name='check']").is(':checked');
      console.log("isChecked = ", isChecked);
      myActor.update({"system.prefs.typeofthrow.check": isChecked});
      return choice;
    }
  }
}
}

async function _skillDiceRollDialog(myActor, template, myTitle, myDialogOptions, myNumberOfDice, myIsSpecial, myAspect, myBonus, myBonusAuspiciousDice, myTypeOfThrow) {
  // Render modal dialog
  template = template || 'systems/chroniquesdeletrange/templates/form/skill-dice-prompt.html';
  const title = myTitle;
  let dialogOptions = myDialogOptions;
  let isspecial = myIsSpecial;
  var dialogData = {
    numberofdice: myNumberOfDice,
    aspect: myAspect.toString(),
    bonusmalus: myBonus,
    bonusauspiciousdice: myBonusAuspiciousDice.toString(),
    typeofthrow: myTypeOfThrow.toString()
  };
  console.log("dialogData avant retour func = ", dialogData);
  const html = await renderTemplate(template, dialogData);

  // Create the Dialog window
  let prompt = await new Promise((resolve) => {
    new Dialog(
      {
        title: title,
        content: html,
        buttons: {
          validateBtn: {
            icon: `<div class="tooltip"><i class="fas fa-check"></i>&nbsp;<span class="tooltiptextleft">${game.i18n.localize('CDE.Validate')}</span></div>`,
            callback: (html) => resolve( dialogData = _computeResult(dialogData, html) )
          },
          cancelBtn: {
            icon: `<div class="tooltip"><i class="fas fa-cancel"></i>&nbsp;<span class="tooltiptextleft">${game.i18n.localize('CDE.Cancel')}</span></div>`,
            callback: (html) => resolve( null )
          }
        },
        default: 'validateBtn',
        close: () => resolve( null )
    },
    dialogOptions
    ).render(true, {
      width: 520,
      height: 375
    });
  });

  if (prompt == null) {
    dialogData = null;
  };

  return dialogData;

  function _computeResult(myDialogData, myHtml) {
    console.log("J'exécute bien _computeResult()");
    myDialogData.aspect = myHtml.find("select[name='aspect']").val();
    myDialogData.bonusmalus = myHtml.find("input[name='bonusmalus']").val();
    myDialogData.bonusauspiciousdice = myHtml.find("select[name='bonusauspiciousdice']").val();
    myDialogData.typeofthrow = myHtml.find("select[name='typeofthrow']").val();
    console.log("myDialogData après traitement et avant retour func = ", myDialogData);
    return myDialogData;
  };

}

async function _skillSpecialDiceRollDialog(myActor, template, myTitle, myDialogOptions, myNumberOfDice, myIsSpecial, myAspect, myBonus, myBonusAuspiciousDice, myTypeOfThrow) {
  // Render modal dialog
  template = template || 'systems/chroniquesdeletrange/templates/form/skill-special-dice-prompt.html';
  const title = myTitle;
  let dialogOptions = myDialogOptions;
  let isspecial = myIsSpecial;
  var dialogData = {
    numberofdice: myNumberOfDice,
    aspect: myAspect.toString(),
    bonusmalus: myBonus,
    bonusauspiciousdice: myBonusAuspiciousDice.toString(),
    typeofthrow: myTypeOfThrow.toString()
  };
  console.log("dialogData avant retour func = ", dialogData);
  const html = await renderTemplate(template, dialogData);

  // Create the Dialog window
  let prompt = await new Promise((resolve) => {
    new Dialog(
      {
        title: title,
        content: html,
        buttons: {
          validateBtn: {
            icon: `<div class="tooltip"><i class="fas fa-check"></i>&nbsp;<span class="tooltiptextleft">${game.i18n.localize('CDE.Validate')}</span></div>`,
            callback: (html) => resolve( dialogData = _computeResult(dialogData, html) )
          },
          cancelBtn: {
            icon: `<div class="tooltip"><i class="fas fa-cancel"></i>&nbsp;<span class="tooltiptextleft">${game.i18n.localize('CDE.Cancel')}</span></div>`,
            callback: (html) => (resolve) => { dialogData = null }
          }
        },
        default: 'validateBtn',
        close: () => resolve( null )
    },
    dialogOptions
    ).render(true, {
      width: 520,
      height: 375
    });
  });

  if (prompt == null) {
    dialogData = null;
  };

  return dialogData;

  function _computeResult(myDialogData, myHtml) {
    console.log("J'exécute bien _computeResult()");
    myDialogData.aspect = myHtml.find("select[name='aspect']").val();
    myDialogData.bonusmalus = myHtml.find("input[name='bonusmalus']").val();
    myDialogData.bonusauspiciousdice = myHtml.find("select[name='bonusauspiciousdice']").val();
    myDialogData.typeofthrow = myHtml.find("select[name='typeofthrow']").val().toString();
    console.log("myDialogData après traitement et avant retour func = ", myDialogData);
    return myDialogData;
  };

}

async function _magicDiceRollDialog(myActor, template, myTitle, myDialogOptions, myNumberOfDice, myIsSpecial, myAspectSkill, myBonusMalusSkill, myBonusAuspiciousDice,
  myAspectSpecial, myRollDifficulty, myBonusMalusSpecial, myTypeOfThrow) {
  // Render modal dialog
  template = template || 'systems/chroniquesdeletrange/templates/form/magic-dice-prompt.html';
  const title = myTitle;
  let dialogOptions = myDialogOptions;
  let isspecial = myIsSpecial;
  var dialogData = {
    numberofdice: myNumberOfDice,
    aspectskill: myAspectSkill.toString(),
    bonusmalusskill: myBonusMalusSkill,
    bonusauspiciousdice: myBonusAuspiciousDice.toString(),
    aspectspeciality: myAspectSpecial.toString(),
    rolldifficulty: myRollDifficulty,
    bonusmalusspeciality: myBonusMalusSpecial,
    typeofthrow: myTypeOfThrow.toString()
  };
  console.log("dialogData avant retour func = ", dialogData);
  const html = await renderTemplate(template, dialogData);

  // Create the Dialog window
  let prompt = await new Promise((resolve) => {
    new Dialog(
      {
        title: title,
        content: html,
        buttons: {
          validateBtn: {
            icon: `<div class="tooltip"><i class="fas fa-check"></i>&nbsp;<span class="tooltiptextleft">${game.i18n.localize('CDE.Validate')}</span></div>`,
            callback: (html) => resolve ( dialogData = _computeResult(dialogData, html) )
          },
          cancelBtn: {
            icon: `<div class="tooltip"><i class="fas fa-cancel"></i>&nbsp;<span class="tooltiptextleft">${game.i18n.localize('CDE.Cancel')}</span></div>`,
            callback: (html) => resolve( null )
          }
        },
        default: 'validateBtn',
        close: () => resolve( null )
      },
      dialogOptions
    ).render(true, {
      width: 520,
      height: 530
    });
  });

  if (prompt == null) {
    dialogData = null;
  };

  return dialogData;

  function _computeResult(myDialogData, myHtml) {
    console.log("J'exécute bien _computeResult()");
    myDialogData.aspectskill = myHtml.find("select[name='aspectskill']").val();
    myDialogData.bonusmalusskill = myHtml.find("input[name='bonusmalusskill']").val();
    myDialogData.bonusauspiciousdice = myHtml.find("select[name='bonusauspiciousdice']").val();
    myDialogData.aspectspeciality = myHtml.find("select[name='aspectspeciality']").val();
    myDialogData.rolldifficulty = myHtml.find("input[name='rolldifficulty']").val();
    myDialogData.bonusmalusspeciality = myHtml.find("input[name='bonusmalusspeciality']").val();
    myDialogData.typeofthrow = myHtml.find("select[name='typeofthrow']").val();
    console.log("myDialogData après traitement et avant retour func = ", myDialogData);
    return myDialogData;
  };

}