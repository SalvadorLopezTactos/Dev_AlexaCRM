/**
	Módulo donde se procesan los parámetros recibidos y la respuesta del dispositivo.

**/
module.exports = function() { 

require('./vars')();

this.lastMetricSlot ="";		//Para almacenar la última métrica en caso de que se hagan preguntas del tipo "y para el sexo másculino"
this.dimensionDesglose =""; 	//Dimensión usada para el deslose de afiliados
this.error = false;

/**
**	Función encargada del procesamiento del intent y la extracción de todos los parámetros necesarios
**	intent: sección intent de la request
**	petitionType: tipo de petición.
**/
this.extractParams = function(intent, petitionType) {
    
    /** Slots posibles **/
	var mes 					= "";
	var anio 					= "";
	var producto 				= "";	
	var region 					= "";	
	var equipo 					= "";
	var tipo_colocado_cliente	= "";
	var valor_colocado_cliente	= "";
	var tipoOperacion 			= "";
	var tipoCredito 			= "";
	var kpi 					= "";
	var top						= "";
	var lumo 					= "";	//Valores: SOLO LUMO, SIN LUMO, AMBAS
	var dimension				= "";
	var dimensionValor			= "";
	var newIntentCode			= "";
	var parametros 				= {};
	var mensajeError 			= null;
	var error 					= false;
	
	let texto_frase 	= "";
	let texto_producto 	= "";
	let texto_top 		= "";
	
	var vieneMes = false;
	
	try{			
						
			/**
			 * Obtener el valor del mes (si viene)
			 */
			if(intent.slots!= undefined && 
				intent.slots.mes!= undefined && 
					intent.slots.mes.value!= undefined){				
				mes = intent.slots.mes.value;
				vieneMes = true;
			}
			else	//Si no se encuentra se usa el mes actual
				mes = max_mes;
				
			/**
			 * Obtener el valor del año (si viene)
			 */
			if(intent.slots!= undefined && 
				intent.slots.anio!= undefined && 
					intent.slots.anio.value!= undefined)					
				anio = intent.slots.anio.value;
			else	//Se usa el año actual
				anio = max_anio;
				
			/**
			 * Obtener el valor de lumo
			 */
			if(intent.slots!= undefined && 
				intent.slots.lumo!= undefined && 
					intent.slots.lumo.value!= undefined)					
				lumo = filtrarElemento(intent.slots.lumo.value.toUpperCase(),ARRAY_LUMO);
			else	//Por defecto AMBAS
				lumo = LIT_AMBAS_LUMO;	
				
			//Buscar mayor/menor
			if(intent.slots!= undefined && 
				intent.slots.masmenos!= undefined && 
					intent.slots.masmenos.value!= undefined){
						
						if(intent.slots.masmenos.value.toUpperCase().includes("MÁS") || intent.slots.masmenos.value.toUpperCase().includes("MAYOR"))
							masmenos = LIT_MAYOR;
						else
							masmenos = LIT_MENOR;				
			}
			else
				masmenos = LIT_MAYOR;
				
						
			/*
				Get parameters from call
			*/
			switch(petitionType){
				
				case GET_RESUMEN_PRODUCTO:
					
					producto = "";			
					
					//Buscar producto
					if(intent.slots!= undefined && 
						intent.slots.producto!= undefined && 
							intent.slots.producto.value!= undefined)
						producto = filtrarElemento(intent.slots.producto.value.toUpperCase(),ARRAY_PRODUCTOS);
						
					printTrace("Producto: "+producto);
					
					ULTIMA_FRASE_ENTENDIDA = "RESUMEN PARA EL PRODUCTO "+producto;
					ULTIMA_FRASE_ENTENDIDA+= getTextoMes(mes,getRequestedYear(anio));
					
				break;
				
				case GET_RESUMEN_PRODUCTO_X_OPERACION:
				
					producto = LIT_LEASING;		//LOS TIPOS DE OPERACIÓN SÓLO APLICAN PARA EL PRODUCTO LEASING
					tipoOperacion = "";					
					
					/*Buscar producto
					if(intent.slots!= undefined && 
						intent.slots.producto!= undefined && 
							intent.slots.producto.value!= undefined)
						producto = filtrarElemento(intent.slots.producto.value.toUpperCase(),ARRAY_PRODUCTOS);
					*/
					
					//Las consultas por tipo de operación sólo son válidas para el producto LEASING
					//Si se detecta otro producto, se detiene el Intent avisando al usuario					
					if(producto != LIT_LEASING){
						mensajeError = MSG_ERROR_LEASING;
						error = true;
					}		
					
					//Buscar operación
					if(intent.slots!= undefined && 
						intent.slots.operacion!= undefined && 
							intent.slots.operacion.value!= undefined)
						tipoOperacion = filtrarElemento(intent.slots.operacion.value.toUpperCase(),ARRAY_TIPO_OPERACION);	
						
						
					printTrace("Producto: "	+producto);
					printTrace("Operacion Capturada: "+intent.slots.operacion.value.toUpperCase());
					printTrace("Operacion Filtrada: "+tipoOperacion);
					
					ULTIMA_FRASE_ENTENDIDA = "RESUMEN PARA EL PRODUCTO "+producto+" POR TIPO DE OPERACIÓN "+tipoOperacion;
					ULTIMA_FRASE_ENTENDIDA+= getTextoMes(mes,getRequestedYear(anio));
					
				break;
				
				case GET_RESUMEN_PRODUCTO_X_TIPO_CREDITO:
				
					producto = LIT_CREDITO_SIMPLE;	//LOS TIPOS DE CRÉDITO SÓLO APLICAN PARA EL PRODUCTO CRÉDITO SIMPLE	
					tipoCredito = "";

					/*Buscar producto
					if(intent.slots!= undefined && 
						intent.slots.producto!= undefined && 
							intent.slots.producto.value!= undefined)
						producto = filtrarElemento(intent.slots.producto.value.toUpperCase(),ARRAY_PRODUCTOS);
					*/
					
					//Las consultas por tipo de crédito sólo son válidas para el producto CRÉDITO SIMPLE
					//Si se detecta otro producto, se detiene el Intent avisando al usuario					
					if(producto != LIT_CREDITO_SIMPLE){
						mensajeError = MSG_ERROR_CREDITO;
						error = true;
					}	
					
					
					//Buscar tipo de crédito
					if(intent.slots!= undefined && 
						intent.slots.tipoCredito!= undefined && 
							intent.slots.tipoCredito.value!= undefined)
						tipoCredito = filtrarElemento(intent.slots.tipoCredito.value.toUpperCase(),ARRAY_TIPO_CREDITO);	
						
						
					printTrace("Producto: "	+producto);
					printTrace("Operacion: "+tipoCredito);
					
					ULTIMA_FRASE_ENTENDIDA = "RESUMEN PARA EL PRODUCTO "+producto+" POR TIPO DE crédito "+tipoCredito;
					ULTIMA_FRASE_ENTENDIDA+= getTextoMes(mes,getRequestedYear(anio));
					
				break;
				
				case GET_KPI_PRODUCTO:
					
					producto = "";	
					kpi = "";					
					
					//Buscar producto
					if(intent.slots!= undefined && 
						intent.slots.producto!= undefined && 
							intent.slots.producto.value!= undefined)
						producto = filtrarElemento(intent.slots.producto.value.toUpperCase(),ARRAY_PRODUCTOS);
						
					
					//Buscar kpi
					if(intent.slots!= undefined && 
						intent.slots.kpi!= undefined && 
							intent.slots.kpi.value!= undefined)
						kpi = filtrarElemento(intent.slots.kpi.value.toUpperCase().replace("NÚMERO","").replace("DE",""),ARRAY_KPIS);	
						
						
					printTrace("Producto: "	+producto);
					printTrace("KPI: "+kpi);
					
					ULTIMA_FRASE_ENTENDIDA = "VALOR DEL INDICADOR "+kpi+" PARA EL PRODUCTO "+producto;
					ULTIMA_FRASE_ENTENDIDA+= getTextoMes(mes,getRequestedYear(anio));
					
				break;
				
				case GET_KPI_OPERACION:
					
					tipoOperacion = "";	
					kpi = "";					
					
					//Buscar operación
					if(intent.slots!= undefined && 
						intent.slots.operacion!= undefined && 
							intent.slots.operacion.value!= undefined)
						tipoOperacion = filtrarElemento(intent.slots.operacion.value.toUpperCase(),ARRAY_TIPO_OPERACION);
						
					//Buscar kpi
					if(intent.slots!= undefined && 
						intent.slots.kpi!= undefined && 
							intent.slots.kpi.value!= undefined)
						kpi = filtrarElemento(intent.slots.kpi.value.toUpperCase().replace("NÚMERO","").replace("DE",""),ARRAY_KPIS);	
						
						
					printTrace("Operación: "	+tipoOperacion);
					printTrace("KPI: "+kpi);
					
					ULTIMA_FRASE_ENTENDIDA = "VALOR DEL INDICADOR "+kpi+" PARA EL TIPO DE OPERACIÓN "+tipoOperacion;
					ULTIMA_FRASE_ENTENDIDA+= getTextoMes(mes,getRequestedYear(anio));
					
				break;
				
				case GET_KPI_TIPO_CREDITO:
					
					tipoCredito = "";	
					kpi = "";					
					
					//Buscar operación
					if(intent.slots!= undefined && 
						intent.slots.tipoCredito!= undefined && 
							intent.slots.tipoCredito.value!= undefined)
						tipoCredito = filtrarElemento(intent.slots.tipoCredito.value.toUpperCase(),ARRAY_TIPO_CREDITO);
						
					//Buscar kpi
					if(intent.slots!= undefined && 
						intent.slots.kpi!= undefined && 
							intent.slots.kpi.value!= undefined)
						kpi = filtrarElemento(intent.slots.kpi.value.toUpperCase().replace("NÚMERO","").replace("DE",""),ARRAY_KPIS);	
						
						
					printTrace("Tipo Crédito: "	+tipoCredito);
					printTrace("KPI: "+kpi);
					
					ULTIMA_FRASE_ENTENDIDA = "VALOR DEL INDICADOR "+kpi+" PARA EL TIPO DE CRÉDITO "+tipoCredito;
					ULTIMA_FRASE_ENTENDIDA+= getTextoMes(mes,getRequestedYear(anio));
					
				break;
				
				//Pregunta con asistencia para obtener un valor de kpi
				case GET_KPI_NAV:
					
					dimension 		= "";	
					dimensionValor 	= "";	
					kpi 			= "";					
					
					//Buscar kpi
					if(intent.slots!= undefined && 
						intent.slots.kpi!= undefined && 
							intent.slots.kpi.value!= undefined)
						kpi = filtrarElemento(intent.slots.kpi.value.toUpperCase().replace("NÚMERO","").replace("DE",""),ARRAY_KPIS);					
					
					//Buscar tipo de dimensión
					if(intent.slots!= undefined && 
						intent.slots.dimension!= undefined && 
							intent.slots.dimension.value!= undefined){
								
						//Filtrar dimensión solicitada		
						dimension = filtrarElemento(intent.slots.dimension.value.toUpperCase(),ARRAY_DIMENSIONES);

						//Buscar valor de dimensión
						if(intent.slots!= undefined && 
							intent.slots.dimensionValor!= undefined && 
								intent.slots.dimensionValor.value!= undefined){									
							
							
							//Se filtra el valor en función de la dimensión solicitada para usar el array correspondiente
							if(dimension == ATT_TIPO_CREDITO.replace('Simple','')){
								tipoCredito = filtrarElemento(intent.slots.dimensionValor.value.toUpperCase(),ARRAY_TIPO_CREDITO);
								dimensionValor = tipoCredito;
								newIntentCode  = GET_KPI_TIPO_CREDITO;						
							}
							else if(dimension == ATT_TIPO_OPERACION){
								tipoOperacion = filtrarElemento(intent.slots.dimensionValor.value.toUpperCase(),ARRAY_TIPO_OPERACION);
								dimensionValor = tipoOperacion;
								newIntentCode  = GET_KPI_OPERACION;						
							}
							else if(dimension == ATT_PRODUCTO){
								producto = filtrarElemento(intent.slots.dimensionValor.value.toUpperCase(),ARRAY_PRODUCTOS);
								dimensionValor = producto;
								newIntentCode  = GET_KPI_PRODUCTO;						
							}
						
						}
							
					}
						
					printTrace("Dimensión: "		+dimension);
					printTrace("Dimensión Valor: "	+dimensionValor);
					printTrace("KPI: "+kpi);
					
					ULTIMA_FRASE_ENTENDIDA = "VALOR DEL INDICADOR "+kpi+" PARA "+dimension+" "+dimensionValor;
					ULTIMA_FRASE_ENTENDIDA+= getTextoMes(mes,getRequestedYear(anio));
					
				break;	

				//Pregunta para consultar la variación de un indicador
				//con respecto del mes pasado
				case GET_VAR_KPI_PRODUCTO:
				case GET_VAR_KPI_TIPO_CREDITO:
				case GET_VAR_KPI_OPERACION:
				
					
					dimension 		= "";
					dimensionValor 	= "";
					kpi 			= "";
					
					printTrace("Kpi recibido: "	+intent.slots.kpi.value.toUpperCase());
					printTrace("Kpi limpio: "	+intent.slots.kpi.value.toUpperCase().replace("NÚMERO","").replace("DE",""));
					//Buscar kpi
					if(intent.slots!= undefined && 
						intent.slots.kpi!= undefined && 
							intent.slots.kpi.value!= undefined)
						kpi = filtrarElemento(intent.slots.kpi.value.toUpperCase().replace("NÚMERO","").replace("DE",""),ARRAY_KPIS);					
					
					
					//Buscar valor de dimensión
					if(intent.slots!= undefined && 
						intent.slots.valor!= undefined && 
							intent.slots.valor.value!= undefined){									
						
						
						//Se filtra el valor en función de la dimensión solicitada para usar el array correspondiente
						if(petitionType == GET_VAR_KPI_TIPO_CREDITO){
							dimension = " TIPO DE CRÉDITO ";
							tipoCredito = filtrarElemento(intent.slots.valor.value.toUpperCase(),ARRAY_TIPO_CREDITO);
							dimensionValor = tipoCredito;
						}
						else if(petitionType == GET_VAR_KPI_OPERACION){
							dimension = " TIPO DE OPERACIÓN ";
							tipoOperacion = filtrarElemento(intent.slots.valor.value.toUpperCase(),ARRAY_TIPO_OPERACION);
							dimensionValor = tipoOperacion;
						}
						else if(petitionType == GET_VAR_KPI_PRODUCTO){
							dimension = " PRODUCTO ";
							producto = filtrarElemento(intent.slots.valor.value.toUpperCase().replace('PRODUCTO',''),ARRAY_PRODUCTOS);
							dimensionValor = producto;
						}
					
					}							
					
						
					printTrace("KPI: "+kpi);
					
					ULTIMA_FRASE_ENTENDIDA = "VALOR DEL INDICADOR "+kpi+" PARA "+dimension+" "+dimensionValor;
					ULTIMA_FRASE_ENTENDIDA+= getTextoMes(mes,getRequestedYear(anio));
					
				break;
				
				case GET_COLOCACION_REGION:
				
					producto = "";
										
					//Buscar producto
					if(intent.slots!= undefined && 
						intent.slots.producto!= undefined && 
							intent.slots.producto.value!= undefined)
						producto = filtrarElemento(intent.slots.producto.value.toUpperCase(),ARRAY_PRODUCTOS);
						
					printTrace("Producto: "+producto);
					printTrace("Mayor/Menor: "+masmenos);
					
					//Excepción para cuando no viene el mes en la petición de este Intent
					if(!vieneMes) mes = LIT_TODO;
					
					
					ULTIMA_FRASE_ENTENDIDA = "QUÉ REGIÓN PRESENTA "+masmenos+" COLOCACIÓN DEL PRODUCTO "+producto;
					ULTIMA_FRASE_ENTENDIDA+= getTextoMes(mes,getRequestedYear(anio));
					
				break;
				
				case GET_COLOCACION_CLIENTE_PRODUCTO:
				case GET_COLOCACION_CLIENTE_EQUIPO:
				case GET_COLOCACION_CLIENTE_REGION:
				
				
					tipo_colocado_cliente	= "";
					valor_colocado_cliente	= "";			
					texto_frase = "";
					texto_producto = "";
					
					producto 	= getSlotValue(intent,"producto");
					region 		= getSlotValue(intent,"region");
					equipo 		= getSlotValue(intent,"equipo");
					
					//Get Producto -- Siempre viene en la petición
					if(producto!=""){
						producto = filtrarElemento(producto.toUpperCase(),ARRAY_PRODUCTOS);						
						texto_producto = " DEL PRODUCTO "+producto;
					}
					
					//Get Region -- Puede no venir
					if(region!=""){
						region = filtrarElemento(region.toUpperCase(),ARRAY_REGIONES);
						tipo_colocado_cliente = ATT_REGION;
						valor_colocado_cliente = region;
						texto_frase = " DE LA REGIÓN "+region;
					}
					
					//Get Equipo -- Puede no venir
					if(equipo!=""){
						equipo = filtrarElemento(equipo.toUpperCase(),ARRAY_EQUIPOS);
						tipo_colocado_cliente = ATT_EQUIPO;
						valor_colocado_cliente = equipo;
						texto_frase = " DEL EQUIPO "+equipo;
					}
					
					printTrace("Producto: "	+producto);
					printTrace("Equipo: "	+equipo);
					printTrace("Region: "	+region);
						
					ULTIMA_FRASE_ENTENDIDA = "CUÁL ES EL CLIENTE CON MAYOR COLOCACIÓN  "+texto_frase+texto_producto;
					ULTIMA_FRASE_ENTENDIDA+= getTextoMes(mes,getRequestedYear(anio));		
				
				
				break;
				
				case GET_COLOCACION_EQUIPO_REGION:									
				
					texto_producto = "";
					
					producto 	= getSlotValue(intent,"producto");
					region 		= getSlotValue(intent,"region");
										
					//Get Producto
					if(producto!=""){
						producto = filtrarElemento(producto.toUpperCase(),ARRAY_PRODUCTOS);						
						texto_producto = " DEL PRODUCTO "+producto;
					}
					
					//Get Region --
					if(region!=""){
						region = filtrarElemento(region.toUpperCase(),ARRAY_REGIONES);
						tipo_colocado_cliente = ATT_REGION;
						valor_colocado_cliente = region;						
					}
					
					
					
					printTrace("Producto: "	+producto);
					printTrace("Region: "	+region);
						
					ULTIMA_FRASE_ENTENDIDA = " QUÉ EQUIPO DE LA REGIÓN "+region+" TIENE "+masmenos+" COLOCACIÓN  "+texto_producto;
					ULTIMA_FRASE_ENTENDIDA+= getTextoMes(mes,getRequestedYear(anio));		
								
				break;
				
				case GET_COLOCACION_ASESOR:	
				case GET_COLOCACION_EQUIPO:				
				
					texto_producto = "";
					
					producto 	= getSlotValue(intent,"producto");
															
					//Get Producto
					if(producto!=""){
						producto = filtrarElemento(producto.toUpperCase(),ARRAY_PRODUCTOS);						
						texto_producto = " DEL PRODUCTO "+producto;
					}					
										
					
					printTrace("Producto: "	+producto);
											
					ULTIMA_FRASE_ENTENDIDA = " QUÉ "+(petitionType==GET_COLOCACION_ASESOR?"ASESOR":"EQUIPO")+" TIENE "+masmenos+" COLOCACIÓN  "+texto_producto;
					ULTIMA_FRASE_ENTENDIDA+= getTextoMes(mes,getRequestedYear(anio));		
								
				break;
				
				case GET_COLOCACION_ASESOR:	
				case GET_COLOCACION_EQUIPO:				
				
					texto_producto = "";
					
					producto 	= getSlotValue(intent,"producto");
															
					//Get Producto
					if(producto!=""){
						producto = filtrarElemento(producto.toUpperCase(),ARRAY_PRODUCTOS);						
						texto_producto = " DEL PRODUCTO "+producto;
					}					
										
					
					printTrace("Producto: "	+producto);
											
					ULTIMA_FRASE_ENTENDIDA = " QUÉ "+(petitionType==GET_COLOCACION_ASESOR?"ASESOR":"EQUIPO")+" TIENE "+masmenos+" COLOCACIÓN  "+texto_producto;
					ULTIMA_FRASE_ENTENDIDA+= getTextoMes(mes,getRequestedYear(anio));		
								
				break;
				
				case GET_TOP_COLOCACION_ASESOR:	
				
					texto_producto 	= "";
					texto_top 		= "";
					
					producto 	= getSlotValue(intent,"producto");
					top 		= getSlotValue(intent,"top");
					
					//Get Producto
					if(producto!=""){
						producto = filtrarElemento(producto.toUpperCase(),ARRAY_PRODUCTOS);						
						texto_producto = " DEL PRODUCTO "+producto;
					}	

					//Get TOP
					if(top=="")	top = "3";
					
					if(top=="1")	texto_top = " EL ASESOR CON ";
					else			texto_top = " LOS "+top+" ASESORES CON ";
										
					
					printTrace("Producto: "	+producto);
											
					ULTIMA_FRASE_ENTENDIDA = " DIME "+texto_top+masmenos+" COLOCACIÓN  "+texto_producto;
					ULTIMA_FRASE_ENTENDIDA+= getTextoMes(mes,getRequestedYear(anio));		
								
				break;
				
				case GET_TOP_COLOCACION_VS_PRESUPUESTO_EQUIPO:	
				case GET_TOP_COLOCACION_VS_PRESUPUESTO_REGION:
				
					texto_producto = "";
					
					producto 	= getSlotValue(intent,"producto");
															
					//Get Producto
					if(producto!=""){
						producto = filtrarElemento(producto.toUpperCase(),ARRAY_PRODUCTOS);						
						texto_producto = " DEL PRODUCTO "+producto;
					}				
					
					printTrace("Producto: "	+producto);
											
					ULTIMA_FRASE_ENTENDIDA = " QUÉ "+(petitionType==GET_TOP_COLOCACION_VS_PRESUPUESTO_EQUIPO?"EQUIPO":"REGIÓN")+" LLEVA "+masmenos+" AVANCE DE COLOCACIÓN FRENTE A PRESUPUESTO  "+texto_producto;
					ULTIMA_FRASE_ENTENDIDA+= getTextoMes(mes,getRequestedYear(anio));		
								
				break;
				
				default:
				break;
			}
						
			parametros.mes 						= mes;
			parametros.anio 					= anio;
			parametros.producto					= producto;
			parametros.region					= region;
			parametros.equipo					= equipo;
			parametros.tipo_colocado_cliente	= tipo_colocado_cliente;
			parametros.valor_colocado_cliente 	= valor_colocado_cliente;
			parametros.tipoOperacion			= tipoOperacion;
			parametros.tipoCredito				= tipoCredito;
			parametros.kpi						= kpi;
			parametros.newIntentCode			= newIntentCode;
			parametros.lumo						= lumo;
			parametros.masmenos					= masmenos;
			parametros.top						= top;
			
			parametros.error			= error;
			parametros.mensajeError		= mensajeError;
	}
	catch(error){
		
		printTrace("ERROR EXTRAYENDO PARÁMETROS");
		//printTrace(error);	
		parametros.error			= true;	
		
		throw new Error(error);		
	}
	
	return parametros;
}

/**
**	Función encargada del procesamiento de la respuesta en formato JSON y devolución de una estructura preparada
**	parámetros: parámetros de la petición
**	targetCube: ID del cubo destino
**  responseString: respuesta bruta recibida
**	petitionType: tipo de petición.
**	Return: objeto parametros
**/
this.processRequest = function(petitionType, parametros, targetCube, responseString) {		

	var obj ={};
	
	try{				
		printTrace("Entra en makeRequestDataRequest");	

		printTrace("ResponseString: "+responseString);		
				
		if(responseString!=null){
			
			var responseObject = JSON.parse(responseString);
	
			
			var diff_porc=0;
			var diff=0;
			var error = false;			
			var resumen_metricas ={};
			var hayDatos = false;	//Consistencia pregunta aumentos/descensos
			
			
			var metric_valor_actual 		= 0;
			var metric_valor_anterior 		= 0;			
			var metric_colocado 			= 0;
			var metric_presupuesto 			= 0;			
			var metric_colocado_actual 		= 0;
			var metric_presupuesto_actual	= 0;			
			var metric_colocado_anterior 	= 0;
			var metric_presupuesto_anterior	= 0;
			
			var elemento_mayor_colocado 		= "";	//Elemento con mayor colocación 
			var elemento_menor_colocado 		= "";	//Elemento con menor colocación 
			var valor_mayor_colocado 			= 0;	//mayor colocación 
			var valor_menor_colocado 			= 9999999999;	//menor colocación 
			
			var results_top 					= [];	//Array para la ordenación del top
			
			
			try{
				
				//Control cuando no hay datos
				if(responseObject.result!=null && responseObject.result.data.root!=null){
				
					switch(petitionType){							
	
								case GET_RESUMEN_PRODUCTO:
								case GET_RESUMEN_PRODUCTO_X_OPERACION:
								case GET_RESUMEN_PRODUCTO_X_TIPO_CREDITO:

									resumen_metricas[METRIC_CLIENTES] 		= responseObject.result.data.root.metrics[METRIC_CLIENTES].rv;
									resumen_metricas[METRIC_COLOCACION] 	= responseObject.result.data.root.metrics[METRIC_COLOCACION].rv;
									resumen_metricas[METRIC_ANEXOS] 		= responseObject.result.data.root.metrics[METRIC_ANEXOS].rv;
									resumen_metricas[METRIC_PRESUPUESTO] 	= responseObject.result.data.root.metrics[METRIC_PRESUPUESTO].rv;
									
									resumen_metricas[METRIC_COLOCADO_VS_PRESUPUESTO] = (parseInt(resumen_metricas[METRIC_PRESUPUESTO])==0?"100%":(parseInt(resumen_metricas[METRIC_COLOCACION])==0?"0%":number_format((parseInt(resumen_metricas[METRIC_COLOCACION])*100/parseInt(resumen_metricas[METRIC_PRESUPUESTO])),2,'.',',')+"%"));
									
								break;	
								
								case GET_KPI_PRODUCTO:	
								case GET_KPI_OPERACION:	
								case GET_KPI_TIPO_CREDITO:									

									//Si el kpi es Sesiones, se cambia por Anexos
									var kpi_aux = parametros.kpi;									
									if(parametros.kpi == METRIC_SESIONES)	kpi_aux = METRIC_ANEXOS;
									
									if(kpi_aux == METRIC_COLOCADO_VS_PRESUPUESTO)	//Colocado frente a presupuesto
									{
										
										metric_colocado 	= responseObject.result.data.root.metrics[METRIC_COLOCACION].rv;	
										metric_presupuesto 	= responseObject.result.data.root.metrics[METRIC_PRESUPUESTO].rv;	
									
										diff 		= metric_colocado - metric_presupuesto;
										diff_porc	= (metric_presupuesto==0?0:(((metric_colocado*100)/metric_presupuesto)-100).toFixed(2));

										resumen_metricas[METRIC_COLOCADO_VS_PRESUPUESTO] = diff_porc;							
										
									}
									else	//Devolver kpi solicitado sin modificaciones									
										resumen_metricas[kpi_aux] = responseObject.result.data.root.metrics[kpi_aux].rv;
									
								break;	
								
								case GET_VAR_KPI_PRODUCTO:	
								case GET_VAR_KPI_OPERACION:	
								case GET_VAR_KPI_TIPO_CREDITO:									

									//Si el kpi es Sesiones, se cambia por Anexos
									var kpi_aux = parametros.kpi;	
									
									if(parametros.kpi == METRIC_SESIONES)	kpi_aux = METRIC_ANEXOS;
									
									if(kpi_aux == METRIC_COLOCADO_VS_PRESUPUESTO)	//Colocado frente a presupuesto - Necesita lógica especial
									{
										
										metric_colocado_actual 		= responseObject.result.data.root.children[1].metrics[METRIC_COLOCACION].rv;	//Valor Actual
										metric_colocado_anterior 	= responseObject.result.data.root.children[0].metrics[METRIC_COLOCACION].rv;	//Valor mes anterior
										
										metric_presupuesto_actual 	= responseObject.result.data.root.children[1].metrics[METRIC_PRESUPUESTO].rv;	//Valor Actual
										metric_presupuesto_anterior	= responseObject.result.data.root.children[0].metrics[METRIC_PRESUPUESTO].rv;	//Valor mes anterior
																		
										diff_porc_actual	= (metric_presupuesto_actual==0?0:(((metric_colocado_actual*100)/metric_presupuesto_actual)-100).toFixed(2));										
										diff_porc_anterior	= (metric_presupuesto_anterior==0?0:(((metric_colocado_anterior*100)/metric_presupuesto_anterior)-100).toFixed(2));

										parametros.metric_valor_actual 		= diff_porc_actual;	
										parametros.metric_valor_anterior 	= diff_porc_anterior;
										parametros.diff 					= diff_porc_actual - diff_porc_anterior;										
										
									}
									else
									{
																		
										metric_valor_actual 	= responseObject.result.data.root.children[1].metrics[kpi_aux].rv;	//Valor Actual
										metric_valor_anterior 	= responseObject.result.data.root.children[0].metrics[kpi_aux].rv;	//Valor mes anterior
										
										diff 		= metric_valor_actual - metric_valor_anterior;
										diff_porc	= (metric_valor_anterior==0?0:(((metric_valor_actual*100)/metric_valor_anterior)-100).toFixed(2));
										
										parametros.metric_valor_actual 		= metric_valor_actual;
										parametros.metric_valor_anterior 	= metric_valor_anterior;
										parametros.diff_porc 				= diff_porc;
										parametros.diff 					= diff;
									}
									
								break;
								
								case GET_COLOCACION_REGION:								
								case GET_COLOCACION_CLIENTE_PRODUCTO:
								case GET_COLOCACION_CLIENTE_EQUIPO:
								case GET_COLOCACION_CLIENTE_REGION:
								
									for(var i=0; i<responseObject.result.data.root.children.length;i++){
									
										if(responseObject.result.data.root.children[i].metrics[METRIC_COLOCACION].rv > valor_mayor_colocado){
											valor_mayor_colocado 	= responseObject.result.data.root.children[i].metrics[METRIC_COLOCACION].rv;
											if(petitionType == GET_COLOCACION_REGION)
												elemento_mayor_colocado = responseObject.result.data.root.children[i].element.name;
											else	//Se usa la representación Sinónimo
												elemento_mayor_colocado = responseObject.result.data.root.children[i].element.formValues[FORM_SINONIM1_NAME];
										}

										if(responseObject.result.data.root.children[i].metrics[METRIC_COLOCACION].rv < valor_menor_colocado){
											valor_menor_colocado 	= responseObject.result.data.root.children[i].metrics[METRIC_COLOCACION].rv;
											if(petitionType == GET_COLOCACION_REGION)
												elemento_menor_colocado = responseObject.result.data.root.children[i].element.name;
											else	//Se usa la representación Sinónimo
												elemento_menor_colocado = responseObject.result.data.root.children[i].element.formValues[FORM_SINONIM1_NAME];
										}															
								
									}
									
									parametros.valor_mayor_colocado 	= valor_mayor_colocado;
									parametros.elemento_mayor_colocado	= elemento_mayor_colocado;
									
									parametros.valor_menor_colocado		= valor_menor_colocado;
									parametros.elemento_menor_colocado	= elemento_menor_colocado;
									
									
								break;
								
								case GET_COLOCACION_EQUIPO_REGION:
								case GET_COLOCACION_ASESOR:
								case GET_COLOCACION_EQUIPO:
								
								
									for(var i=0; i<responseObject.result.data.root.children.length;i++){
									
										if(responseObject.result.data.root.children[i].metrics[METRIC_COLOCACION].rv > valor_mayor_colocado){
											valor_mayor_colocado 	= responseObject.result.data.root.children[i].metrics[METRIC_COLOCACION].rv;
											if(petitionType!= GET_COLOCACION_ASESOR)
												elemento_mayor_colocado = responseObject.result.data.root.children[i].element.name;
											else
												elemento_mayor_colocado = responseObject.result.data.root.children[i].element.formValues.DESC;
										}

										if(responseObject.result.data.root.children[i].metrics[METRIC_COLOCACION].rv < valor_menor_colocado){
											valor_menor_colocado 	= responseObject.result.data.root.children[i].metrics[METRIC_COLOCACION].rv;
											if(petitionType!= GET_COLOCACION_ASESOR)
												elemento_menor_colocado = responseObject.result.data.root.children[i].element.name;
											else
												elemento_menor_colocado = responseObject.result.data.root.children[i].element.formValues.DESC;
										}															
								
									}
									
									parametros.valor_mayor_colocado 	= valor_mayor_colocado;
									parametros.elemento_mayor_colocado	= elemento_mayor_colocado;
									
									parametros.valor_menor_colocado		= valor_menor_colocado;
									parametros.elemento_menor_colocado	= elemento_menor_colocado;
									
									
								break;
								
								case GET_TOP_COLOCACION_ASESOR:	

									var ordenados;
									results_top = [];
								
									for(var i=0; i<responseObject.result.data.root.children.length;i++){
										
										//printTrace("Guardar Asesor "+responseObject.result.data.root.children[i].element.name);
										
										//Se guardan los resultados en un array
										results_top.push({"name":""+responseObject.result.data.root.children[i].element.formValues.DESC+"","value":""+responseObject.result.data.root.children[i].metrics[METRIC_COLOCACION].rv+""});
																												
								
									}

									//Ordenar array									
									//Ordenar resultados de mayor a menor
									if(results_top.length>0){		
																					
										ordenados=results_top.sort(function(a, b) {
												return parseFloat(b.value) - parseFloat(a.value);
											});											
									}
									
									parametros.top_asesores = ordenados;
									
								break;
								
								case GET_TOP_COLOCACION_VS_PRESUPUESTO_EQUIPO:	
								case GET_TOP_COLOCACION_VS_PRESUPUESTO_REGION:
									
									valor_mayor_colocado 	= "0";
									elemento_mayor_colocado = "";
								
									for(var i=0; i<responseObject.result.data.root.children.length;i++){
										
										metric_colocado 	= responseObject.result.data.root.children[i].metrics[METRIC_COLOCACION].rv;	
										metric_presupuesto 	= responseObject.result.data.root.children[i].metrics[METRIC_PRESUPUESTO].rv;	
									
										diff 		= metric_colocado - metric_presupuesto;
										diff_porc	= (metric_presupuesto==0?0:(((metric_colocado*100)/metric_presupuesto)-100).toFixed(2));
										
									
										if(diff_porc > 0 && diff_porc > valor_mayor_colocado){
											valor_mayor_colocado 	= diff_porc;
											elemento_mayor_colocado = responseObject.result.data.root.children[i].element.name;
										}													
								
									}
									
									parametros.valor_mayor_colocado 	= valor_mayor_colocado;
									parametros.elemento_mayor_colocado	= elemento_mayor_colocado;
									
																		
									printTrace("Equipo: "+elemento_mayor_colocado);
									printTrace("Valor: "+valor_mayor_colocado);
									
									
									
								break;
								
								
								
								default:
								break;
							}
					
										
										
															
					obj.resumen_metricas 		= resumen_metricas;					
					obj.error = false;	
				}
				else	//NO HAY DATOS
				{						
					printTrace("No hay datos");
					obj.error = true;					

				}
			}
			catch(error){				
				obj.error = true;
				printTrace("ERROR EN PROCESS REQUEST");
				throw new Error(error);
			}
			   
			return obj;						

		}
		else	//Error en la obtención de datos
		{
			return null;		
		}
		
	}
	catch(error){
		
		printTrace("ERROR EN PROCESS REQUEST");
		throw new Error(error);
		
	}
			
	return null;	    
}




/**
**	Función encargada del generar el texto que Alexa mostrará por pantalla o hablará
**	webserviceCall: json preparado con los valores limpios
**	petitionType: tipo de petición.
**  para,etros: parámetros de la petición.
**	Return: objeto speechOut{texto,value}
**/
this.procesarRespuesta = function(petitionType,webserviceCall, parametros){	
	
	var speechOutput 	={};
	
	try{
	
		
		var textoMes 		= getTextoMes(parametros.mes,getRequestedYear(parametros.anio));
		var textoLumo 		=(parametros.lumo == LIT_SOLO_LUMO?" filtrado por LUMO ":parametros.lumo == LIT_SIN_LUMO?" sin LUMO ":"");
		
		var textoOperaciones 	= (parametros.tipoOperacion.includes(LIT_TODO) ||
										parametros.tipoOperacion.includes(LIT_TODOS) ||
											parametros.tipoOperacion.includes(LIT_TODAS)?" para todas las operaciones ":" para las operaciones de tipo "+parametros.tipoOperacion);
											
		var textoTipoCredito 	= (parametros.tipoCredito.includes(LIT_TODO) ||
										parametros.tipoCredito.includes(LIT_TODOS) ||
											parametros.tipoCredito.includes(LIT_TODAS)?" para todos los tipos de crédito ":" para tipo de crédito "+parametros.tipoCredito);
		
		var textoProducto 	= (parametros.producto.includes(LIT_TODO) ||
										parametros.producto.includes(LIT_TODOS) ||
											parametros.producto.includes(LIT_TODAS)?" para todos los productos ":" para el producto "+parametros.producto);
		
		var textoRegion 	= (parametros.region.includes(LIT_TODO) ||
										parametros.region.includes(LIT_TODOS) ||
											parametros.region.includes(LIT_TODAS)?" para todos las regiones ":" para la región "+parametros.region);

		
		switch(petitionType){						
							
			case GET_RESUMEN_PRODUCTO:
			case GET_RESUMEN_PRODUCTO_X_OPERACION:
			case GET_RESUMEN_PRODUCTO_X_TIPO_CREDITO:
			
				if(petitionType == GET_RESUMEN_PRODUCTO_X_OPERACION)
					speechOutput.texto ="El resumen de "+parametros.producto+textoOperaciones+textoMes+textoLumo+" es el siguiente. ";					
				else if(petitionType == GET_RESUMEN_PRODUCTO_X_TIPO_CREDITO)
					speechOutput.texto ="El resumen de "+parametros.producto+textoTipoCredito+textoMes+textoLumo+" es. ";					
				else if(petitionType == GET_RESUMEN_PRODUCTO)	
					speechOutput.texto ="El resumen de "+parametros.producto+textoMes+textoLumo+" es el siguiente. ";					
					
				if(!webserviceCall.error){
					
					for (let ele in webserviceCall.resumen_metricas) {
						
						//Si el presupuesto es cero, no se menciona ni presupuesto ni colocado vs presupuesto
						if(ele == METRIC_PRESUPUESTO && webserviceCall.resumen_metricas[ele]==0)	continue;
						else if(ele == METRIC_COLOCADO_VS_PRESUPUESTO && webserviceCall.resumen_metricas[METRIC_PRESUPUESTO]==0)	continue;
						
						if(parametros.producto == LIT_FACTORAJE && ele == METRIC_ANEXOS)
							speechOutput.texto+=" Sesiones, ";
						else
							speechOutput.texto+=" "+ele.replace('$','')+", ";
						
						if(ele!= METRIC_COLOCADO_VS_PRESUPUESTO)
							speechOutput.texto+=number_format(webserviceCall.resumen_metricas[ele],0,'.',',')+". ";
							//speechOutput.texto+=webserviceCall.resumen_metricas[ele] +". ";

						else
							speechOutput.texto+=webserviceCall.resumen_metricas[ele];
													
					}
				}
				else
					speechOutput.texto = MSG_ERROR;		


				printTrace("Respuesta: "+speechOutput.texto);
					
			break;
			
			case GET_KPI_PRODUCTO:
			case GET_KPI_OPERACION:
			case GET_KPI_TIPO_CREDITO:
			
				if(petitionType == GET_KPI_PRODUCTO)
					speechOutput.texto ="El valor de "+
						(parametros.producto== LIT_FACTORAJE && parametros.kpi== METRIC_ANEXOS?"SESIONES":(parametros.producto!= LIT_FACTORAJE && parametros.kpi== METRIC_SESIONES?METRIC_ANEXOS:parametros.kpi.replace('$','')))+" para "+parametros.producto+textoMes+textoLumo+" es ";					
				else if(petitionType == GET_KPI_OPERACION)
					speechOutput.texto ="El valor de "+parametros.kpi.replace('$','')+textoOperaciones+textoMes+textoLumo+" es ";	
				else if(petitionType == GET_KPI_TIPO_CREDITO)
					speechOutput.texto ="El valor de "+parametros.kpi.replace('$','')+textoTipoCredito+textoMes+textoLumo+" es ";
				
					
				if(!webserviceCall.error){	
				
						var kpi_aux = parametros.kpi;
						if(parametros.kpi == METRIC_SESIONES)	kpi_aux = METRIC_ANEXOS;
						
						if(kpi_aux == METRIC_COLOCADO_VS_PRESUPUESTO)
							speechOutput.texto+= number_format(webserviceCall.resumen_metricas[METRIC_COLOCADO_VS_PRESUPUESTO],2,'.',',')+"%";
						
						else
							speechOutput.texto+= number_format(webserviceCall.resumen_metricas[kpi_aux],0,'.',',')+". ";	
						
						//Si el presupuesto es cero, no se menciona ni presupuesto ni colocado vs presupuesto
						if((kpi_aux == METRIC_PRESUPUESTO && webserviceCall.resumen_metricas[kpi_aux]==0) ||
								(kpi_aux == METRIC_COLOCADO_VS_PRESUPUESTO && webserviceCall.resumen_metricas[METRIC_PRESUPUESTO]==0))
									speechOutput.texto= "No hay datos para el indicador solicitado";

												
				}
				else
					speechOutput.texto = MSG_ERROR;		


				printTrace("Respuesta: "+speechOutput.texto);
					
			break;
			
			case GET_VAR_KPI_PRODUCTO:	
			case GET_VAR_KPI_OPERACION:	
			case GET_VAR_KPI_TIPO_CREDITO:									

				var extra ="";
				var kpi_name =(parametros.producto== LIT_FACTORAJE && parametros.kpi== METRIC_ANEXOS?"SESIONES":(parametros.producto!= LIT_FACTORAJE && parametros.kpi== METRIC_SESIONES?METRIC_ANEXOS:parametros.kpi));
				
				
				if(petitionType == GET_VAR_KPI_PRODUCTO)
					extra = " para el producto "+parametros.producto;
				else if(petitionType == GET_VAR_KPI_OPERACION)
					extra = textoOperaciones;	
				else if(petitionType == GET_VAR_KPI_TIPO_CREDITO)
					extra = textoTipoCredito;
				
				if(kpi_name == METRIC_COLOCADO_VS_PRESUPUESTO)	//Colocado frente a presupuesto - Necesita lógica especial
					speechOutput.texto =  "El valor de "+METRIC_COLOCADO_VS_PRESUPUESTO+extra+textoLumo+
											" este mes es de "+number_format((parametros.metric_valor_actual),2,'.',',')+"%"+
											", "+number_format(Math.abs(parametros.diff),0,'.',',')+" puntos "+(parametros.diff<0?' inferior ':' superior ')+
											" al mes pasado, con un valor del "+number_format(parametros.metric_valor_anterior,2,'.')+"%. "; 		
				else	//Indicador normal básico				
					speechOutput.texto =  "El valor para "+kpi_name.replace('$','')+extra+textoLumo+
											" este mes es de "+number_format((parametros.metric_valor_actual),0,'.',',')+
											", un "+(parametros.diff<0?' descenso del ':' incremento del ')+number_format((parametros.diff_porc<0?parametros.diff_porc*-1:parametros.diff_porc),2,'.')+"% con el mes anterior. "; 
		
			break;
			
			case GET_COLOCACION_REGION:
			
				if(parametros.masmenos == LIT_MAYOR)
					speechOutput.texto =" La región con mayor colocación del producto "+parametros.producto+
										textoMes+" es "+parametros.elemento_mayor_colocado+" con un valor de "+number_format(parametros.valor_mayor_colocado,0,'.',',');
				else
					speechOutput.texto =" La región con menor colocación del producto "+parametros.producto+
										textoMes+" es "+parametros.elemento_menor_colocado+" con un valor de "+number_format(parametros.valor_menor_colocado,0,'.',',');
			
			break;			
											
			case GET_COLOCACION_CLIENTE_PRODUCTO:
			
				speechOutput.texto =" El Cliente con "+parametros.masmenos+" colocación "+textoProducto;
					
				if(parametros.masmenos == LIT_MAYOR)
					speechOutput.texto += textoMes+" es "+parametros.elemento_mayor_colocado+" con un valor de "+number_format(parametros.valor_mayor_colocado,0,'.',',');
				else
					speechOutput.texto += textoMes+" es "+parametros.elemento_menor_colocado+" con un valor de "+number_format(parametros.valor_menor_colocado,0,'.',',');
			break;
			
			case GET_COLOCACION_CLIENTE_EQUIPO:
			case GET_COLOCACION_CLIENTE_REGION:
			
				speechOutput.texto =" El Cliente con "+parametros.masmenos+" colocación para "+parametros.tipo_colocado_cliente+" "+parametros.valor_colocado_cliente+", "+textoProducto;
					
				if(parametros.masmenos == LIT_MAYOR)
					speechOutput.texto += textoMes+" es "+parametros.elemento_mayor_colocado+" con un valor de "+number_format(parametros.valor_mayor_colocado,0,'.',',');
				else
					speechOutput.texto += textoMes+" es "+parametros.elemento_menor_colocado+" con un valor de "+number_format(parametros.valor_menor_colocado,0,'.',',');
						
			break;
			
			case GET_COLOCACION_EQUIPO_REGION:
			
			speechOutput.texto =" El Equipo con "+parametros.masmenos+" colocación "+textoRegion+", "+textoProducto;
					
				if(parametros.masmenos == LIT_MAYOR)
					speechOutput.texto += textoMes+" es "+parametros.elemento_mayor_colocado+" con un valor de "+number_format(parametros.valor_mayor_colocado,0,'.',',');
				else
					speechOutput.texto += textoMes+" es "+parametros.elemento_menor_colocado+" con un valor de "+number_format(parametros.valor_menor_colocado,0,'.',',');
				
			
			break;
			
			case GET_COLOCACION_EQUIPO:
			
				speechOutput.texto =" El EQUIPO con "+parametros.masmenos+" colocación "+textoProducto;
					
				if(parametros.masmenos == LIT_MAYOR)
					speechOutput.texto += textoMes+" es "+parametros.elemento_mayor_colocado+" con un valor de "+number_format(parametros.valor_mayor_colocado,0,'.',',');
				else
					speechOutput.texto += textoMes+" es "+parametros.elemento_menor_colocado+" con un valor de "+number_format(parametros.valor_menor_colocado,0,'.',',');
				
			
			break;
			
			case GET_COLOCACION_ASESOR:			
			
				speechOutput.texto =" El ASESOR con "+parametros.masmenos+" colocación "+textoProducto;
					
				if(parametros.masmenos == LIT_MAYOR)
					speechOutput.texto += textoMes+" es "+parametros.elemento_mayor_colocado+" con un valor de "+number_format(parametros.valor_mayor_colocado,0,'.',',');
				else
					speechOutput.texto += textoMes+" es "+parametros.elemento_menor_colocado+" con un valor de "+number_format(parametros.valor_menor_colocado,0,'.',',');
				
			
			break;
			
			case GET_TOP_COLOCACION_ASESOR:
			
				var texto_top 	= "";
				
				//parametros.top_asesores
				if(parametros.top=="1")	texto_top = " EL ASESOR CON "+parametros.masmenos+" colocación "+textoProducto+textoMes+" ES: ";
				else					texto_top = " LOS "+parametros.top+" ASESORES CON "+parametros.masmenos+" colocación "+textoProducto+textoMes+" SON los siguientes: ";
				
				
				for(var i=0; i<parametros.top; i++){
				
						texto_top += parametros.top_asesores[i].name+" con "+number_format(parametros.top_asesores[i].value,0,'.',',')+". ";					
					
				}
				
				speechOutput.texto = texto_top;	
			
			break;
			
			case GET_TOP_COLOCACION_VS_PRESUPUESTO_EQUIPO:
			case GET_TOP_COLOCACION_VS_PRESUPUESTO_REGION:
			
				if(parametros.elemento_mayor_colocado!=""){
			
					speechOutput.texto =(petitionType==GET_TOP_COLOCACION_VS_PRESUPUESTO_EQUIPO?"El EQUIPO":"La REGIÓN")+" con mayor avance de colocación frente a presupuesto "+textoProducto;
						
					speechOutput.texto += textoMes+" es "+parametros.elemento_mayor_colocado+" con un valor del "+number_format(parametros.valor_mayor_colocado,2,'.',',')+"%";
				}
				else
					speechOutput.texto = MSG_NO_HAY_DATOS;
			
			
			break;
				
			default:
					speechOutput.texto = MSG_ERROR;
			break;
		}
	}
	catch(error){
		
		printTrace("ERROR EN PROCESAR RESPUESTA");
		throw new Error(error);
		
	}
			
	return speechOutput.texto;
}

}//Cierre Export