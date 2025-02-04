var MongoClient = require('mongodb').MongoClient;

    const mongoClient = new MongoClient("mongodb://fcat-ro:v68mQi7X194r@fcat-mongo.cnetcontent.com:27017/fcat", { useNewUrlParser: true });
//    const mongoClient = new MongoClient("mongodb://fcat:WtRv772n7J7h@stage-fcat-mongo0.cnetcontent.net:27017/fcat-dev", { useNewUrlParser: true });
    mongoClient.connect(function(err, db) {
        if (err) {
                console.dir(err);
                        return;
        }
        var dbo = db.db("fcat");
        dbo.collection('item').find( {catId:105, partyId: 79, map: 0 } , function(err, res) {
                if(!err) {
                        console.time('test');
                        var count = 0;
                        res.forEach((data)=>   {
							console.log (data.itemIds.id);
                        });
                }
        });
		
   });

