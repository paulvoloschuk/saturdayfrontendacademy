function CountF(){
  var varT = document.querySelector('#formula input[name="varT"]').value;
  var varV0 = document.querySelector('#formula input[name="varV0"]').value;
  var varG = 3;
  var result;
  if(isNaN(varT) || isNaN(varV0) || varT == "" || varV0 == ""){
    result = "h";
  } else {
      result = varV0 * varT + varG * varT * varT / 2;
  }
  document.querySelector('#result').innerHTML = result;
}
