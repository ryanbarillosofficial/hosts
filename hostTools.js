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
	host_name,
	host_title,
	host_description,
	domains_sans_www_prefix,
	domains_with_www_prefix,
	directory_output = ""
) {
	/*
  Convert sets into arrays for iteration
  And then sort them alphabetically
  */
	const DOMAINS_WITH_WWW_PREFIX = Array.from(domains_with_www_prefix).sort(
		(a, b) => a - b
	);
	const DOMAINS_SANS_WWW_PREFIX = Array.from(domains_sans_www_prefix).sort(
		(a, b) => a - b
	);

	// Info for each host file
	const FILE_NAME = `${host_name}.txt`;
	const FILE_PATH = path.join(DIRECTORY_CURRENT, FILE_NAME);

	// console.log(`Host file will be placed here:\n${FILE_PATH}\n`);

	const HOST_COMMENT = `# Title: \
    \n# ${host_title} \
    \n# \
    \n# Description: \
    \n# ${host_description} — simple as that! \
    \n# \
    \n# Compatible with AdAway on Android and multiple ad blockers. \
    \n# \
    \n# Source(s) Used: \
    \n# https://raw.githubusercontent.com/ryanbarillosofficial/hosts/main/${directory_output}/sources.json \
    \n# \
    \n# Number of Unique Domains (without their "www." variants): \
    \n# ${domains_sans_www_prefix.size} \
    \n# \
    \n# Project Home Page: \
    \n# https://github.com/ryanbarillos/hosts \
    \n#${BREAK_BLOCK}`;

	// String of each domain blocked in IPv4 format
	const IPV4_ADDRESSES =
		`${BREAK_LINE}\n# IPv4 Addresses\n${BREAK_LINE}\n` +
		(() => {
			let output = "";
			for (let i = 0; i < DOMAINS_WITH_WWW_PREFIX.length; i++) {
				output += `\n${IP_MODE.V4.PREFIX} ${DOMAINS_SANS_WWW_PREFIX[i]}`;
				output += `\n${IP_MODE.V4.PREFIX} ${DOMAINS_WITH_WWW_PREFIX[i]}`;
			}
			return output;
		})() +
		BREAK_BLOCK;
	// String of each domain blocked in IPv6 format
	const IPV6_ADDRESSES =
		`${BREAK_LINE}\n# IPv6 Addresses\n${BREAK_LINE}\n` +
		(() => {
			let output = "";
			for (let i = 0; i < DOMAINS_WITH_WWW_PREFIX.length; i++) {
				output += `${IP_MODE.V6.PREFIX} ${DOMAINS_SANS_WWW_PREFIX[i]}\n`;
				output += `${IP_MODE.V6.PREFIX} ${DOMAINS_WITH_WWW_PREFIX[i]}\n`;
			}
			return output;
		})();

	// Make the host text file
	fs.writeFileSync(FILE_PATH, HOST_COMMENT + IPV4_ADDRESSES + IPV6_ADDRESSES);
	console.log(`Created \"${FILE_NAME}\" for \"${host_title}\"`);
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
