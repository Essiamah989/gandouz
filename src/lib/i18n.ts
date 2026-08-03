import "server-only";

const dictionaries = {
  fr: () => import("../dictionaries/fr.json").then((module) => module.default),
};

export const getDictionary = async () => {
  return dictionaries.fr();
};
