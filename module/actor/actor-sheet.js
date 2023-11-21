/**
 * @extends {ActorSheet}
 */
export class CDEActorSheet extends ActorSheet {
  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["chroniquesdeletrange", "sheet", "actor"],
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }],
      width: 720,
      height: 850,
    });
  }

  /** @inheritdoc */
  async getData(options) {
    const context = await super.getData(options);
    context.systemData = this.actor.system;
    context.descriptionHTML = await TextEditor.enrichHTML(this.actor.system.description, {
      secrets: this.document.isOwner,
      async: true,
    });
    return context;
  }

  /** @inheritdoc */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Item Controls
    html.find(".item-control").click(this._onItemControl.bind(this));
    // html.find(".items .rollable").on("click", this._onItemRoll.bind(this));
  }

  /**
   * Handle click events for Item, Spell, Kungfu control buttons within the Actor Sheet
   * @param event
   * @private
   */
  _onItemControl(event) {
    event.preventDefault();

    // Obtain event data
    const button = event.currentTarget;
    const action = button.dataset.action;
    const type = button.dataset.type;
    const li = button.closest(".item");
    let item;

    // Handle different actions
    switch (action) {
      case "create":
        const cls = getDocumentClass("Item");
        let name = "";
        if (type === "item") name = game.i18n.localize("CDE.ItemNew");
        else if (type === "kungfu") name = game.i18n.localize("CDE.KFNew");
        else if (type === "spell") name = game.i18n.localize("CDE.SpellNew");
        else if (type === "supernatural") name = game.i18n.localize("CDE.SupernaturalNew");
        return cls.create({ name: name, type: type }, { parent: this.actor });
      case "edit":
        item = this.actor.items.get(li?.dataset.itemId);
        return item.sheet.render(true);
      case "delete":
        item = this.actor.items.get(li?.dataset.itemId);
        return item.delete();
    }
  }

  /**
   * Listen for roll buttons on items.
   * @param {MouseEvent} event    The originating left click event
   *
  _onItemRoll(event) {
    let button = $(event.currentTarget);
    const li = button.parents(".item");
    const item = this.actor.items.get(li.data("itemId"));
    let r = new Roll(button.data("roll"), this.actor.getRollData());
    return r.toMessage({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: `<h2>${item.name}</h2><h3>${button.text()}</h3>`,
    });
  }
  */
}
