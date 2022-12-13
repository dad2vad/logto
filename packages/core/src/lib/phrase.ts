import type { LocalePhrase } from '@logto/phrases-ui';
import resource, { isBuiltInLanguageTag } from '@logto/phrases-ui';
import type { CustomPhrase } from '@logto/schemas';
import cleanDeep from 'clean-deep';
import deepmerge from 'deepmerge';

import { findCustomPhraseByLanguageTag } from '#src/queries/custom-phrase.js';

export const getPhrase = async (supportedLanguage: string, customLanguages: string[]) => {
  if (!isBuiltInLanguageTag(supportedLanguage)) {
    return deepmerge<LocalePhrase, CustomPhrase>(
      resource.en,
      cleanDeep(await findCustomPhraseByLanguageTag(supportedLanguage))
    );
  }

  if (!customLanguages.includes(supportedLanguage)) {
    return resource[supportedLanguage];
  }

  return deepmerge<LocalePhrase, CustomPhrase>(
    resource[supportedLanguage],
    cleanDeep(await findCustomPhraseByLanguageTag(supportedLanguage))
  );
};
