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
    lba = 4;
//  PROBABILITA DI ALBERI IN MEZZO
    pac = 0.06;

// VARIABILI DI AMBIENTE PER IL GIOCO
walking = false;
min_x = 0;
max_x = 0;
min_y = 0;
max_y = 0;
mappa = new Array();

function crea_gioco() {
    $('body').html('<div id="schermata_di_gioco"></div>');
    $('#schermata_di_gioco').append('<span id="player"></span>');
    crea_mappa();
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
    pos = parseInt(pos.substring(0,pos.length-2));
    newpos = p=='r'||p=='d' ? pos+(1*vmg) : pos-(1*vmg);
    $('#player').addClass('t100');
    half_player_width = hpw = $('#player').width()/2;
    half_player_height = hph = $('#player').height()/2;
    if(coord == 'left') {
        if(newpos < min_x-hpw)
            newpos = min_x-hpw;
        if(newpos > max_x+hpw)
            newpos = max_x+hpw;
        if(!spostamento('orizzontale', newpos))
            newpos = pos;
    }else{
        if(newpos < min_y-hph)
            newpos = min_y-hph;
        if(newpos > max_y+hph)
            newpos = max_y+hph;
        if(!spostamento('verticale', newpos))
            newpos = pos;
    }
    $('#player').css(coord, Math.floor(newpos)+'px');
    setTimeout(function() {
        $('#player').removeClass('t100');
    }, 105);
    if(!walking)
        animate_walk('w'+p);
}

function spostamento(direzione, pos) {
    console.log("Controllo "+pos+" in "+direzione);
    if(direzione == 'orizzontale') {
        y = $('#player').css('top');
        y = parseInt(y.substring(0,y.length));
        for(i=5;i<=14;i++) {
            for(j=14;j<=24;j++) {
                if(mappa[pos+i][y+j] == '1') return false;
            }
        }
    }else{
        x = $('#player').css('left');
        x = parseInt(x.substring(0,x.length));
        for(i=14;i<=23;i++) {
            for(j=5;j<=14;j++) {
                if(mappa[x+j][pos+i] == '1') return false;
            }
        }
    }
    return true;
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
    max_x = $('#schermata_di_gioco').width()-tw-$('#player').width();
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
            pos_x = Math.floor(i*tw);
            pos_y = Math.floor(j*th);
            style='top:'+pos_y+'px;left:'+pos_x+'px;';
            if(j==0)
                style+='z-index:9999;';
            if(
                Math.random() < 1-(j/lba) ||
                Math.random() < 1-(i/lba) ||
                Math.random() < 1-((nr-j-1)/lba) ||
                Math.random() < 1-((nc-i-1)/lba) ||
                Math.random() < pac
            ) {
                $('#schermata_di_gioco').append('<span id="albero" style="'+style+'"></span>');
                // riempi la mappa per gli alberi
                for(x=19;x<=30;x++) {
                    for(y=54;y<=61;y++) {
                        riempi_mappa(pos_x+x,pos_y+y);
                    }
                }
            }
        }
    }
    $('#schermata_di_gioco').css('width',tw*nc+"px");
    $('#schermata_di_gioco').css('height',th*nr+"px");
    $('#schermata_di_gioco').css('margin-left',((tw*nc)/2)*(-1)+"px");
}

function crea_mappa() {
    mappa = new Array($('#schermata_di_gioco').width());
    for(i=0;i<$('#schermata_di_gioco').width();i++) {
        mappa[i] = new Array($('#schermata_di_gioco').height());
    }
}

function riempi_mappa(x,y) {
    mappa[x][y] = '1';
}

function visualizza_blocchi() {
    for(i=0;i<mappa.length;i++) {
        for(j=0;j<mappa[i].length;j++) {
            if(mappa[i][j]=='1') {
                blocco = '<span style="top:'+j+'px;left:'+i+'px;" class="pixel"></span>';
                $('#schermata_di_gioco').append(blocco);
            }
        }
    }
}