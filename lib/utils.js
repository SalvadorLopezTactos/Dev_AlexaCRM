module.exports = function() { 

	require('./vars')();
	require('./stringSimilarity')();

	/** Generador de frases random **/
	this.getRandomSentence = function(type) {
		
		var frases = [];
		if(type == "fin")
			frases = frases_fin; 
		else if(type == "inicio")
			frases = frases_bienvenida;
		else if(type == "ok")	
			frases = frases_hecho;
		else if(type == "mas")	
			frases = frases_mas;
		else if(type == "metrica")
			frases = frases_metrica;
		else if(type == "atributo")
			frases = frases_atributo;
		else if(type == "region")
			frases = frases_regiones;
		else if(type == "error")
			frases = frases_error;
		else if(type == "sin_datos")
			frases = sin_datos;
		
	    var index= Math.floor(Math.random() * (frases.length));
	    return frases[index];
	}

	/**
		Limpiar array de navegación
	**/
    this.limpiarNavegacion = function() { 
    	
    	printTrace("LIMPIAR NAVEGACIÓN");
    	
		navegacion = []; 
		
    };
    
    /**
		Trazas de log
	**/
	this.printTrace = function(mensaje) { 
		
		if(DEBUG)
			console.log("****************\nTRACE --> "+mensaje+"\n****************");
		
	};
    
   
    /**
     * Función que determina el cubo autilizar
     */
    this.setCubeId = function(petitionType,metricSlot){    	
    	return cubeID;
    }


	/****
	***	Función para limpiar los kpis
	
		this.METRIC_COLOCACION		=	"Colocacion";
		this.METRIC_CLIENTES		=	"Clientes";
		this.METRIC_ANEXOS			=	"Anexos";
		this.METRIC_PRESUPUESTO		=	"$ Presupuesto";
		this.METRIC_PRESUPUESTO_CS	=	"$ Presupuesto CS";
	****/
	this.filtrarKpi = function (kpi){			
		if(kpi == null || kpi == undefined || kpi =="undefined")
			return getDefaultMetric();		//Si la métrica no es reconocida se usa por feceto la métrica clientes
		
		if(kpi.toUpperCase().includes("COLOC"))		
			return METRIC_COLOCACION;
		else if(kpi.toUpperCase().includes("CLI"))		
			return METRIC_CLIENTES;
		else if(kpi.toUpperCase().includes("ANEXO"))		
			return METRIC_ANEXOS;
		else if(kpi.toUpperCase().includes("PRESUPUESTO"))		
			return METRIC_PRESUPUESTO;
		else if(kpi.toUpperCase().includes("PRESUPUESTO") && kpi.toUpperCase().includes("CS"))		
			return METRIC_PRESUPUESTO_CS;
		else	
			return getDefaultMetric();	
	};	
	
	/****
	***	Función para elegir el elemento con mayor correspondencia
	@params
		valor: valor capturado
		ARRAY_ELEMENTOS: array con el listado de valores.
		
		Se usa la función JaroWrinker para comparar lo que entra con todos los elementos identificados.
		El algoritmo puntua de 0 a 1 la similitud de dos cadenas.
		0 - Menor similitus
		1 - Mayor similitud
	****/
	this.filtrarElemento = function (valor,ARRAY_ELEMENTOS){

		printTrace("filtrarElementos para valor: "+valor);
		
		var elegido;
		var max = 0.0;
		var parcial = 0.0;
		
		for(var i=0;i<ARRAY_ELEMENTOS.length;i++){
			
			parcial = JaroWrinker(valor,ARRAY_ELEMENTOS[i].toUpperCase());
			
			//printTrace("Resultado para elemento "+ARRAY_ELEMENTOS[i]);
			
			if(parcial>max){
				max = parcial;
				elegido = ARRAY_ELEMENTOS[i];
				
			}			
		}
		
		return elegido;
		
	};
	
	/**
		Función para devolver el kpi por defecto en caso de no encontrarse
		una coincidencia o un valor en el Intent
	**/
	this.getDefaultMetric = function(){
		return METRIC_CLIENTES;
	}
	
	
	
	/**
	Función para devolver el mensaje del mes. Para evitar problemas con 
	PASADO Y ANTERIOR.
	@params:
		mes: valor del mes.
	**/
	this.getTextoMes = function (mes,anio){		
		
		var textoMes  = mes;		
		
		if(mes.toUpperCase() == LIT_PASADO || mes.toUpperCase() == LIT_ANTERIOR)
			return " en el mes pasado ";		
		else if(mes.toUpperCase() == LIT_ACTUAL || mes.toUpperCase().includes(LIT_ESTE))
			return " en el mes actual ";
		else
			textoMes = " en el mes de "+mes;
		
				
		if((mes.toUpperCase() == LIT_TODO ||  mes.toUpperCase() == LIT_TODOS) && (anio.toUpperCase() == LIT_TODO ||  anio.toUpperCase() == LIT_TODOS))
			return " en toda la historia ";
		else if(anio.toUpperCase() == LIT_TODO ||  anio.toUpperCase() == LIT_TODOS)
			return " en toda la historia ";
		else if(mes.toUpperCase() == LIT_TODO ||  mes.toUpperCase() == LIT_TODOS)
			return " en el año "+anio;		
		else 
			return textoMes+(anio!=null?" del año "+anio:"");	
	};
	
	/**
	Función para devolver el mensaje del mes cuando está almacenado 
	en el array de navegación.
	@params:
	**/
	this.getTextoMesNavegacion = function(){
		
		var texto =" en este mes";
		
		for(i=0;i<navegacion.length;i++){
			
			if(navegacion[i].dim==IT_ATT_MES)
			{
				if(navegacion[i].value.toUpperCase() == LIT_PASADO || navegacion[i].value.toUpperCase() == LIT_ANTERIOR)
					texto =" en el mes pasado ";
				else
					texto =" en el mes de "+navegacion[i].value;
			}	
			
		}
		
		return texto;
	
	};
	
	
	
	/**
	 * Función que busca un elemento dentro del array de navegación.
	 * @params 
	 * 	- newElement {"dim":"","value":""}
	 **/
	this.hasElement = function(element){
		
		var encontrado = -1;
		
		for(var i=0;i<navegacion.length;i++){					
			if(navegacion[i].dim==element.dim){				
				encontrado=i;
			}
		}
		return encontrado;
	}
	
	
	
	/**
	*	Añadir/Actualizar elemento en el array de navegación
	*	Si lo encuentra 	--> Actualiza el valor.
	*	Si no lo encuentra 	--> Añade nuevo elemento al array.
	*	@params 
	* 	- newElement {"dim":"","value":""}
	**/
	this.addDimNavegacion = function(newElement){
		
		printTrace("addDimNavegacion: \nDim"+newElement.dim+"\nValue"+newElement.value);		
	};
	
	

	//Capitalizar palabras
	this.titleCase = function(str) {
		return str
			.toLowerCase()
			.split(' ')
			.map(function(word) {
				return word[0].toUpperCase() + word.substr(1);
			})
			.join(' ');
	};
	
	/**
	**	New function to format numbers
	**
	**/
	this.number_format = function(number,decimals,dec_point,thousands_sep) {
		
		//Reducción de cifras grandes 
		if(number>10000000)	//Más de diez millones
			return Math.trunc(number/1000000)+" millones ";
		else if(number>1000000)	//Más de 1 millón
		{
			return Math.trunc(number/1000)*1000;
		}

		
		
		number  = number*1;//makes sure `number` is numeric value
		var str = number.toFixed(decimals?decimals:0).toString().split('.');
		var parts = [];
		for ( var i=str[0].length; i>0; i-=3 ) {
			parts.unshift(str[0].substring(Math.max(0,i-3),i));
		}
		str[0] = parts.join(thousands_sep?thousands_sep:',');
		
		/*
		printTrace("Valor Original: "+str);
		if(number>UMBRAL_CIFRAS){			
			printTrace("Valor Acortado: "+str.substring(0,str.lastIndexOf('.'))+".000");
		}
		else
			printTrace("No necesita acortar");
		
		return (number>UMBRAL_CIFRAS?str.substring(0,str.lastIndexOf('.'))+".000":str);
		*/
		
		return str.join(dec_point?dec_point:'.');
	};
	
	
	/**
	**	Devuelve el nombre del mes en Castellano.
	**/
	this.getMonthName = function() {
			var d = new Date();
			var month = new Array();
			month[0] = MES_ENE;
			month[1] = MES_FEB;
			month[2] = MES_MAR;
			month[3] = MES_ABR;
			month[4] = MES_MAY;
			month[5] = MES_JUN;
			month[6] = MES_JUL;
			month[7] = MES_AGO;
			month[8] = MES_SEP;
			month[9] = MES_OCT;
			month[10] = MES_NOV;
			month[11] = MES_DIC;
			
			//IMPORTANTE: lo dejo fijo, pero hay que ponerlo dinámico
			if(test)
				return MES_JUL;	
			else
				return month[d.getMonth()];
	};
	
	/**
	**	Devuelve la fecha en formato AAAAMM
	**/
	/**
	**	Devuelve la fecha solicitada en formato AAAAMM
	**/
	this.getRequestedPeriod = function(monthName,anio) {
		
			var num = "01";
			var int_num =1;
			var period ="";
			var pasado = false;
			
			switch(monthName){
				case MES_ENE:
					num ="01";
					int_num=1;
				break;
				case MES_FEB:
					num ="02";
					int_num=2;
				break;
				case MES_MAR:
					num ="03";
					int_num=3;
				break;
				case MES_ABR:
					num ="04";
					int_num=4;
				break;
				case MES_MAY:
					num ="05";
					int_num=5;
				break;
				case MES_JUN:
					num ="06";
					int_num=6;
				break;
				case MES_JUL:
					num ="07";
					int_num=7;
				break;
				case MES_AGO:
					num ="08";
					int_num=8;
				break;
				case MES_SEP:
					num ="09";
					int_num=9;
				break;
				case MES_OCT:
					num ="10";
					int_num=10;
				break;
				case MES_NOV:
					num ="11";
					int_num=11;
				break;
				case MES_DIC:
					num ="12";
					int_num=12;
				break;	
				
				case LIT_ANTERIOR:
				case LIT_PASADO:
					pasado = true;
					return period = max_fecha_mes_anterior;						
				break;
						
				default:
					num = max_fecha.substring(4,6);	//Se obtiene la fecha actual si no se identifica el mes
					int_num=parseInt(num);
				break;
			}
			
			//Incluir el año
			var d = new Date();
			var current_month = d.getMonth()+1;	//Mes Actual
			
			if(anio!=null){	//Se ha capturado un valor de año
				
				if(int_num<10)	month = "0"+int_num;
				else	month = int_num.toString();
				
				if(anio.toUpperCase().includes(LIT_ANTERIOR) || anio.toUpperCase().includes(LIT_PASADO)){					
					period=(parseInt(max_anio)-1).toString() + month;
				}
				else if(anio.toUpperCase().includes(LIT_ACTUAL) || anio.toUpperCase().includes(LIT_ESTE)){					
					period=parseInt(max_anio).toString() + month;
				}
				else{	//Año solicitado
					period = anio + month;
				}				
			}
			else{			
				if(test) current_month=3; 	//BORRAR
				
				if(!pasado){
					if(int_num>parseInt(max_mes)){	//El mes solicitado es mayor que el máximo mes del cubo
													//Se Calcula el mes soicitado pero del año anterior
						
						if(int_num<10)	month = "0"+int_num;
						else	month = int_num.toString();		
						
						period=(parseInt(max_anio)-1).toString() + month;			
						
					}
					else{
						period= max_anio + num;				
					}
				}
			}
			
			return period;
	}
	
	
	
	/**
	**	Obtiene el año solicitado. Tiene en cuenta pasado y anterior.
	*	@params
	*	- anio
	**/
	this.getRequestedYear = function(anio) {
		
			if(anio == null)	
				return max_anio;

			if(anio.toUpperCase().includes(LIT_PASADO) || anio.toUpperCase().includes(LIT_ANTERIOR))				
				return "pasado";
			else if(anio.toUpperCase().includes(LIT_ACTUAL) || anio.toUpperCase().includes(LIT_ESTE))
				return "actual";
			else 
				return anio;
				
	};
	
	/**
	**	Obtener la fecha del mes actual, pero del año anterior.
	**	Se usa la variable "max_fecha" como base
	**/
	this.getPreviousYear = function() {		
		
		var periodo = "202007"
			
		if(!test) 	periodo = max_fecha_anio_anterior;
		
		return periodo;		
			
	};
	
	/**
	**	Función que devuelve el periodo actual en formato AAAAMM
	**	Como ahora se utiliza la variable "max_fecha" para almacenar este valor, la única
	**	operación de esta función es devolver esta variable.
	**	
	**/
	this.getCurrentPeriod = function() {
		
			var periodo = "201906"
			
			if(!test) 	periodo = max_fecha;
			
			return periodo;
	};
	
	/** Función para eliminar acentos
	En el modelo de Afiliación, los nombres de las provincias no llevan acentos.
	Pero Alexa incluye el acento si se necesita. Es necesario eliminarlo para aplicar bien los filtros.
	**/
	this.removeAcutes = function(s){
		var r = s.toLowerCase();
		non_asciis = {'a': '[àáâãäå]', 'ae': 'æ', 'c': 'ç', 'e': '[èéêë]', 'i': '[ìíîï]', 'n': 'ñ', 'o': '[òóôõö]', 'oe': 'œ', 'u': '[ùúûűü]', 'y': '[ýÿ]'};
		for (i in non_asciis) { r = r.replace(new RegExp(non_asciis[i], 'g'), i); }
		return titleCase(r);
	};
	
	/**
		Función para determinar si el dispositivo soporta pantalla
	**/
	this.supportsDisplay = function(handlerInput) {
	  const hasDisplay =
		handlerInput.requestEnvelope.context &&
		handlerInput.requestEnvelope.context.System &&
		handlerInput.requestEnvelope.context.System.device &&
		handlerInput.requestEnvelope.context.System.device.supportedInterfaces &&
		handlerInput.requestEnvelope.context.System.device.supportedInterfaces.Display;
	  return hasDisplay;
	}
	
	/**
	**	Función que determina si es una navegación en función del tipo de petición
	**/
	this.esNavegacion = function (petitionType){
		
		var esNavegacion = false;
		
		return esNavegacion;
		
	}
	
	/*
	Función para extraer la fecha máxima del conjunto de datos.
	Esta fecha se utilizará como filtro en las consultas a los cubos correspondientes.
	@params: respuesta	
	*/
	this.getFechaMaxima = function(responseObject){
		
			printTrace("Respuesta: "+responseObject);
		
			var data = responseObject.result.data.root.children;
			var fecha_maxima = 0;
			var fechaInt = 0;
			
			for(var i=0;i<data.length;i++){
				
				if(parseInt(data[i].element.id.substring(1,7))>fecha_maxima)
					fecha_maxima = parseInt(data[i].element.id.substring(1,7));		
				
			}
			
			return fecha_maxima.toString();	
		
	}
	
	/*
	Función para los distintos productos del conjunto de datos.
	Estos productos se usarán para cotejar con las preguntas del usuario
	@params: productos
	@return: array con el listado de elementos.
	*/
	this.guardarElementos = function(responseObject){		
					
			var data = responseObject.result.data.root.children;
			var ARRAY_ELEMENTOS = [];			
			
			for(var i=0;i<data.length;i++){				
				ARRAY_ELEMENTOS[i] = data[i].element.name;				
			}
			
			return ARRAY_ELEMENTOS;			
	}
	
		/*
	*	Fución para insertar/actualizar valores en el objeto json generado
	*	en el proceso de respuesta.
	*/
	this.insertUpdate	= function(results,oldName,porcentaje,oldValue){
		
		for(var i=0;i<results.length;i++)
		{
			if(results[i].name == oldName)	//Encontrado - Actualizar valores
			{
				results[i].value = porcentaje;
				results[i].oldValue = oldValue;
			}	
			
		}		
	}
	
	/**
		Función para saber si un Intent es procesable
	**/
	this.acceptedIntent = function(intentName){
		
		for (let ele in listadoIntents) {
				
				if(ele == intentName)
					return true;			
		}
		
		return false;
		
	}
	
	//Función para extrater los valores de slot
	this.getSlotValue = function (intent,slotName){
		
		if(intent.slots!= undefined && 
			intent.slots[slotName]!= undefined && 
				intent.slots[slotName].value!= undefined)
			return intent.slots[slotName].value;
			
		return "";		
		
	}
}