# Kinesis Producer and Consumer nodes - temporary file structure

Producers in NodeJS / to be installed on gateway device
Consumers in NodeJS / aws-KCL to be installed onto an EC2 Auto Scaling Group

# Consumer / Producer Node:
install node.js, npm and git
    $ sudo yum install nodejs npm --enablerepo=epel
    $ sudo yum install git
    # clone the git repository to work with the samples
    $ git clone https://github.com/etorkos/kinesis.git
    $ cd kinesis/consumer/ or cd kinesis/producer
    # download dependencies
    $ npm install
    $ node consumer.js

# Local Install:
ref: https://github.com/awslabs/amazon-kinesis-client-nodejs
install AWS CLI credentials to talk with Kinesis
    $ sudo pip install awscli
or
    $ curl "https://s3.amazonaws.com/aws-cli/awscli-bundle.zip" -o "awscli-bundle.zip"
    $ unzip awscli-bundle.zip
    $ sudo ./awscli-bundle/install -i /usr/local/aws -b /usr/local/bin/aws

then
    $ cd ~
    $ aws configure 
    *** Make sure to use user credentials with kinesis enabled *** 