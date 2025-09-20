import __SOURCES__ from "./sources.json" with {type: "json"}
import {
	makeHost,
	resolveRedirect,
	resolveUrlAffixes,
	AFFIX_KEYWORDS
} from "../hostTools.js";
// import process from "process";

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
const HOST = {
	directory: "search_engines",
	type: {
		all: {
			name: "all",
			title: "No Search Engines",
			description: "No search engines AT ALL",
		},
		moderate: {
			name: "safesearch_moderate",
			title: "Safe Search Engines ONLY (Moderate Version)",
			description:
				"Enforce SafeSearch on ALL search engines (without breaking the web)",
		},
		aggressive: {
			name: "safesearch_aggressive",
			title: "Safe Search Engines ONLY (Moderate Version)",
			description:
				"Enforce SafeSearch on ALL search engines (even when it breaks the web)",
		},
	},
};

const AFFIX_KEYWORDS_ARRAY = Object.values(AFFIX_KEYWORDS);

function main() {
	/**
	 * List of search engines to block
	 */
	let domainSet = {
		all: new Set(),
		moderate: new Set(),
		aggressive: new Set(),
	};

	for (const __ENTRY__ in __SOURCES__) {
		// Variables for use
		const ENTRY = __SOURCES__[__ENTRY__];
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
		ENTRY.subdomains.forEach((domain) => {
			if (
				AFFIX_KEYWORDS_ARRAY.some((affix) => domain.url.includes(affix)) == true
			) {
				const urlArray = resolveUrlAffixes(domain.url, ENTRY.affixes);
				/**
				 * Check if each URL has a "redirectTo" object (AKA !== null)
				 * So it can be resolved to another IP address
				 * - likely a SafeSearch or Restricted Mode version of itself
				 *
				 * Otherwise, add it to the list right away
				 * - No need for extra procedures
				 */
				urlArray.forEach((url) => {
					if (domain.redirectTo !== null) {
						domainSet.moderate.add(resolveRedirect(url, domain.redirectTo.url));
						domainSet.aggressive.add(resolveRedirect(url, domain.redirectTo.url));
					} else {
						/**
						 * Verdict: URL has no REDIRECTS present!
						 * - Essentially the domain has no SafeSearch to redirect
						 *
						 * 1. hasSafeSearch?
						 *  - If "false", PREPARE to block it!
						 *
						 * 1a. Does blocking it NOT DISRUPT other websites?
						 *  - If "true", add in the "Moderate" blacklist
						 *  - Regardless, add it to the "Strict" blacklist
						 */
						if (domain.safeToDisable) {
							domainSet.moderate.add({
								url: url,
								redirectAddress: null,
							});
						}
						domainSet.aggressive.add({
							url: url,
							redirectAddress: null,
						});
					}
					// Regardless, add it to the database of all search engines
					domainSet.all.add({
						url: url,
						redirectAddress: null,
					});
				});
			} else {
				if (domain.redirectTo !== null) {
					domainSet.moderate.add(resolveRedirect(domain.url, domain.redirectTo.url));
					domainSet.aggressive.add(resolveRedirect(domain.url, domain.redirectTo.url));
				} else {
					/**
					 * Verdict: URL has no REDIRECTS present!
					 * - Essentially the domain has no SafeSearch to redirect
					 *
					 * 1. hasSafeSearch?
					 *  - If "false", PREPARE to block it!
					 *
					 * 1a. Does blocking it NOT DISRUPT other websites?
					 *  - If "true", add in the "Moderate" blacklist
					 *  - Regardless, add it to the "Strict" blacklist
					 */
					if (domain.safeToDisable) {
						domainSet.moderate.add({
							url: domain.url,
							redirectAddress: null,
						});
					}
					domainSet.aggressive.add({
						url: domain.url,
						redirectAddress: null,
					});
				}
				// Regardless, add it to the database of all search engines
					domainSet.all.add({
						url: domain.url,
						redirectAddress: null,
					});
			}
		});
	}
	/**
	 * Now to create all appropriate host files
	 */
	// Blocking ALL Search Engines
	makeHost(
		HOST.type.all.name,
		HOST.type.all.title,
		HOST.type.all.description,
		HOST.directory,
		domainSet.all,
		true
	);
	// Blocking ALL Search Engines + SafeSearch NOT ENFORCED + NOT BREAKING other websites
	makeHost(
		HOST.type.moderate.name,
		HOST.type.moderate.title,
		HOST.type.moderate.description,
		HOST.directory,
		domainSet.moderate,
		true
	);
	// Blocking ALL Search Engines + SafeSearch NOT ENFORCED + BREAKING other websites
	makeHost(
		HOST.type.aggressive.name,
		HOST.type.aggressive.title,
		HOST.type.aggressive.description,
		HOST.directory,
		domainSet.aggressive,
		true
	);
}

main();
