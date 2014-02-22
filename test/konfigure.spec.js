
var cfg =  require( '../konfigure.js')
    , expect = require('chai').expect
    , should = require('chai').should()
;

describe ("Konfigure", function(){
    it ("should correctly split the filename to get the local config", function(){
        cfg._get_local_cfg("/jump/high/config.js").should.equal("/jump/high/config.local.js");
    });

    it ("should correctly split the filename even when short", function(){
        cfg._get_local_cfg("config.js").should.equal("config.local.js");
    });


    it ("should correctly merge two json configurations", function(){
        expect(cfg._merge_configs({key:"val1"}, {key:"val2", other:"val3"})).to.deep.equal({key:"val2", other:"val3"});
    });


    it ("even deep ones", function(){
        expect(cfg._merge_configs({key:{prop1: "one", prop2: "two"}}, {key:{prop2: "TWO"}, other:"val3"}))
            .to.deep.equal({key:{prop1: "one", prop2: "TWO"},other:"val3"});
    });


    it ("knows how to copy a value from the environment", function(){
        var cfg2 = {PORT: 3000};
        cfg._merge_env_variables(cfg2,{PORT:10000});
        cfg2.PORT.should.equal(10000);
    });

    it ("can handle environment variables that point more deeply in the config structure", function(){
        var cfg2 =  { production : {
                uri : 'mongodb://jambo:hotdog@dharma.mongohq.com:10053/evd'
            }
        };
        cfg._merge_env_variables(cfg2,{"production.uri":"foo"});
        cfg2.production.uri.should.equal("foo");
    });


    it ("correctly handles numeric values", function(){
        var cfg2 =  { production : {
            uri : 'mongodb://jambo:hotdog@dharma.mongohq.com:10053/evd'
        }
        };
        cfg._merge_env_variables(cfg2,{"production.uri":100});
        cfg2.production.uri.should.equal(100);
    });


    it ("does not copy non-existant keys in the config", function(){
        var cfg2 =  { production : {
            uri : 'mongodb://jambo:hotdog@dharma.mongohq.com:10053/evd'
        }
        };
        expect(cfg2.production.stink).to.be.undefined;
        cfg._merge_env_variables(cfg2,{"production.stink":100});
        expect(cfg2.production.stink).to.be.undefined;
    });

    it ("handles a mix of existing and no nonexisting items", function(){
        var cfg2 = {PORT: 3000};
        cfg._merge_env_variables(cfg2,{WHOO: "one", PORT:10000, FOO:1, POO:2});
        expect(cfg2.PORT).to.equal(10000);
        expect(cfg2.FOO).to.be.undefined;
        expect(cfg2.POO).to.be.undefined;
        expect(cfg2.WHOO).to.be.undefined;
    });


    it ("remaps an environment variable to another key in the cfg", function(){
        var cfg2 = {PORT: 3000};
        cfg._merge_special([["POOOOT", "PORT"]], cfg2,{POOOOT:10000});
        expect(cfg2.PORT).to.equal(10000);
    });


    it ("it will not map an environment variable mapping when it doesn't exist in the config", function(){
        var cfg2 = {PORT: 3000};
        cfg._merge_special([["POOOOT", "PORT"],["LOOOT", "ADDED"]], cfg2,{POOOOT:10000, LOOT:"a"});
        expect(cfg2.LOOT).to.be.undefined;
    });


    it ("it should combine together all three steps", function(){
        var cfg2 = {PORT: 3000, DB:{uri:"here"}, FROM_ENV:true};
        var local = {PORT: 100}
        cfg._config(cfg2 ,local, {FROM_ENV:false, DBURI:"elsewhere"}, [["DBURI","DB.uri"]]);
        expect(cfg2.PORT).to.equal(100);
        expect(cfg2.FROM_ENV).to.be._false;
        expect(cfg2.DB.uri).to.equal("elsewhere");

    });






})

