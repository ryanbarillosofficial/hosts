import { SourceUrlNative, SourceUrlForeign } from "./SourceUrl";

export class SourceNative {
  constructor(
    entryName,
    entryTitle,
    affixesCountries = null,
    affixesPrefixes = null,
    affixesSuffixes = null,
    subdomains
  ) {
    // Name of the source
    if (typeof entryName === "string") {
      this.entryName = entryName;
    } else {
      throw new Error('"entryName" must be a string!');
    }
    // entryTitle of given source
    if (typeof entryTitle === "string") {
      this.entryTitle = entryTitle;
    } else {
      throw new Error('"entryTitle" must be a string!');
    }
    // Affixes of country codes of given source, which must be either null or an array of strings
    if (Array.isArray(affixesCountries)) {
      for (let i = 0; i < affixesCountries.length; i++) {
        if (typeof affixesCountries[i] !== "string") {
          throw new Error(
            `"affixesCountries" is INVALID! (Entry #${
              i + 1
            } has the WRONG data type)`
          );
        }
      }
      this.affixesCountries = affixesCountries;
    } else if (affixesCountries == null) {
      this.affixesCountries = affixesCountries;
    } else {
      throw new Error('"affixesCountries" MUST be an array!');
    }
    // Affixes of prefixes of given source, which must be either null or an array of strings
    if (Array.isArray(affixesPrefixes)) {
      for (let i = 0; i < affixesPrefixes.length; i++) {
        if (typeof affixesPrefixes[i] !== "string") {
          throw new Error(
            `"affixesPrefixes" is INVALID! (Entry #${
              i + 1
            } has the WRONG data type)`
          );
        }
      }
      this.affixesPrefixes = affixesPrefixes;
    } else if (affixesPrefixes == null) {
      this.affixesPrefixes = affixesPrefixes;
    } else {
      throw new Error('"affixesPrefixes" MUST be an array!');
    }
    // Affixes of suffixes of given source, which must be either null or an array of strings
    if (Array.isArray(affixesSuffixes)) {
      for (let i = 0; i < affixesSuffixes.length; i++) {
        if (typeof affixesSuffixes[i] !== "string") {
          throw new Error(
            `"affixesSuffixes" is INVALID! (Entry #${
              i + 1
            } has the WRONG data type)`
          );
        }
      }
      this.affixesSuffixes = affixesSuffixes;
    } else if (affixesSuffixes == null) {
      this.affixesSuffixes = affixesSuffixes;
    } else {
      throw new Error('"affixesSuffixes" MUST be an array!');
    }
    // Array of subdomains of given source, all of which much be instances of "SourceUrlNative"
    if (Array.isArray(subdomains)) {
      for (let i = 0; i < subdomains.length; i++) {
        if (subdomains[i] instanceof SourceUrlNative == false) {
          throw new Error(
            `"subdomains" is INVALID! (Entry #${i + 1} has the WRONG data type)`
          );
        }
      }
      this.subdomains = subdomains;
    } else {
      throw new Error('"affixesSuffixes" MUST be an array!');
    }
  }
  // Convert object to JSON
  toJson() {
    return {
      [entryName]: {
        entryTitle: this.entryTitle,
        affixes: {
          countries: this.affixesCountries,
          prefixes: this.affixesPrefixes,
          suffixes: this.affixesSuffixes,
        },
        subdomains: this.subdomains,
      },
    };
  }
}

export class SourceForeign {
  constructor(entryName, entryTitle, urlList) {
    // Name of the source
    if (typeof entryName === "string") {
      this.name = entryName;
    } else {
      throw new Error('"entryName" must be a string!');
    }
    // Title of given source
    if (typeof entryTitle === "string") {
      this.title = entryTitle;
    } else {
      throw new Error('"entryTitle" must be a string!');
    }
    // List of URL's of the source
    if (Array.isArray(urlList)) {
      for (let i = 0; i < urlList.length; i++) {
        if (urlList[i] instanceof SourceUrlForeign == false) {
          throw new Error(
            `"urlList" is INVALID! (Entry #${i + 1} has the WRONG data type)`
          );
        }
      }
      this.sources = urlList;
    }
  }
  // Convert object to JSON
  toJson() {
    return {
      [this.name]: {
        title: this.title,
        sources: this.sources,
      },
    };
  }
}
