/**
 * User: rob
 * Date: 5/20/13
 * Time: 2:49 PM
 * To change this template use File | Settings | File Templates.
 */

var _ = require('lodash')
    , path = require( 'path')
    , fs = require('fs')
    ;


/**
 *
 * This little module will load configuration from a file, merging it with a local fiile
 * called cfg_file.local.js in the same directory and finally merging on top of that
 * any environment mvariables that
 *
 * @param cfg_file  -- the full path to the config file
 * @param env  -- dictionary containing the system enviromnney
 * @param maps -- mapping in the forn [["env_var", "congf.path"], ["env_var", "congf.path"]]
 */
exports.config = function( cfg_file, env, maps){

        var cfg = require(cfg_file) ;
        var local_config = this._get_local_cfg(cfg_file)
        var local = {};
        if (fs.existsSync(local_config))
            local = require(this._get_local_cfg(cfg_file));
        this._config(cfg,local,env,maps);

        return cfg;

    };



//Functions that do the work and are exposed for testing



/**
 * Wrapped version on the obove that doesn't depend on files
 * @param cfg
 * @param local
 * @param env
 * @param maps
 * @private
 */
exports._config = function( cfg,  local, env, maps){

    this._merge_configs(cfg,local);
    this._merge_env_variables(cfg,env);
    this._merge_special(maps,cfg,env);

    //Provide a function that returns am environment specific key version
    cfg.get = function(ref) {
         if (!('environment' in cfg))
                throw new Error("Config file requires top level 'environment' key");

          return ref[cfg.environment];
    };

};


/**
 * Returns the filename for the local config file:
 * config.js ==> config.local.js
 *
 * @param filename
 * @returns {*}
 * @private
 */
exports._get_local_cfg = function(filename) {
    var dir = path.dirname(filename);
    var base =  path.basename(filename,"js");
    var ext =  path.extname(filename);
    return path.join(dir,base +"local" + ext);

};


exports._merge_configs = function(base, local) {

     return _.merge(base,local);
};


/**
 * Function that updates the config with a single name/value pair
 * @param cfg
 * @param key
 * @param value
 * @private
 */
var _merge_one = function(cfg,key, value) {

    var parts  = key.split(".") ;
    if(parts.length == 1) {
        if (key in cfg)
            cfg[key] =  value
    }
    else {
        if ( eval("cfg."+ key ) === undefined)
            return true;
        if (_.isString(value))
            eval("cfg."+ key +"="+  '"'+value+'"') ;
        else
            eval("cfg."+ key +"="+value);

    }

};


/**
 * Loops through a dictionary containing environment variable
 * and tries to update the config dictionary
 * @param cfg
 * @param env
 * @private
 */
exports._merge_env_variables = function(cfg, env) {

    _.forEach(_.keys(env), function(o){
        _merge_one(cfg,o, env[o])

    });

    return cfg;
};


/**
 * Remaps evnironment variables to different places in the
 * cfg object
 * @param mappings -- mapping in the forn [["env_var", "congf.path"], ["env_var", "congf.path"]]
 * @param cfg
 * @param env
 * @private
 */
exports._merge_special = function(mappings, cfg, env) {

        _.forEach(mappings, function(each){
            if (each[0] in  env)
                _merge_one(cfg,each[1], env[each[0]])
    } );




}



