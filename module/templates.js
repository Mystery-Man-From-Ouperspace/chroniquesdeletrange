/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function() {

  // Define template paths to load
  const templatePaths = [
    "systems/chroniquesdeletrange/templates/actor/parts/character-skills.html",
    "systems/chroniquesdeletrange/templates/actor/parts/character-magics.html",
    "systems/chroniquesdeletrange/templates/actor/parts/character-nghang.html",
    "systems/chroniquesdeletrange/templates/actor/parts/character-treasures.html",
    "systems/chroniquesdeletrange/templates/actor/parts/character-items.html",
    "systems/chroniquesdeletrange/templates/actor/parts/character-kungfus.html",
    "systems/chroniquesdeletrange/templates/actor/parts/character-spells.html"
  ];

  // Load the template parts
  return loadTemplates(templatePaths);
};