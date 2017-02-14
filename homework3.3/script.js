function userForm(rootElement){
  this.rootElement = document.getElementById(rootElement);
  this.className = this.rootElement.className;

  this.getRandom = function(){
    var url = 'https://randomuser.me/api/?inc=name,phone';
    var request;
    Panel.rootElement.reset();
    document.getElementsByClassName('edit')[0].className = '';
    if(window.XMLHttpRequest) request = new XMLHttpRequest();
    else if(window.ActiveXObject) request = new ActiveXObject("Microsoft.XMLHTTP");
    else return;
    request.onreadystatechange = function(){
      switch (request.readyState) {
        case 1: {
          console.log('Preparing request');
          Panel.rootElement.className += ' loading';
          break;}
        case 2: console.log('Request sended');  break;
        case 3: console.log('Starting download'); break;
        case 4:{
        if(request.status == 200){
          console.info('Download complete');
          var requestJSON = JSON.parse(request.responseText);
          Panel.rootElement[0].value = requestJSON.results[0].name.title;
          Panel.rootElement[1].value = requestJSON.results[0].name.first;
          Panel.rootElement[2].value = requestJSON.results[0].name.last;
          Panel.rootElement[3].value = requestJSON.results[0].phone;
        } else if(request.status == 404) console.warn('Host not found');
        else console.warn('Server returning status: ' + request.status);
        break;
        }
      }
    }
    request.open ('GET', url, true);
    request.send ('');
    setTimeout(function(){Panel.rootElement.className = Panel.className;}, 500);
  }

  this.doAction = function(action = false, id = false){
    if(!action){
      var data = {
        title:  this.rootElement[0].value,
        first:  this.rootElement[1].value,
        last:   this.rootElement[2].value,
        phone:  this.rootElement[3].value
      };
      if(this.rootElement[4].value !== '') {
        Table.editRow(data, this.rootElement[4].value);
        Table.editingRow.className = '';
        Table.editingRow = false;
      }
      else Table.addRow(data);
    }else if(action == 'edit') {
      Table.editingRow.className = '';
      Table.editingRow = document.querySelector('button[data-id="'+id+'"]').parentNode.parentNode;
      Table.editingRow.className = 'edit';
      this.rootElement[0].value = Table.dataBase[id].title;
      this.rootElement[1].value = Table.dataBase[id].first;
      this.rootElement[2].value = Table.dataBase[id].last;
      this.rootElement[3].value = Table.dataBase[id].phone;
      this.rootElement[4].value = id;
    }else if(action == 'delete') {
      Table.deleteRow(id);
      this.rootElement.reset();
    }
    else {
      console.error(action);
    }
  }
}

function userDBView(rootElement){
  this.rootElement = document.getElementById(rootElement);
  this.className = this.rootElement.className;
  this.dataBase = [];
  this.buttons = [];
  this.editingRow = false;
  this.sortCollumn = false;


  this.addRow = function(row){
    this.dataBase.push(row);
    this.update();

  }

  this.editRow = function(data, id){
    this.dataBase[id] = data;
    this.update();
  }

  this.deleteRow = function(id){
    this.dataBase.splice(id,1);
    this.update();
  }

  this.update = function(){
    var HTML = '';
    localStorage.clear();
    for (var i = 0; i < this.dataBase.length; i++) {
      HTML += '<tr><td>'+(i+1)+'</td><td data-type="title">'+this.dataBase[i].title+'</td><td data-type="first">'+this.dataBase[i].first+'</td><td data-type="last">'+this.dataBase[i].last+'</td><td data-type="phone">'+this.dataBase[i].phone+'</td><td><button class="ghost action" data-id="'+i+'" data-action="edit">Edit</button><button class="ghost action warning inline" data-id="'+i+'" data-action="delete">Delete</button></td></tr>';
      localStorage.setItem(i, JSON.stringify(this.dataBase[i]));
    }
    this.rootElement.lastElementChild.innerHTML = HTML;
    this.buttons = document.querySelectorAll('button.action');
    for (var i = 0; i < this.buttons.length; i++) {
      this.buttons[i].onclick = function(e){
        Panel.doAction(e.target.attributes[2].value, e.target.attributes[1].value);
      }
    }
    Panel.rootElement.reset();
  }

  this.sortBy = function(target){
    var filterid = function(a, b){return (a.id > b.id) ? 1 : -1;};
    var filterfirst = function(a, b){return (a.first > b.first) ? 1 : -1;};
    var filterlast = function(a, b){return (a.last > b.last) ? 1 : -1;};
    var filtertitle = function(a, b){return (a.title > b.title) ? 1 : -1;};
    var filterphone = function(a, b){return (a.phone > b.phone) ? 1 : -1;};
    var sortBy = target.attributes[1].value;
    this.dataBase.sort(eval('filter' + sortBy));
    if (sortBy == this.sortCollumn){
      this.dataBase.reverse();
      this.rootElement.className = this.className+' sort-'+this.sortCollumn+' decrement';
      this.sortCollumn = false;
    } else{
      this.sortCollumn = sortBy;
      this.rootElement.className = this.className+' sort-'+this.sortCollumn;
    }
    this.update();
  }

  var i = 0;
  var result = true;
  this.sortControls = [];
  while(result){
    var result = localStorage.getItem(i);
    if(result){
      this.dataBase.push(JSON.parse(result));
      i++;
    }
  }
  this.sortControls = document.getElementsByClassName('sort');
  for (var j = 0; j < this.sortControls.length; j++)
    this.sortControls[j].onclick = function(e){Table.sortBy(e.target);}
  this.update();
}

// Initialize
var Panel = new userForm('controls');
var Table = new userDBView('db_view');

// Events
document.getElementById('random').onclick = function(e){Panel.getRandom();return false;};
document.getElementById('controls').onsubmit = function(e){Panel.doAction();return false;};
