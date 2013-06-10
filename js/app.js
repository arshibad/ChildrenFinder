var cur_bracelet_code = '';
var serverURL = 'http://fatbraindev.somee.com/DeviceGateway.aspx';
var browser  = 'yes';

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
  var html2 = '';
  for(i=0;i<nationality.length;i++){
		//html+='<option value="'+nationality[i][0]+'">'+nationality[i][1]+'</option>';
    if (nationality[i][0]!= undefined){
    html+='<option value="'+nationality[i][0]+'#'+nationality[i][2]+'" data-image="images/flags-pack/flag_'+nationality[i][0].toLowerCase()+'.png" data-imagecss="flag '+nationality[i][0]+'" data-title="'+nationality[i][1]+'"><img src="images/flags-pack/flag_'+nationality[i][0].toLowerCase()+'.png">'+nationality[i][1]+'</option>';
    html2+='<option value="'+nationality[i][2]+'">'+'+'+nationality[i][2]+'</option>';
    }

	}
	 $('#childnation').html(html);
   $('#childnation').selectmenu('refresh');
   $('#childnation').find('option').each(function(index, element){
        if ($(element).attr('data-image') != undefined) {
            $('#childnation-menu').children().eq(index).find('.ui-btn-inner').append('<span class="ui-icon flag"><img src="'+$(element).attr('data-image')+'"></span>');
        }
   })
   
  var html1 = '';
  var html3 = '';
  html3+='<option value=""></option>';
	for(x=0;x<languages.length;x++){
		 html1+='<option value="'+languages[x][0]+'">'+languages[x][1]+'</option>';
     html3+='<option value="'+languages[x][0]+'">'+languages[x][1]+'</option>';
	}
  
  
  $('#parent1phone_ext').html(html2);
  $('#parent2phone_ext').html(html2);
	$('#childlang1').html(html1);
  $('#childlang2').html(html3);
}

function loadnation(val){
  var phArr =val.split("#");
  var ph = phArr[1];
  if($('#parent1phone').val() == ''){
    $('#parent1phone_ext option:selected').attr('selected','');
    $('#parent1phone_ext option:contains("+'+ph+'")').prop('selected', true);
    $('#parent1phone_ext').selectmenu('refresh');
  }
  
  if($('#parent2phone').val() == ''){
    $('#parent2phone_ext option:selected').attr('selected','');
    $('#parent2phone_ext option:contains("+'+ph+'")').prop('selected', true);
    $('#parent2phone_ext').selectmenu('refresh');
  }
  
}


function registerNewBracelet(){
	$.mobile.loading('show');
  var phArr =val.split("#");
  var nationality = phArr[0];
	var sdata = {childname:$('#childname').val(),childsurname:$('#childsurname').val(),childnation:nationality,childlang1:$('#childlang1').val(),childlang2:$('#childlang2').val(),parent1name:$('#parent1name').val(),parent1surname:$('#parent1surname').val(),parent1phone:$('#parent1phone').val(),parent2name:$('#parent2name').val(),parent2surname:$('#parent2surname').val(),parent2phone:$('#parent2phone').val(),accom:$('#accom').val(),allergies:$('#allergies').val(),blood:$('#blood').val(),medical:$('#medical').val(),message:$('#message').val(),deleteafter:""};
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

