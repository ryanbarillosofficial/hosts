"""
Reference(s):
https://ihateregex.io/expr/ipv6/
"""
# Import makehost() function
#
import sys
sys.path.append("..")
from makehost import makehost

# Import everything else
#
import requests as req
import re as regex
import os
import textwrap
import datetime
import json
import time

# CONSTANTS
#
HOST_NAME: str = "porn"
HOST_TITLE: str = "No Porn"
HOST_DESC: str = "No pornographic websites"

def main():
    # Regular Expressions for IPv4 and IPv6 addresses
    ipv4Regex = regex.compile("\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}")
    ipv6Regex = regex.compile("(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))")

    # List of websites
    domains_with_www_prefix: set = set()
    domains_sans_www_prefix: set = set()
    keywords_to_be_ignored=[
        "local",
        "localhost",
        "broadcasthost",
        "#"
    ]
    
    # Host files to derive my work from
    #
    json_name: str = "sources.json"
    sources: dict = []

    with open(file = ("./" + json_name), encoding='utf-8') as json_file:
        sources = json.load(json_file)
    json_file.close()    


    for i in sources:
        # Alert the console the source being worked on for debugging
        #
        print("\n\nAdding all domains from \"" + sources[i]["name"] + "\"")
        
        # Grab host file and convert it into list
        #
        domain_list = req.get(sources[i]["link"]).text.split("\n")

        # Separate each URL from its redirect IP address
        # And append them to the corrrect domain lists above
        #
        for domain in domain_list:
            # Ignore lines that don't have IP addresses
            # They are most likely whitespaces or comments  
            # 
            # Next, check if the domain is to be ignored
            # If so, do not add domain in any list
            #           
            proceed: bool = True

            for keyword in keywords_to_be_ignored:
                if keyword in domain:
                    proceed = False
                    break
            # If we should proceed
            #
            # Next, check if line contains an IP address
            # That means it's a website
            #
            if (proceed):
                if ipv4Regex.match(domain) or ipv6Regex.match(domain):
                    url = domain.split(" ")
                    # Now to add the domain in the list
                    #
                    if "www." in domain:
                        if domain not in domains_with_www_prefix:
                            domains_with_www_prefix.add(url[1])
                    else:
                        if domain not in domains_sans_www_prefix:
                            domains_sans_www_prefix.add(url[1])
        print("Done!")
        time.sleep(3)

    # Now check if each website has its appropriate counterpart
    # On either list; otherwise, create it
    #
    print("\nFinalizing all domains WITH their \"www.\" counterparts")
    for domain in domains_sans_www_prefix:
        domains_with_www_prefix.add("www." + domain)
    print("Done!")
    time.sleep(3)

    print("\nFinalizing all domains WITHOUT their \"www.\" counterparts")
    for domain in domains_with_www_prefix:
        # Get the website without the "www." prefix & check
        #
        domain_spliced = domain[4:]
        domains_sans_www_prefix.add(domain_spliced)
    print("Done!")
    time.sleep(3)  
    
    # Now write to the new hosts file
    #
    makehost(
        host_name=HOST_NAME,
        host_title=HOST_TITLE,
        host_desc=HOST_DESC,
        domains_with_www_prefix=domains_with_www_prefix,
        domains_sans_www_prefix=domains_sans_www_prefix
    )
        
# Run script    
main()