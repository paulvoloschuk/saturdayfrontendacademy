<?php

  $Settings = parse_ini_file('settings.ini');

?>
<style>
  @import url('/common/iconfont/flaticon.css');

  #project_header{
    position:<?=$Settings['position'];?>;
    text-align:<?=$Settings['align'];?>;
    padding: 5px 20px;
    width:100vw;
    box-sizing: border-box;
    background:<?=$Settings['background'];?>
  }
  #project_header h2{
    font: 14px Tahoma;
    text-transform: uppercase;
    margin: 0.2em 0;
    font-weight: bold;
    color:<?=$Settings['hcolor'];?>;
  }
  #project_header h1{
    font: 24px Tahoma;
    margin: 0.2em 0;
    font-weight: normal;
  }
  #project_header ul{
    margin:0;
    padding:0;
  }
  #project_header li{
    display: inline;
  }
  #project_header li a{
    display: inline-block;
    text-decoration: none;
    color:<?=$Settings['hcolor'];?>;
    width:2.5em;
    height:2.5em;
    line-height: 2.5em;
    text-align: center;
    border-radius: 50%;
    cursor:pointer;
  }
  #project_header li a:hover{
    background: <?=$Settings['hcolor'];?>;
    color:white;
  }
</style>
<div id="project_header">
  <h2>Project: <?=$Settings['subcaption'];?></h2>
  <h1><?=$Settings['caption'];?></h1>
  <ul>
    <li><a class="flaticon-arrows" onclick="history.back(); return false;"></a></li>
    <li><a class="flaticon-github-big-logo" href="https://github.com/paulvoloschuk/saturdayfrontendacademy/tree/master/homeworkjavascript:history(-1);"></a></li>
    <li><a class="flaticon-interface" href="/"></a></li>
  </ul>
</div>
