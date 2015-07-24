Kinesis nodes - temporary file structure

Producers in python / BOTO to be loaded onto gateway.
Consumers in NodeJS / aws-KCL to be installed onto an EC2 EBS cluster

Producer Node:
ref: https://github.com/awslabs/kinesis-poster-worker

# from pip:
	$ pip install boto

# or from source:
	$ git clone git://github.com/boto/boto.git
	$ cd boto
	$ python setup.py install

    # install git
    $ sudo yum install git
    # clone the git repository to work with the samples
    $ git clone https://github.com/awslabs/amazon-kinesis-client-nodejs.git kclnodejs
    $ cd kclnodejs/samples/basic_sample/producer/
    # run the sample producer
	$ python genericproducer.py ResidentialBuildings


Consumer Node:
ref: https://github.com/awslabs/amazon-kinesis-client-nodejs
# install AWS CLI credentials to talk with Kinesis
    $ sudo pip install awscli
or
    $ curl "https://s3.amazonaws.com/aws-cli/awscli-bundle.zip" -o "awscli-bundle.zip"
    $ unzip awscli-bundle.zip
    $ sudo ./awscli-bundle/install -i /usr/local/aws -b /usr/local/bin/aws

then
    $ cd ~
    $ aws configure 
    *** Make sure to use user credentials with kinesis enabled *** 

# install node.js, npm and git
    $ sudo yum install nodejs npm --enablerepo=epel
    $ sudo yum install git
    # clone the git repository to work with the samples
    $ git clone https://github.com/awslabs/amazon-kinesis-client-nodejs.git kclnodejs
    $ cd kclnodejs/samples/basic_sample/producer/
    # download dependencies
    $ npm install
    $ export PATH=$PATH:kclnodejs/bin
    $ cd kclnodejs/samples/basic_sample/consumer/

    # Start the consumer with command option A
    $ node_modules/aws-kcl/bin/kcl-bootstrap --java /usr/bin/java -e -p ./sample.properties > consumer.out
    # Start the consumer with command option B
    $ kcl-bootstrap --java /usr/bin/java -e -p ./sample.properties > consumer.out 2>&1 &
