(function() {
  
  new Engine({
    scope: {
      animationProgress: 0,
      animateAlternate: 0
    },
    shapes: function() {
      return [
        {
          origin: {
            x: 0,
            y: 0,
            z: .5
          },
          length: {
            x: 4,
            y: 4,
            z: 4
          },
          color: `rgba(255, 255, 136, ${.07 - .03 * this.animateAlternate})`
        },
        {
          origin: {
            x: 0,
            y: 0,
            z: 2
          },
          length: {
            x: 2.5,
            y: 2.5,
            z: 2.5
          },
          color: `rgba(255, 255, 136, ${.13 - .03 * this.animateAlternate})`
        },
        {
          origin: {
            x: 0,
            y: 0,
            z: 3
          },
          length: {
            x: 1.5,
            y: 1.5,
            z: 1.5
          },
          color: `rgba(255, 255, 255, ${.33 - .03 * this.animateAlternate})`
        },
        {
          type: 'pyramid',
          origin: {
            x: 0,
            y: 0,
            z: -2
          },
          length: {
            x: .5,
            y: .5,
            z: 1
          },
          color: '#6D4C41',
          rotateX: {
            rotation: 180
          }
        },
        {
          origin: {
            x: 0,
            y: 0,
            z: -1
          },
          length: {
            x: .5,
            y: .5,
            z: 2
          },
          color: '#4E342E'
        },
        {
          origin: {
            x: -.25,
            y: -.25,
            z: 1
          },
          length: {
            x: 1,
            y: 1,
            z: .25
          },
          color: '#616161'
        },
        {
          origin: {
            x: 0,
            y: 0,
            z: 1.25
          },
          length: {
            x: .5,
            y: .5,
            z: .5
          },
          color: '#4E342E'
        },
        {
          type: 'pyramid',
          origin: {
            x: -.5,
            y: .5,
            z: 1.85
          },
          length: {
            x: .5,
            y: .5,
            z: .4
          },
          color: '#424242',
          rotateX: {
            rotation: 180
          }
        },
        {
          origin: {
            x: -.5,
            y: .5,
            z: 2.25
          },
          length: {
            x: .5,
            y: .5,
            z: .75
          },
          color: '#424242'
        },
        {
          type: 'pyramid',
          origin: {
            x: -.5,
            y: .5,
            z: 3
          },
          length: {
            x: .5,
            y: .5,
            z: .4
          },
          color: '#424242'
        },
        {
          origin: {
            x: -.5,
            y: 0,
            z: 2
          },
          length: {
            x: .5,
            y: .5,
            z: .5
          },
          color: '#424242'
        },
        {
          type: 'pyramid',
          origin: {
            x: -1,
            y: 0,
            z: 2
          },
          length: {
            x: .5,
            y: .5,
            z: .5
          },
          color: '#424242',
          rotateY: {
            rotation: 90
          }
        },
        {
          type: 'pyramid',
          origin: {
            x: .5,
            y: -.5,
            z: 1.85
          },
          length: {
            x: .5,
            y: .5,
            z: .4
          },
          color: '#424242',
          rotateX: {
            rotation: 180
          }
        },
        {
          origin: {
            x: .5,
            y: -.5,
            z: 2.25
          },
          length: {
            x: .5,
            y: .5,
            z: .75
          },
          color: '#424242'
        },
        {
          type: 'pyramid',
          origin: {
            x: .5,
            y: -.5,
            z: 3
          },
          length: {
            x: .5,
            y: .5,
            z: .4
          },
          color: '#424242'
        },
        {
          origin: {
            x: 0,
            y: -.5,
            z: 2
          },
          length: {
            x: .5,
            y: .5,
            z: .5
          },
          color: '#424242'
        },
        {
          type: 'pyramid',
          origin: {
            x: 0,
            y: -1,
            z: 2
          },
          length: {
            x: .5,
            y: .5,
            z: .5
          },
          color: '#424242',
          rotateX: {
            rotation: -90
          }
        },
        {
          origin: {
            x: 0,
            y: 0,
            z: 2.5
          },
          length: {
            x: .5,
            y: .5,
            z: 3.5
          },
          color: '#FFAB00'
        },
        {
          origin: {
            x: -.5,
            y: 0,
            z: 3.5
          },
          length: {
            x: .5,
            y: .5,
            z: 1.5
          },
          color: '#FFAB00'
        },
        {
          origin: {
            x: 0,
            y: -.5,
            z: 4
          },
          length: {
            x: .5,
            y: .5,
            z: 1.5
          },
          color: '#FFAB00'
        },
        {
          type: 'pyramid',
          origin: {
            x: -.5,
            y: -.5,
            z: 1.85
          },
          length: {
            x: .5,
            y: .5,
            z: .4
          },
          color: '#424242',
          rotateX: {
            rotation: 180
          }
        },
        {
          origin: {
            x: -.5,
            y: -.5,
            z: 2.25
          },
          length: {
            x: .5,
            y: .5,
            z: .75
          },
          color: '#424242'
        },
        {
          type: 'pyramid',
          origin: {
            x: -.5,
            y: -.5,
            z: 3
          },
          length: {
            x: .5,
            y: .5,
            z: .4
          },
          color: '#424242'
        }
      ];
    },
    loop: function() {
      this.animationProgress = (this.animationProgress + .005) % 1;
      return this.animateAlternate = 1 - Math.abs(this.animationProgress * 2 - 1);
    },
    beforeInit: function() {
      this.$Isomer.lightColor = this.util.color('#FFD');
      this.$Isomer.colorDifference = .3;
      this.$Isomer.setLightPosition(-1, .25, 2);
      this.$Isomer.offsetY = 230;
      return this.init();
    }
  });

}).call(this);

