const Alexa = require('ask-sdk-core');
/* CONSTANTS */
const skillBuilder = Alexa.SkillBuilders.custom();

// Tokens used when sending the APL directives
const HELLO_WORLD_TOKEN = 'HOME';
const DESGLOSE_GENERO_TOKEN = 'DESGLOSE_GENERO';
/** FIN Templates y data **/

/** Mensajes **/
const welcomeMessage		= 'Bienvenido! Para ver distintas distribuciones solo di: horizontal o vertical ';
const exitSkillMessage 		= 'Adiós';
const repromptOutput 		= 'Qué te gustaría ver?';
var lastIntent = '';
var lastParams;
/** Fin mensajes **/

/** Import de ficheros **/

require('./lib/vars');			//Fichero de variables
require('./lib/mensajes')();	//Fichero de mensajes
require('./lib/utils')();		//Fichero de funciones de utilidad
require('./lib/filters')();		//Fichero de funciones para filtro de datos
require('./lib/process')();		//Fichero de funciones para el procesamiento inical de las peticiones
require('./lib/RestAPI')();		//Fichero de funciones del Rest API

/** Implementación de Handlers **/

/**
	Función de Bienvenida,
	Es el handler disparado al arrancar el skill.
**/
const WelcomeHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;

	printTrace("Requet Type: "+request.type);

    return request.type === 'LaunchRequest'
  },
  //Definida como asíncrona
  async handle(handlerInput) {

	 //const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();		//Used for Dynamic Entities

   let speakOutput = getRandomSentence("inicio");
   let responseBuilder = handlerInput.responseBuilder;

	supportDisplay = supportsDisplay(handlerInput);  	//Comprobar si el dispositivo soporta pantalla


	/**
	**	Lo primero que se hace es obtener la estructura de los cubos de trabajo.
	**/

	//Llamar a Login
	const login = await getSessionRequest();

    console.log("Respuesta de Welcome Login: "+ login);

	if(login){		//Si Login Correcto

		//Get cube definition Afiliaciones
		const responseString = await getCubeDefinition(cubeID);


		if(responseString!=null){
			CUBE_DEFINITION = JSON.parse(responseString);
		}
		else
			CUBE_DEFINITION = CUBE_DEFINITION_AUX;

			printTrace("Cube Definition: "+JSON.stringify(CUBE_DEFINITION));

		//Get Fecha máxima en el cubo
		//Por Ahora se obtiene la fecha del cubo
		{
			//Obtener el ID de las fechas de los cubos
			var attId = getElementId(cubeID,ATTRIBUTE,ATT_MES);
			var postData = {
				"requestedObjects":{"attributes":[{"id":""+attId+""}]}
			};

			printTrace("PostData: "+JSON.stringify(postData));


			const respuesta = await getData(cubeID,JSON.stringify(postData));

			/** Precalculo de fechas **/
			max_fecha 	= getFechaMaxima(JSON.parse(respuesta));
			max_mes 	= max_fecha.substring(4,6);
			max_anio 	= max_fecha.substring(0,4);
			max_fecha_anio_anterior= (parseInt(max_anio)-1).toString() + max_mes;

			//Mes anterior
			var aux_month;
			if(parseInt(max_mes)==1)	//Mes Enero --> Hay que poner diciembre
				 max_fecha_mes_anterior = (parseInt(max_anio)-1).toString() +"12";
			else{
				aux_month = parseInt(max_mes)-1;	//restar uno

				if(aux_month<10)	max_fecha_mes_anterior = max_anio +"0"+aux_month.toString();
				else	max_fecha_mes_anterior = max_anio + aux_month.toString();
			}
			/** Fin Precalculo de fechas **/

			printTrace("MAX_FECHA: "+max_fecha+
			"\nMAX_ANIO: "+max_anio+
			"\nMAX_MES: "+max_mes+
			"\nAÑO_ANTERIOR: "+max_fecha_anio_anterior+
			"\nMES_ANTERIOR: "+max_fecha_mes_anterior);

		}

		//Get Listado de Productos.
		//Se almacenan los productos en un array para después poder machear con las preguntas
		{
			//Obtener el ID de las fechas de los cubos
			attId = getElementId(cubeID,ATTRIBUTE,ATT_PRODUCTO);
			postData = {
				"requestedObjects":{"attributes":[{"id":""+attId+""}]}
			};

			printTrace("PostData: "+JSON.stringify(postData));


			const productos = await getData(cubeID,JSON.stringify(postData));

			//printTrace("Productos: "+JSON.stringify(productos));

			ARRAY_PRODUCTOS = guardarElementos(JSON.parse(productos));
			ARRAY_PRODUCTOS.push(LIT_TODO,LIT_TODOS,LIT_TODAS);

			//print productos
			for(var i=0;i<ARRAY_PRODUCTOS.length;i++){
				printTrace("Producto: "+ARRAY_PRODUCTOS[i]);
			}
		}

		//Get Listado de Tipos de Operación.
		//Se almacenan los tipos de operación en un array para después poder machear con las preguntas
		{
			//Obtener el ID de las fechas de los cubos
			attId = getElementId(cubeID,ATTRIBUTE,ATT_TIPO_OPERACION);
			postData = {
				"requestedObjects":{"attributes":[{"id":""+attId+""}]}
			};

			//printTrace("PostData: "+JSON.stringify(postData));


			const operaciones = await getData(cubeID,JSON.stringify(postData));

			//printTrace("Tipos de Operación: "+JSON.stringify(operaciones));

			ARRAY_TIPO_OPERACION = guardarElementos(JSON.parse(operaciones));
			ARRAY_TIPO_OPERACION.push(LIT_TODO,LIT_TODOS,LIT_TODAS);

			/*print productos
			for(var i=0;i<ARRAY_TIPO_OPERACION.length;i++){
				printTrace("Producto: "+ARRAY_TIPO_OPERACION[i]);
			}*/
		}

		//Get Listado de Tipos de Crédito.
		//Se almacenan los tipos de crédito en un array para después poder machear con las preguntas
		{
			//Obtener el ID de las fechas de los cubos
			attId = getElementId(cubeID,ATTRIBUTE,ATT_TIPO_CREDITO);
			postData = {
				"requestedObjects":{"attributes":[{"id":""+attId+""}]}
			};

			//printTrace("PostData: "+JSON.stringify(postData));


			const tiposCredito = await getData(cubeID,JSON.stringify(postData));

			//printTrace("Tipos de Operación: "+JSON.stringify(tiposCredito));

			ARRAY_TIPO_CREDITO = guardarElementos(JSON.parse(tiposCredito));
			ARRAY_TIPO_CREDITO.push(LIT_TODO,LIT_TODOS,LIT_TODAS);

			/*print productos
			for(var i=0;i<ARRAY_TIPO_CREDITO.length;i++){
				printTrace("Producto: "+ARRAY_TIPO_CREDITO[i]);
			}*/
		}

		//Get Listado de Regiones
		//Se almacenan las regiones en un array para después poder machear con las preguntas
		{
			//Obtener el ID de las fechas de los cubos
			attId = getElementId(cubeID,ATTRIBUTE,ATT_REGION);
			postData = {
				"requestedObjects":{"attributes":[{"id":""+attId+""}]}
			};

			//printTrace("PostData: "+JSON.stringify(postData));


			const regiones = await getData(cubeID,JSON.stringify(postData));

			//printTrace("Regiones: "+JSON.stringify(tiposCredito));

			ARRAY_REGIONES = guardarElementos(JSON.parse(regiones));
			ARRAY_REGIONES.push(LIT_TODO,LIT_TODOS,LIT_TODAS);

			//Añadir Dynamic Entities
			//if(!sessionAttributes['entities'])
			//	sessionAttributes['entities'] = [];

			//for(var i=0;i<ARRAY_REGIONES.length;i++)
			//	sessionAttributes['entities'].push(ARRAY_REGIONES[i]);

			//Añadir variables almacenadas en el array
			/*
			try{
				addDynamicEntities(responseBuilder, 'region', sessionAttributes['entities']);
			}
			catch(err){
				printTrace("error en addDynamicEntities");
			}
			*/

			/*print REGIONES
			for(var i=0;i<ARRAY_REGIONES.length;i++){
				printTrace("Región: "+ARRAY_REGIONES[i]);
			}*/
		}

		//Get Listado de eQUIPOS
		//Se almacenan los elementos en un array para después poder machear con las preguntas
		{
			//Obtener el ID de las fechas de los cubos
			attId = getElementId(cubeID,ATTRIBUTE,ATT_EQUIPO);
			postData = {
				"requestedObjects":{"attributes":[{"id":""+attId+""}]}
			};

			//printTrace("PostData: "+JSON.stringify(postData));


			const equipos = await getData(cubeID,JSON.stringify(postData));

			//printTrace("Tipos de Operación: "+JSON.stringify(tiposCredito));

			ARRAY_EQUIPOS = guardarElementos(JSON.parse(equipos));
			ARRAY_EQUIPOS.push(LIT_TODO,LIT_TODOS,LIT_TODAS);

			/*print REGIONES
			for(var i=0;i<ARRAY_REGIONES.length;i++){
				printTrace("Región: "+ARRAY_REGIONES[i]);
			}*/
		}

		//Logout
		await sessionLogout();


	}
	else{	//Si Login incorrecto se usan valores auxiliares
		CUBE_DEFINITION = CUBE_DEFINITION_AUX;
	}

	//Devolver resultados
	return handlerInput.responseBuilder
		  .speak(speakOutput)
		  .reprompt(getRandomSentence("mas"))
		  .getResponse();
  }
};


/**
	Handler de ayuda
**/
const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' &&
           request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(texto_ayuda)
      .reprompt(getRandomSentence("mas"))
      .getResponse();
  },
};

/**
**	Fin del skill
**/
const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;

    return request.type === 'IntentRequest' && (
      request.intent.name === 'AMAZON.StopIntent' ||
      request.intent.name === 'AMAZON.PauseIntent' ||
      request.intent.name === 'AMAZON.CancelIntent'
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(getRandomSentence("fin"))
	  .withShouldEndSession(true)	//Fin de sesión
      .getResponse();
  },
};

/**
**	Fin de sesión
**/
const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${JSON.stringify(handlerInput.requestEnvelope)}`);
    return handlerInput.responseBuilder.getResponse();
  },
};

/**
	Gestión de errores
**/
const ErrorHandler = {
  canHandle() {
    console.log('Inside ErrorHandler');
    return true;
  },
  handle(handlerInput, error) {
    console.log('Inside ErrorHandler - handle');
    console.log(`Error handled: ${JSON.stringify(error)}`);
    console.log(`Handler Input: ${JSON.stringify(handlerInput)}`);

    return handlerInput.responseBuilder
      .speak(getRandomSentence("error"))
      .reprompt(getRandomSentence("mas"))
      .getResponse();
  },
};
/** FIN de implementaciónde Hhandlers **/

/**	Navegación
**
	Toda navegación comienza con la pregunta número de bajas.
	No es posible empezar una navegación con dos dimensiones(por ejemplo: número de bajas en madrid)
**/

/**
	Handle General encargado de capturar todos los intents custom del skill
**/
const GeneralHandler = {

  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;

    return (
        request.type === 'IntentRequest' && acceptedIntent(request.intent.name)
    );
  },
  async handle(handlerInput) {

	  const responseBuilder = handlerInput.responseBuilder;
	  const request = handlerInput.requestEnvelope.request;
	  const intent = request.intent;
	  var speechOutput = MSG_NO_HAY_DATOS;
	  var parametros;
	  var resultado = {};
	  try{
		  printTrace("Full request: "+JSON.stringify(request.intent));

		  //limpiarNavegacion();
		  petitionType = listadoIntents[request.intent.name];	//Set petition type

		  printTrace("Intent Name: "+request.intent.name);
		  printTrace("PetitionType: "+petitionType);
		  console.log(request.intent.name);
		  console.log(petitionType);

		  if(petitionType!=GET_ULTIMA_RESPUESTA && petitionType!=GET_FRASE_ENTENDIDA){
		  	if(request.intent.name=='FollowAsking'){
		  		parametros = lastParams;
		  	//Set Producto
			  if (request.intent.slots.producto.value != undefined && request.intent.slots.producto.value != "") {
			  parametros.producto = request.intent.slots.producto.value.toUpperCase();
			  }
			  //Set mes
			  if (request.intent.slots.mes.value != undefined && request.intent.slots.mes.value != "") {
			  parametros.mes = request.intent.slots.mes.value;
			  }
			  //Set Anio
			  if (request.intent.slots.anio.value != undefined && request.intent.slots.anio.value != "") {
			  parametros.anio = request.intent.slots.anio.value;
			  }
		  		console.log("Define petitionType");
		  		petitionType = lastIntent;
		  		console.log("Define nuevos parametros, mes y año");
		  		console.log("Producto ",parametros.producto);
		  		console.log("Mes ",parametros.mes);
		  		console.log("Anio ",parametros.anio);
		  		console.log("Ultimo intento",lastIntent);
		  	}else{
		  		lastIntent = petitionType;
				  //Procesar petición para extraer parámetros
				  parametros=extractParams(intent, petitionType);
				  lastParams = parametros;
		  	}
		  	
			  /** Printar parámetros **/
			  printTrace("** Parámetros extraidos **\n"+
							"Mes :"+parametros.mes+"\n"+
							"Anio :"+parametros.anio+"\n"+
							"Producto :"+parametros.producto+"\n"+
							"Operación :"+parametros.tipoOperacion+"\n"+
							"Tipo Crédito :"+parametros.tipoCredito+"\n"+
							"KPI :"+parametros.kpi+"\n"+
							"NewIntentCode :"+parametros.newIntentCode+"\n"+
							"Lumo :"+parametros.lumo+"\n"+
							"Mas Menos :"+parametros.masmenos+"\n");

			  //Si la extracción ha sido correcta
			  if(!parametros.error){

				  //Forzar nuevo Intent para el caso de navegación de KPI
				  if(petitionType == GET_KPI_NAV)
					  petitionType = parametros.newIntentCode;


				  var login = await getSessionRequest();

					console.log("Pregunta Normal: "+ parametros.producto);

					if(login){

						//Obtener el filter a enviar al API
						var postData = getRequestFilter(petitionType,parametros,cubeID);

						console.log("PostData :"+JSON.stringify(postData));

						//Obtener los datos desde el API usando el filtro generado
						var responseString= await getData(cubeID,postData);

						//Procesar los resultados obtenidos del API
						resultado = processRequest(petitionType, parametros, cubeID, responseString);

						console.log("Respuesta final :"+ JSON.stringify(resultado));

						//Generar respuesta hablada
						if(!resultado.error)
							speechOutput = procesarRespuesta(petitionType,resultado, parametros);
						else
							speechOutput = getRandomSentence("sin_datos");

						//Logout
						await sessionLogout();


					}//Login
			  }
			  else	//Errores durante la extracción
			  {
				 speechOutput = parametros.mensajeError;

			  }
		  }
		  else if(petitionType==GET_ULTIMA_RESPUESTA)
				speechOutput = ULTIMA_RESPUESTA;
		  else if(petitionType==GET_FRASE_ENTENDIDA)
			  speechOutput = "Esto fue lo que entendí.<break time=\"1s\"/> "+ULTIMA_FRASE_ENTENDIDA;
	  }
	  catch(error){
	  	console.log('Eror General-catch1');
		  printTrace('' + error.stack);
		  speechOutput = getRandomSentence("sin_datos");
	  }

	  ULTIMA_RESPUESTA = speechOutput;
	  speechOutput = speechOutput;

		return responseBuilder
		  .speak(speechOutput)
		  .reprompt(getRandomSentence("mas"))
		  .getResponse();
  }
}	//Cierre Handle General

/**
**	Fallback Intent para procesar todas aquellas
**	peticiones que no cruzan con los intents.
**/
const FallbackHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;

    return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.FallbackIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(getRandomSentence("error"))
	  .reprompt(getRandomSentence("mas"))
	  .withShouldEndSession(false)	//Fin de sesión
      .getResponse();
  },
};

/**
**	Función para añadir valores dinámicos a un Slot.
**	Esto permite utilizar valores obtenidos desde el REST API.
**/
function addDynamicEntities(responseBuilder, slotType, entities) {
    let updateEntitiesDirective = {
      type: 'Dialog.UpdateDynamicEntities',
      updateBehavior: 'REPLACE',
      types: [
        {
          name: slotType,
          values: [] // we fill this array with the entities below
        }
      ]
    };
    entities.map((entity) => updateEntitiesDirective.types[0].values.push(
        {
            id: entity.replace(/\s/gi, "_"),
            name: {
                value: entity
            }
        }
    ));
    console.log(JSON.stringify(updateEntitiesDirective));
    responseBuilder.addDirective(updateEntitiesDirective);
}


/** Este es el punto de entrada de todas las peticiones
**	Se mira en todas las funciones definidas dentro de addRequestHandlers
**  buscando qué módulo debe responder a la petición.
**/
exports.handler = skillBuilder
  .addRequestHandlers(
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler,
	WelcomeHandler,
	GeneralHandler,
	FallbackHandler
)
//.addErrorHandlers(ErrorHandler)
.withCustomUserAgent('cookbook/display-directive/v1')
.lambda();
