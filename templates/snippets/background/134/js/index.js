function recursivelyAddOption(start, amt, cont){
  var container = document.getElementById(cont);
  container.innerHTML = '';
  for(var i = start; i <= amt; i++){
    var opt = document.createElement('option');
    opt.id = cont + '-' + i;
    opt.textContent = i.toString().length === 1 && cont !== 'hours' ? '0' + i.toString() : i;
    container.appendChild(opt);
  }
}

function getMaximumValue(id){
  var opts = document.getElementById(id).querySelectorAll('option');
  var select_vals = Array.prototype.map.call(opts, function(elm){
    return parseInt(elm.value);
  });
  return select_vals.sort(function(a, b){ return a - b })[select_vals.length - 1];
}

function convertTimeToRGB(value, id){
  return value * 255 / getMaximumValue(id);
}

window.onload = function(){
  recursivelyAddOption(1, 12, 'hours');
  recursivelyAddOption(0, 59, 'minutes');
  recursivelyAddOption(0, 59, 'seconds');
  var select_elms = document.querySelectorAll('select');
  document.getElementById('military-time-toggle').addEventListener('change', function(ev){
    var am_pm_elm = document.getElementById('am-pm');
    if(!ev.target.checked){
      recursivelyAddOption(1, 12, 'hours');
      am_pm_elm.className = 'visible';
    } else {
      recursivelyAddOption(0, 23, 'hours');
      am_pm_elm.className = '';
    }
  });
  Array.prototype.forEach.call(select_elms, function(elm){
    elm.addEventListener('change', function(ev){
      var hrs = parseInt(document.getElementById('hours').value);
      if(!document.getElementById('military-time-toggle').checked){
        console.log(document.getElementById('am-pm').value);
        hrs += document.getElementById('am-pm').value === 'PM' ? 12 : 0;
      } 
      var mins = parseInt(document.getElementById('minutes').value);
      var secs = parseInt(document.getElementById('seconds').value);
      document.documentElement.style.setProperty('--background-color', 'rgb(' + convertTimeToRGB(hrs, 'hours') + ',' + convertTimeToRGB(mins, 'minutes') + ',' + convertTimeToRGB(secs, 'seconds') + ')');
    });
  });
  
  document.getElementById('use-my-time').addEventListener('click', function(){
    var time = new Date();
    var hrs = time.getHours();
    if(!document.getElementById('military-time-toggle').checked){
      var am_pm = hrs > 12 ? 'PM' : 'AM';
      hrs -= hrs > 12 ? 12 : 0;
      document.getElementById('am-pm').value = am_pm;
    }
    var mins = time.getMinutes();
    var secs = time.getSeconds();
    document.getElementById('hours').value = hrs;
    document.getElementById('minutes').value = mins.toString().length === 1 ? '0' + mins.toString() : mins;
    document.getElementById('seconds').value = secs.toString().length === 1 ? '0' + secs.toString() : secs;
    document.documentElement.style.setProperty('--background-color', 'rgb(' + convertTimeToRGB(hrs, 'hours') + ',' + convertTimeToRGB(mins, 'minutes') + ',' + convertTimeToRGB(secs, 'seconds') + ')');
  });
}