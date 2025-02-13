# Import makehost() function
#
import sys
sys.path.append("..")
from makehost import makehost

# Import everything else
#
import time
import json

def main():
    # List of websites
    domains_with_www_prefix: set = set()
    domains_sans_www_prefix: set = set()

    # List of Child-safe Websites (Easy Version)
    safesearch_easy__domains_with_www_prefix: set = set()
    safesearch_easy__domains_sans_www_prefix: set = set()

    # List of Child-safe Websites (Easy Version)
    safesearch_strict__domains_with_www_prefix: set = set()
    safesearch_strict__domains_sans_www_prefix: set = set()

    # List of Child-safe Websites WITHOUT graphics
    safesearch__graphicfree__domains_sans_www_prefix: set = set()
    safesearch__graphicfree__domains_with_www_prefix: set = set()

    # Host files to derive my work from
    #
    json_name: str = "sources.json"
    search_engines: dict = []

    with open(file = ("./" + json_name), encoding='utf-8') as json_file:
        search_engines = json.load(json_file)
    json_file.close()

    # Go through each search engine and add them to list
    # https://www.w3schools.com/python/python_dictionaries_loop.asp
    #
    for domains in search_engines.values():
        for domain in domains:
            link_sans_www: str = domain["url"]
            link_with_www: str = "www." + link_sans_www

            # Add link to the normal list
            #
            domains_sans_www_prefix.add(link_sans_www)
            domains_with_www_prefix.add(link_with_www)

            # Add to child-safe list
            #
            if domain["safesearch"] is False:
                # Check if domains can damage other websites, to which don't block it
                #
                if domain["damaging_if_disabled"] is False:
                    safesearch_easy__domains_sans_www_prefix.add(link_sans_www)
                    safesearch_easy__domains_with_www_prefix.add(link_with_www)
                # Otherwise, block it anyway on the other list
                #
                safesearch_strict__domains_sans_www_prefix.add(link_sans_www)
                safesearch_strict__domains_with_www_prefix.add(link_with_www)

                if domain["has_graphics"] is True:
                    safesearch__graphicfree__domains_sans_www_prefix.add(link_sans_www)
                    safesearch__graphicfree__domains_with_www_prefix.add(link_with_www)

    # Blacklist of all search engines
    #
    makehost(
        host_name="all",
        host_title="No Search Engines",
        host_desc="No search engines",
        domains_sans_www_prefix=domains_sans_www_prefix,
        domains_with_www_prefix=domains_with_www_prefix
        )
    
    # Blacklist of all search engines NOT SAFESEARCH (easy mode)
    #
    makehost(
        host_name="safesearch_easy",
        host_title="Safe Search Engines ONLY (Easy Version)",
        host_desc="Only allow search engines with Safe Mode enabled",
        domains_sans_www_prefix=safesearch_easy__domains_sans_www_prefix,
        domains_with_www_prefix=safesearch_easy__domains_with_www_prefix
        )
    # Blacklist of all search engines NOT SAFESEARCH (easy mode)
    #
    makehost(
        host_name="safesearch_strict",
        host_title="Safe Search Engines ONLY (Strict Version)",
        host_desc="Only allow search engines with Safe Mode STRICTLY enabled",
        domains_sans_www_prefix=safesearch_strict__domains_sans_www_prefix,
        domains_with_www_prefix=safesearch_strict__domains_with_www_prefix
        )    
    # Blacklist of all search engines NOT SAFESEARCH + WITH IMAGES
    #
    makehost(
        host_name="safesearch__graphicfree",
        host_title="Safe Search Engines + NO Images ONLY",
        host_desc="Only allow search engines with Safe Mode STRICTLY enabled + no images",
        domains_sans_www_prefix=safesearch__graphicfree__domains_sans_www_prefix,
        domains_with_www_prefix=safesearch__graphicfree__domains_with_www_prefix
        )                

main()