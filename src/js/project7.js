function randomArray(params){
  var options = {
    dimensions:params.dimensions  || 1,
    integer:   params.integer     || false,
    minValue:  params.min         || 1,
    maxValue:  params.max         || 100,
    arraySize: params.size        || 10
  }
  var result = [], subresult;
  for (var i = 0; i < options.arraySize; i++) {
    if (options.dimensions > 1) {
      subresult = [];
      for (var j = 0; j < options.dimensions; j++) {
        subresult[j] = (options.integer)
          ? Math.floor(Math.random() * (options.maxValue - options.minValue + 1)) + options.minValue
          : +(Math.random() * (options.maxValue - options.minValue) + options.minValue).toFixed(2);
      }
    } else {
      subresult = (options.integer)
        ? Math.floor(Math.random() * (options.maxValue - options.minValue + 1)) + options.minValue
        : +(Math.random() * (options.maxValue - options.minValue) + options.minValue).toFixed(2);
    }
    result[i] = subresult;
  }
  return result;
}

var ProtoGraph = {
  workfiled: {
    x: 0,
    y: 0
  },
  workSpaceCalculations: function(){
    this.workSpace = {
      minX: 20,
      maxX: this.rootElement.clientWidth - 20,
      minY: 20,
      maxY: this.rootElement.clientHeight - 20
    };
    var maxY = 0, maxX = 0;
    if (this.data[0] instanceof Array && this.data[0].length == 2) {
      for (var i = 0; i < this.data.length; i++) {
        if (maxY < this.data[i][0]) maxY = this.data[i][0];
        if (maxX < this.data[i][1]) maxX = this.data[i][1];
      }
      this.maxYvalue = maxY;
      this.relativeValueY = this.workSpace.maxY / maxY;
      this.relativeValueX = this.workSpace.maxX / maxX;
    } else if (this.data[0] instanceof Array && this.data[0].length > 2) {
      for (var i = 0; i < this.data.length; i++) {
        for (var j = 0; j < this.data[i].length; j++) {
          if (maxY < this.data[i][j]) maxY = this.data[i][j];
        }
      }
      this.maxYvalue = maxY;
      this.relativeValueY = this.workSpace.maxY / this.maxYvalue;
    } else {
      this.maxYvalue = Math.max.apply(null, this.data);
      this.relativeValueY = this.workSpace.maxY / this.maxYvalue;
    }

  },
  createElement: function(elementName){
    var element = document.createElementNS('http://www.w3.org/2000/svg', elementName);
    element.setMultyAttributes = function(object){
      for (key in object) {
        this.setAttribute(key, object[key]);
      }
    }
    return element;
  },
  drawLevels: function(){
    var maxFloor = parseInt(this.maxYvalue),
        dex = '',
        levelLine,
        levelCaption,
        levelGroup = this.createElement('g');
    for (var i = 0; i < maxFloor.toString().length; i++){
      dex += (i == 0)? 1: 0;
    }
    levelGroup.setMultyAttributes({class: 'levels'});
    for (var i = 1; i <= parseInt(maxFloor/dex); i++) {
      levelLine = this.createElement('line');
      levelLine.setMultyAttributes({x1: this.workSpace.minX-10,
                                    y1: this.workSpace.maxY-(this.relativeValueY*dex*i)+10,
                                    x2: this.workSpace.maxX+20,
                                    y2: this.workSpace.maxY-(this.relativeValueY*dex*i)+10
                                  });
      levelCaption = this.createElement('text');
      levelCaption.textContent = dex*i;
      levelCaption.setMultyAttributes({x: this.workSpace.minX-14,
                                       y: this.workSpace.maxY-(this.relativeValueY*dex*i)+15,
                                       'text-anchor': 'end'
                                     });
      levelGroup.appendChild(levelLine);
      levelGroup.appendChild(levelCaption);
    }
    this.rootElement.insertBefore(levelGroup, this.rootElement.children[1]);
  },
  drawGuideLines: function(){
    var guideLinesGroup = this.createElement('g');
    var guideLineX = this.createElement('line');
    var guideLineY = this.createElement('line');
    guideLinesGroup.setMultyAttributes({class: 'grid'});
    guideLineX.setMultyAttributes({class: 'x',
                                    x1: this.workSpace.minX-10,
                                    y1: this.workSpace.minY-20,
                                    x2: this.workSpace.minX-10,
                                    y2: this.workSpace.maxY+10
                                  });
    guideLineY.setMultyAttributes({class: 'y',
                                    x1: this.workSpace.minX-10,
                                    y1: this.workSpace.maxY+10,
                                    x2: this.workSpace.maxX+20,
                                    y2: this.workSpace.maxY+10
                                  });
    guideLinesGroup.appendChild(guideLineX);
    guideLinesGroup.appendChild(guideLineY);
    this.rootElement.appendChild(guideLinesGroup);
  }
};

function ColumnGraph(svgId, data){
  this.data = data;
  this.__proto__ = window.ProtoGraph;
  this.rootElement = document.getElementById(svgId);
  this.workSpaceCalculations();
  this.drawGuideLines();
  // Building a graph
  var child, text, element, valuesContainer = this.createElement('g');
  valuesContainer.setMultyAttributes({class:'values'});
  for (var i = 0; i < this.data.length; i++) {
    text = this.createElement('text');
    text.textContent = this.data[i];
    text.setMultyAttributes({x: (this.workSpace.maxX / 10 * i)+17+this.workSpace.maxX / 20,
                             y: (this.data[i] * this.relativeValueY > this.workSpace.maxY - 20)
                                  ? this.workSpace.maxY - (this.data[i] * this.relativeValueY) + 30
                                  : this.workSpace.maxY - (this.data[i] * this.relativeValueY),
                             'text-anchor': 'middle'
                           });
    child = this.createElement('g');
    child.setMultyAttributes({class: 'squarebar'});
    element = this.createElement('rect');
    element.setMultyAttributes({width:  this.workSpace.maxX / 10 - 5,
                              height: this.data[i] * this.relativeValueY,
                              x: (this.workSpace.maxX / 10 * i)+20,
                              y: this.workSpace.maxY - (this.data[i] * this.relativeValueY) + 10
                            });
    child.appendChild(element);
    child.appendChild(text);
    valuesContainer.appendChild(child);
  }
  this.rootElement.appendChild(valuesContainer);
  this.drawLevels();
}

function DottedGraph(svgId, data){
  this.data = data;
  this.__proto__ = window.ProtoGraph;
  this.rootElement = document.getElementById(svgId);
  this.workSpaceCalculations();
  this.drawGuideLines();
  // Building a graph
  var child, text, element, valuesContainer = this.createElement('g');
  valuesContainer.setMultyAttributes({class:'values'});
  for (var i = 0; i < this.data.length; i++) {
    element = this.createElement('circle');
    element.setMultyAttributes({r: 5,
                              cx: this.workSpace.maxX - (this.data[i][1] * this.relativeValueX)+20,
                              cy: this.workSpace.maxY - (this.data[i][0] * this.relativeValueY)+10
                            });
    child = this.createElement('g');
    child.setMultyAttributes({class: 'dotbar'});
    child.appendChild(element);
    valuesContainer.appendChild(child);
  }
  this.rootElement.appendChild(valuesContainer);
  this.drawLevels();
}

function LinearGraph(svgId, data){
  this.data = data;
  this.__proto__ = window.ProtoGraph;
  this.rootElement = document.getElementById(svgId);
  this.workSpaceCalculations();
  this.drawGuideLines();
  // Building a graph
  var globalGroup = this.createElement('g'),
      polyGroup,
      circle,
      polyline,
      points,
      x, y;
  globalGroup.setMultyAttributes({class: 'values'});
  for (var p = 0; p < this.data.length; p++) {
    points = [];
    polyGroup = this.createElement('g');
    polyGroup.setMultyAttributes({class: 'poly'});
    for (var i = 0; i <  this.data[p].length; i++) {
      x = (this.workSpace.maxX / this.data[p].length * i)+20;
      y = this.workSpace.maxY - (this.data[p][i] * this.relativeValueY)+10;
      points.push(x+','+y);
      circle = this.createElement('circle');
      circle.setMultyAttributes({cx: x,
                                cy: y,
                                r:  5
                              });
      polyGroup.appendChild(circle);
    }
    polyline = this.createElement('polyline');
    polyline.setMultyAttributes({points: points.join(' ')});
    polyGroup.appendChild(polyline);
    globalGroup.appendChild(polyGroup);
  }
  this.rootElement.appendChild(globalGroup);
  this.drawLevels();
}
