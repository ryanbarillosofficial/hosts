/*
Imports for debugging (not used very often)
The one I use most from these:
- process.exit();
*/
import process from "process";
import fs from "fs";
import path from "path";
import printDate from "./__tools__/printDate.js";

// Constant variables
const DIRECTORY_CURRENT = process.cwd();
const BREAK_BLOCK = "\n\n\n";
const BREAK_LINE = "#===============";
const AFFIX_KEYWORDS = {
	location: "__location__",
	number: "__number__",
	prefix: "__prefix__",
	suffix: "__suffix__",
};
/**
 * Source of IPv6 Regex
 * https://github.com/sindresorhus/ip-regex/blob/main/index.js
 */
const KEYWORDS_TO_IGNORE = [
	"local",
	"localhost",
	"broadcasthost",
	"#",
	"localdomain",
];
export const WWW_MODE = {
	prefix: "www.",
	regex: /^www\./,
};
export const IP_MODE = {
	v4: {
		prefix: "0.0.0.0",
		regex: /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/,
	},
	v6: {
		prefix: "::",
		regex:
			/(?:[a-fA-F\d]{1,4}:){7}(?:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){6}(?::[a-fA-F\d]{1,4}|:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){5}(?::[a-fA-F\d]{1,4}|(?::[a-fA-F\d]{1,4}){1,2}|:)|(?:[a-fA-F\d]{1,4}:){4}(?:(?::[a-fA-F\d]{1,4}){0,1}:[a-fA-F\d]{1,4}|(?::[a-fA-F\d]{1,4}){1,3}|:)|(?:[a-fA-F\d]{1,4}:){3}(?:(?::[a-fA-F\d]{1,4}){0,2}:[a-fA-F\d]{1,4}|(?::[a-fA-F\d]{1,4}){1,4}|:)|(?:[a-fA-F\d]{1,4}:){2}(?:(?::[a-fA-F\d]{1,4}){0,3}:[a-fA-F\d]{1,4}|(?::[a-fA-F\d]{1,4}){1,5}|:)|(?:[a-fA-F\d]{1,4}:){1}(?:(?::[a-fA-F\d]{1,4}){0,4}:[a-fA-F\d]{1,4}|(?::[a-fA-F\d]{1,4}){1,6}|:|)(?::(?:(?::[a-fA-F\d]{1,4}){0,5}:[a-fA-F\d]{1,4}|(?::[a-fA-F\d]{1,4}){1,7}|:))(?:%[0-9a-zA-Z]{1,})?/,
	},
};

export const resolveRedirect = (url, redirectAddress = null) => {
	return {
		url: url,
		redirectAddress: redirectAddress,
	};
};
export function resolveUrlAffixes(url, affixes) {
	let urlSet = new Set();

	const resolveAffix = (url, keyword, affix) => {
		return url.replace(keyword, affix.toString());
	};

	if (url.includes(AFFIX_KEYWORDS.location)) {
		/**
		 * Check if "URL" has the affix "location"
		 * Then add each URL variant into the list
		 */
		for (const location of affixes.locations) {
			urlSet.add(resolveAffix(url, AFFIX_KEYWORDS.location, location));
		}
	} else if (url.includes(AFFIX_KEYWORDS.number)) {
		/**
		 * Check if "URL" has the affix "number"
		 * Then add each URL variant into the list
		 *
		 * NOTE:
		 * Given that any domain can have 1 to 9999+ variations of its domain
		 * Only the first 10 will be resolved
		 * - In the future, when I've learnt alternatives to hostname blocking, I'll utilize simpler methods (like RegExp)
		 * - Other alternative is IP address blocking, but hostname blocking won't allow that
		 */
		for (let number = 0; number <= 10; number++) {
			urlSet.add(resolveAffix(url, AFFIX_KEYWORDS.number, number));
		}
	} else if (url.includes(AFFIX_KEYWORDS.prefix)) {
		/**
		 * Check if "URL" has the affix "prefix"
		 * Then add each URL variant into the list
		 */
		for (const prefix of affixes.prefixes) {
			urlSet.add(resolveAffix(url, AFFIX_KEYWORDS.prefix, prefix));
		}
	} else if (url.includes(AFFIX_KEYWORDS.suffix)) {
		/**
		 * Check if "URL" has the affix "suffix"
		 * Then add each URL variant into the list
		 */
		for (const suffix of affixes.suffixes) {
			urlSet.add(resolveAffix(url, AFFIX_KEYWORDS.suffix, suffix));
		}
	}
	return urlSet;
}

async function getHost(url) {
	/**
	 * Assuming that @url fetches a .txt file of domains to be blocked
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

function makeHost(
	hostName,
	hostTitle,
	hostDescription,
	hostDirectory,
	domainSet,
	domainsContainRedirects = false
) {
	/**
	 * Convert sets into arrays for iteration
	 * And then sort them alphabetically
	 *
	 * - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#sorting_array_of_objects
	 */
	let domainsArray = [];

	if (domainsContainRedirects) {
		domainsArray = Array.from(domainSet).sort();
	} else {
		domainsArray = Array.from(domainSet).sort((a, b) => {
			if (a.url < b.url) {
				return -1;
			}
			if (a.url > b.url) {
				return 1;
			}

			// names must be equal
			return 0;
		});
	}

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
    \n# https://raw.githubusercontent.com/ryanbarillosofficial/hosts/main/${hostDirectory}/sources.json \
    \n# \
    \n# Number of Unique Domains (without their "www." variants): \
    \n# ${domainsArray.length} \
    \n# \
    \n# Project Home Page: \
    \n# https://github.com/ryanbarillosofficial/hosts \
    \n# \
    \n# Last Updated: ${printDate()}\
    \n#`;

	/**
	 * OJBECTIVE:
	 * Build the string
	 * containing all IPv4 addresses
	 */
	let finalHostsText = "";

	if (domainsContainRedirects) {
		domainsArray.forEach((domain) => {
			if (domain.redirectAddress != null) {
				finalHostsText += `\n${domain.redirectAddress} ${domain.url}`;
				finalHostsText += `\n${domain.redirectAddress} ${
					WWW_MODE.prefix + domain.url
				}`;
			} else {
				// Domain blocked in IPv4 format
				finalHostsText += `\n${IP_MODE.v4.prefix} ${domain.url}`;
				finalHostsText += `\n${IP_MODE.v4.prefix} ${
					WWW_MODE.prefix + domain.url
				}`;
				// Same domain, but in IPv6 format
				finalHostsText += `\n${IP_MODE.v6.prefix} ${domain.url}`;
				finalHostsText += `\n${IP_MODE.v6.prefix} ${
					WWW_MODE.prefix + domain.url
				}`;
			}
		});
	} else {
		domainsArray.forEach((domain) => {
			// Domain blocked in IPv4 format
			finalHostsText += `\n${IP_MODE.v4.prefix} ${domain}`;
			finalHostsText += `\n${IP_MODE.v4.prefix} ${WWW_MODE.prefix + domain}`;
			// Same domain, but in IPv6 format
			finalHostsText += `\n${IP_MODE.v6.prefix} ${domain}`;
			finalHostsText += `\n${IP_MODE.v6.prefix} ${WWW_MODE.prefix + domain}`;
		});
	}
	// Make the host text file
	fs.writeFileSync(FILE_PATH, HOST_COMMENT + finalHostsText);
	console.log(`Created \"${FILE_NAME}\" for \"${hostTitle}\"`);
}

export {
	makeHost,
	getHost,
	getAllUrlVariants,
	KEYWORDS_TO_IGNORE,
	AFFIX_KEYWORDS,
};
