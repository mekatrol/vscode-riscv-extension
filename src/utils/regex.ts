const getRegexFlags = (regexes: RegExp[]): string => {
  // Create distinct set of flags
  const reFlags = regexes
    .map((t) => t.flags)
    .join('') // Join all as single string
    .split('') // Split into individual characters
    .sort() // Sort alphabetically
    .join('') // Rejoin characters
    .replace(/(.)(?=.*\1)/g, ''); // Make letters distinct (remove repeated characters)

  return reFlags;
};

const getRegexSources = (regexes: RegExp[]): string[] => {
  const reSource = regexes.map((t) => t.source);
  return reSource;
};

export const joinRegexAsOr = (regexes: RegExp[]): RegExp => {
  // Create distinct set of flags
  const reFlags = getRegexFlags(regexes);

  // Join all source values with or '|' operator
  const reSource = getRegexSources(regexes).join('|');

  const re = new RegExp(reSource, reFlags);

  return re;
};
