var DataSource = require('loopback-datasource-juggler').DataSource;

var config = require('rc')('loopback', {dev: {crate: {debug: true}}}).dev.crate;

var ds = new DataSource(require('../'), config);

// Define a account model
Tweets = ds.define('tweets', {
      id : String,
      created_at : String,
      user: JSON,
      text: String,
      source: String,
      retweeted: Boolean,
      meta: {required: false, type: JSON}
    });

data = {
      created_at: Math.floor(new Date() / 1000), 
      id:'99999',
      retweeted:true,
      source:"",
      text: 'Melano #StitchesAtMidnight #TWDRun #ChristianFigueiredoNoPanico #ExplicamePorQue #KUWTK10 Anne Dorval Paulsen Corujo Bobby Hurley', 
      user:{}
    };
    
Tweets.create(data, function(err, p) {
    post = p;
    Tweets.find({where: {id: data.id}}, function(err, p) {
        console.log(err, "return data: ", p);
    });
      
    var sql = "SELECT * FROM tweets WHERE text LIKE 'tweet' LIMIT 1";
    ds.connector.query(sql,function(err, p) {
      console.log("Query RESULT", p);
    });
            
    var sql = "SELECT * FROM tweets WHERE text LIKE ? LIMIT ?";
    ds.connector.executeSQL(sql,['tweet',3],function(err, p) {
      console.log("executeSQL RESULT", p);
    }); 
    
    Tweets.destroyAll({id: data.id}, function(){
        console.log("Deleted!");
    })
});



