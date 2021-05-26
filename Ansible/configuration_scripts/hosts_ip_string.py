#!/usr/bin/python3

# COMP90024 Cloud Computing Project 2
# Team 40:
# Mark Drvodelic 1068574
# Colton Carner 693280
# Bing Xu 833684
# Zihao Zhang 1151006
# Brandon Lulham 1162377

# given the output of the openstack inventory (eg as generated from openstack_inventory.py) as input to stdin,
# this script prints to stdout a simple string of all public IPv4 addresses with spaces between them
# to make it easy to parse in a bash script
# The control/instance-1 node will be the FIRST IP in the output string.

import sys
import json

jsonstring = ''
host_string = ''

# json passed in via a pipe
datastore = json.load(sys.stdin)

for host_id,data in datastore['_meta']['hostvars'].items():
    name = data["openstack"]["name"]
    ip = data["openstack"]["public_v4"]
    if "control" in name or "instance-1" in name:
        # this is the main/control node, make it the FIRST IP in the string
        host_string = ip + " " + host_string
    else:
        host_string +=  ip + " "

print(host_string)
