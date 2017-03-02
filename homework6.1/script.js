regForm = {
  level: 0,
  init: function(elementName){
      this.form = document.getElementById(elementName);
      this.form[this.form.length-1].callback = this.form[this.form.length-2].callback = this;
      this.form[this.form.length-1].onclick = this.nextLevel;
      this.form[this.form.length-2].onclick = this.prevLevel;
      this.form.onreset = this.resetInputsState;
      this.indicator = document.getElementById('indicator');
      this.progressbar = document.getElementsByClassName('progress')[0];
      this.fieldsets = document.getElementsByTagName('fieldset');
      this.slider = document.getElementsByClassName('slider')[0];
      this.inputs = document.querySelectorAll('input, select');
      this.form.onmousedown = this.onIndicatorClick;
      for (var i = 0; i < this.inputs.length; i++) {
        this.inputs[i].onkeyup = this.onInputChange;
        this.inputs[i].onchange = this.onInputChange;
      }
      this.updateStyle();
  },
  onInputChange: function(){
    if(event instanceof KeyboardEvent && event.code == 'Enter'){
      regForm.form[this.form.length-1].dispatchEvent(new Event('click', {bubbles: false}));
    } else {
      if (this.value !== '') this.classList.add('focus');
      else this.classList.remove('focus');
    }
  },
  nextLevel: function(){
    if (this.callback.validateFieldset()) {
      this.callback.level++;
      if (this.callback.level !== 0) this.callback.form[this.callback.form.length-2].removeAttribute('disabled');
      if (this.callback.level == 3){
        this.callback.level = 0;
        this.callback.submit();
      }
      this.callback.updateStyle();
    }
  },
  prevLevel: function(){
    this.callback.level--;
    this.callback.updateStyle();
  },
  updateStyle: function(){
    for (var i = 0; i < this.progressbar.children.length; i++) {
      if (i <= this.level) this.progressbar.children[i].classList.add('active');
      else this.progressbar.children[i].classList.remove('active');
      if (i == this.level) this.slider.children[i].classList.add('active');
      else this.slider.children[i].classList.remove('active');
    }
    this.slider.style.height = this.slider.children[this.level].clientHeight+'px';
    this.slider.style.marginLeft = (this.level*this.slider.children[this.level].clientWidth*(-1))+'px';
    if (this.level == 0) this.form[this.form.length-2].setAttribute('disabled', true);
    this.form[this.form.length-1].innerHTML = (this.level == 2) ? 'Send' : 'Next';
    setTimeout(function(){regForm.fieldsets[regForm.level].elements[0].focus()},300);

  },
  resetInputsState: function(){
    for (var i = 0; i < this.length; i++) {
      this[i].classList.remove('focus');
    }
  },
  onIndicatorClick: function(){
    if (this.classList.contains('complete')){
      this.classList.remove('complete');
      window.regForm.indicator.innerHTML = "2";
    }
  },
  submit: function(){
    var resultArray = {};
    for (var i = 0; i < this.form.length; i++) {
      if (this.form[i].localName == 'input' || this.form[i].localName == 'select') {
        resultArray[this.form[i].name] = this.form[i].value;
      }
    }
    resultArray.toString = function() {
      var text = '', value;
      for (var key in this){
        switch (typeof this[key]) {
          case 'function':
            value = 'function()';
            break;
          case 'object':
            value = '(object)';
            break;
          default:
          value = this[key];
        }
        text += '<p><span>'+key+'</span>: '+value+'</p>'
      }
      return text;
    }
    this.form.classList.add('complete');
    console.log(this.form.classList);
    this.indicator.innerHTML = "✔";
    this.send(resultArray);
    this.form.reset();
  },
  send: function(data){
    document.getElementById('result').innerHTML = data;
  },
  validateFieldset: function(){
    var input, errorCount = 0, errorMsg;
    var regExps = {
      email: /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm,
      password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/,
      phone: /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/,
      creditcard: /^[0-9]{13,16}$/,
      icq: /^([1-9])+(?:-?\d){4,}$/,
      domen: /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/,
      ipv4: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
      ipv6: /^((^|:)([0-9a-fA-F]{0,4})){1,8}$/,
      day: /^[0-9]{1,2}$/,
      mounth: /^[0-9]{1,2}$/,
      year: /^[0-9]{4}$/,
      word: /^[a-zA-Zа-яА-Я]+$/
    };
    var notices ={
      email: "Please enter a valide email",
      phone: "Please enter a valide phone number",
      equal: "Passwords must be equal",
      required: "This field is required",
      password: "Your password is week",
      maxlength: "Row musn't have length more than ",
      minlength: "Row must have length atleast ",
      day: "Please enter a valid date dd:mm:yy",
      mounth: this.day,
      year: this.day
    }
    for (var i = 0; i < this.fieldsets[this.level].elements.length; i++) {
      errorMsg = '';
      input = this.fieldsets[this.level].elements[i];
      if (input.hasAttribute('maxlength') && input.value.length > input.getAttribute('maxlength') && input.value !== '')
        errorMsg = notices.maxlength+input.getAttribute('maxlength');
      if (input.hasAttribute('minlength') && input.value.length < input.getAttribute('minlength') && input.value !== '')
        errorMsg = notices.minlength+input.getAttribute('minlength');
      if (input.hasAttribute('pattern-name') && !regExps[input.getAttribute('pattern-name')].test(input.value) && input.value !== '')
        errorMsg = notices[input.getAttribute('pattern-name')];
      if (input.hasAttribute('required') && input.value == '')
        errorMsg = notices.required;
      if (input.hasAttribute('equal') && input.value !== this.fieldsets[this.level].elements[input.getAttribute('equal')].value && input.value !== '')
        errorMsg = notices.equal;
      if (errorMsg !== '') {
        errorCount++;
        input.parentElement.lastElementChild.innerHTML = '('+errorMsg+')';
      } else{
        input.parentElement.lastElementChild.innerHTML = '';
      }
    }
    return (errorCount)? false : true;
  }
}
window.onload = function(){
  // Init Functions
  var selects = document.getElementsByTagName('select');
  for (var i = 0; i < selects.length; i++) {
    var count = 1, edge = 0, HTML = '';
    switch (selects[i].name) {
      case 'day':
        edge = 31;
        break;
      case 'mounth':
        edge = 12;
        break;
      case 'year':
        count = 1917;
        edge = 2017;
        break;
    }
    for (count; count <= edge; count++) {
      HTML += '<option value="'+count+'">'+count+'</option>';
    }
    selects[i].innerHTML += HTML;
  }
  regForm.init('registration');
}
