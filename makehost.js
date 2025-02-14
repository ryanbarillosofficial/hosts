// Imports
import { exit } from "process";
import fs from "fs";

// Constant variables
const DIRECTORY_CURRENT = process.cwd();
const BREAK_BLOCK = "\n\n\n";
const BREAK_LINE = "#===============";
const IP_PREFIX = {
  V4: "0.0.0.0",
  V6: "::1",
};

export default function makehost(
  host_name = "all",
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
  const FILE_PATH = `${DIRECTORY_CURRENT}/${directory_output}/${FILE_NAME}`;
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

  // String of each domain blocked
  const IPV4_ADDRESSES =
    `${BREAK_LINE}\n# IPv4 Addresses\n${BREAK_LINE}\n` +
    (() => {
      let output = "";
      for (let i = 0; i < DOMAINS_WITH_WWW_PREFIX.length; i++) {
        output += `${IP_PREFIX.V4} ${DOMAINS_SANS_WWW_PREFIX[i]}\n`;
        output += `${IP_PREFIX.V4} ${DOMAINS_WITH_WWW_PREFIX[i]}\n`;
      }
      return output;
    })() +
    BREAK_BLOCK;
  const IPV6_ADDRESSES =
    `${BREAK_LINE}\n# IPv6 Addresses\n${BREAK_LINE}\n` +
    (() => {
      let output = "";
      for (let i = 0; i < DOMAINS_WITH_WWW_PREFIX.length; i++) {
        output += `${IP_PREFIX.V6} ${DOMAINS_SANS_WWW_PREFIX[i]}\n`;
        output += `${IP_PREFIX.V6} ${DOMAINS_WITH_WWW_PREFIX[i]}\n`;
      }
      return output;
    })();

  // Make the host text file
  fs.writeFile(
    FILE_PATH,
    HOST_COMMENT + IPV4_ADDRESSES + IPV6_ADDRESSES,
    (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`Created \"${FILE_NAME}\" for \"${host_title}\" — yay!`);
      }
    }
  );
}
