export default function($routeProvider) {
	$routeProvider.
	when('/', {
		templateUrl: 'views/contacts-list.html',
		controller: 'ContactsListCtrl'
	}).
	when('/contact/:contactId', {
		templateUrl: 'views/contacts-detail.html',
		controller: 'ContactDetailCtrl'
	}).
	when('/contact/new', {
		templateUrl: 'views/contacts-detail.html',
		controller: 'ContactDetailCtrl'
	}).
	otherwise({
		redirectTo: '/'
	});
};