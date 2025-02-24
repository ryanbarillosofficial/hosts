import sources from "./sources.json" with {type: "json"}
import { makeHost } from "../hostTools.js";


const DIRECTORY_OUTPUT = "dns_providers";
function main() {
	/**
	 * List of ALL DNS domains to block
	 */
	let domainsSansPrefixWWW = new Set(),
		domainsWithPrefixWWW = new Set();
	/**
	 *
	 * Now, begin the work!
	 *
	 */
	for (const ENTRY in sources) {
		// Variables for use
		const DNS = sources[ENTRY]
		
		DNS.urls.forEach((URL_CURRENT) => {
			domainsSansPrefixWWW.add(URL_CURRENT);
			domainsWithPrefixWWW.add(`www.${URL_CURRENT}`);
		});
	}
	/**
	 * Now to create all appropriate host files
	 */
	makeHost(
		"all",
		"No Foreign DNS Providers",
		"No Foreign DNS Providers (except your own) AT ALL",
		domainsSansPrefixWWW,
		domainsWithPrefixWWW,
		DIRECTORY_OUTPUT
	);
}
main();
