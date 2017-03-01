regForm = {
  level: 0,
  init: function(elementName){
      this.form = document.getElementById(elementName);
      this.form[this.form.length-1].callback = this.form[this.form.length-2].callback = this;
      this.form[this.form.length-1].onclick = this.nextLevel;
      this.form[this.form.length-2].onclick = this.prevLevel;
      this.progressbar = document.getElementsByClassName('progress')[0];
      this.fieldsets = document.getElementsByTagName('fieldset');
      this.slider = document.getElementsByClassName('slider')[0];
      this.inputs = document.getElementsByTagName('input');

      for (var i = 0; i < this.inputs.length; i++) {
        if (this.inputs[i].type == 'text' || this.inputs[i].type == 'password') this.inputs[i].onkeyup = this.onInputChange;
        else this.inputs[i].onchange = this.onInputChange;
      }
      this.updateStyle();
  },
  onInputChange: function(){
    if (this.value !== '') this.classList.add('focus');
    else this.classList.remove('focus');
  },
  nextLevel: function(){
    if (this.callback.validateFieldset()) {
      this.callback.level++;
      if (this.callback.level !== 0) this.callback.form[this.callback.form.length-2].removeAttribute('disabled');
      if (this.callback.level == 2) this.innerHTML = 'Send';
      this.callback.updateStyle();
    }
  },
  prevLevel: function(){
    this.callback.level--;
    if (this.callback.level == 0) this.setAttribute('disabled', true);
    this.callback.form[this.callback.form.length-1].innerHTML = 'Next';
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
      year: /^[0-9]{4}$/
    };
    var notices ={
      email: "Please enter a valide email",
      equal: "Passwords must be equal",
      required: "This field is required",
      password: "Your password is week",
      maxlength: "Row musn't have length more than ",
      minlength: "Row must have length atleast "
    }
    for (var i = 0; i < this.fieldsets[this.level].elements.length; i++) {
      errorMsg = '';
      input = this.fieldsets[this.level].elements[i];
      if (input.hasAttribute('maxlength') && input.value.length >= input.getAttribute('maxlength') && input.value !== '')
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
    regForm.init('registration');

}
