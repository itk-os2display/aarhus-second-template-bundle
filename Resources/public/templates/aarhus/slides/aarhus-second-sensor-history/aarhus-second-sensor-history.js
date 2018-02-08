/**
 * itk-aarhus-second-sensor-history slide.
 */

// Register the function, if it does not already exist.
if (!window.slideFunctions['itk-aarhus-second-sensor-history']) {
  window.slideFunctions['itk-aarhus-second-sensor-history'] = {
    /**
     * Setup the slide for rendering.
     * @param scope
     *   The slide scope.
     */
    setup: function setupBaseSlide(scope) {
      var slide = scope.ikSlide;

      slide.factsLength = slide.options.texts ? slide.options.texts.length : 0;
      slide.factIndex = 0;
    },

    /**
     * Run the slide.
     *
     * @param slide
     *   The slide.
     * @param region
     *   The region object.
     */
    run: function runBaseSlide(slide, region) {
      region.itkLog.info("Running itk-aarhus-second-sensor-history facts slide: " + slide.title);

      var duration = slide.duration !== null ? slide.duration : 15;
      var runningFactTimeout = null;

        function skipAnimations() {
            region.$animate.enabled(false);

            region.$timeout(function () {
                region.$animate.enabled(true);
            });
        }

      /**
       * Go to next rss news.
       */
      var factTimeout = function () {
        runningFactTimeout = region.$timeout(function () {
          slide.factIndex = (slide.factIndex + 1) % slide.factsLength;
          factTimeout();
        }, 4000);
      };

      factTimeout();


      // Wait fadeTime before start to account for fade in.
      region.$timeout(function () {
          // Set the progress bar animation.
          region.progressBar.start(duration);

          // Wait for slide duration, then show next slide.
          // + fadeTime to account for fade out.
          region.$timeout(function () {
              if (runningFactTimeout !== null) {
                  region.$timeout.cancel(runningFactTimeout);
              }
              region.nextSlide();
          }, duration * 1000 + region.fadeTime);
      }, region.fadeTime);
    }
  };
}
