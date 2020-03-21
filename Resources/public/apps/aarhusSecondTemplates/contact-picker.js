/**
 * @file
 * Contains the ContactPicker directive.
 */

/**
 * ContactPicker tool.
 */
angular.module('aarhusSecondTemplates').directive('contactPicker', [
  'mediaFactory', 'busService', function (mediaFactory, busService) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        slide: '=',
        close: '&',
        tool: '='
      },
      link: function (scope) {
        var selectedContact = null;
        scope.step = null;
        scope.selectedMedia = [];
        scope.selectedMediaType = 'image';

        if (!scope.slide.options.contacts) {
          scope.slide.options.contacts = {};
        }

        scope.addContact = function () {
          var id = Date.now();
          scope.slide.options.contacts[id] = {
            id: id,
            name: '',
            title: '',
            phone: '',
            email: ''
          };
        };

        scope.removeContact = function (contact) {
          delete scope.slide.options.contacts[contact.id];

          // @TODO: Remove media from media list.
        };

        /**
         * Remove the media from the given index.
         *
         * @param pickedIndex The index to remove.
         */
        scope.removeMedia = function(pickedIndex) {
          scope.slide.options[pickedIndex] = null;

          // @TODO: Remove from media list.
        };

        /**
         * Set the step to background-picker.
         */
        scope.backgroundPicker = function backgroundPicker(contact) {
          selectedContact = contact;

          scope.step = 'background-picker';
        };

        /**
         * Set the step to pick-from-media.
         */
        scope.pickFromMedia = function pickFromMedia() {
          if (selectedContact &&
              selectedContact.imageId !== "" &&
              selectedContact.imageId !== null &&
              selectedContact.imageId !== undefined) {
            scope.selectedMedia = [scope.slide.media[selectedContact.imageId]];
          }

          scope.step = 'pick-from-media';
        };

        /**
         * Set the step to pick-from-computer.
         */
        scope.pickFromComputer = function pickFromComputer() {
          scope.step = 'pick-from-computer';
        };

        scope.back = function back() {
          scope.selectedMedia = [];
          scope.step = null;
          selectedContact = null;
        };

        /**
         * Add a media from scope.slide.media.
         *
         * @param clickedMedia
         */
        var clickMedia = function (clickedMedia) {
          var mediaList = [];
          var found = false;
          var mediaIndex = null;

          // See if the media is already in the media list.
          for (var i in scope.slide.media) {
            if (scope.slide.media.hasOwnProperty(i)) {
              var media = scope.slide.media[i];

              if (media.id === clickedMedia.id) {
                found = true;
                mediaIndex = parseInt(i);
              }
              mediaList.push(media);
            }
          }

          // If the media is not already in mediaList, add it.
          if (!found) {
            mediaList.push(clickedMedia);
            mediaIndex = mediaList.length - 1;
          }

          selectedContact.imageId = mediaIndex;

          scope.step = null;
          scope.slide.media = mediaList;
        };

        // Register event listener for select media.
        scope.$on('mediaOverview.selectMedia', function (event, media) {
          clickMedia(media);
        });

        // Register event listener for media upload success.
        scope.$on('mediaUpload.uploadSuccess', function (event, data) {
          mediaFactory.getMedia(data.id).then(
            function success(media) {
              scope.slide.media.push(media);
              selectedContact.imageId = scope.slide.media.indexOf(media);

              scope.step = null;
            },
            function error(reason) {
              busService.$emit('log.error', {
                'cause': reason,
                'msg': 'Kunne ikke tilføje media.'
              });
            }
          );
        });
      },
      templateUrl: '/bundles/itkaarhussecondtemplate/apps/aarhusSecondTemplates/contact-picker.html'
    };
  }
]);
