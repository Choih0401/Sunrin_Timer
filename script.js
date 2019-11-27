var app = angular.module('PomodoroApp', []);
app.controller('MainCtrl', function($scope, $interval) {
  $scope.breakLength = 0;
  $scope.sessionLength = 10;
  $scope.timeLeft = $scope.sessionLength;
  $scope.fillHeight = '0%';
  $scope.sessionName = 'Timer';
  $scope.currentTotal;
  
  var runTimer = false;
  var secs = 60 * $scope.timeLeft;
  $scope.originalTime = $scope.sessionLength;
  
  function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
    return (
      (h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s
    ); 
  }
  
  // Change default Timer length
  $scope.sessionLengthChange = function(Timer) {
    if (!runTimer){
      if ($scope.sessionName === 'Timer') {
        $scope.sessionLength += Timer;
        if ($scope.sessionLength < 1) {
          $scope.sessionLength = 1;
        }
        $scope.timeLeft = $scope.sessionLength;
        $scope.originalTime = $scope.sessionLength;
        secs = 60 * $scope.sessionLength;
      }
    }
  }
  
  // Change default break length
  $scope.breakLengthChange = function(Timer) {
    if (!runTimer){
      $scope.breakLength += Timer;
      if ($scope.breakLength < 0) {
        $scope.breakLength = 0;
      }
      if ($scope.sessionName === 'Break!') {
        $scope.timeLeft = $scope.breakLength;
        $scope.originalTime = $scope.breakLength;
        secs = 60 * $scope.breakLength;
      }
    }
  }
  
  $scope.toggleTimer = function() {
    if (!runTimer) {
      if ($scope.sessionName === 'Timer') {
        $scope.currentLength = $scope.sessionLength;
      } else {
        $scope.currentLength = $scope.breakLength;
      }
      
      updateTimer();
      runTimer = $interval(updateTimer, 1000);
    } else {
      $interval.cancel(runTimer);
      runTimer = false;
    }
  }
  
  function updateTimer() {
    secs -= 1;
    if (secs < 0) {
      // countdown is finished
      
      // Play audio
      var wav = 'http://notificationsounds.com/christmas-ringtones/slow-jingle-bells-539/download/mp3';
      var audio = new Audio(wav);
			audio.play();
      
      // toggle break and Timer
      $scope.fillColor = '#333333';
      if ($scope.sessionName === 'Break!') {
        $scope.sessionName = 'Timer';
        $scope.currentLength = $scope.sessionLength;
        $scope.timeLeft = 60 * $scope.sessionLength;
        $scope.originalTime = $scope.sessionLength;
        secs = 60 * $scope.sessionLength;
      } else if($scope.breakLength != 0){
        $scope.sessionName = 'Break!';
        $scope.currentLength = $scope.breakLength;
        $scope.timeLeft = 60 * $scope.breakLength;
        $scope.originalTime = $scope.breakLength;
        secs = 60 * $scope.breakLength;
      }else{
        $scope.sessionName = 'Timer';
        $scope.currentLength = $scope.sessionLength;
        $scope.timeLeft = 60 * $scope.sessionLength;
        $scope.originalTime = $scope.sessionLength;
        secs = 60 * $scope.sessionLength;
      }
    } else {
      if ($scope.sessionName === 'Break!') {
        $scope.fillColor = '#FF4444';
      } else {
        $scope.fillColor = '#99CC00';
      }
	    $scope.timeLeft = secondsToHms(secs);
      
      var denom = 60 * $scope.originalTime;
      var perc = Math.abs((secs / denom) * 100 - 100);
      $scope.fillHeight = perc + '%';
    }
  }
  
});


var Clock = (function(){

	var exports = function(element) {
		this._element = element;
		var html = '';
		for (var i=0;i<6;i++) {
      if(!i%2){
        html += '<span>&nbsp;&nbsp;</span>';
      }else{
        html += '<span>&nbsp;</span>';
      }
		}
		this._element.innerHTML = html;
		this._slots = this._element.getElementsByTagName('span');
		this._tick();
	};

	exports.prototype = {

		_tick:function() {
			var Timer = new Date();
			this._update(this._pad(Timer.getHours()) + this._pad(Timer.getMinutes()) + this._pad(Timer.getSeconds()));
			var self = this;
			setTimeout(function(){
				self._tick();
			},1000);
		},

		_pad:function(value) {
			return ('0' + value).slice(-2);
		},

		_update:function(timeString) {

			var i=0,l=this._slots.length,value,slot,now;
			for (;i<l;i++) {

				value = timeString.charAt(i);
				slot = this._slots[i];
				now = slot.dataset.now;

				if (!now) {
					slot.dataset.now = value;
					slot.dataset.old = value;
					continue;
				}

				if (now !== value) {
					this._flip(slot,value);
				}
			}
		},

		_flip:function(slot,value) {

			// setup new state
			slot.classList.remove('flip');
			slot.dataset.old = slot.dataset.now;
			slot.dataset.now = value;

			// force dom reflow
			slot.offsetLeft;

			// start flippin
			slot.classList.add('flip');

		}

	};

	return exports;
}());

var i=0,clocks = document.querySelectorAll('.clock'),l=clocks.length;
for (;i<l;i++) {
	new Clock(clocks[i]);
}

Vue.component('togglebutton', {
  props: ['label', 'name'],
  template: `<div class="togglebutton-wrapper" v-bind:class="isactive ? 'togglebutton-checked' : ''">
      <label v-bind:for="name">
        <span class="togglebutton-label">{{ label }}</span>
        <span class="tooglebutton-box"></span>
      </label>
      <input v-bind:id="name" type="checkbox" v-bind:name="name" v-model="isactive" v-on:change="onToogle">
  </div>`,
  model: {
    prop: 'checked',
    event: 'change'
  },
  data: function() {
    return {
      isactive:false
    }
  },
  methods: {
    onToogle: function() {
       this.$emit('clicked', this.isactive)
    }
  }
});

var todolist = new Vue({
  el: '#todolist',
  data: {
    newitem:'',
    sortByStatus:false,
    todo: [
    ]
  },
  methods: {
    addItem: function() {
      this.todo.push({id: Math.floor(Math.random() * 9999) + 10, label: this.newitem, done: false});
      this.newitem = '';
    },
    markAsDoneOrUndone: function(item) {
      item.done = !item.done;
    },
    deleteItemFromList: function(item) {
      let index = this.todo.indexOf(item)
      this.todo.splice(index, 1);
    },
    clickontoogle: function(active) {
      this.sortByStatus = active;
    }
  },
  computed: {
    todoByStatus: function() {

      if(!this.sortByStatus) {
        return this.todo;
      }

      var sortedArray = []
      var doneArray = this.todo.filter(function(item) { return item.done; });
      var notDoneArray = this.todo.filter(function(item) { return !item.done; });
      
      sortedArray = [...notDoneArray, ...doneArray];
      return sortedArray;
    }
  }
});