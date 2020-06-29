/**
 * @file
 * Contains the ContactPicker directive.
 */

/**
 * ContactPicker tool.
 */
angular.module('aarhusSecondTemplates').directive('contactTool', [
  'mediaFactory', 'busService', '$timeout', function (mediaFactory, busService, $timeout) {
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

        /**
         * Get contact length.
         *
         * @return {number}
         */
        scope.contactLength = function () {
          return Object.keys(scope.slide.options.contacts).length;
        };

        /**
         * Add an empty contact.
         */
        scope.addContact = function () {
          if (scope.contactLength() >= 6) {
            return;
          }

          var id = Date.now();
          scope.slide.options.contacts[id] = {
            id: id,
            name: '',
            title: '',
            phone: '',
            email: ''
          };
        };

        /**
         * Remove a contact.
         *
         * @param contact
         */
        scope.removeContact = function (contact) {
          delete scope.slide.options.contacts[contact.id];

          cleanupMediaList();
        };

        /**
         * Remove the media from the given contact.
         *
         * @param contactId The index to remove.
         */
        scope.removeMedia = function(contactId) {
          scope.slide.options.contacts[contactId].imageId = null;

          cleanupMediaList();
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

        /**
         * Back from image selection.
         */
        scope.back = function back() {
          scope.selectedMedia = [];
          scope.step = null;
          selectedContact = null;
        };

        /**
         * Cleanup slide.media list and update imageIds in contacts.
         */
        function cleanupMediaList() {
          var mediaList = scope.slide.media;

          // Map contact ids to image ids.
          var imageIndexToContactId = Object.values(scope.slide.options.contacts).reduce(function (carry, el) {
            if (el.imageId !== null && el.imageId !== undefined) {
              if (!carry[el.imageId]) {
                carry[el.imageId] = [];
              }
              carry[el.imageId].push(el.id);
            }
            return carry;
          }, {});

          // Reset imageIds for contacts.
          for (var contactIndex in scope.slide.options.contacts) {
            if (scope.slide.options.contacts.hasOwnProperty(contactIndex)) {
              scope.slide.options.contacts[contactIndex].imageId = null;
            }
          }

          // Create new mediaList and set imageIds for contacts.
          var newMediaList = [];
          for (var oldIndex in mediaList) {
            if (mediaList.hasOwnProperty(oldIndex)) {
              var alreadyAdded = false;
              var el = mediaList[oldIndex];
              var contactIds = imageIndexToContactId[oldIndex];

              for (var contactId in contactIds) {
                if (contactIds.hasOwnProperty(contactId)) {
                  contactId = contactIds[contactId];

                  if (contactId) {
                    if (!alreadyAdded) {
                      newMediaList.push(el);
                      alreadyAdded = true;
                    }
                    scope.slide.options.contacts[contactId].imageId = newMediaList.indexOf(el);
                  }
                }
              }
            }
          }

          scope.slide.media = newMediaList;
        }

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
          scope.step = null;

          mediaFactory.getMedia(data.id).then(
            function success(media) {
              $timeout(function () {
                scope.slide.media.push(media);
                selectedContact.imageId = scope.slide.media.indexOf(media);
              });
            },
            function error(reason) {
              busService.$emit('log.error', {
                'cause': reason,
                'msg': 'Kunne ikke tilføje media.'
              });
            }
          );
        });

        scope.availableSizes = [
          {
            name: "Normal",
            value: 'normal'
          },
          {
            name: "Stor",
            value: 'large'
          }
        ];
      },
      templateUrl: '/bundles/itkaarhussecondtemplate/apps/aarhusSecondTemplates/contact-tool.html'
    };
  }
]);
