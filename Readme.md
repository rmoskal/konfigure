##Konfigure

I like to deploy to PAAS providers like heroku and like an easy way to support getting configuration variables from the application environment.

Konfigure accepts the full path to a configuration file, the process environment variables, and an optional set of mappings between environment variables and configuration keys. 

	var config = require( 'konfigure').config(path.join( __dirname, "config.js" ), process.env
	, [["EVD_ENV", "environment"],["EVD_FIXTURES", "directories.fixtures"],
        ["REDISCLOUD_URL", "redis.production" ], ["MONGOHQ_URL", "mongo.production.uri" ]])

If a file with the name of the configuration file with '.local.' interposed is found in the same directory, variables will be preferentially mapped from that. In the above this would be 'config.local.js' Developers can use this to override any shared settings for a local environment. Normally this file is added to .gitignore.

You can map various environment variables to various configuration keys.  For example, in the above example, the MONGOHQ_URL is mapped to a configuration key called 'mongo.production.uri'.

As of version .2 you  environment specific configurations out of the config file using a short-hand notation. Instead of doing this:

    config.redis[ config.environment ]

You can just do this:

    config.get(config.redis);

It will correctly parse the key for a configuration file that has a top level environment key like so:

var cfg = {
	         PORT : 3000
	, environment : 'development'
	, mongo : {
    		development : {
    			           uri : 'mongodb://evd_local:27017/evd'
    			, errorOptions : {
    				dumpExceptions : true
    				,    showStack : true
    			}
    		},

            test : {
                uri : 'mongodb://evd_local:27017/test'
                , errorOptions : {
                    dumpExceptions : true
                    ,    showStack : true
                }
            }

    		, production : {
    			uri : 'mongodb://jambo:foo'
    		}
    	}
    }


The code is well tested, and is dependent on lodash.
