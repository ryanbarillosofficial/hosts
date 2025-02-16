import sources from "./sources.json" with {type: "json"}
import {makeHost, getAllUrlVariants} from "../hostTools.js"
import process from "process";

const DIRECTORY_OUTPUT = "search_engines";

const a = "__test__I love U";
const aa = a.replace("__test__", "")
console.log(`${aa} + ${aa[0]}`)
process.exit()

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
 * 
 * Wikipedia (why it's blocked)
 * - https://en.wikipedia.org/wiki/Wikipedia:Sexual_content/FAQ
 */

/*
List of search engines to block
*/ 
let domains_with_www_prefix = new Set();
let domains_sans_www_prefix = new Set();

/*
List of Child-safe Websites (Easy Version)
*/
let safesearch_easy__domains_with_www_prefix = new Set()
let safesearch_easy__domains_sans_www_prefix = new Set()

/*
List of Child-safe Websites (Strict Version)
*/
let safesearch_strict__domains_with_www_prefix = new Set()
let safesearch_strict__domains_sans_www_prefix = new Set()

/*
List of Child-safe Websites WITHOUT graphics
*/
let safesearch__graphicfree__domains_sans_www_prefix = new Set()
let safesearch__graphicfree__domains_with_www_prefix = new Set()

/*
Go through each search engine and add them to list
https://www.w3schools.com/python/python_dictionaries_loop.asp
*/
for (const search_engine in sources) {
    const domains = sources[search_engine]

    for (const domain of domains) {
        // Prepare two distinct versions of the URL
        const URL_SANS_WWW = domain.url
        const URL_WITH_WWW = `www.${domain.url}`;
        
        // Add to normal blacklist
        domains_sans_www_prefix.add(URL_SANS_WWW)
        domains_with_www_prefix.add(URL_WITH_WWW)

        /**
         * Check if it has SafeSearch enabled
         * 
         * Two Ways:
         * - if domain.safesearh == false, block it!
         * - if domain.redirect_to is NOT EMPTY, redirect it to its SafeSearch variant
         */
        if(domain.url.includes("^")) {
            const ALL_URL_VARIANTS__SANS_WWW = domain.redirect_to !== ""
        ? getAllUrlVariants(URL_SANS_WWW, domain.affixes, domain.redirect_to).union(getAllUrlVariants(URL_WITH_WWW, domain.affixes, domain.redirect_to)) 
        : getAllUrlVariants(URL_SANS_WWW, domain.affixes).union(getAllUrlVariants(URL_WITH_WWW, domain.affixes));

        for (const URL of ALL_URL_VARIANTS) {
            console.log(URL)
        }
        process.exit()
        }

        if (domain.safesearch == false) {
            safesearch_strict__domains_sans_www_prefix.add(URL_SANS_WWW)
            safesearch_strict__domains_with_www_prefix.add(URL_WITH_WWW)

            // Now check if blocking it damages other websites---by which, don't block at all
            if (domain.damaging_if_disabled == false) {
                safesearch_easy__domains_sans_www_prefix.add(URL_SANS_WWW)
                safesearch_easy__domains_with_www_prefix.add(URL_WITH_WWW)
            }
        }
    }
}
/*
Now to create all appropriate host files
*/

// Blocking ALL Search Engines
makeHost(
    "all",
    "No Search Engines",
    "No search engines AT ALL",
    domains_sans_www_prefix,
    domains_with_www_prefix,
    DIRECTORY_OUTPUT
    )

// Blocking ALL Search Engines + SafeSearch NOT ENFORCED + NOT BREAKING other websites
makeHost(
    "safesearch_easy",
    "Safe Search Engines ONLY (Easy Version)",
    "Only allow search engines with Safe Mode enabled (but don't break other sites)",
    safesearch_easy__domains_sans_www_prefix,
    safesearch_easy__domains_with_www_prefix,
    DIRECTORY_OUTPUT
    )

// Blocking ALL Search Engines + SafeSearch NOT ENFORCED + BREAKING other websites
makeHost(
    "safesearch_strict",
    "Safe Search Engines ONLY (Strict Version)",
    "Only allow search engines with Safe Mode enabled (EVEN IF other sites break)",
    safesearch_strict__domains_sans_www_prefix,
    safesearch_strict__domains_with_www_prefix,
    DIRECTORY_OUTPUT
    )