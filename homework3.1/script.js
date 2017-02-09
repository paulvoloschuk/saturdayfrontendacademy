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
  this.figures = Array();
  this.current_figures = Array();
  this.current_actions = Array();
  this.current_select = false;
  this.current_player = 0;
  this.current_side = 'light';
  this.kill_count = Array([], []);

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

  this.PlayerSwitch = function(){
    this.Debug('Switching players');
    this.current_player = (this.current_player !== 1) ? 1 : 0;
    this.current_side = (this.current_side !== 'dark') ? 'dark' : 'light';
    this.global_container.className = 'player' + this.current_player;
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
    for(var id_cell = 0, id_figure = 0, y = 0; y <= this.size_y; y++) {
      HTML_field += '<div data-id="' + y + '" class="row">';
      for(var x = 0; x <= this.size_x; x++) {
        if(x == 0 || x == this.size_x) HTML_tooltip = '<span class="n-tooltip">' + (y + 1) + '</span>';
        if(y == 0 || y == this.size_y) HTML_tooltip += '<span class="s-tooltip">' + String.fromCharCode(65 + x) + '</span>';
        HTML_field += '<div class="cell" id="cell_' + (id_cell++) + '" data-x="' + x + '" data-y="' + y + '">'  + HTML_tooltip + '</div>';
        HTML_tooltip = '';
        if(this.field[y][x].value) HTML_figures += '<div id="fig_' + (id_figure++) + '" class="figure ' + this.field[y][x].value.type + ' ' + this.field[y][x].value.side + '" style="' + this.FigurePositioning(x, y) + '"></div>';
      }
      HTML_field += '</div>';
      this.cells = document.getElementsByClassName('cell');
      this.figures = document.getElementsByClassName('figure');
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
        // Figures secondary
        if(this.field[y][x].value) this.figures[this.field[y][x].value.id].style.cssText = this.FigurePositioning(x, y);
      }
    }
  }

  this.FigurePositioning = function(x, y){
    return 'top:' + (y * 8) + 'vmin; left:' + (x * 8) + 'vmin;';
  }
  this.PossibleActions = function(x, y, id = 0){
    var clear_actions_name = false;
    var recursive = false;
    x = +x;
    y = +y;
    var move_ways = Array(
      [y-1, x-1],
      [y-1, x+1],
      [y+1, x-1],
      [y+1, x+1]
    );
    var atack_ways = Array(
      [y-2, x-2],
      [y-2, x+2],
      [y+2, x-2],
      [y+2, x+2]
    );
    for (var i = 0; i < 4; i++) {
      // Try to move
      if(0 <= move_ways[i][0] && move_ways[i][0] <= this.size_y && 0 <= move_ways[i][1] && move_ways[i][1] <= this.size_x && this.field[move_ways[i][0]][move_ways[i][1]].value.side !== this.current_side && this.field[move_ways[i][0]][move_ways[i][1]].value == false){
          this.field[move_ways[i][0]][move_ways[i][1]].action = new Action(++id, 'move', [move_ways[i][1], move_ways[i][0]]);
          this.current_actions.push(this.field[move_ways[i][0]][move_ways[i][1]].action);
        // Try to atack ---------------------------------------------------------------------------------------------------------------------------------------------- TROUBLE SOMEWHERE HERE
      }else if(0 <= atack_ways[i][0] && atack_ways[i][0] <= this.size_y && 0 <= atack_ways[i][1] && atack_ways[i][1] <= this.size_x && this.field[atack_ways[i][0]][atack_ways[i][1]].value == false && this.field[move_ways[i][0]][move_ways[i][1]].value.side !== this.current_side){
          this.field[atack_ways[i][0]][atack_ways[i][1]].action = new Action(++id, 'atack', [atack_ways[i][1], atack_ways[i][0]], [move_ways[i][1], move_ways[i][0]]);
          this.current_actions.push(this.field[atack_ways[i][0]][atack_ways[i][1]].action);
          clear_actions_name = 'move';
      }
    }
    if(clear_actions_name) this.ClearActions(clear_actions_name);
  }

  this.FinalizeAction = function(){
    this.ClearActions();
    this.UpdateField();
  }

  this.ClearActions = function(name = 'all'){
    this.Debug('Abbadon ' + name + ' actions');
    if(name == 'all'){
      this.current_actions = Array();
      this.current_select = false;
    }else{
      for (var i = 0; i < this.current_actions.length; i++)
        if(this.current_actions[i].name == name) this.current_actions.splice(i, 1);
    }
    for (var y = 0; y <= this.size_y; y++) {
      for (var x = 0; x <= this.size_x; x++) {
        if(name == 'all') this.field[y][x].action = false;
        else if(this.field[y][x].action.name == name) this.field[y][x].action = false;
      }
    }
  }

  this.MakemoveAction = function(id){
    var to_x = this.current_actions[id].cordinates[0];
    var to_y = this.current_actions[id].cordinates[1];
    var from_x = this.current_actions[0].cordinates[0];
    var from_y = this.current_actions[0].cordinates[1];
    this.Debug('Moving to x:' + to_x + ' y:' + to_y);
    this.field[to_y][to_x].value = this.field[from_y][from_x].value;
    this.field[from_y][from_x].value = false;
    this.FinalizeAction();
    this.PlayerSwitch();
  }

  this.MakeatackAction = function(id){
    var margin = (!!this.current_player) ? '-' : '';
    this.field[this.current_actions[id].kill[1]][this.current_actions[id].kill[0]].alive = false;
    this.figures[this.field[this.current_actions[id].kill[1]][this.current_actions[id].kill[0]].value.id].className += ' fallen';
    this.figures[this.field[this.current_actions[id].kill[1]][this.current_actions[id].kill[0]].value.id].style.cssText += ' margin-left:' + margin + (++this.kill_count[this.current_player]*3) + 'vmin; z-index:' + this.kill_count[this.current_player] + ';';
    this.field[this.current_actions[id].kill[1]][this.current_actions[id].kill[0]].value = false;
    this.MakemoveAction(id);
  }

  this.ClickEvent = function(target){
    var recursive = false;
    var update = true;
    var cell_x = +target.attributes[2].value
    var cell_y = +target.attributes[3].value;
    this.Debug('Click on x:' + cell_x + ' y:' + cell_y);
    if(!this.current_select){
      // Вход в режим выбора действий
      // Далее расчет всех возможных ходов.
      if(this.field[cell_y][cell_x].value.side == this.current_side){
        this.current_select = true;
        this.field[cell_y][cell_x].action = new Action(0, 'select', [cell_x, cell_y]);
        this.current_actions.push(this.field[cell_y][cell_x].action);
        this.PossibleActions(cell_x, cell_y);
      } else update = false;
    } else {
      // Выполнение хода
      if(this.field[cell_y][cell_x].action){
        eval('this.Make' + this.field[cell_y][cell_x].action.name + 'Action(this.field[cell_y][cell_x].action.id)');
        return false;
      }else this.ClearActions();
      if(this.field[cell_y][cell_x].value) recursive = this.ClickEvent(target);
    }
    if(!recursive && update) this.UpdateField();
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
function Action(id, name, cordinates, kill = false){
  this.id = id;
  this.name = name; // move,atack,select
  this.cordinates = cordinates;
  this.kill = kill;
}

var Checkers = new Checkers('container');
