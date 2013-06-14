function createDatabase(){
				
         try{
              if(window.openDatabase){
                  //localStorage.setItem("dbname", "");
                  //executeQuery('DROP DATABASE placelist;');
                  var shortName = 'childfinder';
                  var version = '1.0';
                  var displayName = 'childfinder';
                  var maxSize = 655367; // in bytes
                  //alert("sa");
                  db = openDatabase(shortName, version, displayName, maxSize);
                  dbname = localStorage.getItem("dbname");
                  //alert(dbname);
                  //localStorage.removeItem("dbname");
                  if(dbname != 'childfinder'){
                         localStorage.setItem("dbname", shortName);
                          
                         createTable('bracelet','id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,cur_bracelet_code VARCHAR(250),childname VARCHAR(250),childsurname VARCHAR(250),childnation VARCHAR(250),childlang1 VARCHAR(250),childlang2 VARCHAR(250),parent1name VARCHAR(250),parent1surname VARCHAR(250),parent1phone VARCHAR(250),parent2name VARCHAR(250),parent2surname VARCHAR(250),parent2phone VARCHAR(250),accom TEXT,allergies TEXT,blood VARCHAR(250),medical TEXT,message TEXT,address TEXT,deleteafter VARCHAR(250)');
                         
                  }else{  
                     // executeQuery('DROP DATABASE lectures;');
                     //alert('elsepart');
                     localStorage.setItem("dbname", shortName);
                  }
															   
                  //alert(db);
                }
         }catch(e){
             console.log(">>"+e);
         }
}
function executeQuery($query,callback,errorcallback){
            try{
                   
                 if(window.openDatabase){
                    db.transaction(
                        function(tx){
                            console.log("Query Fired "+$query); 
                            tx.executeSql($query,[],function(tx,result){
										console.log("Query Success "); 	
                                if(typeof(callback) == "function"){
                                    callback(result);
                                }else{
                                    if(callback != undefined){
                                        eval(callback+"(result)");
                                    }
                                }
                            },function(tx,error){
                                console.log("Query Error"); 	
                                          if(typeof(errorcallback) == "function"){
                                            errorcallback(error);
                                          }else{
                                            if(errorcallback != undefined){
                                                
                                            }
                                          }
                                          });
                        });
                    
                    return rslt;
                 }
             }catch(e){}
      }
      
      function createTable(tablename,fields){
           var sql = 'drop table '+tablename+'';
           executeQuery(sql);
           //id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, image BLOB
           var sqlC = 'create table if not exists '+tablename+' ( '+fields+' )';
           //alert(sqlC);
           executeQuery(sqlC);
      }
      
      function insertValue(table,fields,values){

           var sql = 'insert into '+table+' ('+fields+') VALUES ('+values+')';
          console.log(sql);
           executeQuery(sql,function(results){
            // alert(results);
            return results;
			},function(error){
				console.log(error);
		  	});
      }