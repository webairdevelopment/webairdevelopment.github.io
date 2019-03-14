class scrollEffect {
   constructor() {
      this.addHTML();
      this.crazyBorder = document.querySelector('.crazy-border');
      this.crazyBorder2 = document.querySelector('.crazy-border_2');
      this.crazyCircleSm = document.querySelector('.crazy-circle_sm');
      this.crazyCircleMd = document.querySelector('.crazy-circle_md');
      this.crazyCircleLg = document.querySelector('.crazy-circle_lg');

      this.events();
   }

   events() {
      window.addEventListener('scroll', this.scrollMe.bind(this));
   }

   scrollMe(e) {	
      this.scrollTop = window.scrollY;
      this.docHeight = document.documentElement.scrollHeight;
      this.winHeight = document.documentElement.clientHeight;
      this.scrollPercent = (this.scrollTop) / (this.docHeight - this.winHeight);
      this.scrollPercentRounded = Math.round(this.scrollPercent * 100);

      document.querySelector('.load').style.width = this.scrollPercentRounded + 'vw';
      document.querySelector('.foot-load').style.width = this.scrollPercentRounded + 'vw';

      this.moveY = scrollY * -1 / 20;
      this.moveCircle = scrollY * 1 / 80;
      this.crazyBorder.style.transform = "rotate(" + this.moveY + "deg)";
      this.crazyBorder2.style.transform = "rotate(" + this.moveY + "deg)";
      this.crazyCircleSm.style.boxShadow = 3 * this.moveCircle + 'px 5px 15px #ff1ead';
      this.crazyCircleMd.style.boxShadow = 3 * this.moveCircle + 'px 5px 15px #ff1ead';
      this.crazyCircleLg.style.boxShadow = 3 * this.moveCircle + 'px 5px 15px #ff1ead';
      this.crazyCircleSm.style.right = this.moveCircle * 3 + '%';
      this.crazyCircleMd.style.right = 30 + this.moveCircle * 2 + '%';
      this.crazyCircleLg.style.right = 10 + this.moveCircle + '%';
   }

   addHTML() {
      jQuery('.pop-nav').append(`
<div class="load"></div>
`);
      jQuery('.pop-grid').append(`
<div class="crazy-border"></div>
<div class="crazy-border_2"></div>
`);
      jQuery('.pop-body').append(`
<div class="crazy-circle_sm"></div>
<div class="crazy-circle_md"></div>
<div class="crazy-circle_lg"></div>
`);
      jQuery('.pop-foot').append(`
<div class="foot-load"></div>
`);

   }
}

document.addEventListener('DOMContentLoaded', mainInit);

function mainInit() {
   new scrollEffect();
}