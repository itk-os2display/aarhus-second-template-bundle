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
            headers: [
              '', '', '', ''
            ],
            rows: [
              [
                {
                  type: 'date',
                  value: null,
                },
                '',
                '',
                ''
              ]
            ],
          };
        }

        scope.addRow = function addRow() {
          // @TODO: variable columns.
          scope.slide.options.table.rows.push(['','','','']);

          console.log(scope.slide.options.table.rows);
        };

        scope.removeRow = function removeRow(index) {
          console.log(index);
          scope.slide.options.table.rows.splice(index, 1);
        };
      },
      templateUrl: '/bundles/itkaarhussecondtemplate/apps/aarhusSecondTemplates/table-tool.html'
    };
  }
]);
