function Figure(id, side, x = false, y = false, type = "regular"){
  this.id = id;
  this.type = type; // regular, queen
  this.side = side; // black, white
  this.alive = true;
  this.top = x*8; // position:top(vmin)
  this.left = y*8; // position:left(vmin)

  this.setPosition = function(x, y){
    this.top = x*8;
    this.left = y*8;
  }

  this.makeQueen = function(){
    this.type = 'queen';
  }

  this.failed = function(){
    this.alive = false;
  }
}

function Checkers(block){
  // Инициализация
  this.container_checkers = document.getElementById(block);
  this.container_checkers.innerHTML ='<div id="figures"></div><div id="field"></div>'
  this.container_field = document.getElementById('field');
  this.container_figures = document.getElementById('figures');
  this.active_side = 'white';
  this.active_cell = false;
  this.active_stage = 'select'; // variants: select, action
  this.field = Array();
  this.actions = Array();

  // Генерация таблицы
    var HTML = '';
    for(var i = 0; i < 8; i++){
      HTML += '<div class="row" id="row-' + i  + '">';
      for(var j = 0; j < 8; j++){
        HTML += '<div class="cell" id="cell-' + i + '-' + j + '" data-x="' + i + '" data-y="' + j + '"></div>';
      }
      HTML += '</div>';
    }
    this.container_field.innerHTML = HTML;

    // Генерация поля и фигур
    for(var id = 0, x = 0; x < 8; x++){
      this.field[x] = Array();
      for(var y = 0; y < 8; y++){
        if(x < 2) this.field[x][y] = new Figure(id, 'black', x, y);
        else if (x > 5) this.field[x][y] = new Figure(id, 'white',  x, y);
        else this.field[x][y] = false;
        if(this.field[x][y]){
          // console.log(this.field[x][y]);
          id++;
          this.container_figures.innerHTML += '<div data-id="' + this.field[x][y].id + '" class="' + this.field[x][y].type + ' ' + this.field[x][y].side + '" style="top:' + this.field[x][y].top + 'vmin;left:' + this.field[x][y].left + 'vmin;"></div>'
        }
      }
    }

    // Подсвечивает все озможные ходы
    this.showActions = function(x, y){

      var variants = Array();
      if(this.field[x][y].type == 'regular'){
        variants = Array(
          Array((+x-1),(+y-1)),
          Array((+x-1),(+y+1)),
          Array((+x+1),(+y-1)),
          Array((+x+1),(+y+1))
        );
        // console.log(variants);
        for(var i = 0; i < variants.length; i++){
          if(8 > variants[i][0] > 0 && 8 > variants[i][1] > 0 ){
          if(this.field[variants[i][0]][variants[i][1]] !== undefined && !this.field[variants[i][0]][variants[i][1]]) {

            var local = document.querySelector('div[data-x="' + variants[i][0] + '"][data-y="' + variants[i][1] + '"]');
            local.className = 'cell move';
            this.actions.push(local);
          } else continue;
          }
        }
      }
    }
    this.hideActions = function(){
      for(var i = 0; i < this.actions.length; i++){
        this.actions[i].className = 'cell';
      }
      this.action = Array();
    }


    // Вешаем обработчики на клетки
    this.cells = document.querySelectorAll(".cell");
    this.selectCell = function(y, x){
      this.hideActions();
      document.getElementById('debug').innerHTML = 'x = ' + x + '; y = ' + y + ';';
      if(this.active_cell) this.active_cell.className = 'cell';
      if(this.field[x][y] instanceof Object && this.field[x][y].side == this.active_side){
        this.active_cell = document.querySelector('#field #cell-' + x + '-' + y);
        this.active_cell.className = 'cell focus';
        this.active_stage = 'action';
        this.showActions(x, y);
      } else{
        this.active_cell = false;
        this.active_stage = 'select';
        // this.hideActions();
      }

    }
    for(var i = 0; i < this.cells.length; i++)
      this.cells[i].onclick = function(e){
        Checkers.selectCell(e.srcElement.getAttribute('data-y'), e.srcElement.getAttribute('data-x'));
      }


}

var Checkers = new Checkers('checkers');
