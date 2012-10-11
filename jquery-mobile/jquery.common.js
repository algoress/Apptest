// JavaScript Document

// Wait for Cordova to load
//

var language_root = 'it';
document.addEventListener("deviceready", onDeviceReady, false);


//---------------------------------------------------------------//
//TROVO DATI HOMEPAGE
//
function homepageDB(tx) {
	var outputhome = $('#txt-home');
	var content = $('#home-cont');
	$.ajax({
		url: 'http://test.vision121.it/appPhoneGap/ext/findhome-'+language_root+'.php',
		dataType: 'jsonp',
		jsonp: 'jsoncallback',
		timeout: 5000,
		success: function(data, status){
			//alert("success home");
			
			tx.executeSql('DROP TABLE IF EXISTS THOME');
			tx.executeSql('CREATE TABLE IF NOT EXISTS THOME (id integer primary key, titolo text, immagine text)');
			outputhome.empty();
			$.each(data, function(i,item){
					//alert(this["immagine"]);
					content.css("background-image","http://test.vision121.it/appPhoneGap/_files/immagini/"+this["immagine"]+"");
					//content.css("background-position","center");
					outputhome.append(''+this["titolo"]+'');
					
					tx.executeSql('INSERT INTO THOME (id, titolo,immagine) VALUES ('+this["id"]+', "'+this["titolo"]+'", "'+this["immagine"]+'")');
					
			});
		},
		error: function(){
			//alert("error");
			//CARICO I FILE OFFLINE
			var db = window.openDatabase("EllisMobile", "1.0", "Ellis Mobile", 200000);
			db.transaction(homepageSelect, errorCB);
		}
	});
}
//--------------------------------------------------------------//
// HOMEPAGE SELECT QUERY
//
function homepageSelect(tx) {
	tx.executeSql('SELECT * FROM THOME', [], homepageSelectSuccess, errorCB);
}

function homepageSelectSuccess(tx, results) {
	var outputhome = $('#txt-home');
	var content = $('#home-cont');
	outputhome.empty();
	var len = results.rows.length;
	for (var i=0; i<len; i++){
		
		content.css("background-image","http://test.vision121.it/appPhoneGap/_files/immagini/"+results.rows.item(i).immagine+"");
		content.css("background-position","center");
		outputhome.append(''+this["titolo"]+'');
	}
}

//--------------------------------------------------------------//
// TROVO LA LISTA PRODOTTI
//
function listaProdDB(tx) {
	var output = $('#lista-prod');
	$.ajax({
		url: 'http://test.vision121.it/appPhoneGap/ext/findprod-'+language_root+'.php',
		dataType: 'jsonp',
		jsonp: 'jsoncallback',
		timeout: 5000,
		success: function(data, status){
			//alert("success prod");
			
			tx.executeSql('DROP TABLE IF EXISTS TPRODOTTI');
			tx.executeSql('CREATE TABLE IF NOT EXISTS TPRODOTTI (id integer primary key, nome text, descrizione text, immagine text)');
			output.empty();
			j=1;
			$.each(data, function(i,item){					
					if (j/2 == 0) {
						output.append('<li style="clear:"right;"><img src="http://test.vision121.it/appPhoneGap/_files/immagini/'+this["immagine"]+'" alt="'+this["nome"]+'"  /><br />'+this["nome"]+'</li>');
						j=1;
					} else {
						output.append('<li><img src="http://test.vision121.it/appPhoneGap/_files/immagini/'+this["immagine"]+'" alt="'+this["nome"]+'"  /><br />'+this["nome"]+'</li>');
					}
					j++;
					//var desc = this["descrizione"].substring(0,255);
					var desc = this["descrizione"];
					
					tx.executeSql('INSERT INTO TPRODOTTI (id, nome,immagine,descrizione) VALUES ('+this["id"]+', "'+this["nome"]+'", "'+this["immagine"]+'", "'+desc+'")');
					//tx.executeSql('INSERT INTO DEMO (id, data) VALUES (2, "Second row")');
			});
		},
		error: function(){
			//alert("error");
			output.text('C\'è un errore nel caricamento dei dati.');
				navigator.notification.confirm(
					'Qualcosa non va. Vuoi riprovare?',
					yourCallback,
					'Errore',
					'No,Si'
				);

		}
	});
}

// Query the database
//
function queryDB(tx) {
	tx.executeSql('SELECT * FROM TPRODOTTI', [], querySuccess, errorCB);
}

// Query the success callback
//
function querySuccess(tx, results) {
	var output = $('#lista-prod');
	output.empty();
	var len = results.rows.length;
	j=1;
	for (var i=0; i<len; i++){
		if (j/2 == 0) {
			output.append('<li style="clear:"right;"><img src="http://test.vision121.it/appPhoneGap/_files/immagini/'+results.rows.item(i).immagine+'" alt="'+results.rows.item(i).nome+'"  /><br />'+results.rows.item(i).nome+'</li>');
			j=1;
		} else {
			output.append('<li><img src="http://test.vision121.it/appPhoneGap/_files/immagini/'+results.rows.item(i).immagine+'" alt="'+results.rows.item(i).nome+'"  /><br />'+results.rows.item(i).nome+'</li>');
		}
		j++;
		
	}
}

// Transaction error callback
//
function errorCB(err) {
	console.log("Error processing SQL: "+err.code);
}

// Transaction success callback
//
function successCB() {
	console.log("SQL Process");
}

// Cordova is ready
//
function onDeviceReady() {
	var language = navigator.language.split("-");
	language_root = (language[0]);

	//APRO E CREO DB
	var db = window.openDatabase("EllisMobile", "1.0", "Ellis Mobile", 200000);
	//TROVO DATI HOMEPAGE
	db.transaction(homepageDB, errorCB, successCB);
	
	//TROVO DATI PRODOTTI
	db.transaction(listaProdDB, errorCB, successCB);
	
	//PLUGIN NOTIFICHE PUSH
	//window.plugins.statusBarNotification.notify("Put your title here", "Put your message here");
	
}

function yourCallback(button) {
	if (button == 2) {
		dataRequest();
	} else {
		var db = window.openDatabase("EllisMobile", "1.0", "Ellis Mobile", 200000);
		db.transaction(queryDB, errorCB);
	}
}

// Show a custom alert
//
function showAlert() {
	navigator.notification.alert(
		'You are the winner!',  // message
		'Game Over',            // title
		'Done'                  // buttonName
	);
}


$(document).ready(function(e) {
	//COMPANY
	//
	if (language_root == 'it') {
		$("#cont-company").append("ITALIANO Lorem Ipsum è un testo segnaposto utilizzato nel settore della tipografia e della stampa. Lorem Ipsum è considerato il testo segnaposto standard sin dal sedicesimo secolo, quando un anonimo tipografo prese una cassetta di caratteri e li assemblò per preparare un testo campione. È sopravvissuto non solo a più di cinque secoli, ma anche al passaggio alla videoimpaginazione, pervenendoci sostanzialmente inalterato. Fu reso popolare, negli anni ’60, con la diffusione dei fogli di caratteri trasferibili “Letraset”, che contenevano passaggi del Lorem Ipsum, e più recentemente da software di impaginazione come Aldus PageMaker, che includeva versioni del Lorem Ipsum.");
	} else {
		$("#cont-company").append("ENGLISH Lorem Ipsum è un testo segnaposto utilizzato nel settore della tipografia e della stampa. Lorem Ipsum è considerato il testo segnaposto standard sin dal sedicesimo secolo, quando un anonimo tipografo prese una cassetta di caratteri e li assemblò per preparare un testo campione. È sopravvissuto non solo a più di cinque secoli, ma anche al passaggio alla videoimpaginazione, pervenendoci sostanzialmente inalterato. Fu reso popolare, negli anni ’60, con la diffusione dei fogli di caratteri trasferibili “Letraset”, che contenevano passaggi del Lorem Ipsum, e più recentemente da software di impaginazione come Aldus PageMaker, che includeva versioni del Lorem Ipsum.");
	}
	
	// -------------------------------------------- //
	//ADD COPYRIGHT
    var my_date = new Date();	
    $("#c-copyr").text("Copyright Ellis "+my_date.getFullYear());
	$("#c-copyC").text("Copyright Ellis "+my_date.getFullYear());
	$("#c-copyP").text("Copyright Ellis "+my_date.getFullYear());
});

/*
	

	
	///////////////////////////////////////////////////////////////////////////////
	//trovo dettaglio prod
	function dettProd(idprod) {
	
		$.ajax({
			type: "GET",
			data: {id_prod: idprod},
			url: "http://test.vision121.it/appPhoneGap/ext/dett-prod-"+language_root+".php",
			dataType: "json",
			success: parseDettProd,
			error: function(jqXHR, exception) {
				if (jqXHR.status === 0) {
					alert('Not connect.\n Verify Network.');
				} else if (jqXHR.status == 404) {
					alert('Requested page not found. [404]');
				} else if (jqXHR.status == 500) {
					alert('Internal Server Error [500].');
				} else if (exception === 'parsererror') {
					alert('Requested JSON parse failed.');
				} else if (exception === 'timeout') {
					alert('Time out error.');
				} else if (exception === 'abort') {
					alert('Ajax request aborted.');
				} else {
					alert('Uncaught Error.\n' + jqXHR.responseText);
				}
			}
		});	
	}
	
	function parseDettProd(json) {
		$("#dett-prod").empty();
		if ($(json).length != 0) {
			$(json).each(function(index, element) {
				$('<div id="menu-prod"><a href="javascript:updateArticles();"><< Lista Prodotti</div>').appendTo($('#dett-prod'));
				$('<div id="dett-prod-img"><img src="http://test.vision121.it/appPhoneGap/_files/immagini/'+this["immagine"]+'" alt="'+this["nome"]+'"  /></div><div id="dett-prod-txt"><h2>'+this["nome"]+'</h2>'+this["descrizione"]+'</div>').appendTo($('#dett-prod'));
				//$('#testo').append(this["nome_it"]).trigger("create");
			});
		}
	}*/




