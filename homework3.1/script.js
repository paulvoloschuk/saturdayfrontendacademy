// set namespace
var MYAPP = MYAPP || {};

function Checkers(global_container){
  this.debug = true;
  this.global_container = document.getElementById(global_container);
  this.field_container;
  this.figures_container;


  this.size_x = 7;
  this.size_y = 7;

  this.players = Array();
  this.field = Array();
  this.cells = Array();
  this.current_figures = Array();
  this.current_actions = Array();
  this.current_select = false;
  this.current_player = 0;
  this.current_side = 'light';

  // Constructor
  this.Construct = function(){

    //TEMP
    this.players.push(new Player('Вася'));
    this.players.push(new Player('Петя'));

    this.GenerateStructure();
    this.GenerateField();
  }

  this.Debug = function(message){
    if(this.debug) console.log(message);
  }

  // Generate/Regenerate figures
  this.GenerateStructure = function(){
    this.Debug('Generating matrix');
    this.field = Array();
    var pass_cell = true;
    for(var id_cell = 0, id_figure = 0, side = false, y = 0; y <= this.size_y; y++) {
      if(pass_cell) x = 0;
      else x = 1;
      this.field[y] = Array();
      if(y < 3) side = 'dark';
      if(y > 4) side = 'light';
      for (var x = 0; x <= this.size_x; x++) {
        this.field[y][x] = new Cell(id_cell++);
        if(side) {
          this.field[y][x].value = (pass_cell) ? false : new Figure(id_figure++, side);
          if(this.field[y][x].value) this.current_figures.push(this.field[y][x].value);
        }
        else this.field[y][x].value = false;
        pass_cell = !pass_cell;
      }
      side = false;
      pass_cell = !pass_cell;
    }
  }

  // Generate HTML field & start events
  this.GenerateField = function(){
    this.Debug('Generating field & figures');
    var HTML_field = '', HTML_figures = '', HTML_tooltip = '';
    for(var id = 0, y = 0; y <= this.size_y; y++) {
      HTML_field += '<div data-id="' + y + '" class="row">';
      for(var x = 0; x <= this.size_x; x++) {
        if(x == 0 || x == this.size_x) HTML_tooltip = '<span class="n-tooltip">' + (y + 1) + '</span>';
        if(y == 0 || y == this.size_y) HTML_tooltip += '<span class="s-tooltip">' + String.fromCharCode(65 + x) + '</span>';
        HTML_field += '<div class="cell" id="cell_' + (id++) + '" data-x="' + x + '" data-y="' + y + '">'  + HTML_tooltip + '</div>';
        HTML_tooltip = '';
        HTML_figures += '<div class="' + this.field[y][x].value.type + ' ' + this.field[y][x].value.side + '" style="' + this.FigurePositioning(x, y) + '"></div>';
      }
      HTML_field += '</div>';
      this.cells = document.getElementsByClassName('cell');
    }
    this.global_container.className = 'player' + this.current_player;
    this.global_container.innerHTML = '<p>' + this.players[0].name + '</p><p>' + this.players[1].name + '</p><div id="figures">' + HTML_figures + '</div><div id="field">' + HTML_field + '</div>';
    this.Debug('Setting click events');
    var cells = document.getElementsByClassName('cell');
    for (var i = 0; i < cells.length; i++) {
      cells[i].onclick = function(e) {Checkers.ClickEvent(e.target);}
    }
  }

  // Rebuilt field
  this.UpdateField = function(){
    this.Debug('Updating field');
    for (var y = 0; y <= this.size_y; y++) {
      for (var x = 0; x <= this.size_x; x++) {
        // Action firstly
        if(this.field[y][x].action) this.cells[this.field[y][x].id].className = 'cell ' + this.field[y][x].action.name;
        else this.cells[this.field[y][x].id].className = 'cell';
      }
    }
    // console.log(this.field);
  }

  this.FigurePositioning = function(x, y){
    return 'top:' + (y * 8) + 'vmin; left:' + (x * 8) + 'vmin;';
  }
  this.PossibleActions = function(x, y){

  }

  this.ClearActions = function(){
    this.Debug('Abbadon all actions');
    this.current_actions = Array();
    this.current_select = false;
    for (var y = 0; y <= this.size_y; y++) {
      for (var x = 0; x <= this.size_x; x++) {
        this.field[y][x].action = false;
      }
    }
  }

  this.ClickEvent = function(target){
    var recursive = false;
    var cell_x = target.attributes[2].value
    var cell_y = target.attributes[3].value;
    this.Debug('Click on x:' + cell_x + ' y:' + cell_y);
    if(!this.current_select){
      // Вход в режим выбора действий, выход при нажатии туда-же.
      // Далее расчет всех возможных ходов.
      console.log(this.field[cell_y][cell_x].value.side);
      if(this.field[cell_y][cell_x].value.side == this.current_side){
        this.current_select = true;
        this.field[cell_y][cell_x].action = new Action(0, 'select');
        this.current_actions.push(this.field[cell_y][cell_x].action);
        this.PossibleActions(cell_x, cell_y);
      }
    } else {
      // Выполнение хода
      if(this.field[cell_y][cell_x].action){
        alert(1); //--------------------------------------ЗАКОНЧИТЬ
      }else this.ClearActions();
      if(this.field[cell_y][cell_x].value) recursive = this.ClickEvent(target);
    }
    if(!recursive)this.UpdateField();
    return true;
  }

  this.Construct();
}
function Player(name){
  this.name = name;
  this.points;
  this.turns;
}
function Figure(id, side){
  this.id = id;
  this.side = side;
  this.type = 'regular';
  this.alive = true;
}
function Cell(id, value = false){
  this.id = id;
  this.value = value;
  this.action = false;
}
function Action(id, name){
  this.id = id;
  this.name = name; // move,atack,select
  this.cordinates = Array();
  this.kill = Array();
}

var Checkers = new Checkers('container');
