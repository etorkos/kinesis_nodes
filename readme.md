Kinesis nodes- temporary file structure

Producers in python to be loaded in embedded gateway.
Consumers in NodeJS to be installed onto an EC2 EBS cluster

Producer:
ref: https://github.com/awslabs/kinesis-poster-worker

from pip:
	$ pip install boto

or from source:
	$ git clone git://github.com/boto/boto.git
	$ cd boto
	$ python setup.py install
	$ python genericproducer.py ResidentialBuildings



Consumer:
ref: https://github.com/awslabs/amazon-kinesis-client-nodejs

# install node.js, npm and git
    $ sudo yum install nodejs npm --enablerepo=epel
    $ sudo yum install git
    # clone the git repository to work with the samples
    $ git clone https://github.com/awslabs/amazon-kinesis-client-nodejs.git kclnodejs
    $ cd kclnodejs/samples/basic_sample/producer/
    # download dependencies
    $ npm install
    # run the sample producer
    $ node sample_kinesis_producer_app.js &

    # ...and in another terminal, run the sample consumer
    $ export PATH=$PATH:kclnodejs/bin
    $ cd kclnodejs/samples/basic_sample/consumer/
    #option A
    $ kcl-bootstrap --java /usr/bin/java -e -p ./sample.properties > consumer.out
    #option B
    $ kcl-bootstrap --java /usr/bin/java -e -p ./sample.properties > consumer.out 2>&1 &
