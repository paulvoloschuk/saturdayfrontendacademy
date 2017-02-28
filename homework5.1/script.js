window.onload = function(){

  var searchContainer = document.getElementsByTagName('section')[0];
  var searchContainerContent = searchContainer.innerHTML;
  var searchInput = document.getElementById('search');
  var matchings = 0;
  searchInput.onkeyup = function(){window.matchings = 0; Search();Matchings();};

  function Search(container){
    searchContainer.innerHTML = searchContainerContent;
    if (searchInput.value !== '') {
      var reg = new RegExp(searchInput.value, "g");
      for (var i = 0; i < searchContainer.children.length; i++) {
        if (searchContainer.children[i].children.length == 0) {
          searchContainer.children[i].innerHTML = searchContainer.children[i].innerHTML.replace(reg, function(){
              window.matchings++;
              return '<span class="highlight">'+searchInput.value+'</span>';
          });
        } else {
          Search(searchContainer.children[i]);
        }
      }
    }
  }
  function Matchings(){
    document.getElementById('matchings').innerHTML = window.matchings;
  }
}

// nodeValue
// textContent
// wholeText
// data
