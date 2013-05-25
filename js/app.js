var cur_bracelet_code = '';
var serverURL = 'http://fatbraindev.somee.com/DeviceGateway.aspx';
var browser  = 'no';
//var browser  = 'no';
var deviceLanguage = '';
var deviceNationality = '';

$(document).bind('pageinit', function (event) {
 	i18n.init({ debug: true, resStore: resources }, function () {
        $(".i18n").i18n();
    });
	
	$('.readqrcode').bind('click',function(){
		if(browser == 'no'){
			window.plugins.barcodeScanner.scan( function(result) {
					//alert("We got a barcode\n" +"Result: " + result.text + "\n" +"Format: " + result.format + "\n" +"Cancelled: " + result.cancelled);
					getBarCodedetails(result.text);
					
			  }, function(error) {
				 alert("Scanning failed: " + error);
			 });	
		}else{
			getBarCodedetails("");	
		}
	});
	
	loadnationalityJson();
	if(browser == 'no'){
		navigator.globalization.getPreferredLanguage(
			function (language) {
      //alert('language: ' + language.value + '\n');
      },
			function () {
      //alert('Error getting language\n');
      }
		 );
		navigator.globalization.getLocaleName(
			function (locale) {
        //alert('locale: ' + locale.value + '\n');
        },
			function () {
      //alert('Error getting locale\n');
      }
		 );	
	}
  
  
	
	/*$('#submitpassword').on('click',function(){
		console.log("as");
		;
	});*/
});

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ');
    }
};

function getBarCodedetails(surl){
	surl = 'http://www.childrenfinder.com/123456';
	var sUrlArr  = surl.split("/");
	var surllength =  parseInt(sUrlArr.length)-1;
	var laststring = sUrlArr[surllength];
	cur_bracelet_code = laststring;
	changepage('typepassword');
}

function enterNumber(){
  $.mobile.loading('show');
  var number = $('#bracelet_numeric_code').val();
  if(number == ''){
    alert("Please enter bracelet number.");
    return false;
  }
  cur_bracelet_code = number;
  changepage('typepassword');
  $.mobile.loading('hide');
}

function submitpassword(){
	$.mobile.loading('show');
	var password = $('#bracelet_password').val();
	var sdata = {p:password};
	sdata = JSON.stringify(sdata);
	$.ajax({
       type: "POST",
       url:serverURL,
       dataType: 'json',
		 data:{c:''+cur_bracelet_code+'',op:'active',v:'1',d:sdata},
       success: function(data) {
						//console.log(data.rc);
						if(data.rc == 0){
							alert("Bracelet activated successfully");
							$.mobile.loading('hide');
							changepage('fillInfo');	
						}else if(data.rc == 1){
							alert("Error, bracelet code is not valid");
							$.mobile.loading('hide');
						}else if(data.rc == 2){
							alert("Error, bracelet password is not valid");
							$.mobile.loading('hide');
						}else{
							alert("Error, generic error");
							$.mobile.loading('hide');
						}
						
       },
		 error:function(error){
			console.log(error);
			$.mobile.loading('hide');
		 }
       });
}


function initializemap(lat,longt) {  
  changepage("showmap");
  
  var myLatlng = new google.maps.LatLng(lat,longt);
  
  var mapOptions = {
    zoom: 18,
    center: myLatlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  var map = new google.maps.Map(document.getElementById('mapcanvas'), mapOptions);
       
  var marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      title: 'Hello World!'
  });
  setTimeout(function(){
       google.maps.event.trigger(map, 'resize');
       var latLng = marker.getPosition(); // returns LatLng object
       map.setCenter(latLng);
       },1000);
}

function changepage(page){
      $.mobile.changePage( "#"+page)
}

function loadnationalityJson(){
	var html = '';
	for(i=0;i<nationality.length;i++){
		html+='<option value="'+nationality[i]+'">'+nationality[i]+'</option>';
	}
	$('#childnation').html(html);
	
	var html1 = '';
	for (x in languages)
	{
		 html1+='<option value="'+languages[x]+'">'+languages[x]+'</option>';
	}
	$('#childlang1').html(html1);
  $('#childlang2').html(html1);
}


function registerNewBracelet(){
	$.mobile.loading('show');
	var sdata = {childname:$('#childname').val(),childsurname:$('#childsurname').val(),childnation:$('#childnation').val(),childlang1:$('#childlang1').val(),childlang2:$('#childlang2').val(),parent1name:$('#parent1name').val(),parent1surname:$('#parent1surname').val(),parent1phone:$('#parent1phone').val(),parent2name:$('#parent2name').val(),parent2surname:$('#parent2surname').val(),parent2phone:$('#parent2phone').val(),accom:$('#accom').val(),allergies:$('#allergies').val(),blood:$('#blood').val(),medical:$('#medical').val(),message:$('#message').val(),deleteafter:""};
	sdata = JSON.stringify(sdata);
	$.ajax({
       type: "POST",
       url:serverURL,
       dataType: 'json',
		 data:{c:''+cur_bracelet_code+'',op:'upd_data',v:'1',d:sdata},
       success: function(data) {
						//console.log(data.rc);
						if(data.rc == 0){
							alert("OK, message updated successfully");
							$.mobile.loading('hide');
							changepage('Infoview');	
						}else if(data.rc == 1){
							alert("Error, bracelet code is not valid");
							$.mobile.loading('hide');
						}else{
							alert("Error, generic error");
							$.mobile.loading('hide');
						}
						
       },
		 error:function(error){
			console.log(error);
			$.mobile.loading('hide');
		 }
   });
}