<?php
    $username = "root";
    $password = "";
    $host = "localhost";
    $database="d3-test";
    
    $server = mysql_connect($host, $username, $password);
    $connection = mysql_select_db($database, $server);

    $myquery = "
SELECT `id_GEOCODE_REGION_CODE`, `id_GEOCODE_DIVISION_CODE`, `id_GEOCODE_STATE_CODE`,
    `id_GEOCODE_REGION_LABEL`, `id_GEOCODE_DIVISION_LABEL`, `id_GEOCODE_STATE_LABEL`
    FROM  `geocodes_dict`
";
    $query = mysql_query($myquery);
    
    if ( ! $query ) {
        echo mysql_error();
        die;
    }
    
    $data = array();
    
    for ($x = 0; $x < mysql_num_rows($query); $x++) {
        $data[] = mysql_fetch_assoc($query);
    }
    
    echo json_encode($data);
     
    $fp = fopen('geocodes.json', 'w');
    fwrite($fp, json_encode($data));
    fclose($fp);

    mysql_close($server);
?>