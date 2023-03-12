import { animals, colors, uniqueNamesGenerator } from 'unique-names-generator';

import type { Config } from 'unique-names-generator';

const customConfig: Config = {
  dictionaries: [colors, animals],
  separator: '-',
  length: 2,
};

export const shortname = () => uniqueNamesGenerator(customConfig);
