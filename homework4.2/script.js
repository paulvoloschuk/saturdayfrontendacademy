function SquareCalculator(rootElementId){
  this.rootElement = document.getElementById(rootElementId);
  this.form = this.rootElement.firstElementChild;
  this.currentFigure;
  this.resultContainer = document.getElementById('result');
  // Display & else

  this.toggleFigure = function(){
    this.resultContainer.innerHTML = '';
    this.rootElement.className = 'container '+this.form[0].value;
    this.currentFigure = this.form[0].value;
    for (var i = 0; i < this.form.length; i++) {
      if (this.form[i].type == 'text') {
        this.form[i].parentElement.style.display = (this.form[i].dataset.figures.indexOf(this.currentFigure) >= 0)? 'inherit' : 'none';
      }
    }
  }

  this.updateInputs = function(element){
    var preVar = {
      radius: "r",
      width: "w",
      height: "h",
      lenght: "a"
    };
    var equal, outputs = document.getElementsByClassName(element.name);
    for (var i = 0; i < outputs.length; i++) {
      equal = (element.value == '')? '': '=';
      outputs[i].innerHTML = preVar[element.name]+' '+equal+' '+element.value;
    }
  }

  this.calculate = function(){
    var data = {}, figure;
    for (var i = 0; i < this.form.length; i++) {
      if (this.form[i].type == 'text') {
        data[this.form[i].name] = this.form[i].value;
      }
    }
    this.currentFigure = this.currentFigure.charAt(0).toUpperCase() + this.currentFigure.substr(1);
    if(!window['figurePrototype']) window['figurePrototype'] = new Figure();
    figure = new window[this.currentFigure](data);
    this.resultContainer.innerHTML = 'S = '+figure;
  }

  this.form[0].setAttribute('onclick', 'SquareCalculator.toggleFigure();');
  this.form.setAttribute('onsubmit', 'SquareCalculator.calculate(); return false;');
  this.form.onkeydown = function(event){
        if (isNaN(+event.key)) event.preventDefault();
  };
  this.form.onkeyup = function(event){
    event.code = '';
    SquareCalculator.updateInputs(event.target);
  };
  this.toggleFigure();
}
function Figure(){
  this.accuracy = 2;
  this.calculateSquare = function(){
    return false;
  }
  this.toString = function(){
    return this.calculateSquare().toFixed(this.accuracy);
  }
}
function Circle(data){
  this.__proto__ = window['figurePrototype'];
  this.params = data;
  this.calculateSquare = function(){
    return Math.PI * Math.pow(this.params.radius,2);
  }
}
function Triangle(data){
  this.__proto__ = window['figurePrototype'];
  this.params = data;
  this.calculateSquare = function(){
    return this.params.height * this.params.width / 2;
  }
}
function Rectangle(data){
  this.__proto__ = window['figurePrototype'];
  this.params = data;
  this.calculateSquare = function(){
    return this.params.height * this.params.width;
  }
}
function Pentagon(data){
  this.__proto__ = window['figurePrototype'];
  this.params = data;
  this.calculateSquare = function(){
    return Math.pow(this.params.lenght, 2) / 4 * Math.sqrt(25+10*Math.sqrt(5));
  }
}
function Hexagon(data){
  this.__proto__ = window['figurePrototype'];
  this.params = data;
  this.calculateSquare = function(){
    return Math.pow(this.params.lenght, 2) / 2 * 3 * Math.sqrt(3);
  }
}

var SquareCalculator = new SquareCalculator('container');
