/**
 * @extends {Item}
 */
export class CDEItem extends Item {
  get isWeapon() {
    return this.system.subtype === "weapon";
  }

  get isArmor() {
    return this.system.subtype === "armor";
  }

  get isSanhei() {
    return this.system.subtype === "sanhei";
  }

  get isOther() {
    return this.system.subtype === "other";
  }
}
