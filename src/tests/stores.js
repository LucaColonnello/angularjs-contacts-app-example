import { Dispatcher } from 'flux';
import ActionCreators from '../actions';
import StoresClasses from '../stores';
import assert from 'assert';

// bootstrapping
console.log( "create dispatcher" );
const dispatcher = new Dispatcher( );

const Stores = { };

for( var i in ActionCreators ) {
	// inject dispatcher into every action creators as first param
	console.log( "create actions " + i );
	for( var j in ActionCreators[ i ] )
		ActionCreators[ i ][ j ] = ActionCreators[ i ][ j ].bind( null, dispatcher );
}

// loop stores and add to stores obj
for( var i in StoresClasses ) {
	console.log( "create store " + i );
	Stores[ i ] = new StoresClasses[ i ]( dispatcher );
}

// test contacts store
describe( 'ContactsStore', function( ) {
	let newContactId;

	it( 'should add a contact', function( done ) {
		Stores.ContactsStore.addChangeListener( function changeListener( ) {
			assert.notEqual( Stores.ContactsStore.collection, null );
			assert.equal( ( typeof Stores.ContactsStore.collection == "object" && typeof Stores.ContactsStore.collection.length != "undefined" ), true );
			assert.equal( Stores.ContactsStore.collection.length, 1 );
			
			newContactId = Stores.ContactsStore.collection[0].id;
			assert.deepEqual( Stores.ContactsStore.collection[0], {
				id: newContactId,
				name: 'John',
				lastname: 'Smith',
				age: 24
			} );

			Stores.ContactsStore.removeChangeListener( changeListener );
			done( );
		} );

		ActionCreators.ContactsActionCreators.AddContact( {
			name: 'John',
			lastname: 'Smith',
			age: 24
		} );
	} );

	it( 'should update a contact', function( done ) {
		Stores.ContactsStore.addChangeListener( function changeListener( ) {
			assert.notEqual( Stores.ContactsStore.collection, null );
			assert.equal( ( typeof Stores.ContactsStore.collection == "object" && typeof Stores.ContactsStore.collection.length != "undefined" ), true );
			assert.equal( Stores.ContactsStore.collection.length, 1 );

			assert.deepEqual( Stores.ContactsStore.collection[0], {
				id: newContactId,
				name: 'John',
				lastname: 'Stuart',
				age: 25
			} );

			Stores.ContactsStore.removeChangeListener( changeListener );
			done( );
		} );

		ActionCreators.ContactsActionCreators.UpdateContact( {
			id: newContactId,
			name: 'John',
			lastname: 'Stuart',
			age: 25
		} );
	} );

	it( 'should select a contact', function( done ) {
		Stores.ContactsStore.addChangeListener( function changeListener( ) {
			assert.equal( Stores.ContactsStore.selected, 1 );
			assert.equal( Stores.ContactsStore.collection[0].selected, true );

			Stores.ContactsStore.removeChangeListener( changeListener );
			done( );
		} );

		ActionCreators.ContactsActionCreators.SelectContact( {
			id: newContactId
		} );
	} );

	it( 'should unselect a contact', function( done ) {
		Stores.ContactsStore.addChangeListener( function changeListener( ) {
			assert.equal( Stores.ContactsStore.selected, 0 );
			assert.equal( Stores.ContactsStore.collection[0].selected, false );

			Stores.ContactsStore.removeChangeListener( changeListener );
			done( );
		} );

		ActionCreators.ContactsActionCreators.UnselectContact( {
			id: newContactId
		} );
	} );

	it( 'should delete a contact', function( done ) {
		Stores.ContactsStore.addChangeListener( function changeListener( ) {
			assert.notEqual( Stores.ContactsStore.collection, null );
			assert.equal( ( typeof Stores.ContactsStore.collection == "object" && typeof Stores.ContactsStore.collection.length != "undefined" ), true );
			assert.equal( Stores.ContactsStore.collection.length, 0 );

			Stores.ContactsStore.removeChangeListener( changeListener );
			done( );
		} );

		ActionCreators.ContactsActionCreators.DeleteContact( {
			id: newContactId
		} );
	} );

	it( 'should set contacts', function( done ) {
		Stores.ContactsStore.addChangeListener( function changeListener( ) {
			assert.notEqual( Stores.ContactsStore.collection, null );
			assert.equal( ( typeof Stores.ContactsStore.collection == "object" && typeof Stores.ContactsStore.collection.length != "undefined" ), true );
			assert.equal( Stores.ContactsStore.collection.length, 3 );
			assert.equal( Stores.ContactsStore.selected, 2 );

			Stores.ContactsStore.removeChangeListener( changeListener );
			done( );
		} );

		ActionCreators.ContactsActionCreators.SetContacts( [
			{
				name: 'John',
				lastname: 'Smith',
				age: 24,
				selected: true
			},
			{
				name: 'John',
				lastname: 'Stuart',
				age: 25,
				selected: false
			},
			{
				name: 'Ann Marie',
				lastname: 'Clark',
				age: 32,
				selected: true
			}
		].map( function( v ){
			v.id = Stores.ContactsStore.createNewID( );
			return v;
		} ) );
	} );

	it( 'should delete all selected contacts', function( done ) {
		Stores.ContactsStore.addChangeListener( function changeListener( ) {
			assert.equal( Stores.ContactsStore.collection.length, 1 );
			assert.equal( Stores.ContactsStore.selected, 0 );

			Stores.ContactsStore.removeChangeListener( changeListener );
			done( );
		} );

		ActionCreators.ContactsActionCreators.DeleteSelectedContacts( );
	} );

} );
