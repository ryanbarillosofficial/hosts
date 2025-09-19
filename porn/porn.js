import __SOURCES__ from "./sources.json" with { type: "json" }
import {
  KEYWORDS_TO_IGNORE,
  IP_MODE,
  getHost,
  makeHost,
  WWW_MODE,
} from "../hostTools.js";

const HOST_NAME = "porn";
const HOST_TITLE = "No Porn";
const HOST_DESC = "No pornographic websites";
const DIRECTORY_OUTPUT = "nsfw";

async function main() {
  let domainSet = new Set();

  for (const __ENTRY__ in __SOURCES__) {
    const ENTRY = __SOURCES__[__ENTRY__];
    console.log("Pulling sources from " + ENTRY.title);
    /**
     * Go through every source in the sources array
     * To add each domain to be blocked in the list
     */
    for (let i = 0; i < ENTRY.sources.length; i++) {
      const source = ENTRY.sources[i];
      console.log(`- Source #${i + 1}: "${source.title}"`);
      const hostArray = await getHost(source.url);
      hostArray.forEach((line) => {
        /**
         * Ignore lines that don't have IP addresses
         * They are most likely whitespaces or comments
         */
        if (
          KEYWORDS_TO_IGNORE.some((KEYWORD) => line.includes(KEYWORD)) == false
        ) {
          if (
            IP_MODE.v4.regex.test(line) == true ||
            IP_MODE.v6.regex.test(line) == true
          ) {
            /**
             * Splitting the line should present both the following:
             * - Element 0: IP Address (0.0.0.0, 127.0.0.1, or another for redirecting)
             * - Element 1: Domain name
             *
             * Only focus on Item 1
             */
            const domain = line.split(" ")[1];
            // Now Add to list
            if (WWW_MODE.regex.test(domain) == true) {
              domainSet.add(domain.slice(4)); // Add to set of domains WITHOUT "www." prefix
            } else {
              domainSet.add(domain); // Add to set of domains without "www." prefix
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
    domainSet,
    DIRECTORY_OUTPUT
  );
}

main();
