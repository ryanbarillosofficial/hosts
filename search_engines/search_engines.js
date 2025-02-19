import sources from "./sources.json" with {type: "json"}
import { makeHost } from "../hostTools.js";
import process from "process";
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
const AFFIX_KEYWORDS = {
		country: "__country__",
		number: "__number__",
		prefix: "__prefix__",
		suffix: "__suffix__",
	},
	AFFIX_KEYWORDS_ARRAY = Object.values(AFFIX_KEYWORDS);

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

const resolveRedirect = (ipAddress, url) => {
	return `${ipAddress} ${url}`;
};
function resolveUrlAffixes(URL, AFFIXES) {
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
	for (const ENGINE in sources) {
        /**
         * For the moment, ignore YouTube
         * In the future, it will be made into a separate file to be applied
         */
		if (ENGINE == "youtube") break;
		// Variables for use
		const SEARCH_ENGINE = sources[ENGINE],
			AFFIXES = SEARCH_ENGINE.affixes,
			SUBDOMAINS = SEARCH_ENGINE.subdomains;
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
		for (let index = 0; index < SUBDOMAINS.length; index++) {
			// A handful of required properties to check through
			const SUBDOMAIN = SUBDOMAINS[index],
				URL = SUBDOMAIN.url,
				HAS_SAFESEARCH = SUBDOMAIN.has_safesearch,
				DAMAGING_IF_DISABLED = SUBDOMAIN.damaging_if_disabled,
				REDIRECT_TO = SUBDOMAIN.redirect_to;
			/**
			 *
			 */
			if (AFFIX_KEYWORDS_ARRAY.some((AFFIX) => URL.includes(AFFIX))) {
				const URL_LIST = resolveUrlAffixes(URL, AFFIXES); // Data type is array
				/**
				 * Check if each URL has a "redirect_to" object (AKA !== null)
				 * So it can be resolved to another IP address
				 * - likely a SafeSearch or Restricted Mode version of itself
				 *
				 * Otherwise, add it to the list right away
				 * - No need for extra procedures
				 */
				URL_LIST.forEach((URL_CURRENT) => {
					const URL_SANS_WWW = URL_CURRENT;
					const URL_WITH_WWW =
						/^www/.test(URL_CURRENT) === false
							? `www.${URL_CURRENT}`
							: URL_CURRENT;
					// Check if there are IP addreses to redirect to
					if (REDIRECT_TO !== null) {
						const IP_ADDRESS_MODERATE = REDIRECT_TO.moderate.url,
							IP_ADDRESS_STRICT = REDIRECT_TO.strict.url;
						/**
						 * Add URL to "moderate" blocklist first
						 * - For redirection to SafeSearch / Moderate mode of Search Engine provided
						 * - This CANNOT BREAK other websites
						 */
						domainsSansPrefixWWW_Safesearch_Moderate.add(
							resolveRedirect(IP_ADDRESS_MODERATE, URL_SANS_WWW)
						);
						domainsWithPrefixWWW_Safesearch_Moderate.add(
							resolveRedirect(IP_ADDRESS_MODERATE, URL_WITH_WWW)
						);
						/**
						 * Add URL to "Strict" blocklist first
						 * - For redirection to SafeSearch / Restricted mode of Search Engine provided
						 * - This CAN BREAK other websites
						 */
						domainsSansPrefixWWW_Safesearch_Aggressive.add(
							resolveRedirect(IP_ADDRESS_STRICT, URL_SANS_WWW)
						);
						domainsWithPrefixWWW_Safesearch_Aggressive.add(
							resolveRedirect(IP_ADDRESS_STRICT, URL_WITH_WWW)
						);
					} else {
						const URL_SANS_WWW = URL_CURRENT;
						const URL_WITH_WWW =
						/^www/.test(URL_CURRENT) === false
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
				const URL_WITH_WWW =(/^www/.test(URL) === false? `www.${URL}`: URL);
                /**
                 * Verdict: URL has no affixes present!
                 * Before going further, CHECK if URL needs redirecting 
                 */
                if (REDIRECT_TO !== null) {
                    const IP_ADDRESS_MODERATE = REDIRECT_TO.moderate.url,
                        IP_ADDRESS_STRICT = REDIRECT_TO.strict.url;
                    /**
                     * Add URL to "moderate" blocklist first
                     * - For redirection to SafeSearch / Moderate mode of Search Engine provided
                     * - This CANNOT BREAK other websites
                     */
                    domainsSansPrefixWWW_Safesearch_Moderate.add(
                        resolveRedirect(IP_ADDRESS_MODERATE, URL_SANS_WWW)
                    );
                    domainsWithPrefixWWW_Safesearch_Moderate.add(
                        resolveRedirect(IP_ADDRESS_MODERATE, URL_WITH_WWW)
                    );
                    /**
                     * Add URL to "Strict" blocklist first
                     * - For redirection to SafeSearch / Restricted mode of Search Engine provided
                     * - This CAN BREAK other websites
                     */
                    domainsSansPrefixWWW_Safesearch_Aggressive.add(
                        resolveRedirect(IP_ADDRESS_STRICT, URL_SANS_WWW)
                    );
                    domainsWithPrefixWWW_Safesearch_Aggressive.add(
                        resolveRedirect(IP_ADDRESS_STRICT, URL_WITH_WWW)
                    );
                } else {
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
			}
		}
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
