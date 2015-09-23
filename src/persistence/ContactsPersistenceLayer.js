export default class ContactsPersistenceLayer {

	constructor(
		ContactsStore
	,	ContactsActionCreators
	) {
		// set vars
		this.ContactsStore = ContactsStore;
		this.ContactsActionCreators = ContactsActionCreators;

		// first time get from local storage if there are some data and set to store
		const contacts = this.getFromLocalStorage( );
		if( contacts && typeof contacts == "object" && typeof contacts.length != "undefined" ) {
			this.ContactsActionCreators.SetContacts( contacts );
		}

		// then listen to change event of the store and save to local storage
		// overwrite to apply binding
		// if we call twice bind in add and remove
		// we can't be able to remove the listener, because it's a new one
		this.contactsChangeListener = ::this.contactsChangeListener;
		
		// add listeners to stores
		this.ContactsStore.addChangeListener( this.contactsChangeListener );
	}

	contactsChangeListener( ) {
		this.saveToLocalStorage( );
	}

	getFromLocalStorage( ) {
		return JSON.parse( localStorage.getItem( 'contacts' ) );
	}

	saveToLocalStorage( ) {
		localStorage.setItem( 'contacts', JSON.stringify( this.ContactsStore.collection ) );
	}

	destroy( ) {
		this.ContactsStore.removeChangeListener( this.contactsChangeListener );
	}

}

// this is only for angular, in order to let DI to inject all the dependency
// http://www.michaelbromley.co.uk/blog/350/exploring-es6-classes-in-angularjs-1-x%20nice
ContactsPersistenceLayer.$inject = [ 'ContactsStore', 'ContactsActionCreators' ];