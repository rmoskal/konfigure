!!!Konfigure

I like to deploy to PAAS providers like heroku and like an easy way to support getting configuration variables from the application environment.

Konfigure accepts the full path to a configuration file, the prrocess environment variable, and an optional set of mappings of envronment variables 

	var config = require( 'konfigure').config(path.join( __dirname, "config.js" ), process.env
	, [["EVD_ENV", "environment"],["EVD_FIXTURES", "directories.fixtures"],
        ["REDISCLOUD_URL", "redis.production" ], ["MONGOHQ_URL", "mongo.production.uri" ]])

if a file with the name "config.local.js" in the same directory, variables will be preferentially mapped from that. Developers can use this to override any shared settings for a local environment. Normally this file is added to .gitignore.

Finally, you can map various environment variables to various configuration keys.  For example, in the above example, the MONGOHQ_URL is mapped to a configuration key called mongo.production.uri.

The code is well tested, but is dependent on lodash.  You'll need need mocha or some other test runner to execute them.
