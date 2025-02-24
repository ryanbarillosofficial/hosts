// Imports
import fs from "fs";
import path from "path";

/*
Imports for debugging (not used very often)
The one I use most from these:
- process.exit();
*/
import process from "process";

// Constant variables
const DIRECTORY_CURRENT = process.cwd();
const BREAK_BLOCK = "\n\n\n";
const BREAK_LINE = "#===============";

/**
 * Source of IPv6 Regex
 * https://github.com/sindresorhus/ip-regex/blob/main/index.js
 */
const KEYWORDS_TO_IGNORE = [
	"local",
	"localhost",
	"broadcasthost",
	"#",
	"undefined",
];
const IP_MODE = {
	V4: {
		PREFIX: "0.0.0.0",
		REGEX: /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/,
	},
	V6: {
		PREFIX: "::1",
		REGEX:
			/(?:[a-fA-F\d]{1,4}:){7}(?:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){6}(?::[a-fA-F\d]{1,4}|:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){5}(?::[a-fA-F\d]{1,4}|(?::[a-fA-F\d]{1,4}){1,2}|:)|(?:[a-fA-F\d]{1,4}:){4}(?:(?::[a-fA-F\d]{1,4}){0,1}:[a-fA-F\d]{1,4}|(?::[a-fA-F\d]{1,4}){1,3}|:)|(?:[a-fA-F\d]{1,4}:){3}(?:(?::[a-fA-F\d]{1,4}){0,2}:[a-fA-F\d]{1,4}|(?::[a-fA-F\d]{1,4}){1,4}|:)|(?:[a-fA-F\d]{1,4}:){2}(?:(?::[a-fA-F\d]{1,4}){0,3}:[a-fA-F\d]{1,4}|(?::[a-fA-F\d]{1,4}){1,5}|:)|(?:[a-fA-F\d]{1,4}:){1}(?:(?::[a-fA-F\d]{1,4}){0,4}:[a-fA-F\d]{1,4}|(?::[a-fA-F\d]{1,4}){1,6}|:|)(?::(?:(?::[a-fA-F\d]{1,4}){0,5}:[a-fA-F\d]{1,4}|(?::[a-fA-F\d]{1,4}){1,7}|:))(?:%[0-9a-zA-Z]{1,})?/,
	},
};

function makeHost(
	hostName,
	hostTitle,
	hostDescription,
	domainsSansPrefixWWW,
	domainsWithPrefixWWW,
	directoryOutput
) {
	/**
	 * Convert sets into arrays for iteration
	 * And then sort them alphabetically
	 */
	const DOMAINS_SANS_PREFIX_WWW = Array.from(domainsSansPrefixWWW).sort();
	const DOMAINS_WITH_PREFIX_WWW = Array.from(domainsWithPrefixWWW).sort();

	// Info for each host file
	const FILE_NAME = `${hostName}.txt`;
	const FILE_PATH = path.join(DIRECTORY_CURRENT, FILE_NAME);

	const HOST_COMMENT = `# Title: \
    \n# ${hostTitle} \
    \n# \
    \n# Description: \
    \n# ${hostDescription} — simple as that! \
    \n# \
    \n# Compatible with AdAway on Android and multiple ad blockers. \
    \n# \
    \n# Source(s) Used: \
    \n# https://raw.githubusercontent.com/ryanbarillosofficial/hosts/main/${directoryOutput}/sources.json \
    \n# \
    \n# Number of Unique Domains (without their "www." variants): \
    \n# ${domainsSansPrefixWWW.size} \
    \n# \
    \n# Project Home Page: \
    \n# https://github.com/ryanbarillos/hosts \
    \n#${BREAK_BLOCK}`;

	/**
	 * OJBECTIVE:
	 * Build the string
	 * containing all IPv4 addresses
	 */
	let allDomains_Text = `${BREAK_LINE}\n# IPv4 Addresses\n${BREAK_LINE}`;
	for (let i = 0; i < DOMAINS_SANS_PREFIX_WWW.length; i++) {
		/**
		 * Double-check if the domain already has an IP address appended to it
		 * If so, it's a domain being redirected to its safer version (or one of those versions)
		 */
		if (IP_MODE.V4.REGEX.test(DOMAINS_SANS_PREFIX_WWW[i]) === true) {
			allDomains_Text += `\n${DOMAINS_SANS_PREFIX_WWW[i]}`;
			allDomains_Text += `\n${DOMAINS_SANS_PREFIX_WWW[i].replace(
				" ",
				" www."
			)}`;
		} else {
			allDomains_Text += `\n${IP_MODE.V4.PREFIX} ${DOMAINS_SANS_PREFIX_WWW[i]}`;
			allDomains_Text += `\n${IP_MODE.V4.PREFIX} ${DOMAINS_WITH_PREFIX_WWW[i]}`;
		}
	}
	allDomains_Text += BREAK_BLOCK;
	/**
	 * OJBECTIVE:
	 * Build the string
	 * containing all IPv6 addresses
	 */
	allDomains_Text += `${BREAK_LINE}\n# IPv6 Addresses\n${BREAK_LINE}`;
	for (let i = 0; i < DOMAINS_SANS_PREFIX_WWW.length; i++) {
		/**
		 * Double-check if the domain already has an IP address appended to it
		 * If so, it's a domain being redirected to its safer version (or one of those versions)
		 * - If the redirect is to an IPv4 address, IGNORE IT
		 */
		if (IP_MODE.V4.REGEX.test(DOMAINS_SANS_PREFIX_WWW[i]) === false) {
			if (IP_MODE.V6.REGEX.test(DOMAINS_SANS_PREFIX_WWW[i]) === true) {
				allDomains_Text += `\n${DOMAINS_SANS_PREFIX_WWW[i]}`;
			} else {
				allDomains_Text += `\n${IP_MODE.V6.PREFIX} ${DOMAINS_SANS_PREFIX_WWW[i]}`;
				allDomains_Text += `\n${IP_MODE.V6.PREFIX} ${DOMAINS_WITH_PREFIX_WWW[i]}`;
			}
		}
	}
	// Make the host text file
	fs.writeFileSync(FILE_PATH, HOST_COMMENT + allDomains_Text);
	console.log(`Created \"${FILE_NAME}\" for \"${hostTitle}\"`);
}

async function getHost(url) {
	/**
	 * Assuning that @url fetches a .txt file of domains to be blocked
	 * Then we split the response by whitespaces
	 * And return it as an array
	 */
	return (await (await fetch(url)).text()).split("\n");
}

function getAllUrlVariants(url, affixes, redirect_to = "") {
	let allUrlVariants = new Set();
	/**
	 * I'll add something here, eventually
	 */
	for (const affix of affixes) {
		allUrlVariants.add(
			redirect_to !== ""
				? `${redirect_to} ${url.replace("^", affix)}`
				: `${url.replace("^", affix)}`
		);
	}
	return allUrlVariants;
}

export { makeHost, getHost, getAllUrlVariants, IP_MODE, KEYWORDS_TO_IGNORE };
