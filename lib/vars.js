/**
**	Conjunto de variables globales del módulo IT
**/
module.exports = function() {


	/**
	 * Variable para la conexión
	 */
	this.RESTServerIP 		= "micro.unifin.com.mx";
	this.RESTServerPort 	= "443";
	this.RESTHttpProtocol 	= "https://";

	this.username			= "alexa";
	this.password 			= "Alexa$Micro";
	this.authToken;											//Token devuelto por el API. Será rellenado tras el login satisfactorio.
	this.sessionCookies;

	this.MstrProjectId 		= "3ECCD70946A37F4446D7CBA6365981FC";	//Project ID
	this.cubeID		 		= "E6B5E9F9408E47B4314AB1A0031E5FAA";	//Cube ID





	//Variable con la definición del cubo
	this.CUBE_DEFINITION	= {};

	/*
	 * Control de entornos
	 */
	this.DES 		= 1;
	this.PRO 		= 2;

	//Element types
	this.METRIC		= 0;
	this.ATTRIBUTE	= 1;

	//Nombres de métricas en el cubo
	this.METRIC_COLOCACION				=	"Colocacion";
	this.METRIC_CLIENTES				=	"Clientes";
	this.METRIC_ANEXOS					=	"Anexos";
	this.METRIC_PRESUPUESTO				=	"$ Presupuesto";
	this.METRIC_COLOCADO_VS_PRESUPUESTO	=	"Colocado sobre Presupuesto";
	this.METRIC_SESIONES				=	"Sesiones";		//Para el producto Factoraje los Anexos son Sesiones

	//Nombres de atributos en el cubo
	this.ATT_MES				= "Mes";			//Ene 2019, Feb 2019...Dic 2019
	this.ATT_ANIO				= "Año";
	this.ATT_PRODUCTO			= "Producto";
	this.ATT_TIPO_CREDITO		= "Tipo Credito Simple";
	this.ATT_TIPO_OPERACION		= "Tipo Operacion";
	this.ATT_BINARIO_LUMO		= "Binario Lumo";
	this.ATT_REGION				= "Region";
	this.ATT_EQUIPO				= "Equipo";
	this.ATT_CLIENTE			= "Persona";
	this.ATT_ASESOR				= "Usuario";

	//Id de los forms
	this.FORM_ID 			= "45C11FA478E745FEA08D781CEA190FE5";
	this.FORM_DESC			= "CCFBE2A5EADB4F50941FB879CCF1721C";
	//Sinónimo para Clientes - Contiene el nombre limpio, sin siglas como S.A.  S.L.  etc
	this.FORM_SINONIM1		= "A3C900214183DD67F6BCBBA6C363AA93";
	this.FORM_SINONIM1_NAME	= "Sinonimo 1";

	/** Variables con los valores de fechas máximas en el cubo **/
	this.max_fecha 				= "202007";
	this.max_mes 				= "07";
	this.max_anio 				= "2020";
	this.max_fecha_anio_anterior= "201907";
	this.max_fecha_mes_anterior = "202006";
	/** Fin fechas máximas **/

	this.ULTIMA_RESPUESTA		= "No tengo nada que decir";	//variable para almacenar la última respuesta
	this.ULTIMA_FRASE_ENTENDIDA	= "No tengo nada que decir";	//variable para almacenar la última frase entendida

	this.UMBRAL_CIFRAS		= 100000000;		//Umbral para acortar cifras numéricas
												//Cualquier valor por encima de este valor se elimina el último millar

	/** Literales específicos **/
	this.LIT_LEASING 		= "LEASING";
	this.LIT_CREDITO_SIMPLE = "CREDITO SIMPLE";
	this.LIT_FACTORAJE 		= "FACTORAJE";
	this.LIT_TODO			= "TODO";
	this.LIT_TODOS			= "TODOS";
	this.LIT_TODAS			= "TODAS";
	this.LIT_SOLO_LUMO		= "SOLO LUMO";
	this.LIT_SIN_LUMO		= "SIN LUMO";
	this.LIT_AMBAS_LUMO		= "AMBAS";


	/** Arrays para almacenar los valores de algunos atributos **/
	this.ARRAY_PRODUCTOS		=[];
	this.ARRAY_TIPO_OPERACION	=[];
	this.ARRAY_TIPO_CREDITO		=[];
	this.ARRAY_REGIONES			=[];
	this.ARRAY_EQUIPOS			=[];
	this.ARRAY_KPIS				=[METRIC_PRESUPUESTO,METRIC_ANEXOS,METRIC_CLIENTES,METRIC_COLOCACION,METRIC_SESIONES,METRIC_COLOCADO_VS_PRESUPUESTO];
	this.ARRAY_DIMENSIONES		=[ATT_PRODUCTO,ATT_TIPO_CREDITO.replace('Simple',''),ATT_TIPO_OPERACION];
	this.ARRAY_LUMO				=[LIT_SOLO_LUMO,LIT_SIN_LUMO,LIT_AMBAS_LUMO];


	/**
	 * Cambiar en función del entrono de ejecución.
	 */
	this.environment = this.PRO;

	if(this.environment == this.DES){

		//Cambiar valores de conexión para pro
		this.RESTServerIP ="env-222671.customer.cloud.microstrategy.com";
		this.RESTServerPort ="443";
		this.RESTHttpProtocol ="https://";

		this.username	= "user";
		this.password 	= "password";

		this.MstrProjectId 					= "B7CA92F04B9FAE8D941C3E9B7E0CD754";
		this.cubeID		 					= "8B638E8211EADBC9F1D90080EF55CAE2";

	}

	//Constant petition TYPES
	this.GET_RESUMEN_PRODUCTO						= "1";
	this.GET_RESUMEN_PRODUCTO_X_OPERACION			= "2";
	this.GET_RESUMEN_PRODUCTO_X_TIPO_CREDITO		= "3";
	this.GET_KPI_PRODUCTO							= "4";
	this.GET_KPI_OPERACION							= "5";
	this.GET_KPI_TIPO_CREDITO						= "6";
	this.GET_KPI_NAV								= "7";
	this.GET_VAR_KPI_PRODUCTO						= "8";
	this.GET_VAR_KPI_TIPO_CREDITO					= "9";
	this.GET_VAR_KPI_OPERACION						= "10";

	//Utterances fase 2
	this.GET_COLOCACION_REGION						= "11";
	this.GET_COLOCACION_CLIENTE_PRODUCTO			= "12";
	this.GET_COLOCACION_CLIENTE_EQUIPO				= "13";
	this.GET_COLOCACION_CLIENTE_REGION				= "14";

	this.GET_COLOCACION_EQUIPO_REGION				= "15";

	this.GET_COLOCACION_ASESOR						= "16";

	this.GET_COLOCACION_EQUIPO						= "17";

	this.GET_TOP_COLOCACION_ASESOR					= "18";

	this.GET_TOP_COLOCACION_VS_PRESUPUESTO_EQUIPO	= "19";

	this.GET_TOP_COLOCACION_VS_PRESUPUESTO_REGION	= "20";



	this.FOLLOW_ASKING							= "95";
	this.GET_FRASE_ENTENDIDA					= "96";
	this.GET_ULTIMA_RESPUESTA					= "97";
	this.IT_SI									= "98";		//Response SI
	this.IT_NO									= "99";		//Response NO

	this.listadoIntents = {
		'GetResumenProducto' : 					GET_RESUMEN_PRODUCTO,
		'GetResumenProductoAnio' : 				GET_RESUMEN_PRODUCTO,
		'GetResumenProductoNav' : 				GET_RESUMEN_PRODUCTO,

		'GetResumenProductoxOperacion' : 		GET_RESUMEN_PRODUCTO_X_OPERACION,
		'GetResumenProductoxOperacionAnio' : 	GET_RESUMEN_PRODUCTO_X_OPERACION,
		'GetResumenProductoxOperacionNav' : 	GET_RESUMEN_PRODUCTO_X_OPERACION,

		'GetResumenProductoxTipoCredito':		GET_RESUMEN_PRODUCTO_X_TIPO_CREDITO,
		'GetResumenProductoxTipoCreditoAnio':	GET_RESUMEN_PRODUCTO_X_TIPO_CREDITO,
		'GetResumenProductoxTipoCreditoNav':	GET_RESUMEN_PRODUCTO_X_TIPO_CREDITO,

		'GetKpiProducto':						GET_KPI_PRODUCTO,
		'GetKpiProductoAnio':					GET_KPI_PRODUCTO,

		'GetKpiTipoOperacion':					GET_KPI_OPERACION,
		'GetKpiTipoOperacionAnio':				GET_KPI_OPERACION,

		'GetKpiTipoCredito':					GET_KPI_TIPO_CREDITO,
		'GetKpiTipoCreditoAnio':				GET_KPI_TIPO_CREDITO,

		'GetKpiNav':							GET_KPI_NAV,

		'GetVariacionKpiProducto':				GET_VAR_KPI_PRODUCTO,
		'GetVariacionKpiTipoCredito':			GET_VAR_KPI_TIPO_CREDITO,
		'GetVariacionKpiOperacion':				GET_VAR_KPI_OPERACION,

		'GetColocadoRegion':					GET_COLOCACION_REGION,
		'GetColocadoRegionAnio':				GET_COLOCACION_REGION,

		'GetColocadoClienteProducto':			GET_COLOCACION_CLIENTE_PRODUCTO,
		'GetColocadoClienteProductoAnio':		GET_COLOCACION_CLIENTE_PRODUCTO,

		'GetColocadoClienteEquipo':				GET_COLOCACION_CLIENTE_EQUIPO,
		'GetColocadoClienteEquipoAnio':			GET_COLOCACION_CLIENTE_EQUIPO,

		'GetColocadoClienteRegion':				GET_COLOCACION_CLIENTE_REGION,
		'GetColocadoClienteRegionAnio':			GET_COLOCACION_CLIENTE_REGION,

		'GetColocacionEquipoRegion':			GET_COLOCACION_EQUIPO_REGION,
		'GetColocacionEquipoRegionAnio':		GET_COLOCACION_EQUIPO_REGION,

		'GetColocacionAsesor':					GET_COLOCACION_ASESOR,
		'GetColocacionAsesorAnio':				GET_COLOCACION_ASESOR,

		'GetColocacionEquipo':					GET_COLOCACION_EQUIPO,
		'GetColocacionEquipoAnio':				GET_COLOCACION_EQUIPO,

		'GetTopAsesoresColocado':				GET_TOP_COLOCACION_ASESOR,
		'GetTopAsesoresColocadoAnio':			GET_TOP_COLOCACION_ASESOR,

		'GetColocadoVsPresupuestoEquipo':		GET_TOP_COLOCACION_VS_PRESUPUESTO_EQUIPO,
		'GetColocadoVsPresupuestoEquipoAnio':	GET_TOP_COLOCACION_VS_PRESUPUESTO_EQUIPO,

		'GetColocadoVsPresupuestoRegion':		GET_TOP_COLOCACION_VS_PRESUPUESTO_REGION,
		'GetColocadoVsPresupuestoRegionAnio':	GET_TOP_COLOCACION_VS_PRESUPUESTO_REGION,

		'FollowAsking':							FOLLOW_ASKING,
		'Repite':								GET_ULTIMA_RESPUESTA,
		'GetFraseEntendida':					GET_FRASE_ENTENDIDA
	};


	//Mensajes varios
	this.MSG_NO_HAY_DATOS 			= 	"No se han encontrado datos para la pregunta solicitada";
	this.MSG_ERROR					=	"No se han encontrado datos";
	this.MSG_DESGLOSE_NO_PERMITIDO 	=   "El desglose solicitado no es posible para la métrica ";
	this.MSG_DE_ACUERDO				=	"De acuerdo.";
	this.MSG_VALE					=	"Vale!";
	this.MSG_ESTPENDO				=	"Estupendo";
	this.MSG_NO_ENTIENDO			=	"Lo siento, no he entendido tu pregunta.";
	this.MSG_ERROR_DIM				= 	"No se ha encontrado la dimensión solicitada.";
	this.MSG_ALGO_MAS				=	"Algo más?";
	this.MSG_SILENCIO				=	"Vale, ya me callo.";
	this.MSG_SEEYOU					= 	"Hasta la próxima!";
	this.MSG_ERROR_CONEXION			=	"Estoy teniendo problemas para conectarme.";
	this.MSG_ERROR_GET_DEF			=	"No se ha podido iniciar el Skill. Inténtelo de nuevo por favor";
	this.MSG_READY					=	"Listo!";
	this.MSG_WELCOME				= 	"Bienvenido";
	this.NOTHING_TO_SAY				= 	"¿Nada que decir?";
	this.MSG_SIN_INCREMENTOS		= "No se han encontrado incrementos";
	this.MSG_SIN_DESCENSOS			= "No se han encontrado descensos";
	this.MSG_ERROR_LEASING			= "Las preguntas por tipo de operación solo son válidas para el tipo de producto "+LIT_LEASING;
	this.MSG_ERROR_CREDITO			= "Las preguntas por tipo de crédito solo son válidas para el tipo de producto "+LIT_CREDITO_SIMPLE;

	//Literales
	this.LIT_NO_CONSTA		= "SIN DESCRIPCI�N";
	this.LIT_DESCONOCIDO	= "DESCONOCIDO";
	this.LIT_QUESTION		= "?";
	this.LIT_PASADO			= "PASADO";
	this.LIT_ANTERIOR		= "ANTERIOR";
	this.LIT_ACTUAL			= "ACTUAL";
	this.LIT_ESTE			= "ESTE";
	this.LIT_MAYOR			= "MAYOR";
	this.LIT_MENOR			= "MENOR";

	//Nombre de meses
	this.MES_ENE			= "ENERO";
	this.MES_FEB			= "FEBRERO";
	this.MES_MAR			= "MARZO";
	this.MES_ABR			= "ABRIL";
	this.MES_MAY			= "MAYO";
	this.MES_JUN			= "JUNIO";
	this.MES_JUL			= "JULIO";
	this.MES_AGO			= "AGOSTO";
	this.MES_SEP			= "SEPTIEMBRE";
	this.MES_OCT			= "OCTUBRE";
	this.MES_NOV			= "NOVIEMBRE";
	this.MES_DIC			= "DICIEMBRE";




	//Control variables
	this.LAST_INTENT	="";
	this.LAST_ORDEN		= this.ORDEN_ASC;
	this.navegacion 	= [];		//Control de la función de navegación
	this.test			= false;		//En producción poner esta variable a false.
	this.DEBUG			= true;		//Para mostrar trazas de log

	//Array de Comunidadde autónomas
	//var lista_ccaa = ["ANDALUCIA", "ARAGON", "ASTURIAS", "CANARIAS","CANTABRIA",""];


	/** Variables relacionadas con el device con pantalla **/

	/** Variables de trabajo **/
	this.supportDisplay 			= false;		//Para determinar si el dispositivo soporta pantalla o no

	this.MSG_WELCOME				= 	"Bienvenido";

	/** Frases del diálogo **/

	// Frases de bienvenida
    this.frases_bienvenida= [
        'Hola!',
        'Que tál!',
        'Bienvenido!',
        'Hola, ¿En qué puedo ayudarte?',
        'Comenzamos!',
        'Hola, dime qué puedo hacer por ti hoy?',
		'Qué gusto de verte!',
		'Qué gusto de verlo!'
    ];

	// Frases de despedida
    this.frases_fin= [
        'Adiós!',
        'Hasta la próxima!',
        'Que tengas un buen día!',
        'Encantada de haberte ayudado!',
        'Me encantó ayudarte!',
        'Hasta pronto!',
        'Nos vemos!',
        'Bye!',
        'Hasta luego!'
    ];

    // Frases de operación completada
    this.frases_hecho= [
        'Okay!',
        'Hecho!',
        'Aquí lo tienes!',
        'Perfecto!',
        'Listo!',
        'Eso está hecho!',
        'Todo tuyo!'
    ];

    // Frases de reprompt
    this.frases_mas= [
        'Algo más?',
        'Nada más?',
        'Otra cosa!?',
        'Necesitas algo más?',
        'Te puedo ayudar otra vez?',
        'Te escucho',
		'Que más necesitas?',
        'Sigo aquí!'
     ];

     // Frases de reprompt
    this.frases_metrica= [
        'No encuentro ese indicador',
        'Esa métrica no la encuentro',
        'No sé dónde encontrar esos datos',
        'No te estoy entendiendo bien'
     ];

     // Frases de reprompt
    this.frases_atributo= [
        'No encuentro ese atributo',
        'Esa dimensión no la encuentro',
        'No sé dónde encontrar esos datos',
        'No te estoy entendiendo bien'
     ];

     // Frases de reprompt
    this.frases_error= [
        'Eso no lo entiendo',
        'Disculpa, no te estoy entendiendo bien',
        'Eso no me suena',
        'Eso no lo sé',
        'No sé qué responder a eso',
        'No puedo responderte eso',
		'Podrías repetir la pregunta?'
     ];

     // Frases de reprompt
    this.sin_datos= [
        'No hay datos para esa pregunta',
        'No he podido encontrar nada para responderte',
        'No se han encontrado datos',
        'La consulta no recupero ningún dato',
        'No pude encontrar una respuesta a esto'
     ];

	 //Texto de ayuda
	 this.texto_ayuda = "Con esta skill puedes preguntar información financiera sobre productos, regiones, equipos, clientes, etcétera. "+
						" Es posible solicitar información sobre un periodo concreto del tiempo, y también obtener resúmenes de indicadores generales. "+
						" Para comenzar puedes preguntar algo como: 'Dame el resumen del producto Leasing este mes'.<break time=\"1s\"/>"+
						"¿Qué te gustaría saber?";


/*
 * Cubo de Bajas por Incapacidad Temporal
 */

	this.CUBE_DEFINITION_AUX={
	  "id": "E6B5E9F9408E47B4314AB1A0031E5FAA",
	  "name": "Cube_vwColocacionVsPresupuesto",
	  "result": {
	    "definition": {
	      "availableObjects": {
	        "metrics": [
	          {
	            "name": "Colocacion",
	            "id": "8D4D0A9241EAFB35BFF3C7818F1F9F39",
	            "type": "Metric"
	          },
	          {
	            "name": "Clientes",
	            "id": "4769C2314F461C7E21582F861322BD61",
	            "type": "Metric"
	          },
	          {
	            "name": "Anexos",
	            "id": "7F3591214CD12484D4821F8FF4D3B93C",
	            "type": "Metric"
	          },
	          {
	            "name": "$ Presupuesto",
	            "id": "0F7FB8AA4C0362E91B452790CDD5BC91",
	            "type": "Metric"
	          },
	          {
	            "name": "$ Presupuesto CS",
	            "id": "9B82808F41A9FD571A2230B7D5DB7D79",
	            "type": "Metric"
	          }
	        ],
	        "attributes": [
	          {
	            "name": "Año",
	            "id": "D602A2364B675F9D2DD626B31744D01E",
	            "type": "Attribute",
	            "forms": [
	              {
	                "id": "45C11FA478E745FEA08D781CEA190FE5",
	                "name": "ID",
	                "dataType": "Real",
	                "baseFormCategory": "ID",
	                "baseFormType": "Number"
	              }
	            ]
	          },
	          {
	            "name": "Mes",
	            "id": "DABCD0694E9415BBC8BC479549DE2128",
	            "type": "Attribute",
	            "forms": [
	              {
	                "id": "CCFBE2A5EADB4F50941FB879CCF1721C",
	                "name": "MES CORTO",
	                "dataType": "Char",
	                "baseFormCategory": "DESC",
	                "baseFormType": "Text"
	              },
	              {
	                "id": "762DECA54ADB5FB205CEA0A0E5907F49",
	                "name": "MES SIN AÑO",
	                "dataType": "Char",
	                "baseFormCategory": "Mes None (2)",
	                "baseFormType": "Text"
	              },
	              {
	                "id": "45C11FA478E745FEA08D781CEA190FE5",
	                "name": "ID",
	                "dataType": "Real",
	                "baseFormCategory": "ID",
	                "baseFormType": "Number"
	              }
	            ]
	          },
	          {
	            "name": "Producto",
	            "id": "7CB146054CEA1F952CEB9C8B26D1246B",
	            "type": "Attribute",
	            "forms": [
	              {
	                "id": "CCFBE2A5EADB4F50941FB879CCF1721C",
	                "name": "DESC",
	                "dataType": "Char",
	                "baseFormCategory": "DESC",
	                "baseFormType": "Text"
	              },
	              {
	                "id": "45C11FA478E745FEA08D781CEA190FE5",
	                "name": "ID",
	                "dataType": "Real",
	                "baseFormCategory": "ID",
	                "baseFormType": "Number"
	              }
	            ]
	          },
	          {
	            "name": "Tipo Credito Simple",
	            "id": "70564FF14BB2F2EEB2C7849500E792D4",
	            "type": "Attribute",
	            "forms": [
	              {
	                "id": "CCFBE2A5EADB4F50941FB879CCF1721C",
	                "name": "DESC",
	                "dataType": "Char",
	                "baseFormCategory": "DESC",
	                "baseFormType": "Text"
	              },
	              {
	                "id": "45C11FA478E745FEA08D781CEA190FE5",
	                "name": "ID",
	                "dataType": "Real",
	                "baseFormCategory": "ID",
	                "baseFormType": "Number"
	              }
	            ]
	          },
	          {
	            "name": "Tipo Operacion",
	            "id": "FC01022A4443B237FDD0BD93CB8A1B07",
	            "type": "Attribute",
	            "forms": [
	              {
	                "id": "CCFBE2A5EADB4F50941FB879CCF1721C",
	                "name": "DESC",
	                "dataType": "Char",
	                "baseFormCategory": "DESC",
	                "baseFormType": "Text"
	              },
	              {
	                "id": "45C11FA478E745FEA08D781CEA190FE5",
	                "name": "ID",
	                "dataType": "Real",
	                "baseFormCategory": "ID",
	                "baseFormType": "Number"
	              }
	            ]
	          },
	          {
	            "name": "Binario Lumo",
	            "id": "6F40B7024FED5948605E2EAA34251CCE",
	            "type": "Attribute",
	            "forms": [
	              {
	                "id": "45C11FA478E745FEA08D781CEA190FE5",
	                "name": "ID",
	                "dataType": "Real",
	                "baseFormCategory": "ID",
	                "baseFormType": "Number"
	              }
	            ]
	          }
	        ]
	      }
	    }
	  }
	}


	if(this.environment == this.PRO){

			this.CUBE_DEFINITION_AUX={
		  "id": "E6B5E9F9408E47B4314AB1A0031E5FAA",
		  "name": "Cube_vwColocacionVsPresupuesto",
		  "result": {
		    "definition": {
		      "availableObjects": {
		        "metrics": [
		          {
		            "name": "Colocacion",
		            "id": "8D4D0A9241EAFB35BFF3C7818F1F9F39",
		            "type": "Metric"
		          },
		          {
		            "name": "Clientes",
		            "id": "4769C2314F461C7E21582F861322BD61",
		            "type": "Metric"
		          },
		          {
		            "name": "Anexos",
		            "id": "7F3591214CD12484D4821F8FF4D3B93C",
		            "type": "Metric"
		          },
		          {
		            "name": "$ Presupuesto",
		            "id": "0F7FB8AA4C0362E91B452790CDD5BC91",
		            "type": "Metric"
		          },
		          {
		            "name": "$ Presupuesto CS",
		            "id": "9B82808F41A9FD571A2230B7D5DB7D79",
		            "type": "Metric"
		          }
		        ],
		        "attributes": [
		          {
		            "name": "Año",
		            "id": "D602A2364B675F9D2DD626B31744D01E",
		            "type": "Attribute",
		            "forms": [
		              {
		                "id": "45C11FA478E745FEA08D781CEA190FE5",
		                "name": "ID",
		                "dataType": "Real",
		                "baseFormCategory": "ID",
		                "baseFormType": "Number"
		              }
		            ]
		          },
		          {
		            "name": "Mes",
		            "id": "DABCD0694E9415BBC8BC479549DE2128",
		            "type": "Attribute",
		            "forms": [
		              {
		                "id": "CCFBE2A5EADB4F50941FB879CCF1721C",
		                "name": "MES CORTO",
		                "dataType": "Char",
		                "baseFormCategory": "DESC",
		                "baseFormType": "Text"
		              },
		              {
		                "id": "762DECA54ADB5FB205CEA0A0E5907F49",
		                "name": "MES SIN AÑO",
		                "dataType": "Char",
		                "baseFormCategory": "Mes None (2)",
		                "baseFormType": "Text"
		              },
		              {
		                "id": "45C11FA478E745FEA08D781CEA190FE5",
		                "name": "ID",
		                "dataType": "Real",
		                "baseFormCategory": "ID",
		                "baseFormType": "Number"
		              }
		            ]
		          },
		          {
		            "name": "Producto",
		            "id": "7CB146054CEA1F952CEB9C8B26D1246B",
		            "type": "Attribute",
		            "forms": [
		              {
		                "id": "CCFBE2A5EADB4F50941FB879CCF1721C",
		                "name": "DESC",
		                "dataType": "Char",
		                "baseFormCategory": "DESC",
		                "baseFormType": "Text"
		              },
		              {
		                "id": "45C11FA478E745FEA08D781CEA190FE5",
		                "name": "ID",
		                "dataType": "Real",
		                "baseFormCategory": "ID",
		                "baseFormType": "Number"
		              }
		            ]
		          },
		          {
		            "name": "Tipo Credito Simple",
		            "id": "70564FF14BB2F2EEB2C7849500E792D4",
		            "type": "Attribute",
		            "forms": [
		              {
		                "id": "CCFBE2A5EADB4F50941FB879CCF1721C",
		                "name": "DESC",
		                "dataType": "Char",
		                "baseFormCategory": "DESC",
		                "baseFormType": "Text"
		              },
		              {
		                "id": "45C11FA478E745FEA08D781CEA190FE5",
		                "name": "ID",
		                "dataType": "Real",
		                "baseFormCategory": "ID",
		                "baseFormType": "Number"
		              }
		            ]
		          },
		          {
		            "name": "Tipo Operacion",
		            "id": "FC01022A4443B237FDD0BD93CB8A1B07",
		            "type": "Attribute",
		            "forms": [
		              {
		                "id": "CCFBE2A5EADB4F50941FB879CCF1721C",
		                "name": "DESC",
		                "dataType": "Char",
		                "baseFormCategory": "DESC",
		                "baseFormType": "Text"
		              },
		              {
		                "id": "45C11FA478E745FEA08D781CEA190FE5",
		                "name": "ID",
		                "dataType": "Real",
		                "baseFormCategory": "ID",
		                "baseFormType": "Number"
		              }
		            ]
		          },
		          {
		            "name": "Binario Lumo",
		            "id": "6F40B7024FED5948605E2EAA34251CCE",
		            "type": "Attribute",
		            "forms": [
		              {
		                "id": "45C11FA478E745FEA08D781CEA190FE5",
		                "name": "ID",
		                "dataType": "Real",
		                "baseFormCategory": "ID",
		                "baseFormType": "Number"
		              }
		            ]
		          }
		        ]
		      }
		    }
		  }
		}
	}

}//Cierre ROOT
