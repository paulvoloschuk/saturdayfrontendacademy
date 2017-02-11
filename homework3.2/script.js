// Working functions
function Reverse(array){
  for(var i = 0; i < (array.length / 2); i++){
    array[i] = [array[i], array[array.length - i - 1]];
    array[array.length - i - 1] = array[i][0];
    array[i] = array[i][1];
  }
  return array;
}

function Random(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function SortByNumber(array, order_by_desc){
  for (var i = 0; i < array.length; i++) {
    for (var ii = 0; ii < array.length; ii++) {
      if(array[i] > array[ii]){
        array[i] = [array[ii], array[ii] = array[i]][0];
      }
    }
  }
  return ((order_by_desc) ? array.reverse() : array);
}

// User function
function Exercise1(){
  var result_container = document.getElementById('ex1_result');
  var inputs = document.getElementsByClassName('cell');
  var arr = [];
  for(var i = 0; i < inputs.length; i++){
    arr[i] = '<span class="code"><span>' + i + '</span>:' + ((inputs[i].value == '') ? '<span class="warn">empty</span>' : inputs[i].value) + '</span>';
  }
  result_container.innerHTML = Reverse(arr).join(' ');
}

function Exercise2(){
  var target = document.getElementById('sort_function');
  var result1_container = document.getElementById('ex2_result1');
  var result2_container = document.getElementById('ex2_result2');
  var size = target[1].value;
  var arr_custom = [];
  var arr_random = [];
  var order = false;
  if(size < 0){
    size = size*(-1);
    order = true;
  }
  for(var i = 0; i < size; i++) {
    arr_random[i] = Random(size*(-10), size*10);
    arr_custom[i] = '<span class="code"><span>' + i + '</span>:' + arr_random[i] + '</span>';
  }
  arr_random = SortByNumber(arr_random, order);
  for (var i = 0; i < size; i++) {
    arr_random[i] = '<span class="code"><span>' + i + '</span>:' + arr_random[i] + '</span>';
  }
  result1_container.innerHTML = arr_custom.join(' ');
  result2_container.innerHTML = arr_random.join(' ');
}

function Exercise3(){
  this.target = document.getElementById('matrix_function');
  this.figure;
  this.size = 10;
  this.color = [];
  this.color_inputs = [];
  this.matrix = [];

  this.GenerateField = function(){
    var cells = [];
    var HTML = '';
    for (var y = 0; y < this.size; y++) {
      HTML += '<div class="matrix_row">';
      for (var x = 0; x < this.size; x++) {
        HTML += '<div id="cell_' + x + '' + y + '" class="matrix_cell"></div>';
      }
      HTML += '</div>';
    }
    document.getElementById('ex3_result').innerHTML = HTML;
    this.RecountColor();
  }

  this.ClearMatrix = function(){
    for (var y = 0; y < this.size; y++) {
      this.matrix[y] = [];
      for (var x = 0; x < this.size; x++) {
        this.matrix[y][x] = 'transparent';
      }
    }
  }

  this.RecountColor = function(){
    this.ClearMatrix();
    this.figure = this.target.elements.font.value;
    this.color_inputs = [this.target[3], this.target[4], this.target[5]];
    this.color = [this.color_inputs[0].value, this.color_inputs[1].value, this.color_inputs[2].value];
    for (var i = 0; i < this.color_inputs.length; i++) this.color_inputs[i].style.cssText = 'background-color:#' + this.color[i];
    switch (this.figure) {
      case 'kaleidoscope':
        this.DrawCross();
        break;
      case 'square':
        for (var i = 0; i < Random(4 ,this.size-4); i++) {
          this.DrawSquare([Random(-this.size ,this.size),Random(-this.size+4 ,this.size-4)], Random(2, this.size-3), this.color[Random(0,2)], this.color[Random(0,2)]);
        }
        break;
      case 'wave':
        this.DrawWave();
        break;
    }

    this.Paint();
  }

  this.Paint = function(){
    for (var y = 0; y < this.size; y++) {
      for (var x = 0; x < this.size; x++) {
        document.getElementById('cell_' + x + '' + y).style.cssText = 'background-color:' + ((this.matrix[y][x] == 'transparent') ? this.matrix[y][x] : '#' + this.matrix[y][x]);
      }
    }
  }

  this.DrawSquare = function(start_index, size, color, fill = 'transparent'){
    for (var y = start_index[0]; y < (start_index[0] + size); y++) {
      for (var x = start_index[1]; x < (start_index[1] + size); x++) {
        if(y >= 0 && y < this.size && x >= 0 && x < this.size){
          if(y == start_index[0] || y == start_index[0] + size - 1 || x == start_index[1] || x == start_index[1] + size - 1)
            this.matrix[y][x] = color;
          else this.matrix[y][x] = fill;
        }
      }
    }
  }

  this.DrawCross = function(){
    var temp_color;
    for (var y = 0; y < this.size; y++) {
      for (var x = 0; x < this.size; x++) {
        if(x < this.size/2 && y < this.size/2){
          temp_color = this.color[Random(0 ,2)];
          this.matrix[y][x] =
          this.matrix[x][y] =
          this.matrix[y][this.size - x - 1] =
          this.matrix[this.size - x - 1][y] =
          this.matrix[x][this.size - y - 1] =
          this.matrix[this.size - y - 1][x] =
          this.matrix[this.size - x - 1][this.size - y - 1] =
          this.matrix[this.size - y - 1][this.size - x - 1] =
          temp_color;
        }
      }
    }
  }

  this.DrawWave = function(){
    var temp_color;
    for (var z = 0; z < this.size*2; z++) {
      temp_color = this.color[Random(0 ,2)];
      for (var y = 0, x = z; y < this.size, x >= 0; y++, x--) {
        // for (var x = z; x >= 0; x--) {
          if(y >= 0 && y < this.size && x >= 0 && x < this.size) this.matrix[y][x] = temp_color;
        // }
      }

    }
  }


  this.GenerateField();
}

// Initialize exercises
Exercise1();
Exercise2();
var Matrix = new Exercise3();

// Events
document.getElementById('reverse_function').onkeyup = function(e){Exercise1()};
document.getElementById('sort_function').onsubmit = function(e){Exercise2();return false;};
document.getElementById('matrix_function').onchange = function(){Matrix.RecountColor();};
document.getElementById('matrix_function').onsubmit = function(){Matrix.RecountColor();return false;};
