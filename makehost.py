import os
import textwrap
import datetime

nl = str("\n")
space = str(" ")
line_break = str("#=========\n")


def makehost(
        host_name: str,
        host_title: str,
        host_desc: str,
        domains_with_www_prefix: set,
        domains_sans_www_prefix: set,
        directory_output: str = ""
        ):
    # Sort the lists out alphanumerically
    #
    domains_sans_www_prefix = sorted(domains_sans_www_prefix)
    domains_with_www_prefix = sorted(domains_with_www_prefix)
    # Info for each host file
    #
    host_comment = textwrap.dedent("""\
    # Title:
    # *host_title*
    #
    # Description:
    # *host_desc* (simple as that!)                    
    #                         
    # Compatible with AdAway on Android and multiple ad blockers.
    #
    # Source(s) Used:
    # https://raw.githubusercontent.com/ryanbarillosofficial/dns-blocklists/main/search_engines/sources.json
    #
    # Project Home Page:
    # https://github.com/ryanbarillos/dns-blocklists
    #
    """)

    # Update the "host_comment" for appropriate host file
    #
    comment = host_comment.replace("*host_title*", host_title).replace("*host_desc*", host_desc)

    # Delete the host file if exists already for replacing
    #
    file_name: str = host_name + ".txt"
    if os.path.exists(file_name): os.remove(file_name)

    # Make a new host file of the same name
    #
    file = open(file_name, "x")
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