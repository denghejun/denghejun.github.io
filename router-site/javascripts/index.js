$(document).ready(function(){

    $('#div_setting')
    .mousemove(function(){
        $('#img_setting').attr('src','images/setting_big.png');
    })
    .mouseleave(function(){
        $('#img_setting').attr('src','images/setting_small.png');
    });


 $('#div_wifi')
    .mousemove(function(){
        $('#img_wifi').attr('src','images/wifi_big.png');
    })
    .mouseleave(function(){
        $('#img_wifi').attr('src','images/wifi_small.png');
    });

       $('#div_account')
    .mousemove(function(){
        $('#img_account').attr('src','images/account_big.png');
    })
    .mouseleave(function(){
        $('#img_account').attr('src','images/account_small.png');
    });


   $('#div_search')
    .mousemove(function(){
        $('#img_search').attr('src','images/search_big.png');
    })
    .mouseleave(function(){
        $('#img_search').attr('src','images/search_small.png');
    });

       $('#div_help')
    .mousemove(function(){
        $('#img_help').attr('src','images/help_big.png');
    })
    .mouseleave(function(){
        $('#img_help').attr('src','images/help_small.png');
    });
});