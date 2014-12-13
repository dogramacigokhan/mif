<?php

function get($param, $default)
{
    return isset($_GET[$param]) ? urlencode($_GET[$param]) : $default;
}

?>