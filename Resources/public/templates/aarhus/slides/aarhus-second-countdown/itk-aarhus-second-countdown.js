// Register the function, if it does not already exist.
if (!window.slideFunctions['itk-aarhus-second-countdown']) {
  window.slideFunctions['itk-aarhus-second-countdown'] = {
    /**
     * Setup the slide for rendering.
     * @param scope
     *   The slide scope.
     */
    setup: function setupCalendarSlide(scope) {
      var slide = scope.ikSlide;

      slide.zoom = 1.0;

      if ($.fn.FlipClock === undefined) {
        $.getScript(slide.path + "/flipclock.min.js", function( data, textStatus, jqxhr ) {});
      }

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
      region.itkLog.info("Running itk-aarhus-second-countdown slide: " + slide.title);

      slide.countdown = $('.slide-' + slide.uniqueId + ' .tpl-countdown-clock');

      if (Math.ceil((new Date()).getTime() / 1000) >= slide.options.countdown) {
        slide.countdownFinished = true;
      }

      if (slide.clockInstantiated && !slide.countdownFinished) {
        var currentDate = new Date();
        var futureDate  = new Date(slide.options.countdown * 1000);
        var diff = parseInt(futureDate.getTime() - currentDate.getTime()) / 1000;

        if (diff < 0) {
          diff = 0;
          slide.countdownFinished = true;
        }

        slide.clock.setTime(diff);
        slide.clock.start();
      }

      // Wait fadeTime before start to account for fade in.
      region.$timeout(function () {
        if (!$.fn.FlipClock || !slide.options.countdown) {
          region.nextSlide();
          return;
        }
        else {
          if (!slide.clockInstantiated && !slide.countdownFinished) {
            var currentDate = new Date();
            var futureDate  = new Date(slide.options.countdown * 1000);
            var diff = parseInt(futureDate.getTime() - currentDate.getTime()) / 1000;

            if (diff < 0) {
              diff = 0;
            }

            // Instantiate a countdown FlipClock
            slide.clock = slide.countdown.FlipClock(diff, {
              clockFace: 'DailyCounter',
              countdown: true,
              language:'da-dk',
              callbacks: {
                stop: function () {
                  if (Math.ceil((new Date()).getTime() / 1000) >= slide.options.countdown) {
                    region.$timeout(function() {
                      slide.countdownFinished = true;
                    });
                  }
                }
              }
            });

            var page = $('.slide-' + slide.uniqueId);
            var el = $('.slide-' + slide.uniqueId + ' .tpl-countdown');

            // Calculate zoom factor.
            slide.zoom = (page.width()) / el.width();

            slide.clockInstantiated = true;
          }
        }

        var duration = slide.duration !== null ? slide.duration : 60;

        // If within slide block period, do not continue to new slide, until
        // reaching slide.options.countdown_takeover_to.
        var now = (new Date()).getTime() / 1000;
        if (slide.options.countdown_takeover_from !== null &&
          slide.options.countdown_takeover_to !== null &&
          now > slide.options.countdown_takeover_from &&
          now < slide.options.countdown_takeover_to
        ) {
          duration = slide.options.countdown_takeover_to - now;
        }

        // Set the progress bar animation.
        region.progressBar.start(duration);

        // Wait for slide duration, then show next slide.
        // + fadeTime to account for fade out.
        region.$timeout(function () {
          slide.clock.stop();
          region.nextSlide();
        }, duration * 1000 + region.fadeTime);
      }, region.fadeTime);
    }
  };
}
