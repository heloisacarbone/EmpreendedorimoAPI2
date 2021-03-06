const express = require('express');
const app = express();         
const bodyParser = require('body-parser');
const port = 3000; //porta padr�o
const mysql = require('mysql');

//configurando o body parser para pegar POSTS mais tarde
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//estabelencendo a conex�o
	const connection = mysql.createConnection({
	  host     : 'localhost',
	  port     : 3306,
	  user     : 'root',
	  password : '8ct8b&r',
	  database : 'test'
	});

	connection.connect(function(err){
	  if(err) return console.log(err);
	  console.log('conectou!');
	  createDatabase(connection);
	})

	function createDatabase(conn){
	
		var databaseSql = "CREATE DATABASE IF NOT EXISTS vejapormim;";  
		
		conn.query(databaseSql, function (error, results, fields){
			if(error) return console.log(error);
			console.log('criou o banco!');
			
			databaseSql = "USE vejapormim;";  
			conn.query(databaseSql, function (error, results, fields){
				if(error) return console.log(error);
				console.log('esta usando o banco!');
				createTable(connection);
			});
		});
		
		
	}
	
	function createTable(conn){
				  
	var tableSql = "CREATE TABLE IF NOT EXISTS Obstaculos (\n"+
	   			  "ID int NOT NULL AUTO_INCREMENT,\n"+
				  "Type varchar(150) NOT NULL,\n"+
				  "Latitude numeric(10) NOT NULL,\n"+
				  "Longitude numeric(10) NOT NULL,\n"+
				  "PRIMARY KEY (ID)\n"+
				  ");";
					  
			conn.query(tableSql, function (error, results, fields){
			  if(error) return console.log(error);
			  console.log('criou a tabela!');
			 
		  });
	}


//definindo as rotas
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Funcionando!' }));
app.use('/', router);

router.get('/Obstacle/get', (req, res) =>{
    execSQLQuery('SELECT * FROM Obstaculos', res);
	console.log(req.query.lat);     
    console.log(req.query.lng);     
    console.log(req.query.type);
})

router.post('/Obstacle/insert', (req, res) =>{
    const latitude = req.body.lat.substring(0,15);
    const longitude = req.body.lng.substring(0,15);
	const tipo = req.body.type.substring(0,15);
    execSQLQuery(`INSERT INTO Obstaculos(Latitude, Longitude, Type) VALUES('${latitude}','${longitude}', "${tipo}")`, res);
	});

//inicia o servidor
app.listen(port);
console.log('API funcionando!');

function execSQLQuery(sqlQry, res){
  const connection = mysql.createConnection({
    host     : 'localhost',
	port     : 3306,
	user     : 'root',
	password : '8ct8b&r',
	database : 'vejapormim'
  });
 
  connection.query(sqlQry, function(error, results, fields){
      if(error) 
        res.json(error);
      else
        res.json(results);
      connection.end();
      console.log('executou!');
  });
}