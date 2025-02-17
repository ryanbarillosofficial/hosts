/**
 * This is a script that checks if each entry in "sources.json"
has all the correct class structure, variables, and objects
 * 
 * This will help facilitate maintainability in keeping the list of entries
 * from being to broken for me, the original author, my fellow contributors,
 * And to all those who will fork my project for their specific needs
 */
import sources from "./sources.json" with {type: "json"}
import process from "process";

/**
 * The JSON model that each entry must conform to
 */
const a = new Function();
const MODEL = {
	affixes: {
		countries: [],
		prefixes: [],
		suffixes: [],
	},
	subdomains: [
		{
			url: "",
			about: "",
			safesearch: false,
			has_graphic_content: false,
			damaging_if_disabled: false,
			redirect_to: {
				moderate: {
					url: "",
					about: "",
				},
				strict: {
					url: "",
					about: "",
				},
			},
		},
	],
};
/**
 *
 * "Object" Validator
 * Last Updated: 16 Feb 2025
 *
 */
function validate_Entry(entry) {
	let result = true,
		message = "All good!";
	/**
	 * Check if all properties from MODEL exists
	 */
	for (const PROPERTY in MODEL) {
		if (result === false) break;
		if (!Object.hasOwn(entry, PROPERTY)) {
			message = `"${PROPERTY}" property is MISSING!`;
			result = false;
			break;
		}
	}
	/**
	 * Check if any property of each entry from "entry_list" EXISTS in MODEL (if, at all)
	 */
	for (const PROPERTY in entry) {
		if (result === false) break;
		if (!Object.hasOwn(MODEL, PROPERTY)) {
			message = `"${PROPERTY}" is an INVALID property!`;
			result = false;
			break;
		}
	}
	/**
	 * Check if EACH value of EACH property of each entry from "entry_list" is correct
	 */
	for (const PROPERTY in entry) {
		if (result === false) break;
		if (!Object.hasOwn(MODEL, PROPERTY)) {
			message = `"${PROPERTY}" is an INVALID property!`;
			result = false;
			break;
		}
	}
	// Get result
	return [result, message];
}

/**
 *
 * "Affixes" Property Validator
 * Last Updated: 16 Feb 2025
 *
 */
function validate_AffixProperties(entry_list) {
	let result = true,
		message = "All good!";
	/**
	 * Check if all properties from MODEL exists
	 */
	for (const AFFIX in MODEL.affixes) {
		if (!Object.hasOwn(entry_list, AFFIX)) {
			message = `"${AFFIX}" property under "affixes" is MISSING`;
			result = false;
			break;
		}
		if (result === false) break;
	}
	/**
	 * Check if any object from "entry_list" EXISTS in MODEL (if, at all)
	 */
	for (const AFFIX in entry_list) {
		if (result === false) break;
		if (!Object.hasOwn(MODEL.affixes, AFFIX)) {
			message = `"${AFFIX}" is NOT A VALID property of "affixes"`;
			result = false;
			break;
		}
		if (result === false) break;
	}
	// Get result
	return [result, message];
}
function validate_AffixEntries(entry_list) {
	let result = Array.isArray(entry_list),
		message = "All good!";
	/**
	 * Check it is an array
	 */
	if (result === false) {
		message = "One of the affix properties is NOT AN ARRAY";
		return [result, message];
	}
	/**
	 * Check if all entries are string type
	 * Then STOP checking any further
	 */
	if (entry_list.length > 0) {
		for (let i = 0; i < entry_list.length; i++) {
			if (typeof entry_list[i] !== "string") {
				result = false;
				message = 'One of the entries is NOT a "string" data type';
			}
			if (result === false) break;
		}
	}
	// get result
	return [result, message];
}
/**
 *
 * "Subdomains" Validator
 * Last Updated: 16 Feb 2025
 *
 */
function validate_Subdomains(entry_list) {
	let errorHas = !Array.isArray(entry_list),
		errorMsg = "All good!";
	/**
	 * Check it is an array
	 */
	if (errorHas === true) {
		errorMsg = 'the "subdomains" property is NOT AN ARRAY!';
		return [errorHas, errorMsg];
	}
	/**
	 * Check if all entries are formatted correctly
	 * if not, STOP checking any further!
	 */
	if (entry_list.length > 0) {
		for (let i = 0; i < entry_list.length; i++) {
			/**
			 * Check if each entry in "entry_list" has any missing properties
			 */
			const ENTRY_SUBDOMAIN = entry_list[i];
			for (const PROPERTY in MODEL.subdomains[0]) {
				if (Object.hasOwn(ENTRY_SUBDOMAIN, PROPERTY) === false) {
					errorMsg = `"Entry #${
						i + 1
					}: "${PROPERTY}" property of under "subdomains" is MISSING!`;
					errorHas = true;
				}
				if (errorHas === true) break; // End function upon the presence of an error
			}
			/**
			 * Do the same as previously, but for INVALID properties (i.e., not found in MODEL)
			 */
			for (const PROPERTY in ENTRY_SUBDOMAIN) {
				if (!Object.hasOwn(MODEL.subdomains[0], PROPERTY)) {
					errorMsg = `"Entry #${i + 1}: "${PROPERTY}" is an INVALID property!`;
					errorHas = true;
				}
				if (errorHas === true) break; // End function upon the presence of an error
				/**
				 * Check if each property's value(s) contain the correct data type
				 * Do the check against the MODEL object
				 */
				if (
					typeof ENTRY_SUBDOMAIN[PROPERTY] !==
					typeof MODEL.subdomains[0][PROPERTY]
				) {
					errorMsg = `"Entry #${
						i + 1
					}: Data type of "${PROPERTY}" IS NOT "${typeof MODEL.subdomains[0][
						PROPERTY
					]}"!`;
					errorHas = true;
				}
				if (errorHas === true) break; // End function upon the presence of an error
			}
			if (errorHas === true) break; // End function upon the presence of an error
		}
	}
	// get result
	return [errorHas, errorMsg];
}

function main() {
	let errorHas = false;
	let errorMsg = "All good!";

	for (const i in sources) {
		// Variables
		const ENTRY = sources[i];
		let build_errorMsg = `ERROR with "${i}" entry:\n \- `;
		/**
		 * Check 0:
		 * Validate "ENTRY" for correct properties
		 */
		const [is_error_free, msg] = validate_Entry(ENTRY);
		if (!is_error_free) {
			errorMsg = build_errorMsg + msg;
			errorHas = true;
			if (errorHas) break;
		}
		/**
		 * Check 1a:
		 * Check if "affixes" has all correct object/keys
		 */
		const AFFIXES = ENTRY["affixes"];
		const [IS_ERROR_FREE, MSG] = validate_AffixProperties(AFFIXES);
		if (!IS_ERROR_FREE) {
			errorMsg = build_errorMsg + MSG;
			errorHas = true;
			if (errorHas) break;
		} else {
			/**
			 * Check 1b:
			 * Check if all entries of each object/key are STRING data type
			 */
			for (const AFFIX in AFFIXES) {
				const [IS_ERROR_FREE, MSG] = validate_AffixEntries(AFFIXES[AFFIX]);
				if (!IS_ERROR_FREE) {
					errorMsg = build_errorMsg + MSG + ` (in "${AFFIX}" array)`;
					errorHas = true;
					if (errorHas) break;
				}
				if (errorHas) break;
			}
		}
		if (errorHas) break;
		/**
		 * Check 2:
		 * - Check if all "subdomain" objects are correctly formatted
		 */
		const SUBDOMAINS = ENTRY["subdomains"];
		// process.exit()
		const [ERR_HAS, ERR_MSG] = validate_Subdomains(SUBDOMAINS);
		if (ERR_HAS === true) {
			errorMsg = build_errorMsg + ERR_MSG;
			errorHas = ERR_HAS;
			break;
		}
	}
	/**
	 * Check 1:
	 * Validate "affixes" property
	 */
	// console.clear();
	console.log(errorMsg);
	console.log("\n");
}
main();
