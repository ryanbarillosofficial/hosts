import __SOURCES__ from "./sources.json" with {type: "json"}
// import process from "process";
import {
  makeHost,
  resolveRedirect,
  resolveUrlAffixes,
  AFFIX_KEYWORDS,
  WWW_REGEX
} from "../hostTools.js";
/**
 * Info for later
 *
 * Searching for other live search engines
 * - https://gist.github.com/NaveenDA/b1ff7d43812a3c79354f9b2fd9868186
 *
 * Bing
 * - https://support.microsoft.com/en-us/topic/blocking-adult-content-with-safesearch-or-blocking-chat-946059ed-992b-46a0-944a-28e8fb8f1814
 *
 * Google & YouTube
 * - https://support.google.com/websearch/answer/186669?hl=en
 * - https://support.google.com/a/answer/6214622
 *
 * DuckDuckGo
 * - https://safe.duckduckgo.com/duckduckgo-help-pages/features/safe-search/
 *
 * Ecosia
 * - https://ecosia.helpscoutdocs.com/article/562-how-to-enforce-safe-search-at-your-organization
 *
 * Startpage
 * - https://support.startpage.com/hc/en-us/articles/31709891174420-Whitelisting-Startpage-at-the-DNS-level-safe-startpage-com
 *
 * Searx
 * - https://searx.space/
 * - https://searx.space/data/instances.json
 * - https://github.com/searxng/searxng
 *
 * Wikipedia (why it's blocked)
 * - https://en.wikipedia.org/wiki/Wikipedia:Sexual_content/FAQ
 */
const DIRECTORY_OUTPUT = "search_engines";
const AFFIX_KEYWORDS_ARRAY = Object.values(AFFIX_KEYWORDS);

/**
 * DO NOT DELETE
 * These are notes for the future when I need to update this function
 *
 * This is supposed to be a recursive function that will replace each
 * Affix without the need of separate functions
 */
// const test = "__country__aaaaaaaaa__number___bbbbbbbb__prefix__cccccccccc__suffix__dddddddddd"
// let count = 0
// AFFIX_KEYWORDS_ARRAY.forEach((AFFIX) => {if (test.includes(AFFIX)) count++})
// console.log(count)
// process.exit()

function main() {
  // /**
  //  * List of search engines to block
  //  */
  let domainsSansPrefixWWW_All = new Set(),
    domainsWithPrefixWWW_All = new Set();

  /**
   * List of Child-safe Websites (Easy Version)
   */
  let domainsSansPrefixWWW_Safesearch_Moderate = new Set(),
    domainsWithPrefixWWW_Safesearch_Moderate = new Set();

  /**
   * List of Child-safe Websites (Strict Version)
   */
  let domainsSansPrefixWWW_Safesearch_Aggressive = new Set(),
    domainsWithPrefixWWW_Safesearch_Aggressive = new Set();

  /**
   * List of Child-safe Websites WITHOUT graphics
   */
  let safesearch__graphicfree__domains_sans_www_prefix = new Set(),
    safesearch__graphicfree__domains_with_www_prefix = new Set();
  /**
   *
   * Now, begin the work!
   *
   */
  for (const __ENTRY__ in __SOURCES__) {
    // Variables for use
    const ENTRY = __SOURCES__[__ENTRY__],
      AFFIXES = ENTRY.affixes,
      SUBDOMAINS = ENTRY.subdomains;
    /**
     * Check if each URL of EACH subdomain needs substition for any of the following:
     * - Country code
     * - Number
     * - Prefix
     * - Suffix
     *
     * Then resolve those into actual web addresses for addition to the lists
     *
     * Reference(s):
     * - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
     * - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values
     */
    SUBDOMAINS.forEach((DOMAIN) => {
      // A handful of required properties to check through
      const URL = DOMAIN.url,
        HAS_SAFESEARCH = DOMAIN.hasSafeSearch,
        DAMAGING_IF_DISABLED = DOMAIN.damagingIfDisabled,
        REDIRECT_TO = DOMAIN.redirectTo;
      /**
       *
       */
      if (AFFIX_KEYWORDS_ARRAY.some((AFFIX) => URL.includes(AFFIX)) == true) {
        const URL_LIST = resolveUrlAffixes(URL, AFFIXES); // Data type is array
        /**
         * Check if each URL has a "redirectTo" object (AKA !== null)
         * So it can be resolved to another IP address
         * - likely a SafeSearch or Restricted Mode version of itself
         *
         * Otherwise, add it to the list right away
         * - No need for extra procedures
         */
        URL_LIST.forEach((URL_CURRENT) => {
          const URL_SANS_WWW = URL_CURRENT;
          const URL_WITH_WWW =
						WWW_REGEX.test(URL_CURRENT) === false
							? `www.${URL_CURRENT}`
							: URL_CURRENT;
          // Check if there are IP addreses to redirect to
          if (REDIRECT_TO !== null) {
            const IP_REDIRECT = REDIRECT_TO.url;
            // Add URL to "moderate" blocklist first
            domainsSansPrefixWWW_Safesearch_Moderate.add(
              resolveRedirect(IP_REDIRECT, URL_SANS_WWW)
            );
            domainsWithPrefixWWW_Safesearch_Moderate.add(
              resolveRedirect(IP_REDIRECT, URL_WITH_WWW)
            );
            // Add URL to "Strict" blocklist last
            domainsSansPrefixWWW_Safesearch_Aggressive.add(
              resolveRedirect(IP_REDIRECT, URL_SANS_WWW)
            );
            domainsWithPrefixWWW_Safesearch_Aggressive.add(
              resolveRedirect(IP_REDIRECT, URL_WITH_WWW)
            );
          } else {
            const URL_SANS_WWW = URL_CURRENT,
              URL_WITH_WWW =
                WWW_REGEX.test(URL_CURRENT) === false
                  ? `www.${URL_CURRENT}`
                  : URL_CURRENT;
            /**
             *
             */
            if (HAS_SAFESEARCH !== true) {
              /**
               * Verdict: URL has no REDIRECTS present!
               * Now add the subdomain to the blacklist based on these properties:
               *
               * 1. has_safesearch?
               *  - If "false", PREPARE to block it!
               *
               * 1a. Does blocking it DAMAGE other websites?
               *  - If "true", don't add in the "Moderate" blacklist
               *  - Regardless, add it to the "Strict" blacklist
               */
              if (DAMAGING_IF_DISABLED !== true) {
                domainsSansPrefixWWW_Safesearch_Moderate.add(URL_SANS_WWW);
                domainsWithPrefixWWW_Safesearch_Moderate.add(URL_WITH_WWW);
              }
              domainsSansPrefixWWW_Safesearch_Aggressive.add(URL_SANS_WWW);
              domainsWithPrefixWWW_Safesearch_Aggressive.add(URL_WITH_WWW);
            }
          }
          // Regardless, add it to the database of all search engines
          domainsSansPrefixWWW_All.add(URL_SANS_WWW);
          domainsWithPrefixWWW_All.add(URL_WITH_WWW);
        });
      } else {
        const URL_SANS_WWW = URL;
        const URL_WITH_WWW = WWW_REGEX.test(URL) === false ? `www.${URL}` : URL;
        if (HAS_SAFESEARCH !== true) {
          /**
           * Verdict: URL has no REDIRECTS present!
           * Now add the subdomain to the blacklist based on these properties:
           *
           * 1. has_safesearch?
           *  - If "false", PREPARE to block it!
           *
           * 1a. Does blocking it DAMAGE other websites?
           *  - If "true", don't add in the "Moderate" blacklist
           *  - Regardless, add it to the "Strict" blacklist
           */
          if (DAMAGING_IF_DISABLED !== true) {
            domainsSansPrefixWWW_Safesearch_Moderate.add(URL_SANS_WWW);
            domainsWithPrefixWWW_Safesearch_Moderate.add(URL_WITH_WWW);
          }
          domainsSansPrefixWWW_Safesearch_Aggressive.add(URL_SANS_WWW);
          domainsWithPrefixWWW_Safesearch_Aggressive.add(URL_WITH_WWW);
        } else {
          /**
           * Verdict: URL has no affixes present!
           * Before going further, CHECK if URL needs redirecting
           */
          if (REDIRECT_TO !== null) {
            const IP_REDIRECT = REDIRECT_TO.url;
            // Add URL to "moderate" blocklist first
            domainsSansPrefixWWW_Safesearch_Moderate.add(
              resolveRedirect(IP_REDIRECT, URL_SANS_WWW)
            );
            domainsWithPrefixWWW_Safesearch_Moderate.add(
              resolveRedirect(IP_REDIRECT, URL_WITH_WWW)
            );
            // Add URL to "Strict" blocklist last
            domainsSansPrefixWWW_Safesearch_Aggressive.add(
              resolveRedirect(IP_REDIRECT, URL_SANS_WWW)
            );
            domainsWithPrefixWWW_Safesearch_Aggressive.add(
              resolveRedirect(IP_REDIRECT, URL_WITH_WWW)
            );
            // Regardless, add it to the database of all search engines
            domainsSansPrefixWWW_All.add(URL_SANS_WWW);
            domainsWithPrefixWWW_All.add(URL_WITH_WWW);
          }
        }
      }
    });
  }
  /**
   * Now to create all appropriate host files
   */
  // Blocking ALL Search Engines
  makeHost(
    "all",
    "No Search Engines",
    "No search engines AT ALL",
    domainsSansPrefixWWW_All,
    domainsWithPrefixWWW_All,
    DIRECTORY_OUTPUT
  );
  // Blocking ALL Search Engines + SafeSearch NOT ENFORCED + NOT BREAKING other websites
  makeHost(
    "safesearch_moderate",
    "Safe Search Engines ONLY (Moderate Version)",
    "Only allow search engines with Safe Mode enabled (but don't break other sites)",
    domainsSansPrefixWWW_Safesearch_Moderate,
    domainsWithPrefixWWW_Safesearch_Moderate,
    DIRECTORY_OUTPUT
  );

  // Blocking ALL Search Engines + SafeSearch NOT ENFORCED + BREAKING other websites
  makeHost(
    "safesearch_aggressive",
    "Safe Search Engines ONLY (Aggressive Version)",
    "Only allow search engines with Safe Mode enabled (EVEN IF other sites break)",
    domainsSansPrefixWWW_Safesearch_Aggressive,
    domainsWithPrefixWWW_Safesearch_Aggressive,
    DIRECTORY_OUTPUT
  );
}
main();
