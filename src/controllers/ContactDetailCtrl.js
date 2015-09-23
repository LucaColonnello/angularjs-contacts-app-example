import assign from "lodash/object/assign";

export default class ContactDetailCtrl {

	constructor(
		ContactsStore
,		ContactsActionCreators
,		$rootScope
,		$scope
,		$routeParams
,		Dispatcher
	) {
		// set vars
		this.Dispatcher = Dispatcher;
		this.$root = $rootScope;
		this.$scope = $scope;
		this.$routeParams = $routeParams;
		this.ContactsStore = ContactsStore;
		this.ContactsActionCreators = ContactsActionCreators;

		// set scope data
		if( this.$routeParams.contactId && !isNaN( parseInt( this.$routeParams.contactId ) ) ) {
			this.$scope.state = "update";
			this.$scope.contactId = parseInt( this.$routeParams.contactId );
			this.$scope.contact = this.getContactById( this.$routeParams.contactId );
		} else {
			this.$scope.state = "add";
			this.$scope.contactId = false;
			this.$scope.contact = {
				name: ''
			,	lastname: ''
			,	email: ''
			,	address: ''
			,	city: ''
			,	zipcode: ''
			,	country: ''
			};
		}


		// set handlers
		this.$scope.saveContact = ::this.saveContact;


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

	getContactById( contactId ) {
		for( var i = 0; i < this.ContactsStore.collection.length; i++ ) {
			if( this.ContactsStore.collection[i].id == contactId ) {
				return assign( { }, this.ContactsStore.collection[i] );
			}
		}

		return false;
	}

	saveContact( ) {
		// check validation
		if( !this.$scope.contact_form.$valid ) return;

		// check if is to be added or updated
		if( !this.$scope.contactId ) {
			this.$scope.state = "update";
			this.$scope.contactId = this.ContactsStore.createNewID( );
			this.$scope.contact.id = this.$scope.contactId;

			this.ContactsActionCreators.AddContact( this.$scope.contact );
		} else {
			this.ContactsActionCreators.UpdateContact( this.$scope.contact );
		}
	}

	contactsChangeListener ( ) {
		if( this.$scope.contactId ) {
			this.$scope.contact = this.getContactById( this.$scope.contactId );
		
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

}