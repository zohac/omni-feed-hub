// src/utils/stringUtils.ts

export class StringUtils {
  /**
   * Remplace les placeholders dans une chaîne de caractères.
   * @param template - La chaîne de caractères contenant des placeholders sous la forme {{key}}.
   * @param replacements - Un objet contenant les paires clé-valeur pour le remplacement.
   * @returns La chaîne de caractères avec les placeholders remplacés.
   */
  static replacePlaceholders(
    template: string,
    replacements: Record<string, string>,
  ): string {
    return template.replace(/{{(\w+)}}/g, (_, key) => replacements[key] || '');
  }
}
