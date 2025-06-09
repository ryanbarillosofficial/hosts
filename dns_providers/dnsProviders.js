import sources from "./sources.json" with {type: "json"}
import { makeHost, resolveRedirect } from "../hostTools.js";
import process from "process";


const DIRECTORY_OUTPUT = "dns_providers";
function main() {
	/**
	 * List of ALL DNS domains to block
	 */
	let domainsSet = new Set();
	/**
	 *
	 * Now, begin the work!
	 *
	 */
	for (const ENTRY in sources) {
		const DNS = sources[ENTRY]
		
		DNS.subdomains.forEach((SUBDOMAIN) => {
			if (SUBDOMAIN.redirectTo != null) {
				domainsSet.add(resolveRedirect(SUBDOMAIN.redirectTo.url, SUBDOMAIN.url))
			} else {
				domainsSet.add(SUBDOMAIN.url)
			}
		});
	}
	/**
	 * Now to create all appropriate host files
	 */
	makeHost(
		"all",
		"No Foreign DNS Providers",
		"No Foreign DNS Providers (except your own) AT ALL",
		domainsSet,
		DIRECTORY_OUTPUT
	);
}
main();
