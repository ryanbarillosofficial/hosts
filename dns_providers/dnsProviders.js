import sources from "./sources.json" with {type: "json"}
import { makeHost, resolveRedirect } from "../hostTools.js";
import process from "process";

const DIRECTORY_OUTPUT = "dns_providers";
function main() {
  /**
   * List of ALL DNS domains to block
   */
  let domainSet = new Set();
  /**
   *
   * Now, begin the work!
   *
   */
  for (const ENTRY in sources) {
    const DNS = sources[ENTRY];

    DNS.subdomains.forEach((SUBDOMAIN) => {
      const SUBDOMAIN_SET = resolveRedirect(
        SUBDOMAIN.url,
        SUBDOMAIN.redirectTo != null ? SUBDOMAIN.redirectTo.url : null
      );
      //   const SUBDOMAIN_SET =
      //     SUBDOMAIN.redirectTo != null
      //       ? resolveRedirect(SUBDOMAIN.url, SUBDOMAIN.redirectTo.url)
      //       : resolveRedirect(SUBDOMAIN.url);
      SUBDOMAIN_SET.forEach((domain) => {
        domainSet.add(domain);
      });
    });
  }
  /**
   * Now to create all appropriate host files
   */
  makeHost(
    "all",
    "No Foreign DNS Providers",
    "No Foreign DNS Providers (except your own) AT ALL",
    domainSet,
    DIRECTORY_OUTPUT
  );
}
main();
