#!/bin/bash

#check that positiona argument for key location was provided
if [ "$1" == "$2" ]; then
    echo "Please provide the path to your private key file for openstack"
    return
fi

# If the openstack password hasn't been saved,
# then run the openrc.sh
if [[ -z "${OS_PROJECT_ID}" ]]; then
  . ./openrc.sh;
fi

echo "Welcome to our COMP90024 project deployment script!"
sleep 1

echo "Please enter a single number corresponding to the task you want to perform: "
echo "0 Upload a public key to openstack"
echo "1 Setup from scratch (runs tasks 2-7)"
echo "2 Create openstack instances, create + attach volumes"
echo "3 Install + configure required software on instances"
echo "4 [Re]Start CouchDB container"
echo "5 Initialise CouchDB cluster"
echo "6 Transfer python files + [Re]Start scripts for harvesters and analysis"
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