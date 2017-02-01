function Calculator(){
  this.editable_field = document.querySelector('#calculator .editable');
  this.memory_field = document.querySelector('#calculator .memory');
  this.field = document.querySelector('#text-field');
  this.count_button = document.querySelector('#count_button');
  this.action = '';
  this.variable_1 = '';
  this.variable_2 = '';
  this.active_var = 'this.variable_1';
  this.variableditable = '';
  this.result = '';
  this.variable_memory = false;

  this.fieldRefresh = function(){
    eval('this.editable_field.innerHTML = ' + this.active_var + ';');
    this.memory_field.innerHTML = this.variable_1 + ' ' + this.action + ' ' + this.variable_2;
  }

  this.addChar = function(char){
    if(eval(this.active_var + '.length < 15')){
      eval(this.active_var + ' += char;');
      this.fieldRefresh();
      this.result = '';
    }
  }

  this.addAction = function(action){
    if(this.active_var == 'this.variable_1'){
      this.action = action;
      this.count_button.disabled = false;
      this.active_var = 'this.variable_2';
    } else {
      this.count();
      this.variable_1 = this.result;
      this.variable_2 = '';
      this.action = action;
      this.result = '';
    }
    this.fieldRefresh();
    this.editable_field.innerHTML = 0;
  }

  this.count = function(){
    if(this.result !== '')  this.variable_1 = this.result;
    if(this.action == '^') this.result = Math.pow(this.variable_1, this.variable_2);
    else eval('this.result = ' + this.variable_1 + this.action + this.variable_2);
    this.fieldRefresh();
    this.editable_field.innerHTML = this.result;
  }

  this.clear = function(){
    if(this.active_var == 'this.variable_1'){
      this.variable_1 = '';
      this.memory_field.innerHTML = 'clear';
    } else {
      this.variable_2 = '';
      this.fieldRefresh();
    }
    this.editable_field.innerHTML = 0;
  }

  this.clearAll = function(){
    this.variable_1 = '';
    this.variable_2 = '';
    this.action = '';
    this.memory_field.innerHTML = 'clear';
    this.editable_field.innerHTML = 0;
    this.count_button.disabled = true;
  }

  this.memory = function(){
    if(this.variable_memory){
      eval(this.active_var + ' = this.variable_memory;');
      this.field.className = '';
      this.variable_memory = false;
      this.fieldRefresh();
    } else if(eval(this.active_var) !== '' && this.result == ''){
      this.variable_memory = eval(this.active_var);
      this.field.className = 'mmr';
    } else if(this.result !== ''){
      this.variable_memory = this.result;
      this.field.className = 'mmr';
    }
  }

}

var Calculator = new Calculator();
