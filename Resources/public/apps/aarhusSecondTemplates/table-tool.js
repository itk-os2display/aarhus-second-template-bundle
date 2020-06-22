/**
 * @file
 * Contains the TableTool directive.
 */

/**
 * Table tool.
 */
angular.module('aarhusSecondTemplates').directive('tableTool', [
  'busService', function (busService) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        slide: '=',
        close: '&',
        tool: '='
      },
      link: function (scope) {
        if (!scope.slide.options.table) {
          scope.slide.options.table = {
            title: '',
            headers: [],
            rows: [],
          };
        }

        scope.addColumn = function addColumn(type) {
          type = (typeof type !== 'undefined') ? type : 'text';

          var newHeader = {
            type: type,
            value: ''
          };

          scope.slide.options.table.headers.push(newHeader);

          for (var i = 0; i < scope.slide.options.table.rows.length; i++) {
            scope.slide.options.table.rows[i].push(angular.copy(newHeader));
          }
        };

        scope.removeColumn = function removeColumn(index) {
          // Remove column from headers.
          scope.slide.options.table.headers = scope.slide.options.table.headers.filter(function (el, elIndex) {
            return elIndex !== index;
          });

          // Remove column from each row.
          for (var rowIndex in scope.slide.options.table.rows) {
            var row = scope.slide.options.table.rows[rowIndex];

            row = row.filter(function (el, elIndex) {
              return elIndex !== index;
            });

            scope.slide.options.table.rows[rowIndex] = row;
          }
        };

        scope.addRow = function addRow() {
          var newRow = [];

          // Add a new cell for each header cell, of the headers type.
          for (var i = 0; i < scope.slide.options.table.headers.length; i++) {
            var header = scope.slide.options.table.headers[i];
            var newCell = {
              type: header.type,
              value: ''
            };

            newRow.push(newCell);
          }

          scope.slide.options.table.rows.push(newRow);
        };

        scope.removeRow = function removeRow(index) {
          scope.slide.options.table.rows = scope.slide.options.table.rows.filter(function (el, elIndex) {
            return elIndex !== index;
          });
        };

        scope.availableFontSizes = [
          {
            name: "Lille",
            value: 10
          },
          {
            name: "Normal",
            value: 12
          },
          {
            name: "Stor",
            value: 16
          },
          {
            name: "Meget stor",
            value: 20
          }
        ];
      },
      templateUrl: '/bundles/itkaarhussecondtemplate/apps/aarhusSecondTemplates/table-tool.html'
    };
  }
]);
