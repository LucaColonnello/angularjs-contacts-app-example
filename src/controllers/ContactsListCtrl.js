export default class ContactsListCtrl {

	constructor(
		ContactsStore
,		ContactsActionCreators
,		$rootScope
,		$scope
,		Dispatcher
	) {
		// set vars
		this.Dispatcher = Dispatcher;
		this.$root = $rootScope;
		this.$scope = $scope;
		this.ContactsStore = ContactsStore;
		this.ContactsActionCreators = ContactsActionCreators;

		// set scope data
		this.$scope.contacts = this.ContactsStore.collection || [ ];
		this.$scope.selectedContacts = this.ContactsStore.selected;

		// set handlers
		this.$scope.toggleSelectContact = ::this.toggleSelectContact;
		this.$scope.deleteSelected = ::this.deleteSelected;


		// overwrite to apply binding
		// if we call twice bind in add and remove
		// we can't be able to remove the listener, because it's a new one
		this.contactsChangeListener = ::this.contactsChangeListener;
		
		// add listeners to stores
		this.ContactsStore.addChangeListener( this.contactsChangeListener );

		// listen destroy and remove listerner to stores
		$scope.$on( "$destroy", function( ) {
			this.ContactsStore.removeChangeListener( this.contactsChangeListener );
		}.bind( this ) );
	}

	toggleSelectContact ( contact ) {
		// when you click a checkbox its value change immediatly
		// so if the value was false, now is true and it means that is has to be selected
		if( contact.selected ) {
			this.ContactsActionCreators.SelectContact( contact );
		} else {
			this.ContactsActionCreators.UnselectContact( contact );
		}
	}

	deleteSelected( ) {
		this.ContactsActionCreators.DeleteSelectedContacts( );
	}

	contactsChangeListener ( ) {
		this.$scope.contacts = this.ContactsStore.collection;
		this.$scope.selectedContacts = this.ContactsStore.selected;
		
		// use safe apply here
		// this code gives an '$apply is already in progress' error
		// we have to call apply because changes could not be triggered only by an angular call such as UI event,
		// they could be triggered by an action
		// https://coderwall.com/p/ngisma/safe-apply-in-angular-js
		var phase = this.$root.$$phase;
		if( phase != '$apply' && phase != '$digest' )
			this.$scope.$apply( );
	}

}