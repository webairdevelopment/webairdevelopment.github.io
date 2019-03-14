(function() {
  $('.lol-button .confirm-button').on('click', function() {
    $('.lol-button').addClass('confirm-disabled no-arrow');
    return $('.lol-button .button--text').text('In queue...');
  });

  $('.lol-button .cancel-button').on('click', function() {
    $('.lol-button').removeClass('confirm-disabled no-arrow');
    return $('.lol-button .button--text').text('Find match');
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiPGFub255bW91cz4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQSxDQUFBLENBQUUsNkJBQUYsQ0FBZ0MsQ0FBQyxFQUFqQyxDQUFvQyxPQUFwQyxFQUE2QyxRQUFBLENBQUEsQ0FBQTtJQUMzQyxDQUFBLENBQUUsYUFBRixDQUFnQixDQUFDLFFBQWpCLENBQTBCLDJCQUExQjtXQUNBLENBQUEsQ0FBRSwyQkFBRixDQUE4QixDQUFDLElBQS9CLENBQW9DLGFBQXBDO0VBRjJDLENBQTdDOztFQUlBLENBQUEsQ0FBRSw0QkFBRixDQUErQixDQUFDLEVBQWhDLENBQW1DLE9BQW5DLEVBQTRDLFFBQUEsQ0FBQSxDQUFBO0lBQzFDLENBQUEsQ0FBRSxhQUFGLENBQWdCLENBQUMsV0FBakIsQ0FBNkIsMkJBQTdCO1dBQ0EsQ0FBQSxDQUFFLDJCQUFGLENBQThCLENBQUMsSUFBL0IsQ0FBb0MsWUFBcEM7RUFGMEMsQ0FBNUM7QUFKQSIsInNvdXJjZXNDb250ZW50IjpbIiQoJy5sb2wtYnV0dG9uIC5jb25maXJtLWJ1dHRvbicpLm9uICdjbGljaycsIC0+XG4gICQoJy5sb2wtYnV0dG9uJykuYWRkQ2xhc3MgJ2NvbmZpcm0tZGlzYWJsZWQgbm8tYXJyb3cnXG4gICQoJy5sb2wtYnV0dG9uIC5idXR0b24tLXRleHQnKS50ZXh0ICdJbiBxdWV1ZS4uLidcbiAgXG4kKCcubG9sLWJ1dHRvbiAuY2FuY2VsLWJ1dHRvbicpLm9uICdjbGljaycsIC0+XG4gICQoJy5sb2wtYnV0dG9uJykucmVtb3ZlQ2xhc3MgJ2NvbmZpcm0tZGlzYWJsZWQgbm8tYXJyb3cnXG4gICQoJy5sb2wtYnV0dG9uIC5idXR0b24tLXRleHQnKS50ZXh0ICdGaW5kIG1hdGNoJ1xuICAiXX0=
//# sourceURL=coffeescript