"""
Reference(s):
https://ihateregex.io/expr/ipv6/
"""
import requests as req
import re as regex
import os
import textwrap
import datetime
import json

nl = str("\n")
space = str(" ")
line_break = str("#=========\n")



# Test
def main():
    # IDK
    #
    host_comment = textwrap.dedent("""\
    # Title:
    # No *name*
    #
    # Description:
    # Blocks *name* (simple as that!)                    
    #                         
    # Compatible with AdAway on Android and multiple ad blockers.
    #
    # Source(s) Used:
    # https://raw.githubusercontent.com/ryanbarillosofficial/dns-blocklists/main/social_media/sources.json
    #
    # Project Home Page:
    # https://github.com/ryanbarillos/dns-blocklists
    #
    """)
    # Regular Expressions for IPv4 and IPv6 addresses
    ipv4Regex = regex.compile("\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}")
    ipv6Regex = regex.compile("(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))")
    
    # Host files to derive my work from
    #
    json_name: str = "sources.json"
    sources: dict = []

    with open(file = ("./" + json_name), encoding='utf-8') as json_file:
        sources = json.load(json_file)
    json_file.close()    

    """
    STEP 01:

    1. Go through each host file and add fetch their domains
    2. Sort them into the correct domains list defined above
    """
    
    for social_media in sources:
        # List of websites
        domains_with_www_prefix=[]
        domains_sans_www_prefix=[]
        
        # Delete existing host files to be replaced by newer, updated lists
        #
        file_name: str = sources[social_media]["name"]
        if os.path.exists(file_name + ".txt"): os.remove(file_name + ".txt")
        
        # Grab EACH host file and convert it into list
        #
        for i in sources[social_media]["sources"]:
            link: str = sources[social_media]["sources"][i]["link"]
            keyword: str = sources[social_media]["sources"][i]["keyword"]

            domain_list = req.get(link).text.split("\n")

            # Separate each URL from its redirect IP address
            # And append them to the corrrect domain lists above
            #
            proceed: bool = False

            for domain in domain_list:
                if (proceed):
                    if ipv4Regex.match(domain) or ipv6Regex.match(domain):
                        url = domain.split(" ")
                        # Now to add the domain in the list
                        #
                        if "www." in domain:
                            if domain not in domains_with_www_prefix:
                                domains_with_www_prefix.append(url[1])
                        else:
                            if domain not in domains_sans_www_prefix:
                                domains_sans_www_prefix.append(url[1])
                
                if (domain == keyword): proceed = True
                if (domain == "" and proceed == True): break

        # Now check if each website has its appropriate counterpart
        # On either list; otherwise, create it
        #
        for domain in domains_sans_www_prefix:
            if domain not in domains_with_www_prefix:
                domains_with_www_prefix.append("www." + domain)

        # Now write to the new hosts file
        #
        comment = host_comment.replace("*name*", file_name.title())
        file = open(file_name + ".txt", "x")
        file.write(comment)
        file.write("# Last Updated: " + datetime.date.today().strftime("%d %b %Y") + nl) 
        # IPv4 addresses
        #
        file.write("\n\n" + line_break + "IPv4 Nodes\n" + line_break)    
        for domain in domains_sans_www_prefix:
            file.write("0.0.0.0" + space + domain + nl)
        for domain in domains_with_www_prefix:
            file.write("0.0.0.0" + space + domain + nl)
        # IPv6 addresses
        #
        file.write("\n\n" + line_break + "IPv6 Nodes\n" + line_break)    
        for domain in domains_sans_www_prefix:
            file.write("::1" + space + domain + nl)
        for domain in domains_with_www_prefix:
            file.write("::1" + space + domain + nl)
            
# Run script    
main()