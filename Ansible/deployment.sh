#!/bin/bash

#check that positiona argument for key location was provided
if [ "$1" == "$2" ]; then
    echo "Please provide the path to your private key file for openstack"
    return
fi

# If the openstack password hasn't been saved,
# then run the openrc.sh
if [[ -z "${OS_PASSWORD}" ]]; then
  . ./openrc.sh;
fi

RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${RED}Welcome to our COMP90024 project deployment script!${NC}"
sleep 0.5

#slow terminal effect :)
echo "Please enter a single number corresponding to the task you want to perform: "
sleep 0.05
echo "0 Upload a public key to openstack"
sleep 0.05
echo "1 Setup from scratch (runs tasks 2-7)"
sleep 0.05
echo "2 Create openstack instances, create + attach volumes"
sleep 0.05
echo "3 Install + configure required software on instances"
sleep 0.05
echo "4 [Re]Start CouchDB container"
sleep 0.05
echo "5 Initialise CouchDB cluster"
sleep 0.05
echo "6 Transfer python files + [Re]Start scripts for harvesters and analysis"
sleep 0.05
echo "7 [Re]Start webserver + website container"

read selection

case $selection in 
    "0")
        echo "Note: public key to be uploaded should be located at ./secrets/publickey.pub"
        ansible-playbook -K mrc-replace-publickey.yaml
        ;;
    "1")
        ansible-playbook mrc-complete.yaml -K -i inventory --key-file $1;
        ;;
    "2")
        ansible-playbook mrc-openstack-configure.yaml -K -i inventory --key-file $1;
        ;;
    "3")
        ansible-playbook mrc-install.yaml -K -i inventory --key-file $1;
        ;;
    "4")
        ansible-playbook mrc-start-couchdb.yaml -K -i inventory --key-file $1;
        ;;
    "5")
        ansible-playbook mrc-cluster-couchdb.yaml -K -i inventory --key-file $1;
        ;;
    "6")
        ansible-playbook mrc-python-execute.yaml -K -i inventory --key-file $1;
        ;;
    "7")
        ansible-playbook mrc-start-frontend.yaml -K -i inventory --key-file $1;
        ;;
    *)
        echo "Please type a single number to indicate the job to perform"
        ;;
esac