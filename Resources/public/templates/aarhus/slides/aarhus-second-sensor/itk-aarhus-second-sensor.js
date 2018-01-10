// Register the function, if it does not already exist.
if (!window.slideFunctions['itk-aarhus-second-sensor']) {
  window.slideFunctions['itk-aarhus-second-sensor'] = {
    /**
     * Setup the slide for rendering.
     * @param scope
     *   The slide scope.
     */
    setup: function setupCalendarSlide(scope) {
      var slide = scope.ikSlide;

      // Only show first image in array.
      if (slide.media_type === 'image' && slide.media.length > 0) {
        slide.currentImage = slide.media[0].image;
      }

      // Setup the inline styling
      scope.theStyle = {
        width: "100%",
        height: "100%",
        fontsize: slide.options.fontsize * (scope.scale ? scope.scale : 1.0)+ "px"
      };
    },

    /**
     * Run the slide.
     *
     * @param slide
     *   The slide.
     * @param region
     *   The region object.
     */
    run: function runCalendarSlide(slide, region) {
      region.itkLog.info("Running itk-aarhus-second-sensor slide: " + slide.title);

      slide.counters = $('.slide-' + slide.uniqueId + ' .counter');

      slide.counters.text("0");

      var duration = slide.duration !== null ? slide.duration : 15;

      var maxDuration = Math.min(2500, duration / 2 * 1000);

      // Wait fadeTime before start to account for fade in.
      region.$timeout(function () {
        slide.counters.each(function() {
          var $this = $(this),
            countTo = $this.attr('data-count');

          $({ countNum: $this.text()}).animate({
              countNum: countTo
            },
            {
              duration: Math.min((countTo * 10) + 250, maxDuration),
              easing: 'linear',
              step: function() {
                $this.text(Math.floor(this.countNum));
              },
              complete: function() {
                $this.text(this.countNum);
              }
            });
        });

        // Set the progress bar animation.
        region.progressBar.start(duration);

        // Wait for slide duration, then show next slide.
        // + fadeTime to account for fade out.
        region.$timeout(function () {
          region.nextSlide();
        }, duration * 1000 + region.fadeTime);
      }, region.fadeTime);
    }
  };
}
