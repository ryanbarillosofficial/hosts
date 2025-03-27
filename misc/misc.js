import sources from "./sources.json" with {type: "json"}
import { makeHost } from "../hostTools.js";


const DIRECTORY_OUTPUT = "misc";
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
	for (const __ENTRY__ in sources) {
		// Variables for use
		const ENTRY = sources[__ENTRY__]
		
		ENTRY.urls.forEach((URL_CURRENT) => {
			domainsSansPrefixWWW.add(URL_CURRENT);
			domainsWithPrefixWWW.add(`www.${URL_CURRENT}`);
		});
	}
	/**
	 * Now to create all appropriate host files
	 */
	makeHost(
		"misc",
		"No Misc. Stuffs",
		"No Misc. Stuffs (for personal use)",
		domainsSansPrefixWWW,
		domainsWithPrefixWWW,
		DIRECTORY_OUTPUT
	);
}
main();
