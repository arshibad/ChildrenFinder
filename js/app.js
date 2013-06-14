var cur_bracelet_code = '';
var url = "http://fatbraindev.somee.com/DeviceGateway.aspx";
var website = 'http://fatbraindev.somee.com/';
url = encodeURIComponent(url);

var browser  = 'no';

if(browser == 'yes'){
	var serverURL = 'test.php?callback=callback&url='+url;	
}else{
	var serverURL = url;	
}


var deviceLanguage = '';
var deviceNationality = '';
var selectedBracelet = '';
var selectedBraceletDetails;

$(document).ready(function(){
	createDatabase();
	
	$('.logo').bind('click',function(){
		changepage('home');
	});
	
	$('.readqrcode').bind('click',function(){
		if(browser == 'no'){
			window.plugins.barcodeScanner.scan( function(result) {
					//alert("We got a barcode\n" +"Result: " + result.text + "\n" +"Format: " + result.format + "\n" +"Cancelled: " + result.cancelled);
					getBarCodedetails(result.text);
					
			  }, function(error) {
				 alert("We have not found any valid Qrcode");	
			 });	
		}else{
			getBarCodedetails("");	
		}
	});
	
	
	$('.readqrcode_identify').bind('click',function(){
		if(browser == 'no'){
			window.plugins.barcodeScanner.scan( function(result) {
					//alert("We got a barcode\n" +"Result: " + result.text + "\n" +"Format: " + result.format + "\n" +"Cancelled: " + result.cancelled);
					qrcode_identify(result.text);
					
			  }, function(error) {
				 alert("We have not found any valid Qrcode");	
			 });	
		}else{
			
		}
	});
	
	
	
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
	
	registeredBreacelet();
});

$(document).bind('pageinit', function (event) {
 	i18n.init({ debug: true, resStore: resources }, function () {
        $(".i18n").i18n();
   });
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
	if(surl == ''){
		surl = 'http://www.childrenfinder.com/123456';	
	}
	
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

function enterNumber_identify(){
  $.mobile.loading('show');
  var number = $('#bracelet_numeric_code').val();
  if(number == ''){
    alert("Please enter bracelet number.");
    return false;
  }
  var url = website+number
  window.plugins.childBrowser.showWebPage(url,{ showLocationBar: true });
  $.mobile.loading('hide');
}

function qrcode_identify(url){
	if(surl == ''){
		surl = 'http://www.childrenfinder.com/123456';	
	}
	
	var sUrlArr  = surl.split("/");
	var surllength =  parseInt(sUrlArr.length)-1;
	var laststring = sUrlArr[surllength];
	number = laststring;
	
	var url = website+number
	window.plugins.childBrowser.showWebPage(url,{ showLocationBar: true });
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
							alert("OK, Bracelet activated successfully");
							$.mobile.loading('hide');
							changepage('fillInfo');
							loadnationalityJson('add');
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

function loadnationalityJson(mode){
	var html = '';
  var html2 = '';
  
  for(i=0;i<nationality.length;i++){
		//html+='<option value="'+nationality[i][0]+'">'+nationality[i][1]+'</option>';
    if (typeof(nationality[i][0]) != 'undefined'){
    html+='<option value="'+nationality[i][0]+'#'+nationality[i][2]+'" data-image="images/flags-pack/flag_'+nationality[i][0].toLowerCase()+'.png" data-imagecss="flag '+nationality[i][0]+'" data-title="'+nationality[i][1]+'"><img src="images/flags-pack/flag_'+nationality[i][0].toLowerCase()+'.png">'+nationality[i][1]+'</option>';
    html2+='<option value="'+nationality[i][2]+'">'+'+'+nationality[i][2]+'</option>';
    }

	}
	if(mode == 'add'){
		$('#childnation').html(html);
		$('#childnation').selectmenu('refresh');
		$('#childnation').find('option').each(function(index, element){
				if (typeof($(element).attr('data-image')) != 'undefined') {
					 $('#childnation-menu').children().eq(index).find('.ui-btn-inner').append('<span class="ui-icon flag"><img src="'+$(element).attr('data-image')+'"></span>');
				}
		 });
	}else{
		$('#edit_childnation').html(html);
   
		$('#edit_childnation').selectmenu('refresh');
		
		$('#edit_childnation').find('option').each(function(index, element){
			  if (typeof($(element).attr('data-image')) != 'undefined') {
					$('#edit_childnation-menu').children().eq(index).find('.ui-btn-inner').append('<span class="ui-icon flag"><img src="'+$(element).attr('data-image')+'"></span>');
			  }
		});	
	}
	
	
   
	
  var html1 = '';
  var html3 = '';
  html3+='<option value=""></option>';
	for(x=0;x<languages.length;x++){
		 html1+='<option value="'+languages[x][0]+'">'+languages[x][1]+'</option>';
     html3+='<option value="'+languages[x][0]+'">'+languages[x][1]+'</option>';
	}
  
  if(mode == 'add'){
		$('#parent1phone_ext').html(html2);
		$('#parent2phone_ext').html(html2);
		$('#childlang1').html(html1);
		$('#childlang2').html(html3);
  }else{
		$('#edit_parent1phone_ext').html(html2);
		$('#edit_parent2phone_ext').html(html2);
		
		$('#edit_childlang1').html(html1);
		$('#edit_childlang2').html(html3);
  }
	
	
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

function loadnation_edit(val){
  var phArr =val.split("#");
  var ph = phArr[1];
  if($('#edit_parent1phone').val() == ''){
    $('#edit_parent1phone option:selected').attr('selected','');
    $('#edit_parent1phone option:contains("+'+ph+'")').prop('selected', true);
    $('#edit_parent1phone').selectmenu('refresh');
  }
  
  if($('#edit_parent1phone').val() == ''){
    $('#edit_parent1phone option:selected').attr('selected','');
    $('#edit_parent1phone option:contains("+'+ph+'")').prop('selected', true);
    $('#edit_parent1phone').selectmenu('refresh');
  }
  
}


function registerNewBracelet(){
  $.mobile.loading('show');
  
  var phArr =$('#childnation').val().split("#");
  var nationality = phArr[0];
	var sdata = {childname:$('#childname').val(),childsurname:$('#childsurname').val(),childnation:nationality,childlang1:$('#childlang1').val(),childlang2:$('#childlang2').val(),parent1name:$('#parent1name').val(),parent1surname:$('#parent1surname').val(),parent1phone:$('#parent1phone').val(),parent2name:$('#parent2name').val(),parent2surname:$('#parent2surname').val(),parent2phone:$('#parent2phone').val(),accom:$('#accom').val(),allergies:$('#allergies').val(),blood:$('#blood').val(),medical:$('#medical').val(),message:$('#message').val(),deleteafter:$('#deleteafter').val()};
	sdata = JSON.stringify(sdata);
	console.log(serverURL+"?"+{c:''+cur_bracelet_code+'',op:'upd_data',v:'1',d:sdata});
	$.ajax({
       type: "POST",
       url:serverURL,
       dataType: 'json',
		 data:{c:''+cur_bracelet_code+'',op:'upd_data',v:'1',d:sdata},
       success: function(data) {
						//console.log(data.rc);
						if(data.rc == 0){
							
							$.mobile.loading('hide');
							
							var sql = 'insert into bracelet (cur_bracelet_code,childname,childsurname,childnation,childlang1,childlang2,parent1name,parent1surname,parent1phone,parent2name,parent2surname,parent2phone,accom,allergies,blood,medical,message ,address,deleteafter) VALUES ("'+cur_bracelet_code+'","'+$('#childname').val()+'","'+$('#childsurname').val()+'","'+nationality+'","'+$('#childlang1').val()+'","'+$('#childlang2').val()+'","'+$('#parent1name').val()+'","'+$('#parent1surname').val()+'","'+$('#parent1phone').val()+'","'+$('#parent2name').val()+'","'+$('#parent2surname').val()+'","'+$('#parent2phone').val()+'","'+$('#accom').val()+'","'+$('#allergies').val()+'","'+$('#blood').val()+'","'+$('#medical').val()+'","'+$('#message').val()+'","","'+$('#deleteafter').val()+'")';
							executeQuery(sql,function(results){
								  console.log(results.insertId);
								  alert("OK, message updated successfully");
								  showBraceletDetail(results.insertId);
								  return results;
							},function(error){
								  alert("Error, generic error");
							});
							
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

function showBraceletDetail(id){
	executeQuery('select * from bracelet where id = "'+id+'"',function(results){
	var html = '';
	//console.log("Check Cat >>"+results.rows.length);
	//return false;
		if(results.rows.length > 0){
			for(i=0;i<results.rows.length;i++){
				var x;
				x = results.rows.item(i);
				//console.log(x);
				var cnation = '';
				var cphoneext = '';
				for(i=0;i<nationality.length;i++){
					if(nationality[i][0] == x.childnation){
						cnation = nationality[i][1];
						cphoneext = nationality[i][2];
					}
				}
				
				var clang1 = '';
				var clang2 = '';
				for(i=0;i<languages.length;i++){
					if(languages[i][0] == x.childlang1){
						clang1 = languages[i][1];
					}
					if(languages[i][0] == x.childlang2){
						clang2= languages[i][1];
					}
				}
				
				$('#info_childname').html(x.childname);
				$('#info_childsurname').html(x.childsurname);
				$('#info_childnation').html(cnation);
				$('#info_childlang1').html(clang1);
				$('#info_parent1phone').html('+'+cphoneext+"-"+x.parent1phone);
				$('#info_parent1phone_url').attr('href','tel:'+'+'+cphoneext+"-"+x.parent1phone+'');
				$('#info_parent2phone').html('+'+cphoneext+"-"+x.parent2phone);
				$('#info_parent2phone_url').attr('href','tel:'+'+'+cphoneext+"-"+x.parent2phone+'');
				//$('#info_map').attr(x.childsurname);
				$('#info_accom').html(x.accom);
				$('#info_medical').html(x.medical);
				changepage('Infoview');
			}		 
		}else{
			alert("Bracelet not found!");
			$.mobile.loading('hide');
		}
	},function(error){
		alert("Bracelet not found!");
		$.mobile.loading('hide');
	
	});
			
}

function registeredBreacelet(){
	
	executeQuery('select * from bracelet',function(results){
		var html = '';
		if(results.rows.length > 0){
			for(i=0;i<results.rows.length;i++){
				var x;
				x = results.rows.item(i);
				html+='<a href="javascript:void(0);" onclick="chooseCurrentBracelet('+x.id+');" class="blackhref"><div class="listfields"><div class="label">'+x.childname+'\'s bracelet</div><div class="value"><span>>></span></div></div></a>';
			}
			$('#registered_list').html(html);
			changepage('registeredBracelet');
		}else{
			$.mobile.loading('hide');
			changepage('home');
		}
	},function(error){
		$.mobile.loading('hide');
		changepage('home');
	});
	
}


function chooseCurrentBracelet(id){
	executeQuery('select * from bracelet where id = "'+id+'"',function(results){
	var html = '';
	//console.log("Check Cat >>"+results.rows.length);
	//return false;
		if(results.rows.length > 0){
			for(i=0;i<results.rows.length;i++){
				var x;
				x = results.rows.item(i);
				console.log(x);
				selectedBraceletDetails = x;
				selectedBracelet = x.id;
				changepage('children_finder');	
			}		 
		}else{
			alert("Bracelet not found!");
			$.mobile.loading('hide');
		}
	},function(error){
		alert("Bracelet not found!");
		$.mobile.loading('hide');
		registeredBreacelet();
	});
	
	
	
	
}

function editmessage(){
	
	if(selectedBracelet > 0){
		var message = selectedBraceletDetails.message;
		$('#update_msg_txt').val(message);
		changepage('update_message_main');	
	}else{
		registeredBreacelet();	
	}
}

function updateMessage(){
	$.mobile.loading('show');
	var update_msg_txt = $('#update_msg_txt').val();
	var sdata = {m:update_msg_txt};
	sdata = JSON.stringify(sdata);
	
	$.ajax({
       type: "POST",
       url:serverURL,
       dataType: 'json',
		 data:{c:''+selectedBraceletDetails.cur_bracelet_code+'',op:'upd_msg',v:'1',d:sdata},
       success: function(data) {
						//console.log(data.rc);
						if(data.rc == 0){
							var sql = 'UPDATE bracelet set message="'+update_msg_txt+'" where id = "'+selectedBraceletDetails.id+'"';
							
							executeQuery(sql,function(results){
							var html = '';
							
								if(results.rowsAffected > 0){
									alert("OK, message updated successfully");
									$.mobile.loading('hide');
									changepage('children_finder');
								}else{
									alert("Bracelet not found!");
									$.mobile.loading('hide');
									changepage('children_finder');
								}
							},function(error){
								alert("Bracelet not found!");
								$.mobile.loading('hide');
								changepage('children_finder');
							});
							
							
						}else if(data.rc == 1){
							alert("Error, bracelet code is not valid");
							$.mobile.loading('hide');
							changepage('children_finder');
						}else if(data.rc == 2){
							alert("Error, bracelet password is not valid");
							$.mobile.loading('hide');
							changepage('children_finder');
						}else{
							alert("Error, generic error");
							$.mobile.loading('hide');
							changepage('children_finder');
						}
						
       },
		 error:function(error){
			console.log(error);
			$.mobile.loading('hide');
			changepage('children_finder');
		 }
   });
}


function editposition(){
	
	if(selectedBracelet > 0){
		var update_position_txt = selectedBraceletDetails.address;
		$('#update_position_txt').val(update_position_txt);
		changepage('update_position_main');	
	}else{
		registeredBreacelet();	
	}
}

function updatePosition(){
	$.mobile.loading('show');
	var now = new Date().getTime();
	var update_position_txt = $('#update_position_txt').val();
	var sdata = {addr:update_position_txt,ts:now};
	sdata = JSON.stringify(sdata);
	
	$.ajax({
       type: "POST",
       url:serverURL,
       dataType: 'json',
		 data:{c:''+selectedBraceletDetails.cur_bracelet_code+'',op:'upd_pos',v:'1',d:sdata},
       success: function(data) {
						//console.log(data.rc);
						if(data.rc == 0){
							var sql = 'UPDATE bracelet set address="'+update_position_txt+'" where id = "'+selectedBraceletDetails.id+'"';
							
							executeQuery(sql,function(results){
							var html = '';
							
								if(results.rowsAffected > 0){
									alert("OK, position updated successfully");
									$.mobile.loading('hide');
									changepage('children_finder');
								}else{
									alert("Bracelet not found!");
									$.mobile.loading('hide');
									changepage('children_finder');
								}
							},function(error){
								alert("Bracelet not found!");
								$.mobile.loading('hide');
								changepage('children_finder');
							});
							
							
						}else if(data.rc == 1){
							alert("Error, bracelet code is not valid");
							$.mobile.loading('hide');
							changepage('children_finder');
						}else if(data.rc == 2){
							alert("Error, bracelet password is not valid");
							$.mobile.loading('hide');
							changepage('children_finder');
						}else{
							alert("Error, generic error");
							$.mobile.loading('hide');
							changepage('children_finder');
						}
						
       },
		 error:function(error){
			console.log(error);
			$.mobile.loading('hide');
			changepage('children_finder');
		 }
   });
}

function editDetail(){
	changepage('edit_detail');	
	loadnationalityJson('edit');
	if(selectedBracelet > 0){
		var update_position_txt = selectedBraceletDetails.address;
		$('#edit_bracelet_id').html(selectedBraceletDetails.cur_bracelet_code);
		var x = selectedBraceletDetails;
				var cnation = '';
				var cphoneext = '';
				for(i=0;i<nationality.length;i++){
					if(nationality[i][0] == x.childnation){
						cnation = nationality[i][1];
						cphoneext = nationality[i][2];
					}
				}
				
				var clang1 = '';
				var clang2 = '';
				for(i=0;i<languages.length;i++){
					if(languages[i][0] == x.childlang1){
						clang1 = languages[i][1];
					}
					if(languages[i][0] == x.childlang2){
						clang2= languages[i][1];
					}
				}
				
				$('#edit_parent1phone_ext').selectmenu();
				$('#edit_parent1phone_ext option:selected').attr('selected','');
				$('#edit_parent1phone_ext option:contains("+'+cphoneext+'")').prop('selected', true);
				$('#edit_parent1phone_ext').selectmenu('refresh');
				
				$('#edit_parent2phone_ext').selectmenu();
				$('#edit_parent2phone_ext option:contains("+'+cphoneext+'")').prop('selected', true);
				$('#edit_parent2phone_ext').selectmenu('refresh');
				
				
				$('#edit_childnation').selectmenu();
				$('#edit_childnation option:selected').attr('selected','');
				$("#edit_childnation option[value='"+x.childnation+"#"+cphoneext+"']").prop("selected", true);
				//$('#edit_childnation option:contains("+'+cnation+'")').prop('selected', true);
				$('#edit_childnation').selectmenu('refresh');
				
				$('#edit_childlang1').selectmenu();
				$('#edit_childlang1 option:selected').attr('selected','');
				$("#edit_childlang1 option[value='"+x.childlang1+"']").prop("selected", true);
				$('#edit_childlang1').selectmenu('refresh');
				
				$('#edit_childlang2').selectmenu();
				$('#edit_childlang2 option:selected').attr('selected','');
				$("#edit_childlang2 option[value='"+x.childlang2+"']").prop("selected", true);
				$('#edit_childlang2').selectmenu('refresh');
				
				$('#edit_blood').selectmenu();
				$('#edit_blood option:selected').attr('selected','');
				//$('#edit_blood option:contains("+'+x.blood+'")').prop('selected', true);
				$("#edit_blood option[value='"+x.blood+"']").prop("selected", true);
				$('#edit_blood').selectmenu('refresh');
				
				$('#edit_childname').val(x.childname);
				$('#edit_childsurname').val(x.childsurname);
				//$('#edit_childnation').val(x.childnation);
				//$('#edit_childlang1').val(x.childlang1);
				//$('#edit_childlang2').val(x.childlang2);
				$('#edit_parent1phone').val(x.parent1phone);
				//$('#edit_parent1phone_ext').val(parent1phone_ext);
				$('#edit_parent1name').val(x.parent1name);
				$('#edit_parent1surname').val(x.parent1surname);
				$('#edit_parent2name').val(x.parent2name);
				$('#edit_parent2surname').val(x.parent2surname);
				//$('#edit_parent2phone_ext').val(parent2phone_ext);
				$('#edit_parent2phone').val(x.parent2phone);
				$('#edit_accom').val(x.accom);
				$('#edit_allergies').val(x.allergies);
				
				$('#edit_medical').val(x.medical);
				$('#edit_message').val(x.message);
				$('#edit_deleteafter').val(x.deleteafter);
				
		
	}else{
		registeredBreacelet();	
	}
}

function updateBraceletDetail(){
  $.mobile.loading('show');
  
  var phArr =$('#edit_childnation').val().split("#");
  var nationality = phArr[0];
	var sdata = {childname:$('#edit_childname').val(),childsurname:$('#edit_childsurname').val(),childnation:nationality,childlang1:$('#edit_childlang1').val(),childlang2:$('#edit_childlang2').val(),parent1name:$('#edit_parent1name').val(),parent1surname:$('#edit_parent1surname').val(),parent1phone:$('#edit_parent1phone').val(),parent2name:$('#edit_parent2name').val(),parent2surname:$('#edit_parent2surname').val(),parent2phone:$('#edit_parent2phone').val(),accom:$('#edit_accom').val(),allergies:$('#edit_allergies').val(),blood:$('#edit_blood').val(),medical:$('#edit_medical').val(),message:$('#edit_message').val(),deleteafter:$('#edit_deleteafter').val()};
	sdata = JSON.stringify(sdata);
	console.log(serverURL+"?"+{c:''+selectedBraceletDetails.cur_bracelet_code+'',op:'upd_data',v:'1',d:sdata});
	$.ajax({
       type: "POST",
       url:serverURL,
       dataType: 'json',
		 data:{c:''+selectedBraceletDetails.cur_bracelet_code+'',op:'upd_data',v:'1',d:sdata},
       success: function(data) {
						//console.log(data.rc);
						if(data.rc == 0){
							
							$.mobile.loading('hide');
							
							var sql = 'UPDATE bracelet SET childname="'+$('#edit_childname').val()+'",childsurname="'+$('#edit_childsurname').val()+'",childnation="'+nationality+'",childlang1="'+$('#edit_childlang1').val()+'",childlang2="'+$('#edit_childlang2').val()+'",parent1name="'+$('#edit_parent1name').val()+'",parent1surname="'+$('#edit_parent1surname').val()+'",parent1phone="'+$('#edit_parent1phone').val()+'",parent2name="'+$('#edit_parent2name').val()+'",parent2surname="'+$('#edit_parent2surname').val()+'",parent2phone="'+$('#edit_parent2phone').val()+'",accom="'+$('#edit_accom').val()+'",allergies="'+$('#edit_allergies').val()+'",blood="'+$('#edit_blood').val()+'",medical="'+$('#edit_medical').val()+'",message="'+$('#edit_message').val()+'",deleteafter="'+$('#edit_deleteafter').val()+'" WHERE id="'+selectedBraceletDetails.id+'"';
							executeQuery(sql,function(results){
								  
								  alert("OK, Bracelet updated successfully");
								  registeredBreacelet();	
								  return results;
							},function(error){
								  alert("Error, generic error");
							});
							
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

function deletebraclet(){
	
	if(selectedBracelet > 0){
		$('#delete_bracelet_id').html(selectedBraceletDetails.cur_bracelet_code);
		changepage('deleteBracelet');	
	}else{
		registeredBreacelet();	
	}
}

function deleteBreaceletPermanent(){
	
	$.mobile.loading('show');
	var update_msg_txt = $('#update_msg_txt').val();
	var sdata = {};
	sdata = JSON.stringify(sdata);
	
	$.ajax({
       type: "POST",
       url:serverURL,
       dataType: 'json',
		 data:{c:''+selectedBraceletDetails.cur_bracelet_code+'',op:'del',v:'1',d:sdata},
       success: function(data) {
						//console.log(data.rc);
						if(data.rc == 0){
							var sql = 'DELETE from bracelet WHERE id="'+selectedBraceletDetails.id+'"';
							executeQuery(sql,function(results){
								  
								  alert("OK, Bracelet deleted successfully");
								  registeredBreacelet();	
								  return results;
							},function(error){
								  alert("Error, generic error");
							});
						}else if(data.rc == 1){
							alert("Error, bracelet code is not valid");
							$.mobile.loading('hide');
							changepage('children_finder');
						}else if(data.rc == 2){
							alert("Error, bracelet password is not valid");
							$.mobile.loading('hide');
							changepage('children_finder');
						}else{
							alert("Error, generic error");
							$.mobile.loading('hide');
							changepage('children_finder');
						}
						
       },
		 error:function(error){
			console.log(error);
			$.mobile.loading('hide');
			changepage('children_finder');
		 }
   });
	
	
}