<?PHP
function readCSV($csvFile){
	$file_handle = fopen($csvFile, 'r');
	while (!feof($file_handle) ) {
		$line_of_text[] = fgetcsv($file_handle, 1024);
	}
	fclose($file_handle);
	return $line_of_text;
}


// Set path to CSV file
$csvFile = 'nat.csv';

$csv = readCSV($csvFile);
$num = count($csv);
$far1 = array();
$far2 = array();
 for ($c=1; $c < $num; $c++) {

  if ($csv[$c][3] == 1){
    array_push($far1,$csv[$c]);
  }else{
    array_push($far2,$csv[$c]);
  }
 }
sort($far1);
sort($far2);
$result = array_merge((array)$far1, (array)$far2);
$result = json_encode($result) ;


echo '<pre>';
print_r($result);
echo '</pre>';  exit;
?>