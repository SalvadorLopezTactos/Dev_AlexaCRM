
module.exports = function() { 	
	
	require('./vars')();
	
	/**
	Función para la creación del json base
	@params:
		- metricId: id de la métrica a incluir
		- operator: operador lógico para el filtro.
	****/
	this.createBaseJson = function(metricID,operator){
		
		var jsonBase ={};
		
		//Si se ha preguntado por una métrica concreta se devuelve solo esa
		if(metricID!=null){
			jsonBase = {
				"requestedObjects":{"metrics":[{"id":""+metricID+""}],"attributes":[]},					
				"viewFilter":{				
				"operator":""+operator+"",
				"operands":[					
				]
			  }					
			};
		}
		else{	//Si no se solicita métrica se devuelven todas
			jsonBase = {
				"requestedObjects":{"attributes":[]},					
				"viewFilter":{				
				"operator":""+operator+"",
				"operands":[					
				]
			  }					
			};
			
		}
				
		return jsonBase;	
	};
	
	/**
	Función para la creación del json incluyendo filtros
	@params:
		- json: json base 
		- attID: id del atributo a añadir
		- value: valor para el filtro
		- type: tipo de atributo
		- dataType: tipo de dato
		- operator: operador para el filtro: Equals, NotEqual, And, OR....
	****/
	this.addOperand = function(json,attId,value,type,dataType,operator,formID){
				
		json.viewFilter.operands.push({
							"operator":""+operator+"",
							"operands":[
								  {
									"type":"form",
									"attribute":{
									  "id":""+attId+""
									},
									"form":{
									  "id":""+formID+""
									}
								  },
								  {
									"type":""+type+"",
									"dataType":""+dataType+"",
									"value":""+value+""
								  }
							]
						});
		return json;	
	};	
	

	/**
	Función para incluir un filtro de tipo OR
	@params:
		- json: json base 
		- attID: id del atributo a añadir
		- value: valor para el filtro
		- value2: valor para el filtro
		- type: tipo de atributo
		- dataType: tipo de dato
		****/
		this.addOROperand = function(json,attId1,value1,attId2,value2,type,dataType,operator){		
			
			json.viewFilter.operands.push({
					 "operator": ""+operator+"",
		                "operands": [                    
							{
								"operator": "Equals",
								"operands": [
									{
										"type": "form",
										"attribute": {
											"id": ""+attId1+""
										},
										"form": {
											"id": "45C11FA478E745FEA08D781CEA190FE5"
										}
									},
									{
										"type": ""+type+"",
										"dataType": ""+dataType+"",
										"value": ""+value1+""
									}
								]
							},
							{
								"operator": "Equals",
								"operands": [
									{
										"type": "form",
										"attribute": {
											"id": ""+attId2+""
										},
										"form": {
											"id": "45C11FA478E745FEA08D781CEA190FE5"
										}
									},
									{
										"type": ""+type+"",
										"dataType": ""+dataType+"",
										"value": ""+value2+""
									}
								]
							}
						]
					});
			return json;
			
		};					

		/**
		Función para generar el body de la petición con la estructura necesaria de la consulta REST
		@params:
			- petitionType: tipo de petición 
			- parametros: todos los parámetros extraídos de la petición
			- targetCube: cubo al que atacar
		****/
		this.getRequestFilter = function(petitionType,parametros,targetCube)
		{	
			var postData	="";
			var jsonBase;			
			
			//Código común para todo
			jsonBase = createBaseJson(null,"And");	//Create json base			
			//Add filters
			
			//Mes -- Año
			if(parametros.mes.toUpperCase()!= LIT_TODO && parametros.mes.toUpperCase()!= LIT_TODOS && parametros.mes.toUpperCase()!= LIT_TODAS)
				jsonBase = addOperand(jsonBase,
									getElementId(targetCube,ATTRIBUTE,ATT_MES),
										getRequestedPeriod(parametros.mes.toUpperCase(),parametros.anio),
												"constant","Char","Equals",FORM_ID);
			else	//Respuesta para todo el año
				jsonBase = addOperand(jsonBase,
									getElementId(targetCube,ATTRIBUTE,ATT_ANIO),
										getRequestedPeriod(parametros.mes.toUpperCase(),parametros.anio).substring(0,4),
												"constant","Char","Equals",FORM_ID);
											
			//Setear lumo -- Si es ambas no se añade el filtro
			if(parametros.lumo != LIT_AMBAS_LUMO )
				jsonBase = addOperand(jsonBase,
									getElementId(targetCube,ATTRIBUTE,ATT_BINARIO_LUMO),
										(parametros.lumo == LIT_SOLO_LUMO?"1":"0"),
												"constant","Char","Equals",FORM_ID);
				
			
			
			switch(petitionType){	


				case GET_RESUMEN_PRODUCTO:
						
					//Producto - Si es todas no se incluye
					if(parametros.producto!= LIT_TODO && parametros.producto!= LIT_TODOS && parametros.producto!= LIT_TODAS)
						jsonBase = addOperand(jsonBase,
											getElementId(targetCube,ATTRIBUTE,ATT_PRODUCTO),
														parametros.producto.toUpperCase(),
														"constant","Char","Equals",FORM_DESC);
														
				break;

				case GET_RESUMEN_PRODUCTO_X_OPERACION:			
					
					//Producto
					jsonBase = addOperand(jsonBase,
											getElementId(targetCube,ATTRIBUTE,ATT_PRODUCTO),
														parametros.producto.toUpperCase(),
														"constant","Char","Equals",FORM_DESC);
					//Tipo de Operación - Si es todas no se incluye
					if(parametros.tipoOperacion!= LIT_TODO && parametros.tipoOperacion!= LIT_TODOS && parametros.tipoOperacion!= LIT_TODAS)
						jsonBase = addOperand(jsonBase,
												getElementId(targetCube,ATTRIBUTE,ATT_TIPO_OPERACION),
															parametros.tipoOperacion.toUpperCase(),
															"constant","Char","Equals",FORM_DESC);
														
				break;
				
				case GET_RESUMEN_PRODUCTO_X_TIPO_CREDITO:					
					
					//Producto
					jsonBase = addOperand(jsonBase,
											getElementId(targetCube,ATTRIBUTE,ATT_PRODUCTO),
														parametros.producto.toUpperCase(),
														"constant","Char","Equals",FORM_DESC);
					//Tipo de Crédito - Si es todas no se incluye
					if(parametros.tipoCredito!= LIT_TODO && parametros.tipoCredito!= LIT_TODOS && parametros.tipoCredito!= LIT_TODAS)
						jsonBase = addOperand(jsonBase,
											getElementId(targetCube,ATTRIBUTE,ATT_TIPO_CREDITO),
														parametros.tipoCredito.toUpperCase(),
														"constant","Char","Equals",FORM_DESC);
														
				break;
				
				case GET_KPI_PRODUCTO:					

					//Producto - Si es todas no se incluye
					if(parametros.producto!= LIT_TODO && parametros.producto!= LIT_TODOS && parametros.producto!= LIT_TODAS)
						jsonBase = addOperand(jsonBase,
											getElementId(targetCube,ATTRIBUTE,ATT_PRODUCTO),
														parametros.producto.toUpperCase(),
														"constant","Char","Equals",FORM_DESC);
				break;
				
				case GET_KPI_OPERACION:					
					
					
					//Tipo de Operación - Si es todas no se incluye
					if(parametros.tipoOperacion!= LIT_TODO && parametros.tipoOperacion!= LIT_TODOS && parametros.tipoOperacion!= LIT_TODAS)
						jsonBase = addOperand(jsonBase,
											getElementId(targetCube,ATTRIBUTE,ATT_TIPO_OPERACION),
														parametros.tipoOperacion.toUpperCase(),
														"constant","Char","Equals",FORM_DESC);
				break;
				
				case GET_KPI_TIPO_CREDITO:				
					
					
					//Tipo de Crédito - Si es todas no se incluye
					if(parametros.tipoCredito!= LIT_TODO && parametros.tipoCredito!= LIT_TODOS && parametros.tipoCredito!= LIT_TODAS)
						jsonBase = addOperand(jsonBase,
											getElementId(targetCube,ATTRIBUTE,ATT_TIPO_CREDITO),
														parametros.tipoCredito.toUpperCase(),
														"constant","Char","Equals",FORM_DESC);
				break;
				
				case GET_VAR_KPI_PRODUCTO:
				
					//Limpiar json base
					jsonBase = createBaseJson(null,"And");	//Create json base
				
					//Incluir atributo mes en la consulta
					jsonBase.requestedObjects.attributes.push({"id":""+getElementId(targetCube,ATTRIBUTE,ATT_MES)+""});									
					
					jsonBase = addOROperand(jsonBase,getElementId(targetCube,ATTRIBUTE,ATT_MES),getRequestedPeriod(LIT_PASADO),getElementId(targetCube,ATTRIBUTE,ATT_MES),getCurrentPeriod(),"constant","Char","Or");
					
					//Producto - Si es todas no se incluye
					if(parametros.producto!= LIT_TODO && parametros.producto!= LIT_TODOS && parametros.producto!= LIT_TODAS)
						jsonBase = addOperand(jsonBase,
											getElementId(targetCube,ATTRIBUTE,ATT_PRODUCTO),
														parametros.producto.toUpperCase(),
														"constant","Char","Equals",FORM_DESC);
				
				break;
				
				case GET_VAR_KPI_TIPO_CREDITO:
				
					//Limpiar json base
					jsonBase = createBaseJson(null,"And");	//Create json base
				
					//Incluir atributo mes en la consulta
					jsonBase.requestedObjects.attributes.push({"id":""+getElementId(targetCube,ATTRIBUTE,ATT_MES)+""});									
					
					jsonBase = addOROperand(jsonBase,getElementId(targetCube,ATTRIBUTE,ATT_MES),getRequestedPeriod(LIT_PASADO),getElementId(targetCube,ATTRIBUTE,ATT_MES),getCurrentPeriod(),"constant","Char","Or");
					
					//Tipo de Crédito - Si es todo no se incluye
					if(parametros.tipoCredito!= LIT_TODO && parametros.tipoCredito!= LIT_TODOS && parametros.tipoCredito!= LIT_TODAS)
						jsonBase = addOperand(jsonBase,
											getElementId(targetCube,ATTRIBUTE,ATT_TIPO_CREDITO),
														parametros.tipoCredito.toUpperCase(),
														"constant","Char","Equals",FORM_DESC);
				
				
				break;
				
				case GET_VAR_KPI_OPERACION:
				
					//Limpiar json base
					jsonBase = createBaseJson(null,"And");	//Create json base
				
					//Incluir atributo mes en la consulta
					jsonBase.requestedObjects.attributes.push({"id":""+getElementId(targetCube,ATTRIBUTE,ATT_MES)+""});									
					
					jsonBase = addOROperand(jsonBase,getElementId(targetCube,ATTRIBUTE,ATT_MES),getRequestedPeriod(LIT_PASADO),getElementId(targetCube,ATTRIBUTE,ATT_MES),getCurrentPeriod(),"constant","Char","Or");
					
					//Tipo de Operación - Si es todas no se incluye
					if(parametros.tipoOperacion!= LIT_TODO && parametros.tipoOperacion!= LIT_TODOS && parametros.tipoOperacion!= LIT_TODAS)
						jsonBase = addOperand(jsonBase,
											getElementId(targetCube,ATTRIBUTE,ATT_TIPO_OPERACION),
														parametros.tipoOperacion.toUpperCase(),
														"constant","Char","Equals",FORM_DESC);				
				
				break;
				
				case GET_COLOCACION_REGION:
				
					//Incluir atributo Región en la consulta
					jsonBase.requestedObjects.attributes.push({"id":""+getElementId(targetCube,ATTRIBUTE,ATT_REGION)+""});
					
										
					//Producto - Si es todas no se incluye
					if(parametros.producto!= LIT_TODO && parametros.producto!= LIT_TODOS && parametros.producto!= LIT_TODAS)
						jsonBase = addOperand(jsonBase,
											getElementId(targetCube,ATTRIBUTE,ATT_PRODUCTO),
														parametros.producto.toUpperCase(),
														"constant","Char","Equals",FORM_DESC);
					
					//Excluir blancos				
					jsonBase = addOperand(jsonBase,
											getElementId(targetCube,ATTRIBUTE,ATT_REGION),
														"",
														"constant","Char","NotEqual",FORM_DESC);
														
				break;
				
				case GET_COLOCACION_CLIENTE_PRODUCTO:
				case GET_COLOCACION_CLIENTE_EQUIPO:
				case GET_COLOCACION_CLIENTE_REGION:
				
					//Incluir atributo Cliente en la consulta
					jsonBase.requestedObjects.attributes.push({"id":""+getElementId(targetCube,ATTRIBUTE,ATT_CLIENTE)+""});
					
					//Producto - Si es todas no se incluye
					if(parametros.producto!= LIT_TODO && parametros.producto!= LIT_TODOS && parametros.producto!= LIT_TODAS)
						jsonBase = addOperand(jsonBase,
											getElementId(targetCube,ATTRIBUTE,ATT_PRODUCTO),
														parametros.producto.toUpperCase(),
														"constant","Char","Equals",FORM_DESC);
														
					//Región/Equipo - Si es todas no se incluye
					if(parametros.valor_colocado_cliente!="" && parametros.valor_colocado_cliente!= LIT_TODO && parametros.valor_colocado_cliente!= LIT_TODOS && parametros.valor_colocado_cliente!= LIT_TODAS)
						jsonBase = addOperand(jsonBase,
											getElementId(targetCube,ATTRIBUTE,parametros.tipo_colocado_cliente),
														parametros.valor_colocado_cliente.toUpperCase(),
														"constant","Char","Equals",FORM_DESC);
					
					//Excluir blancos
					if(parametros.tipo_colocado_cliente!="")					
						jsonBase = addOperand(jsonBase,
											getElementId(targetCube,ATTRIBUTE,parametros.tipo_colocado_cliente),
														"",
														"constant","Char","NotEqual",FORM_DESC);				
				
				
				break;
				
				case GET_COLOCACION_EQUIPO_REGION:
				
					//Incluir atributo Cliente en la consulta
					jsonBase.requestedObjects.attributes.push({"id":""+getElementId(targetCube,ATTRIBUTE,ATT_EQUIPO)+""});
					
					//Producto - Si es todas no se incluye
					if(parametros.producto!= LIT_TODO && parametros.producto!= LIT_TODOS && parametros.producto!= LIT_TODAS)
						jsonBase = addOperand(jsonBase,
											getElementId(targetCube,ATTRIBUTE,ATT_PRODUCTO),
														parametros.producto.toUpperCase(),
														"constant","Char","Equals",FORM_DESC);
														
					//Región
					if(parametros.region!="" && parametros.region!= LIT_TODO && parametros.region!= LIT_TODOS && parametros.region!= LIT_TODAS)
						jsonBase = addOperand(jsonBase,
											getElementId(targetCube,ATTRIBUTE,ATT_REGION),
														parametros.region.toUpperCase(),
														"constant","Char","Equals",FORM_DESC);
					
					//Excluir blancos
					jsonBase = addOperand(jsonBase,
											getElementId(targetCube,ATTRIBUTE,ATT_REGION),
														"",
														"constant","Char","NotEqual",FORM_DESC);				
				
				break;
				
				case GET_COLOCACION_ASESOR:	
				case GET_TOP_COLOCACION_ASESOR:
				case GET_COLOCACION_EQUIPO:
				case GET_TOP_COLOCACION_VS_PRESUPUESTO_EQUIPO:
				case GET_TOP_COLOCACION_VS_PRESUPUESTO_REGION:
				
					var att = "";
					
					if(petitionType == GET_COLOCACION_EQUIPO || petitionType == GET_TOP_COLOCACION_VS_PRESUPUESTO_EQUIPO) 
						att = ATT_EQUIPO;
					else if (petitionType == GET_TOP_COLOCACION_VS_PRESUPUESTO_REGION) 
						att = ATT_REGION;
					else 
						att = ATT_ASESOR;
				
					//Incluir atributo Cliente en la consulta
					jsonBase.requestedObjects.attributes.push({"id":""+getElementId(targetCube,ATTRIBUTE,att)+""});
					
					//Producto - Si es todas no se incluye
					if(parametros.producto!= LIT_TODO && parametros.producto!= LIT_TODOS && parametros.producto!= LIT_TODAS)
						jsonBase = addOperand(jsonBase,
											getElementId(targetCube,ATTRIBUTE,ATT_PRODUCTO),
														parametros.producto.toUpperCase(),
														"constant","Char","Equals",FORM_DESC);

					//Excluir blancos
					jsonBase = addOperand(jsonBase,
											getElementId(targetCube,ATTRIBUTE,att),
														"",
														"constant","Char","NotEqual",FORM_DESC);
					
				
				break;
				
				
				
				}									
			
				postData = JSON.stringify(jsonBase);
				
				return postData;
			
		};
		
		/**
		**
		**	Función para buscar los IDs de los elementos en el cubo.
		*	@params
		*	 CubeID: identificador del cubo a atacar.
		*	 elementType: tipo de elemento {METRIC|ATTRIBUTE}
		*	 elementName: nombre del elemento a buscar.
		*	
		**
		*****************/
		this.getElementId = function(CubeID,elementType,elementName){
			
			if(elementType==ATTRIBUTE)
			{
				var attributesList=CUBE_DEFINITION.result.definition.availableObjects.attributes;

				for(i=0;i<attributesList.length;i++){
					
					if(attributesList[i].name==elementName)
						return attributesList[i].id;
					
				}
				
				
			}
			else	//metrics
			{
				var metricList=CUBE_DEFINITION.result.definition.availableObjects.metrics;

				for(i=0;i<metricList.length;i++){
					
					if(metricList[i].name==elementName)
						return metricList[i].id;
					
				}		
				
			}	
		}

	

}