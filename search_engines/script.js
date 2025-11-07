import SOURCES_JSON from "./sources.json" with {type: "json"}
import {
	makeHost,
	resolveRedirect,
	resolveUrlAffixes,
	AFFIX_KEYWORDS
} from "../hostTools.js";
import process from "process";

/**
 * Searching for other live search engines
 * - https://gist.github.com/NaveenDA/b1ff7d43812a3c79354f9b2fd9868186
 *
 * Searx
 * - https://searx.space/
 * - https://searx.space/data/instances.json
 * - https://github.com/searxng/searxng
 */
const AFFIX_KEYWORDS_ARRAY = Object.values(AFFIX_KEYWORDS);
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

function main() {
	/**
	 * List of search engines to block
	 */
	let domainSet = {
		all: new Set(),
		moderate: new Set(),
		aggressive: new Set(),
	};

	// Iterate thru each entry in "sources.json"
	for (const source in SOURCES_JSON) {
		const ENTRY = SOURCES_JSON[source];
		
		// Go thru each subdomain of current "ENTRY"
		ENTRY.subdomains.forEach((subdomain) => {
			let finalSubdomainUrl = new Set();

			if (Array.isArray(subdomain.url)) {
				// In case any URL in the array contains any of pre-defined affixes,
				// Then they must be resolved first before any other procedure
				for (const url of subdomain.url) {
					if (AFFIX_KEYWORDS_ARRAY.some((affix) => url.includes(affix))) {
						resolveUrlAffixes(url, ENTRY.affixes).forEach((urlFinal) => {
							finalSubdomainUrl.add(urlFinal);
						});
					} else {
						finalSubdomainUrl.add(url);
					}
				}
			} else {
				// Else, it's just a string
				// Then they must be resolved first before any other procedure
				let url = subdomain.url;
				if (AFFIX_KEYWORDS_ARRAY.some((affix) => url.includes(affix))) {
					resolveUrlAffixes(url, ENTRY.affixes).forEach((urlFinal) => {
						finalSubdomainUrl.add(urlFinal);
					});
				} else {
					finalSubdomainUrl.add(url);
				}
			}

			finalSubdomainUrl.forEach((url) => {
				// Unconditionally add all URLs into "domainSet.all"
				domainSet.all.add(resolveRedirect(url));

				// Conditionally add them to either "Aggressive" or "Moderate" categories
				if (subdomain.redirectTo !== null) { // Meaning it's redirected to SafeSearch-enfored DNSs
					subdomain.redirectTo.url.forEach((redirectUrl) => {
						domainSet.moderate.add(resolveRedirect(url, redirectUrl));
						domainSet.aggressive.add(resolveRedirect(url, redirectUrl));
					});
				} else {
					if (subdomain.safeToDisable) { // Meaning it won't harm other sites when disabled
						domainSet.moderate.add(resolveRedirect(url));
					}
					// Regardless, block it in the "Aggressive" lists; any traces of it can break the firewall
					domainSet.aggressive.add(resolveRedirect(url));

				}			
			})
		});
	}
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
