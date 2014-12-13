<?php

require_once 'utils.php';

// Api definitions
$imdb_title_api_url = "http://www.imdb.com/xml/find?json=1&q=%s";
$imdb_id_api_url = "http://app.imdb.com/title/maindetails?tconst=%s";

// Parameter definitions
$op_find_movie = get("fm", 0);
$op_find_image = get("fi", 0);


// Find movie info
if ($op_find_movie)
{
    // Allow access control origin for the json data
    header('Access-Control-Allow-Origin: *');

    $title = get("t", 0);
    $id = get("id", 0);

    // Search by title
    if ($title) {

        // Set the header
        $contents = file_get_contents(sprintf($imdb_title_api_url, $title));

        if (strpos($contents,'!DOCTYPE') !== false) {

            // HTML page is returned, get the id from the document
            $pattern = '/tt\d{7}/';
            preg_match($pattern, $contents, $matches);

            if (count($matches) > 0) {
                header('Content-Type: application/json');
                echo json_encode(array('single_tconst' => $matches[0]));
            }
        } else {
            // Json object is returned, print the result
            header('Content-Type: application/json');
            echo $contents;
        }
    }
    // Search by id
    else if ($id)
    {
        $json = file_get_contents(sprintf($imdb_id_api_url, $id));

        header('Content-Type: application/json');
        echo $json;
    }
}
// Find image
else if ($op_find_image)
{
    $id = get("id", 0);
    $w = get("w", 120);
    $h = get("h", 0);

    if ($id)
    {
        $json = file_get_contents(sprintf($imdb_id_api_url, $id));
        $data = json_decode($json);

        try {
            $img_url = $data->data->image->url;
            $resized_img_url = substr_replace($img_url, "SX". $w ."_CR0,0,". $w . ",". $h ."_", count($img_url)-5, 0);

            require_once 'image_process.php';
            trimImage($resized_img_url);
        } catch (Exception $e) {
            // Do nothing.
        }
    }
}

?>