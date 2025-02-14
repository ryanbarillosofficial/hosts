import sources from "./sources.json" with {type: "json"}
import makehost from "../makehost.js"

const DIRECTORY_OUTPUT = "search_engines";

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
        let url_sans_www = domain.url;
        let url_with_www = `www.${domain.url}`;
        
        // Add to normal blacklist
        domains_sans_www_prefix.add(url_sans_www)
        domains_with_www_prefix.add(url_with_www)

        // Check if it has SafeSearch enabled
        if (domain.safesearch == false) {
            safesearch_strict__domains_sans_www_prefix.add(url_sans_www)
            safesearch_strict__domains_with_www_prefix.add(url_with_www)

            // Now check if blocking it damages other websites---by which, don't block at all
            if (domain.damaging_if_disabled == false) {
                safesearch_easy__domains_sans_www_prefix.add(url_sans_www)
                safesearch_easy__domains_with_www_prefix.add(url_with_www)
            }
        }
    }
}

/*
Now to create all appropriate host files
*/

// Blocking ALL Search Engines
makehost(
    "all",
    "No Search Engines",
    "No search engines AT ALL",
    domains_sans_www_prefix,
    domains_with_www_prefix,
    DIRECTORY_OUTPUT
    )

// Blocking ALL Search Engines + SafeSearch NOT ENFORCED + NOT BREAKING other websites
makehost(
    "safesearch_easy",
    "Safe Search Engines ONLY (Easy Version)",
    "Only allow search engines with Safe Mode enabled (but don't break other sites)",
    safesearch_easy__domains_sans_www_prefix,
    safesearch_easy__domains_with_www_prefix,
    DIRECTORY_OUTPUT
    )

// Blocking ALL Search Engines + SafeSearch NOT ENFORCED + BREAKING other websites
makehost(
    "safesearch_strict",
    "Safe Search Engines ONLY (Strict Version)",
    "Only allow search engines with Safe Mode enabled (EVEN IF other sites break)",
    safesearch_strict__domains_sans_www_prefix,
    safesearch_strict__domains_with_www_prefix,
    DIRECTORY_OUTPUT
    )    
    /*
// Blacklist of all search engines NOT SAFESEARCH (easy mode)
//

// Blacklist of all search engines NOT SAFESEARCH (easy mode)
//
makehost(
    host_name="safesearch_strict",
    host_title="Safe Search Engines ONLY (Strict Version)",
    host_description="Only allow search engines with Safe Mode STRICTLY enabled",
    domains_sans_www_prefix=safesearch_strict__domains_sans_www_prefix,
    domains_with_www_prefix=safesearch_strict__domains_with_www_prefix
    )    
// Blacklist of all search engines NOT SAFESEARCH + WITH IMAGES
//
makehost(
    host_name = "safesearch__graphicfree",
    host_title = "Safe Search Engines + NO Images ONLY",
    host_description = "Only allow search engines with Safe Mode STRICTLY enabled + no images",
    domains_sans_www_prefix = safesearch__graphicfree__domains_sans_www_prefix,
    domains_with_www_prefix = safesearch__graphicfree__domains_with_www_prefix
    )
    */