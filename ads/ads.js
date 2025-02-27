import SOURCES from "./sources.json" with { type: "json" }
import { KEYWORDS_TO_IGNORE, IP_MODE, makeHost } from "../hostTools.js";

const HOST_NAME = "ads",
  HOST_TITLE = "No Ads",
  HOST_DESC = HOST_TITLE,
  DIRECTORY_OUTPUT = "ads";

async function main() {
  let domainsSansPrefixWWW = new Set(),
    domainsWithPrefixWWW = new Set();

  for (const __ENTRY__ in SOURCES) {
    const ENTRY = SOURCES[__ENTRY__];
    console.log("Pulling sources from " + ENTRY.title);
    /**
     * Go through every source in the sources array
     * To add each domain to be blocked in the list
     */
    for (let i = 0; i < ENTRY.sources.length; i++) {
      const SOURCE = ENTRY.sources[i];
      console.log(`- Source #${i + 1}: "${SOURCE.title}"`);
      const HOST_ARRAY = (await (await fetch(SOURCE.url)).text()).split("\n");
      HOST_ARRAY.forEach((line) => {
        /**
         * Ignore lines that don't have IP addresses
         * They are most likely whitespaces or comments
         */
        if (
          KEYWORDS_TO_IGNORE.some((KEYWORD) => line.includes(KEYWORD)) == false
        ) {
          if (
            IP_MODE.V4.REGEX.test(line) == true ||
            IP_MODE.V6.REGEX.test(line) == true
          ) {
            /**
             * Splitting the line should present both the following:
             * - Element 0: IP Address (0.0.0.0, 127.0.0.1, or another for redirecting)
             * - Element 1: Domain name
             *
             * Only focus on Item 1
             */
            const DOMAIN = line.split(" ")[1];
            // Now Add to list
            if (DOMAIN.includes("www.")) {
              domainsSansPrefixWWW.add(DOMAIN.slice(4)); // Add to set of domains WITHOUT "www." prefix
              domainsWithPrefixWWW.add(DOMAIN); // Add to set of domains with "www." prefix
            } else {
              domainsSansPrefixWWW.add(DOMAIN); // Add to set of domains without "www." prefix
              domainsWithPrefixWWW.add(`www.${DOMAIN}`); // Add to set of domains WITH "www." prefix
            }
          }
        }
      });
    }
    console.log();
  }
  makeHost(
    HOST_NAME,
    HOST_TITLE,
    HOST_DESC,
    domainsSansPrefixWWW,
    domainsWithPrefixWWW,
    DIRECTORY_OUTPUT
  );
}

main();
