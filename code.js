var doc = {
    designedFor: "Gloden Customer",
    designedBy: "Qinwen Shi",
    date: "Today",
    version: 7,
    sections: {
        keyPartners: [{label: "wheeee!!!"}],
        keyActivities: [],
        keyResources: [],
        valuePropositions: [],
        customerRelationships: [],
        channels: [],
        customerSegments: [{label: "one"}, {label: "two"}, {label: "three"}],
        costStructure: [],
        revenueStreams: []
    }
};

var tableLayout = [
    [
        { title: "Key Partners",
          icon: "link",
          key: "keyPartners",
          rowspan: 2,
          colspan: 2 },

        { title: "Key Activities",
          icon: "check",
          key: "keyActivities",
          rowspan: 1,
          colspan: 2 },

        { title: "Value Proposition",
          icon: "gift",
          key: "valuePropositions",
          rowspan: 2,
          colspan: 2 },

        { title: "Customer Relationships",
          icon: "heart",
          key: "customerRelationships",
          rowspan: 1,
          colspan: 2 },

        { title: "Customer Segments",
          icon: "user",
          key: "customerSegments",
          rowspan: 2,
          colspan: 2 }
    ], [
        { title: "Key Resources",
          icon: "tree-deciduous",
          key: "keyResources",
          rowspan: 1,
          colspan: 2 },

        { title: "Channels",
          icon: "send",
          key: "channels",
          rowspan: 1,
          colspan: 2 }
    ], [
        { title: "Cost Structure",
          icon: "tags",
          key: "costStructure",
          rowspan: 1,
          colspan: 5 },

        { title: "Revenue Streams",
          icon: "usd",
          key: "revenueStreams",
          rowspan: 1,
          colspan: 5 }
    ]
];

var app = angular.module('BusinessModelCanvas', ['ui.keypress', 'LocalStorageModule', 'ngTouch'])
.config(function(localStorageServiceProvider){
  localStorageServiceProvider.setPrefix('bmc');
});

app.controller('RootController', function($scope, localStorageService) {
    var storedBusinessModel = localStorageService.get('localBusinessModel');
    $scope.doc = storedBusinessModel || doc;
    $scope.tableLayout = tableLayout;

    $scope.$watch('doc', function(){
        localStorageService.set('localBusinessModel', $scope.doc);
    }, true);

    $scope.clearAll = function(){
      (localStorageService.clearAll)();
      $scope.doc = doc;
    };
});

app.controller('SectionController', function($scope) {
    $scope.addItem = function() {
        var newItem = { label: "New Item" };
        $scope.doc.sections[$scope.cell.key].push(newItem);
        $scope.lastAddedItem = newItem;
    };
});

app.directive('bmcFocusWhen', function($timeout) {
    return {
        scope: { bmcFocusWhen: "=" },
        link: function(scope, element, attrs) {
            scope.$watch('bmcFocusWhen', function(value) {
                if(value) {
                    $timeout(function() { element[0].focus(); });
                }
            });
        }
    };
});

app.directive('bmcEditableLabel', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: { model: '=', justAdded: '='},
        templateUrl: 'editableLabel.html',
        link: function(scope, element, attrs) {
            scope.editing = scope.justAdded;
            scope.edit = function() {
                scope.editing = true;
            };

            scope.stopEditing = function() {
                scope.editing = false;
            };
        }
    };
});

app.directive('bmcSelectAll', function($parse, $timeout) {
   return {
       restrict: 'A',
       link: function(scope, element, attrs) {
           if($parse(attrs.bmcSelectAll)(scope)) {
               $timeout(function() { element[0].select(); });
           }
       }
   };
});

