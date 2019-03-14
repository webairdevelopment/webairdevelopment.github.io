const
    card = document.querySelectorAll('.card'),
    storyWindow = card[0].querySelectorAll('.parallax'),
    span = document.querySelector('span')

window.addEventListener("mousemove",mouseparallax,true)

window.addEventListener("deviceorientation", handleOrientation, true)

function handleOrientation(e){
    var
        orientation = [
            event.absolute,
            event.alpha,
            event.beta,
            event.gamma]
    
    card[0].setAttribute('style','transform: rotateX('+ (orientation[2]*0.2-10) +'deg) rotateY('+ (orientation[3]*0.2) +'deg)')
    for(i=0;i < storyWindow.length;i++){
        var el = storyWindow[i]
        el.setAttribute('style','transform: translateX('+ (orientation[2]*0.2-10*(i+1)) +'px) translateY('+ (orientation[3]*0.3*(i+1)) +'px) scale(1.33)')
    }
}


function mouseparallax(e){
    var
        orientation = [
            (e.clientX/(window.innerWidth)*20-10),
            -(e.clientY/(window.innerHeight)*20-15)
        ]

    card[0].setAttribute('style','transform: rotateY('+ (orientation[0]) +'deg) rotateX('+ orientation[1] +'deg)')
    for(i=0;i < storyWindow.length;i++){
        var el = storyWindow[i]
        el.setAttribute('style','transform: translateX('+ (orientation[0]*(i+1)) +'px) translateY('+ (orientation[1]*(i+1)) +'px) scale(1.33)')
    }
}