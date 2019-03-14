new Vue({
  el: "#app",
  data() {
    return {
      positionY: 0,
      ratio: 1,
      pageHeight: null,
      elements: []
    };
  },

  computed: {
    computedPosition() {
      return {
        transform: `translate3D(0, -${this.positionY}px, 0)`
      };
    },

    getPageHeight() {
      return {
        height: `${this.pageHeight}px`
      };
    }
  },

  mounted() {
    var content = document.querySelector(".txt");
    var rect = content.getBoundingClientRect();
    this.pageHeight = rect.height - window.innerHeight;

    this.support = this.getSupport();
    if (this.support.isFirefox) {
      this.ratio = 15;
    }

    this.elements = document.querySelectorAll("p");

    document.onwheel = e => {
      this.positionY = this.clamp(
        this.positionY + e.deltaY * this.ratio,
        0,
        this.pageHeight
      );
      this.animateElements();
    };
  },

  methods: {
    getSupport() {
      return {
        isFirefox: navigator.userAgent.indexOf("Firefox") > -1
      };
    },
    clamp(value, min, max) {
      return Math.min(Math.max(min, value), max);
    },
    animateElements() {
      this.elements.forEach((el, i) => {
        TweenMax.to(el, 0.7, {
          y: -this.positionY,
          opacity: 1,
          delay: i * 0.02,
          ease: Expo.easeOut
        });
      });
    }
  }
});