## loopback-connector-crate

The [Crate Datastore] (https://crate.io/) Connector module for for [loopback-datasource-juggler](http://docs.strongloop.com/loopback-datasource-juggler/).

## Connector settings

The connector can be configured using the following settings from the data source.
* host or hostname (default to 'localhost'): The host name or ip address of the Crate DB server
* port (default to 4200): The port number of the Crate DB server
* debug (default to false)

The Crate connector uses [cratejs](https://github.com/herenow/cratejs) as the driver. See more
information about configuration parameters, check [https://github.com/herenow/cratejs](https://github.com/herenow/cratejs).


## Running tests

    npm test


## TODO:
 - Discovering Models
 - Complex query parameter
