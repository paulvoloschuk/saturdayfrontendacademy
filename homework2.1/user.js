function CountF(){
  var varT = document.querySelector('#formula input[name="varT"]').value;
  var varV0 = document.querySelector('#formula input[name="varV0"]').value;
  var varG = 3;
  var result;
  if(isNaN(varT) || isNaN(varV0) || varT == "" || varV0 == "") result = "h";
  else result = varV0 * varT + varG * varT * varT / 2;
  document.querySelector('#result').innerHTML = result;
}

function CountA(){
  var age = document.querySelector('#alcohol_age').value;
  var result_container = document.querySelector('#alcohol_access');
  var result = new Array();
  if(age === ""){
    result.msg = '';
    result.type = 'none';
   } else if(isNaN(age)){
    result.msg = 'Некоректные данные';
    result.type = 'undefined';
  } else if( 0 <= age && age < 9 ){
    result.msg = 'Вы уверены что Вам столько?';
    result.type = 'forbidden';

  } else if( 9<= age && age < 14){
    result.msg = 'Надо еще чуть подрасти';
    result.type = 'forbidden';

  } else if( 14 <= age && age < 18){
    result.msg = 'Только так что мама не видела';
    result.type = 'forbidden';
  } else if(age > 18 && age < 121 ){
    result.msg = 'Можно, но не нужно.';
    result.type = 'accept';
  } else if(age > 121){
    result.msg = 'Разве столько живут?';
    result.type = 'undefined';
  }

  result_container.innerHTML = result.msg;
  result_container.className = result.type;
  }
