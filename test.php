<?php
function curlpost($Url,$parmas){
    
    
    $url = $Url;
    $fields = $parmas;
    
    //url-ify the data for the POST
    $i=0;
    foreach($fields as $key=>$value) {
        if($i != 0){
            $fields_string .= '&';
        }
        $fields_string .= $key.'='.$value;
        $i++;
    }
    //rtrim($fields_string, '&');
    
    
    $fields_string = http_build_query($fields);
    
    //open connection
    $ch = curl_init();
    //echo $url."&".$fields_string;
    //set the url, number of POST vars, POST data
    curl_setopt($ch,CURLOPT_URL, $url);
    curl_setopt($ch,CURLOPT_POST, count($fields));
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION  ,1);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    
    //execute post
    $result = curl_exec($ch);
    
    //close connection
    curl_close($ch);
    return $result;
}

$u = urldecode($_GET['url']);
$callback = $_GET['callback'];
///$_POST['searchType'] = 0;
//$_POST['orderBy'] = 0;
//$_POST['searchPage'] = 1;
    
if($_POST){
    
    $json = curlpost($u,$_POST);
    echo stripslashes($json);exit;
}else{
    $json = file_get_contents($u);
    echo $callback."(".stripslashes($json).")";exit;
}



?>