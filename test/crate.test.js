var juggler = require('loopback-datasource-juggler');
//require('loopback-datasource-juggler/test/common.batch.js');
//require('loopback-datasource-juggler/test/include.test.js');


var should = require('should');

var Tweet, db;

describe('create connector', function () {

  before(function () {
    db = getDataSource();
  //console.log('db :',db.connector);
    Post = db.define('tweets', {
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
  });
  
  it('should run migration', function (done) {
    db.automigrate('Tweets', function () {
      done();
    });
  });
  
  var post;
  it('should insert a row and return it', function(done) {
    Post.create(data, function(err, p) {
      should.not.exists(err);
      post = p;
      Post.findById(p.id, function(err, p) {
        console.log(err, "return data: ", p);
        should.not.exists(err);
        should.exists(p);
        done();
      });
    });
  });


  it('should support updating boolean types with false value', function(done) {
    Post.update({id: data.id}, {retweeted: false}, function(err) {
      //console.log("update: ", err);
      should.not.exists(err);
      Post.findById(data.id, function(err, p) {
        should.not.exists(err);
        p.should.have.property('retweeted', false);
        done();
      });
    });      
  });

  it('should return the model instance for upsert', function(done) {
    var newText = "#HajiLulungEffect #CandraCowokHumoris #Kita12Milanisti #JusticeForBAP #GGMU Semangat Senin Music Video Bale Rooney UASnya";
    Post.upsert({id: data.id, text: newText, source: 'S2_new', retweeted: true}, function(err, p) {
      //p.should.have.property('id', data.id);
      p.should.have.property('text', newText);
      p.should.have.property('source', 'S2_new');
      p.should.have.property('retweeted', true);
      done();
    });
  });

  it('should return the model instance for upsert when id is not present',
    function(done) {
      Post.upsert({text: 'T2_new', source: 'S2_new', retweeted: true},
        function(err, p) {
          p.should.have.property('id');
          p.should.have.property('text', 'T2_new');
          p.should.have.property('source', 'S2_new');
          p.should.have.property('retweeted', true);
          done();
        });
    });
  it('should query with params',
    function(done) {
      //console.log("Post ", Post);
      var sql = "SELECT * FROM tweets WHERE id = ?";
      db.connector.executeSQL(sql,[data.id],function(err, p) {
          console.log(err,"RESULT executeSQL", p);
          should.not.exists(err);
          should.exists(p);
          done();
        });
    });
    

  it('should delete the record', function(done) {
    Post.destroyAll({id: data.id}, function(){
      console.log("deleted!: ");
      done();
    })
  });
  
  it('should query without params',
    function(done) {
      //console.log("Post ", Post);
      var sql = "SELECT * FROM tweets WHERE text LIKE '%price%' LIMIT 5";
      db.connector.query(sql,function(err, p) {
          console.log(err,"RESULT Query", p);
          should.not.exists(err);
          should.exists(p);
          done();
        });
    });

/*
  it('should escape number values to defect SQL injection in findById',
    function(done) {
      Post.findById('(SELECT 1+1)', function(err, p) {
        console.log(err, "EI>>  ", p);
        should.exists(err);
        done();
      });
    });

  it('should escape number values to defect SQL injection in find',
    function(done) {
      Post.find({where: {id: '(SELECT 1+1)'}}, function(err, p) {
        should.exists(err);
        done();
      });
    });

  it('should escape number values to defect SQL injection in find with gt',
    function(done) {
      Post.find({where: {id: {gt: '(SELECT 1+1)'}}}, function(err, p) {
        should.exists(err);
        done();
      });
    });

  it('should escape number values to defect SQL injection in find',
    function(done) {
      Post.find({limit: '(SELECT 1+1)'}, function(err, p) {
        should.exists(err);
        done();
      });
    });

  it('should escape number values to defect SQL injection in find with inq',
    function(done) {
      Post.find({where: {id: {inq: ['(SELECT 1+1)']}}}, function(err, p) {
        should.exists(err);
        done();
      });
    });

  it('should support GeoPoint types', function(done) {
    var GeoPoint = juggler.ModelBuilder.schemaTypes.geopoint;
    var loc = new GeoPoint({lng: 10, lat: 20});
    Post.create({title: 'T1', content: 'C1', loc: loc}, function(err, p) {
      should.not.exists(err);
      Post.findById(p.id, function(err, p) {
        should.not.exists(err);
        p.loc.lng.should.be.eql(10);
        p.loc.lat.should.be.eql(20);
        done();
      });
    });
  });
*/
});

// FIXME: The following test cases are to be reactivated for PostgreSQL
/*

 test.it('should not generate malformed SQL for number columns set to empty string', function (test) {
 var Post = dataSource.define('posts', {
 title: { type: String }
 , userId: { type: Number }
 });
 var post = new Post({title:'no userId', userId:''});

   Post.destroyAll(function () {
     post.save(function (err, post) {
       var id = post.id
       Post.all({where:{title:'no userId'}}, function (err, post) {
           test.ok(!err);
           test.ok(post[0].id == id);
           test.done();
        });
      });
   });
 });

 test.it('all should support regex', function (test) {
 Post = dataSource.models.Post;

 Post.destroyAll(function () {
 Post.create({title:'PostgreSQL Test Title'}, function (err, post) {
 var id = post.id
 Post.all({where:{title:/^PostgreSQL/}}, function (err, post) {
 test.ok(!err);
 test.ok(post[0].id == id);
 test.done();
 });
 });
 });
 });

 test.it('all should support arbitrary expressions', function (test) {
 Post.destroyAll(function () {
 Post.create({title:'PostgreSQL Test Title'}, function (err, post) {
 var id = post.id
 Post.all({where:{title:{ilike:'postgres%'}}}, function (err, post) {
 test.ok(!err);
 test.ok(post[0].id == id);
 test.done();
 });
 });
 });
 })

 test.it('all should support like operator ', function (test) {
 Post = dataSource.models.Post;
 Post.destroyAll(function () {
 Post.create({title:'PostgreSQL Test Title'}, function (err, post) {
 var id = post.id
 Post.all({where:{title:{like:'%Test%'}}}, function (err, post) {
 test.ok(!err);
 test.ok(post[0].id == id);
 test.done();
 });
 });
 });
 });

 test.it('all should support \'not like\' operator ', function (test) {
 Post = dataSource.models.Post;
 Post.destroyAll(function () {
 Post.create({title:'PostgreSQL Test Title'}, function (err, post) {
 var id = post.id
 Post.all({where:{title:{nlike:'%Test%'}}}, function (err, post) {
 test.ok(!err);
 test.ok(post.length===0);
 test.done();
 });
 });
 });
 });

 test.it('all should support arbitrary where clauses', function (test) {
 Post = dataSource.models.Post;
 Post.destroyAll(function () {
 Post.create({title:'PostgreSQL Test Title'}, function (err, post) {
 var id = post.id;
 Post.all({where:"title = 'PostgreSQL Test Title'"}, function (err, post) {
 test.ok(!err);
 test.ok(post[0].id == id);
 test.done();
 });
 });
 });
 });

 test.it('all should support arbitrary parameterized where clauses', function (test) {
 Post = dataSource.models.Post;
 Post.destroyAll(function () {
 Post.create({title:'PostgreSQL Test Title'}, function (err, post) {
 var id = post.id;
 Post.all({where:['title = ?', 'PostgreSQL Test Title']}, function (err, post) {
 test.ok(!err);
 test.ok(post[0].id == id);
 test.done();
 });
 });
 });
 });
 */
