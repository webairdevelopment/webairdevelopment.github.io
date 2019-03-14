new Vue({
  el: "#app",
  data: {
    password: "",
    width: 0,
    barColor: "red",
    strength: "",
    indicator: {
      "red": "weak",
      "yellow": "medium",
      "blue": "strong"
    }
  },
  watch: {
    password: function(value) {
      this.$emit('onchange', value);
      this.checkPassword();
    }
  }, 
  methods: {
    checkPassword: function() {
      let len = this.password.length; 
      this.width = len * 15;
      if(len < 5) {
        this.barColor = "red";
        this.strength = this.indicator["red"];
      }
      
      if(len >= 5) {
        this.barColor = "yellow";
        this.strength = this.indicator["yellow"];
      }
      
      if(len >= 10) {
        this.barColor = "blue";
        this.strength = this.indicator["blue"];
      }
    }
  }
})