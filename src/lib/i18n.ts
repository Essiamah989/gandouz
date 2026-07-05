import "server-only";

const dictionaries = {
  en: () => import("../dictionaries/fr.json").then((module) => module.default),
  fr: () => import("../dictionaries/fr.json").then((module) => module.default),
};

export const getDictionary = async (locale: string) => {
  return dictionaries.fr();
};
