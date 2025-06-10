/*
Imports for debugging (not used very often)
The one I use most from these:
- process.exit();
*/
import process from "process";
import fs from "fs";
import path from "path";
import { printDate } from "./__tools__/printDate.js";

// Constant variables
const DIRECTORY_CURRENT = process.cwd();
const BREAK_BLOCK = "\n\n\n";
const BREAK_LINE = "#===============";
const AFFIX_KEYWORDS = {
  country: "__country__",
  number: "__number__",
  prefix: "__prefix__",
  suffix: "__suffix__",
};
/**
 * Source of IPv6 Regex
 * https://github.com/sindresorhus/ip-regex/blob/main/index.js
 */
const KEYWORDS_TO_IGNORE = [
  "local",
  "localhost",
  "broadcasthost",
  "#",
  "undefined",
];
export const WWW_MODE = {
  prefix: "www.",
  regex: /^www\./,
};
const IP_MODE = {
  v4: {
    prefix: "0.0.0.0",
    regex: /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/,
  },
  v6: {
    prefix: "::1",
    regex:
      /(?:[a-fA-F\d]{1,4}:){7}(?:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){6}(?::[a-fA-F\d]{1,4}|:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){5}(?::[a-fA-F\d]{1,4}|(?::[a-fA-F\d]{1,4}){1,2}|:)|(?:[a-fA-F\d]{1,4}:){4}(?:(?::[a-fA-F\d]{1,4}){0,1}:[a-fA-F\d]{1,4}|(?::[a-fA-F\d]{1,4}){1,3}|:)|(?:[a-fA-F\d]{1,4}:){3}(?:(?::[a-fA-F\d]{1,4}){0,2}:[a-fA-F\d]{1,4}|(?::[a-fA-F\d]{1,4}){1,4}|:)|(?:[a-fA-F\d]{1,4}:){2}(?:(?::[a-fA-F\d]{1,4}){0,3}:[a-fA-F\d]{1,4}|(?::[a-fA-F\d]{1,4}){1,5}|:)|(?:[a-fA-F\d]{1,4}:){1}(?:(?::[a-fA-F\d]{1,4}){0,4}:[a-fA-F\d]{1,4}|(?::[a-fA-F\d]{1,4}){1,6}|:|)(?::(?:(?::[a-fA-F\d]{1,4}){0,5}:[a-fA-F\d]{1,4}|(?::[a-fA-F\d]{1,4}){1,7}|:))(?:%[0-9a-zA-Z]{1,})?/,
  },
};

export const resolveRedirect = (url, urlRedirect = null) => {
  let urlSet = new Set();

  if (urlRedirect != null) {
    urlSet.add(`${urlRedirect} ${url}`);
    return urlSet;
  }

  /**
   * If URL contains "www." prefix,
   * then add both it and its non-"www." equivalent
   */
  if (WWW_MODE.regex.test(url) == true) {
    // Step 01
    urlSet.add(`${IP_MODE.v4.prefix} ${url}`);
    urlSet.add(`${IP_MODE.v4.prefix} ${url.slice(4)}`);
    // Step 02
    urlSet.add(`${IP_MODE.v6.prefix} ${url}`);
    urlSet.add(`${IP_MODE.v6.prefix} ${url.slice(4)}`);
  } else {
    // Step 01
    urlSet.add(`${IP_MODE.v4.prefix} ${url}`);
    urlSet.add(`${IP_MODE.v4.prefix} ${WWW_MODE.prefix}${url}`);
    // Step 02
    urlSet.add(`${IP_MODE.v6.prefix} ${url}`);
    urlSet.add(`${IP_MODE.v6.prefix} ${WWW_MODE.prefix}${url}`);
  }
  return urlSet;
};
export function resolveUrlAffixes(URL, AFFIXES) {
  let urlList = new Set();

  /**
   * "Country" Affix Substitutor for URL's
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace
   */
  const resolveAffix = (URL, keyword, affix) => {
    // console.log(URL.replace(keyword, affix))
    return URL.replace(keyword, affix);
  };

  /**
   * Check if "URL" has the affix "country"
   * Then add each URL variant into the list
   */
  if (URL.includes(AFFIX_KEYWORDS.country)) {
    //console.log(`${URL} has\t\t\"${AFFIX_KEYWORDS.country}\"`)
    for (let i = 0; i < AFFIXES.countries.length; i++) {
      urlList.add(
        resolveAffix(URL, AFFIX_KEYWORDS.country, AFFIXES.countries[i])
      );
    }
  }
  /**
   * Check if "URL" has the affix "number"
   * Then add each URL variant into the list
   *
   * NOTE:
   * Given that any domain can have 1 to 9999+ variations of its domain
   * Only the first 10 will be resolved
   * - In the future, when I've learnt alternatives to hostname blocking, I'll utilize simpler methods (like RegExp)
   * - Other alternative is IP address blocking, but hostname blocking won't allow that
   */
  if (URL.includes(AFFIX_KEYWORDS.number)) {
    //console.log(`${URL} has\t\t\"${AFFIX_KEYWORDS.number}\"`)
    for (let i = 0; i <= 10; i++) {
      urlList.add(resolveAffix(URL, AFFIX_KEYWORDS.number, i.toString()));
    }
  }
  /**
   * Check if "URL" has the affix "prefix"
   * Then add each URL variant into the list
   */
  if (URL.includes(AFFIX_KEYWORDS.prefix)) {
    //console.log(`${URL} has\t\t\"${AFFIX_KEYWORDS.prefix}\"`)
    for (let i = 0; i < AFFIXES.prefixes.length; i++) {
      urlList.add(
        resolveAffix(URL, AFFIX_KEYWORDS.prefix, AFFIXES.prefixes[i])
      );
    }
  }
  /**
   * Check if "URL" has the affix "suffix"
   * Then add each URL variant into the list
   */
  if (URL.includes(AFFIX_KEYWORDS.suffix)) {
    //console.log(`${URL} has\t\t\"${AFFIX_KEYWORDS.suffix}\"`)
    for (let i = 0; i < AFFIXES.suffixes.length; i++) {
      urlList.add(
        resolveAffix(URL, AFFIX_KEYWORDS.suffix, AFFIXES.suffixes[i])
      );
    }
  }
  return urlList;
}

function makeHost(
  hostName,
  hostTitle,
  hostDescription,
  domainsSet,
  directoryOutput
) {
  /**
   * Convert sets into arrays for iteration
   * And then sort them alphabetically
   */
  const DOMAINS_ARRAY = Array.from(domainsSet).sort();
  const DOMAINS_ARRAY_OF_IPV4 = new Array();
  const DOMAINS_ARRAY_OF_IPV6 = new Array();

  DOMAINS_ARRAY.forEach((DOMAIN) => {
    if (IP_MODE.v4.regex.test(DOMAIN) === true) {
      DOMAINS_ARRAY_OF_IPV4.push(DOMAIN);
    } else {
      DOMAINS_ARRAY_OF_IPV6.push(DOMAIN);
    }
    // } else if (IP_MODE.v6.regex.test(DOMAIN) === true) {
    //   DOMAINS_ARRAY_OF_IPV6.push(DOMAIN);
    // }
  });

  // Info for each host file
  const FILE_NAME = `${hostName}.txt`;
  const FILE_PATH = path.join(DIRECTORY_CURRENT, FILE_NAME);

  const HOST_COMMENT = `# Title: \
    \n# ${hostTitle} \
    \n# \
    \n# Description: \
    \n# ${hostDescription} — simple as that! \
    \n# \
    \n# Compatible with AdAway on Android and multiple ad blockers. \
    \n# \
    \n# Source(s) Used: \
    \n# https://raw.githubusercontent.com/ryanbarillosofficial/hosts/main/${directoryOutput}/sources.json \
    \n# \
    \n# Number of Unique Domains (without their "www." variants): \
    \n# ${DOMAINS_ARRAY.length} \
    \n# \
    \n# Project Home Page: \
    \n# https://github.com/ryanbarillosofficial/hosts \
    \n# \
    \n# Last Updated: ${printDate()}\
    \n#${BREAK_BLOCK}`;

  /**
   * OJBECTIVE:
   * Build the string
   * containing all IPv4 addresses
   */
  let allDomains_Text = `${BREAK_LINE}\n# IPv4 Addresses\n${BREAK_LINE}`;
  DOMAINS_ARRAY_OF_IPV4.forEach((DOMAIN) => {
    allDomains_Text += `\n${DOMAIN}`;
  });
  allDomains_Text += BREAK_BLOCK;
  /**
   * OJBECTIVE:
   * Build the string
   * containing all IPv6 addresses
   */
  allDomains_Text += `${BREAK_LINE}\n# IPv6 Addresses\n${BREAK_LINE}`;
  DOMAINS_ARRAY_OF_IPV6.forEach((DOMAIN) => {
    allDomains_Text += `\n${DOMAIN}`;
  });
  // Make the host text file
  fs.writeFileSync(FILE_PATH, HOST_COMMENT + allDomains_Text);
  console.log(`Created \"${FILE_NAME}\" for \"${hostTitle}\"`);
}

async function getHost(url) {
  /**
   * Assuming that @url fetches a .txt file of domains to be blocked
   * Then we split the response by whitespaces
   * And return it as an array
   */
  return (await (await fetch(url)).text()).split("\n");
}

function getAllUrlVariants(url, affixes, redirect_to = "") {
  let allUrlVariants = new Set();
  /**
   * I'll add something here, eventually
   */
  for (const affix of affixes) {
    allUrlVariants.add(
      redirect_to !== ""
        ? `${redirect_to} ${url.replace("^", affix)}`
        : `${url.replace("^", affix)}`
    );
  }
  return allUrlVariants;
}

export {
  makeHost,
  getHost,
  getAllUrlVariants,
  IP_MODE,
  KEYWORDS_TO_IGNORE,
  AFFIX_KEYWORDS,
};
