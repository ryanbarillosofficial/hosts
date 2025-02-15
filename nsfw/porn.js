import sources from "./sources.json" with {type: "json"};
import {
  makeHost,
  getHost,
  IP_MODE,
  KEYWORDS_TO_IGNORE,
} from "../hostTools.js";
import process from "process";

/*
Constant variables
*/
const HOST_NAME = "porn";
const HOST_TITLE = "No Porn";
const HOST_DESC = "No pornographic websites";
const DIRECTORY_OUTPUT = "nsfw";

/*
List of domains to block
*/
let domains_with_www_prefix = new Set();
let domains_sans_www_prefix = new Set();

for (const i in sources) {
  const source = sources[i];
  /**
   * Alert the console the source being worked on for debugging
   */
  console.log(`\n\nAdding all domains from \"${source.name}"\"`);
  const domainList = await getHost(source.url);
  /**
   * Separate each URL from its redirect IP address
   * And append them to the corrrect domain lists above
   */
  for (const domainEntry of domainList) {
    /**
     * Ignore lines that don't have IP addresses
     * They are most likely whitespaces or comments
     */
    let proceed = true;
    for (const KEYWORD of KEYWORDS_TO_IGNORE) {
      if (domainEntry.includes(KEYWORD)) {
        proceed = false;
        break;
      }
    }
    /**
     * Next, check if line contains an IP address
     * That means it's a website
     */
    if (proceed) {
      if (
        IP_MODE.V4.REGEX.test(domainEntry) ||
        IP_MODE.V6.REGEX.test(domainEntry)
      ) {
        /**
         * Format of each entry is as follows:
         * {ip_address} {domain_url}
         *
         * For our purposes, only {domain_url} is needed, thus as follows
         */
        const DOMAIN = domainEntry.split(" ")[1];
        /**
         * Now to add into the list
         */
        if (DOMAIN.includes("www.")) {
          domains_with_www_prefix.add(DOMAIN); // Add to set of domains with "www." prefix
          domains_sans_www_prefix.add(DOMAIN.slice(4)); // Add to set of domains WITHOUT "www." prefix
        } else {
          domains_sans_www_prefix.add(DOMAIN); // Add to set of domains without "www." prefix
          domains_with_www_prefix.add(`www.${DOMAIN}`); // Add to set of domains WITH "www." prefix
        }
      }
    }
  }
}

// console.log(domains_sans_www_prefix.size);
// console.log(domains_with_www_prefix.size);
// process.exit();

/**
 * Now to make a new host file
 */
makeHost(
  HOST_NAME,
  HOST_TITLE,
  HOST_DESC,
  domains_sans_www_prefix,
  domains_with_www_prefix,
  DIRECTORY_OUTPUT
);
