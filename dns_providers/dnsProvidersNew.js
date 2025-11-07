import SOURCES_JSON from "./sources.json" with {type: "json"}
import {
	makeHost,
	resolveRedirect,
	resolveUrlAffixes,
	AFFIX_KEYWORDS,
} from "../hostTools.js";
import process from "process";

const AFFIX_KEYWORDS_ARRAY = Object.values(AFFIX_KEYWORDS);
const HOST = {
	name: "all",
	title: "No Foreign DNS Providers",
	description: "No Foreign DNS Providers (except your own) AT ALL",
	directory: "dns_providers",
};

function main() {
	/**
	 * List of ALL DNS domains to block
	 */
	let domainSet = new Set();

	for (const ENTRY in SOURCES_JSON) {
		const ENTRY = SOURCES_JSON[__ENTRY__];

		ENTRY.subdomains.forEach((domain) => {
			if (Array.isArray(domain.url)) {
				/**
				 * If the domain's URL is an array (not a single URL string),
				 * then it groups related URLs that redirect to the same IP addresses
				 */
				let urlArray = domain.url; // For clarity, re-define as as-is

				for (const url of urlArray) {
					// First, resolve each URL with its affix if any; then add them to the set
					let urlSet_withAffixesResolved = new Set();
					if (AFFIX_KEYWORDS_ARRAY.some((affix) => url.includes(affix))) {
						urlSet_withAffixesResolved = urlSet_withAffixesResolved.union(
							resolveUrlAffixes(url, ENTRY.affixes)
						);
					}
					// Now redirect them to their designated IP addresses
					if (domain.redirectTo !== null) {
						for (const redirectAddress of domain.redirectTo.url) {
							if (urlSet_withAffixesResolved.size > 0) {
								urlSet_withAffixesResolved.forEach((urlFromSet) => {
									domainSet.add(urlFromSet, redirectAddress);
								});
							} else {
								domainSet.add(resolveRedirect(url, redirectAddress));
							}
						}
					} else {
						if (urlSet_withAffixesResolved.size > 0) {
							urlSet_withAffixesResolved.forEach((urlFromSet) => {
								domainSet.add(resolveRedirect(urlFromSet));
							});
						} else {
							domainSet.add(resolveRedirect(url));
						}
					}
				}
			} else {
				/**
				 * URL is a single string, not an array
				 * Address it accordingly
				 */
				let urlSet_withAffixesResolved = new Set();
				if (AFFIX_KEYWORDS_ARRAY.some((affix) => domain.url.includes(affix))) {
					urlSet_withAffixesResolved = resolveUrlAffixes(
						domain.url,
						ENTRY.affixes
					);
				}
				// Redirect URL to its designated IP address
				if (domain.redirectTo !== null) {
					for (const redirectAddress of domain.redirectTo.url) {
						if (urlSet_withAffixesResolved.size > 0) {
							urlSet_withAffixesResolved.forEach((urlFromSet) => {
								domainSet.add(urlFromSet, redirectAddress);
							});
						} else {
							domainSet.add(resolveRedirect(domain.url, redirectAddress));
						}
					}
				} else {
					if (urlSet_withAffixesResolved.size > 0) {
						urlSet_withAffixesResolved.forEach((urlFromSet) => {
							domainSet.add(resolveRedirect(urlFromSet));
						});
					} else {
						domainSet.add(resolveRedirect(domain.url));
						// console.log(domainSet);
						process.exit();
					}
				}
			}
		});
	}
	/**
	 * Now to create all appropriate host files
	 */
	// console.log(domainSet);
	makeHost(
		HOST.name,
		HOST.title,
		HOST.description,
		HOST.directory,
		domainSet,
		true
	);
}
main();
