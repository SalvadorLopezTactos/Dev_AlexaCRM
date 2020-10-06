/**
**	Funciones de consulta REST API
**/
module.exports = function() {
	
	var http = require('http'), https = require('https');
	
	/**
	 * Función de para establecer la sesión y almacenar el token.
	 * Este token puede ser reutilizado. Así no es necesario estar abriendo y cerrando sesión con cada petición.
	 * Esta 
	 * @returns
	 */
	this.getSessionRequest = function (){	
	
		//Añadido promise como parte del proceso Asíncrono
		return new Promise(((resolve, reject) => {
		
			var resultado = true;
			var options = {
					host: RESTServerIP, 
					port: RESTServerPort,
					path: '/MicroStrategyLibrary/api/auth/login',
					method: 'POST',
					rejectUnauthorized: false,
					headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				}
			};
			
			/*
			if(environment == PRO){
				options.headers.Authorization=basicAuth;
				options.headers.Connection="keep-alive";
				
			}
			*/
			////////////////////////////////////////////

			var postBody = "{\"username\": \"" + username + "\",\"password\": \"" + password + "\",\"loginMode\": 1}";
			
			var x = https.request(options,function(res){
			  printTrace("Got response: " + res.statusCode);
				var responseString = '';
				
				if (res.statusCode != 204) {
					resultado = false;
				}
				res.on('data', function (data) {
					responseString += data;
				});            
				res.on('end', function () {
					
					var status = res.statusCode; // HTTP response status, e.g., 200 for "200 OK"
				
					printTrace("Status:"+status);
					
					authToken=res.headers['x-mstr-authtoken'];
					
					printTrace("Auth Token: "+authToken);	
					
					sessionCookies = res.headers["set-cookie"];
					
					resolve(resultado);
					
				});
				res.on('error', function () {
					
					reject(resultado);
					
				});
			});
			
			 // write data to request body
			x.write(postBody);
			x.end();
			
		}));	//Fin Promise
		
	}
	
	/**
	 * Función para obtener la definición de los cubos utilizados
	 * @returns
	 * @params
	 * - cubeId: ID del cubo del que obtener la definición.
	 */
	this.getCubeDefinition = function(cubeId){	
		
		//Añadido promise como parte del proceso Asíncrono
		return new Promise(((resolve, reject) => {
			
			var options = {
					host: RESTServerIP, 
					port: RESTServerPort,
					path: '/MicroStrategyLibrary/api/cubes/'+cubeId,
					method: 'GET',
					rejectUnauthorized: false,
					headers: {
						'Content-Type': 'application/json',
						'Accept': 'application/json',
						'X-MSTR-AuthToken': authToken,
						'X-MSTR-ProjectID': MstrProjectId,
						'Cookie': sessionCookies
					}
			};
			
			//Add Authorization Header para Vordel
				/*
			if(environment == PRO){
				options.headers.Authorization=basicAuth;
				options.headers.Connection="keep-alive";
				
			}
			*/
			////////////////////////////////////////////

			var x = https.request(options,function(res){
			  
				printTrace("Got response: " + res.statusCode);
				var responseString = '';
				
				res.on('data', function (data) {
					responseString += data;
				});            
				res.on('end', function () {
					
					var status = res.statusCode; // HTTP response status, e.g., 200 for "200 OK"
					
					printTrace("GetCubeDefinition OK: ");
					
					if (res.statusCode != 200)	responseString = null;
					
					resolve(responseString);
					
				});
				res.on('error', function () {
					
					printTrace("GetCubeDefinition KO: "+responseString);
					
					reject(null);
					
				});
			});

			x.end();
			
		}));	//Fin Promise
	}
	
	
	/**
	 * Función para obtener los datos solicitados
	 * @returns
	 * @params
	 *  cubeId: ID del cubo del que obtener la definición.
	 *  postData: filtro de datos.
	 */
	this.getData = function(cubeId,postData){	
		
		printTrace("getData: " + cubeId);
		
		//Añadido promise como parte del proceso Asíncrono
		return new Promise(((resolve, reject) => {
		
		var resultado = true;
		var responseString = '';
		
		var options = {
	            host: RESTServerIP, 
	            port: RESTServerPort,
	            path: '/MicroStrategyLibrary/api/cubes/'+cubeId+'/instances?offset=0&limit=-1',
	            method: 'POST',
	            rejectUnauthorized: false,          
	            headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'X-MSTR-AuthToken': authToken,
					'X-MSTR-ProjectID': MstrProjectId,
					'Cookie': sessionCookies
				}
			};
		
		//Add Authorization Header para Vordel
			/*
			if(environment == PRO){
				options.headers.Authorization=basicAuth;
				options.headers.Connection="keep-alive";
				
			}
			*/
		////////////////////////////////////////////

		var x = https.request(options,function(res){
	              
			if (res.statusCode != 200) {
				printTrace("Bad Response: " + res.statusCode+" - "+res.statusMessage);
			}
			res.on('data', function (data) {
				responseString += data;
			});            
			res.on('end', function () {
				
				printTrace("Response OK: " + res.statusCode+" - "+res.statusMessage);		
						
				resolve(responseString);
				
			});
			res.on('error', function () {
				
				reject(null);
				
			});
		});

		x.write(postData);
		x.end();
		
		}));
	};

	

	/**
	 * Función de prueba para establecer la sesión y almacenar el token.
	 * Este token puede ser reutilizado. Así no es necesario estar abriendo y cerrando sesión con cada petición.
	 * @returns
	 *
	 */
	this.sessionLogout = function(){	
		
		//Añadido promise como parte del proceso Asíncrono
		return new Promise(((resolve, reject) => {
		
			if(authToken== undefined || sessionCookies== undefined)
				callback(false);
			
			//Logout
			var options = {
				host: RESTServerIP, 
				port: RESTServerPort,
				path: '/MicroStrategyLibrary/api/auth/logout',
				method: 'POST',
				rejectUnauthorized: false,
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'X-MSTR-AuthToken': authToken,
					'Cookie': sessionCookies					
				}
			};
			
			//Add Authorization Header para Vordel
			/*
			if(environment == PRO){
				options.headers.Authorization=basicAuth;
				options.headers.Connection="keep-alive";
				
			}
			*/
			////////////////////////////////////////////
			
			var x = https.request(options,function(res){
				printTrace("Logout response: " + res.statusCode);
				var responseString = '';
			
				if (res.statusCode != 204) {
					printTrace("Error de Logout");
				}
				res.on('data', function (data) {
					responseString += data;
				});
				res.on('end', function () {
					printTrace("Logout OK - "+res.statusCode);
					resolve(true);			
				});
				res.on('error', function () {	
					printTrace("Logout Function");
					reject(false);
					
				});
			});
			
			x.end();	//Logout request
		}));	//Fin Promise
	}	
	

}