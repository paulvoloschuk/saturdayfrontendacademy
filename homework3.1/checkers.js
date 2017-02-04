function Checkers(){
  // Инициализация
  this.container_checkers = document.getElementById('checkers');
  this.container_field = document.getElementById('field');
  this.container_figures = document.getElementById('figures');


  this.container_field.innerHTML = generateField();
  document.querySelectorAll('.cell').onclick = this.selectField();


  // Генерация таблицы
  function generateField(){
    var HTML = '';
    for(i=0;i<8;i++){
      HTML += '<div class="row" id="row-' + i  + '">';
      for(j=0;j<8;j++){
        HTML += '<div class="cell" id="cell-' + j + '"></div>';
      }
      HTML += '</div>';
    }
    return HTML;
  }


}

var Checkers = new Checkers();
