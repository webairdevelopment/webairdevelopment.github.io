var items = document.querySelectorAll('.item');
var container = document.querySelector('.container');

// check to see if it's supported...
if ('IntersectionObserver' in window &&
'IntersectionObserverEntry' in window &&
'intersectionRatio' in window.IntersectionObserverEntry.prototype) {

  // create the observer
  observer = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.intersectionRatio > 0) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    // config
    root: container,
    rootMargin: '50px 20px',
    threshold: 1 });


  // attach the observer to our elements
  items.forEach(function (item) {
    observer.observe(item);
  });

} else
{
  container.innerHTML = "<p>your browser does not support intersectionObserver!</p>";
}