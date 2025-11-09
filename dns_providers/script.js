import SOURCES_JSON from "./sources.json" with {type: "json"}
import {
	makeHost,
	resolveRedirect,
	resolveUrlAffixes,
	AFFIX_KEYWORDS,
} from "../hostTools.js";

const AFFIX_KEYWORDS_ARRAY = Object.values(AFFIX_KEYWORDS);
const HOST = {
	name: "all",
	title: "No Foreign DNS Providers",
	description: "No Foreign DNS Providers (except your own) AT ALL",
	directory: "dns_providers",
};

function main() {
	let domainSet = new Set();

	// Iterate thru each entry in "sources.json"
	Object.keys(SOURCES_JSON).forEach((source) => {
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
			// Redirect each URL to this assigned IP address(es):
			if (subdomain.redirectTo !== null) {
				finalSubdomainUrl.forEach((url) => {
					if (subdomain.redirectTo.ignoreAndForceDisable) {
						domainSet.add(resolveRedirect(url));
					} else {
					subdomain.redirectTo.url.forEach((redirectUrl) => {
						domainSet.add(resolveRedirect(url, redirectUrl));
					})
				}});
			} else {
				finalSubdomainUrl.forEach((url) => {
					domainSet.add(resolveRedirect(url));
				});
			}
		});
	});
	
	// Now to create all appropriate host files
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
