$(document).ready(function() {
    crea_gioco();
    $(document).bind("keydown", function(e){
        switch(e.which) {
            case 37:
                move('l');
                break;
            case 38:
                move('u');
                break;
            case 39:
                move('r');
                break;
            case 40:
                move('d');
                break;
        }
    });
});

// *** VARIABILI DA IMPOSTARE PER IL GIOCATORE *** //

//  VELOCITA DI MOVIMENTO DEL GIOCATORE
    vmg = 5;
//  LARGHEZZA BORDO DI ALBERI
    lba = 3;
//  PROBABILITA DI ALBERI IN MEZZO
    pac = 0.04;

// VARIABILI DI AMBIENTE PER IL GIOCO
walking = false;
min_x = 0;
max_x = 0;
min_y = 0;
max_y = 0;

function crea_gioco() {
    $('body').html('<div id="schermata_di_gioco"></div>');
    $('#schermata_di_gioco').append('<span id="player"></span>');
    crea_alberi();

    // POSIZIONA IL GIOCATORE AL CENTRO DELLO SCHERMO IN ORIZZONTALE
    new_left = (($('#schermata_di_gioco').width())/2)-(($('#player').width())/2);
    $('#player').css('left', new_left+'px');

    // POSIZIONA IL GIOCATORE AL CENTRO DELLO SCHERMO IN VERTICALE
    new_top = (($('#schermata_di_gioco').height())/2)-(($('#player').height())/2);
    $('#player').css('top', new_top+'px');
}

function move(p) {
    coord = p=='r'||p=='l' ? 'left' : 'top';
    pos = $('#player').css(coord);
    pos = pos.substring(0,pos.length-2);
    pos = p=='r'||p=='d' ? parseInt(pos)+(1*vmg) : parseInt(pos)-(1*vmg);
    $('#player').addClass('t100');
    if(coord == 'left') {
        console.log("controllo left "+pos+" "+min_x);
        if(pos < min_x-10)
            pos = min_x-10;
        if(pos > max_x-45)
            pos = max_x-45;
    }else{
        if(pos < min_y-15)
            pos = min_y-15;
        if(pos > max_y-10)
            pos = max_y-10;
    }
    $('#player').css(coord, pos+'px');
    setTimeout(function() {
        $('#player').removeClass('t100');
    }, 105);
    if(!walking)
        animate_walk('w'+p);
}

function animate_walk(dir) {
    walking = true;
    $('#player').css('background-image', "url('img/"+dir+"1.png')");
    setTimeout(function() {
        $('#player').css('background-image', "url('img/"+dir+"2.png')");
    },100);
    setTimeout(function() {
        walking = false;
        $('#player').css('background-image', "url('img/"+dir+"0.png')");
    }, 150);
}

function crea_alberi() {
    $('#schermata_di_gioco').append('<span id="albero" style="top:0px;left:0px;"></span>');
    tw = $('#albero').width();
    min_x = tw;
    max_x = $('#schermata_di_gioco').width()-tw;
    th = $('#albero').height();
    min_y = th;
    max_y = $('#schermata_di_gioco').height()-th;
    th = th*0.7;
    nr = Math.floor($('#schermata_di_gioco').height()/th);
    nc = Math.floor($('#schermata_di_gioco').width()/tw);
    $('#albero').remove();
    probabilita_albero = 0;
    for(i=0;i<nc;i++) {
        for(j=0;j<nr;j++) {
            style='top:'+j*th+'px;left:'+i*tw+'px;';
            if(j==0)
                style+='z-index:9999;';
            if(
                Math.random() < 1-(j/lba) ||
                Math.random() < 1-(i/lba) ||
                Math.random() < 1-((nr-j-1)/lba) ||
                Math.random() < 1-((nc-i-1)/lba) ||
                Math.random() < pac
            )
                $('#schermata_di_gioco').append('<span id="albero" style="'+style+'"></span>');
        }
    }
    $('#schermata_di_gioco').css('width',tw*nc+"px");
    $('#schermata_di_gioco').css('height',th*nr+"px");
    $('#schermata_di_gioco').css('margin-left',((tw*nc)/2)*(-1)+"px");
}