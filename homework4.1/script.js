function formatTime(arr){
  var result = [];
  for (var i = 0; i < arr.length; i++) {
    result[i] = (arr[i].toString().length == 1) ? '0' + arr[i].toString() : arr[i];
  }
  return result.reverse().join(':');
}

function Stopwatch(){
  this.rootElement    = document.getElementById('stopwatch');
  this.timeContainer  = document.getElementById('time');
  this.lapsContainer  = document.getElementById('laps');
  this.cLapContainer  = document.getElementById('current_lap');
  this.memoryContainer= document.getElementById('memory');
  this.arrowIndicator = document.getElementById('arrow');
  this.laps = [];
  this.time = [0,0,0];
  this.laptime = [0,0,0];
  this.currentLap = 0;
  this.bestLap = false;
  this.worstLap = false;
  this.interval;

  this.startRun = function(){
    this.arrowIndicator.className = 'arrow animate';
    this.rootElement.className = 'active';
    this.interval = setInterval(function(){Stopwatch.timeCount()},10)
  }

  this.stopRun = function(){
    this.arrowIndicator.className += ' pause';
    this.rootElement.className = '';
    clearInterval(this.interval);
  }

  this.resetRun = function(){
    this.arrowIndicator.className = 'arrow';
    this.memoryContainer.className = '';
    this.timeContainer.innerHTML = '00:00:00';
    this.lapsContainer.innerHTML = '';
    this.time = this.laptime = [0,0,0];
    this.currentLap = 0;
    this.laps = [];
    this.bestLap = false;
    this.worstLap = false;

  }

  this.timeCount = function(){
    this.time[0]++;
    this.laptime[0]++;
    if(this.time[0] == 100){
      this.time[0] = 0;
      this.time[1]++;
    }
    if(this.laptime[0] == 100){
      this.laptime[0] = 0;
      this.laptime[1]++;
    }
    if(this.time[1] == 60){
      this.time[1] = 0;
      this.time[2]++;
    }
    if(this.laptime[1] == 60){
      this.laptime[1] = 0;
      this.laptime[2]++;
    }
    if(this.time[2] == 60){
      this.stopRun();
    }
    this.cLapContainer.innerHTML = '<span>'+(this.currentLap+1)+'.</span>'+formatTime(this.laptime);
    this.timeContainer.innerHTML = formatTime(this.time);
  }

  this.newLap = function(){
    this.laps.push(formatTime(this.laptime));
    this.laptime = [0,0,0];
    this.currentLap++;
    if(this.laps.length > 0){
      this.memoryContainer.className = 'active';
    }
    if(this.laps.length > 2){
      this.bestLap = this.laps.indexOf(this.laps.slice(0).sort()[0]);
      this.worstLap = this.laps.indexOf(this.laps.slice(0).sort().reverse()[0]);
    }
    this.updateLapList();
  }

  this.updateLapList = function(){
    console.log(this.bestLap, this.worstLap);
    var HTML = '', message;

    for (var i = this.laps.length-1; i >= 0; i--) {
      if (i === this.bestLap) message = '<i>Best lap</i>';
      else if (i === this.worstLap) message = '<i>Worst lap</i>';
      else  message = '';
      HTML += '<li><span>'+(i+1)+'. '+message+'</span>'+this.laps[i]+'</li>';
    }
    this.lapsContainer.innerHTML = HTML;
  }

  document.getElementById('start_control').onclick = function(e){Stopwatch.startRun()};
  document.getElementById('stop_control').onclick = function(e){Stopwatch.stopRun()};
  document.getElementById('reset_control').onclick = function(e){Stopwatch.resetRun()};
  document.getElementById('lap_control').onclick = function(e){Stopwatch.newLap()};

}

var Stopwatch = new Stopwatch();
