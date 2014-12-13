<?php

function trimImage($imgPath) {
    //load the image
    $img = imagecreatefromjpeg($imgPath);

    //find the size of the borders
    $b_top = 0;
    $b_btm = 0;
    $b_lft = 0;
    $b_rt = 0;

    //top
    for(; $b_top < imagesy($img); ++$b_top) {
        for($x = 0; $x < imagesx($img); ++$x) {
            if(imagecolorat($img, $x, $b_top) != 0xFFFFFF) {
                break 2; //out of the 'top' loop
            }
        }
    }

    //bottom
    for(; $b_btm < imagesy($img); ++$b_btm) {
        for($x = 0; $x < imagesx($img); ++$x) {
            if(imagecolorat($img, $x, imagesy($img) - $b_btm-1) != 0xFFFFFF) {
                break 2; //out of the 'bottom' loop
            }
        }
    }

    //left
    for(; $b_lft < imagesx($img); ++$b_lft) {
        for($y = 0; $y < imagesy($img); ++$y) {
            if(imagecolorat($img, $b_lft, $y) != 0xFFFFFF) {
                break 2; //out of the 'left' loop
            }
        }
    }

    //right
    for(; $b_rt < imagesx($img); ++$b_rt) {
        for($y = 0; $y < imagesy($img); ++$y) {
            if(imagecolorat($img, imagesx($img) - $b_rt-1, $y) != 0xFFFFFF) {
                break 2; //out of the 'right' loop
            }
        }
    }

    //copy the contents, excluding the border
    $newimg = imagecreatetruecolor(
        imagesx($img)-($b_lft+$b_rt), imagesy($img)-($b_top+$b_btm));

    imagecopy($newimg, $img, 0, 0, $b_lft, $b_top, imagesx($newimg), imagesy($newimg));

    //finally, output the image
    header("Content-Type: image/jpeg");
    imagejpeg($newimg);
}

?>