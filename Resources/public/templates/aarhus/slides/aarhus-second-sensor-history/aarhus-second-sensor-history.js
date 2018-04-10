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
        setup: function setupBaseSlide (scope) {
            var slide = scope.ikSlide;

            // Load font-awesome icons.
            if (!window.FONT_AWESOME) {
                window.FONT_AWESOME = true;
                $.getScript(slide.path + "/../../../assets/fontawesome.js", function( data, textStatus, jqxhr ) {});
            }

            // Only show first image in array.
            if (slide.media_type === 'image' && slide.media.length > 0) {
                slide.currentImage = slide.media[0].image;
            }

            // Set currentLogo.
            slide.currentLogo = slide.logo;

            // Setup the inline styling
            scope.theStyle = {
                width: '100%',
                height: '100%',
                fontsize: slide.options.fontsize * (scope.scale ? scope.scale : 1.0) + 'px'
            };

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
        run: function runBaseSlide (slide, region) {
            region.itkLog.info('Running itk-aarhus-second-sensor-history facts slide: ' + slide.title);

            var runningFactTimeout = null;

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

            var slideElement = angular.element('.slide-' + slide.uniqueId);
            var duration = slide.duration !== null ? slide.duration : 15;
            var maxDuration = Math.min(2500, duration / 2 * 1000);

            slide.counters = $(slideElement).find('.js-counter');
            slide.counters.text('0');

            // Wait fadeTime before start to account for fade in.
            region.$timeout(function () {
                angular.forEach(slide.counters, function(element) {
                    element = $(element);
                    var countTo = element.attr('data-count');

                    $({ countNum: element.text()}).animate({
                            countNum: countTo
                        },
                        {
                            duration: Math.min((countTo * 10) + 250, maxDuration),
                            easing: 'linear',
                            step: function() {
                                // Replace dash with minus character.
                                element.text(Math.ceil(this.countNum).toString().replace(/^-/, '−'));
                            }
                        });
                }, region.fadeTime);

                // Set the progress bar animation.
                region.progressBar.start(duration);

                // Wait for slide duration, then show next slide.
                // + fadeTime to account for fade out.
                region.$timeout(function () {
                    // Remove fact timeout if it exists.
                    if (runningFactTimeout !== null) {
                        region.$timeout.cancel(runningFactTimeout);
                    }

                    region.nextSlide();
                }, duration * 1000 + region.fadeTime);
            }, region.fadeTime);
        }
    };
}
