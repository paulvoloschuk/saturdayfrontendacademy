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
  for(var i = 0; i < inputs.length; i++)
    arr[i] = '<span class="code"><span>' + i + '</span>:' + inputs[i].value + '</span>';
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


// Initialize exercises
Exercise1();
Exercise2();

// Events
document.getElementById('reverse_function').onkeyup = function(e){Exercise1()};
document.getElementById('sort_function').onsubmit = function(e){Exercise2();return false;};
