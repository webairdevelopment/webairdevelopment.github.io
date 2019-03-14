const rounds = Array.from(document.querySelectorAll('main div'));

if (rounds[0].animate) {
  const duration = 3000;
  rounds.forEach((round, i) => {
    const mod = i % 2 === 0;
    round.animate([
      { 
        transform: 'rotate(0deg)',
        easing: 'ease-in-out'
      }, { 
        transform: 'rotate(90deg)',
        easing: 'ease-in-out'
      }, { 
        transform: 'rotate(180deg)',
        easing: 'ease-in-out'
      }, { 
        transform: 'rotate(270deg)',
        easing: 'ease-in-out'
      }, { 
        transform: 'rotate(360deg)',
        easing: 'ease-in-out'
      },
    ], {
      duration,
      direction: mod ? 'normal' : 'reverse',
      //easing: 'ease-in-out',
      delay: mod ? 0 : -(duration / 4),
      iterations: Infinity
    });
  });
}