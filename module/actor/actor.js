/**
 * @extends {Actor}
 */
export class CDEActor extends Actor {

  /** @inheritdoc */
  prepareDerivedData() {
    super.prepareDerivedData();
  }

  /* -------------------------------------------- */
  /*  Roll Data Preparation                       */
  /* -------------------------------------------- */

  /** @inheritdoc */
  getRollData() {

    // Copy the actor's system data
    const data = this.toObject(false).system;
   
    return data;
  }

  prepareBaseData() {
    if (this.type === "npc") {
      this.system.vitality.calcul = this.system.aptitudes.physical.value * 4;
      this.system.hei.calcul = this.system.aptitudes.spiritual.value * 4;
    }
  }
}
