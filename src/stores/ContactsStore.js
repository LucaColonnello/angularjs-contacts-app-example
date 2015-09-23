import { EventEmitter } from 'events';
import ContactsConstants from '../constants/ContactsConstants';

const CHANGE_EVENT = 'change';


export default class ContactsStore extends EventEmitter {

	constructor( Dispatcher ) {
		// call super class
		super( );

		// register dispatch token
		this.dispatchToken = Dispatcher.register( this.listenToDispatcher.bind( this ) );

		// data
		this.selected = 0;
		this.collection = [ ];
	}

	createNewID( ) {
		return (new Date( )).getTime( ) + parseInt( Math.random( ) * 100 );
	}

	updateSelected( ) {
		this.selected = 0;
		this.collection.forEach( function( v ) {
			if( v.selected ) this.selected++;
		}.bind( this ) );
	}

	listenToDispatcher( action ) {
		switch(action.type) {
			case ContactsConstants.SET_CONTACTS:
				if( typeof action.data == "object" && typeof action.data.length != "undefined" ) {
					this.collection = action.data;
					this.updateSelected( );
					this.emitChange( );
				}
			break;

			case ContactsConstants.ADD_CONTACT:
				if( !action.data.id )
					action.data.id = this.createNewID( );
				this.collection.push( action.data );

				this.updateSelected( );
				this.emitChange( );
			break;

			case ContactsConstants.DELETE_CONTACT:
				// look for index of element to be deleted
				var index;
				this.collection.forEach( function( v, i ){
					if( v.id == action.data.id ) {
						index = i;
					}
				} );

				// if element is founded, delete it
				if( typeof index != 'undefined' ) {
					this.collection.splice( index, 1 );
					this.updateSelected( );
					this.emitChange( );
				}
			break;

			case ContactsConstants.UPDATE_CONTACT:
				if( !action.data.id ) {
					throw new Error( "ContactsStore Error: Contact ID not found" );
					return false;
				}

				// look for index of element to be deleted
				var index;
				this.collection.forEach( function( v, i ){
					if( v.id == action.data.id ) {
						index = i;
					}
				} );

				// if element is founded, delete it
				if( typeof index != 'undefined' ) {
					this.collection[ index ] = action.data;
					this.updateSelected( );
					this.emitChange( );
				}
			break;

			case ContactsConstants.SELECT_CONTACT:
				if( !action.data.id ) {
					throw new Error( "ContactsStore Error: Contact ID not found" );
					return false;
				}

				// look for index of element to be deleted
				var index;
				this.collection.forEach( function( v, i ){
					if( v.id == action.data.id ) {
						index = i;
					}
				} );

				// if element is founded, delete it
				if( typeof index != 'undefined' ) {
					this.collection[ index ].selected = true;
					this.updateSelected( );
					this.emitChange( );
				}
			break;

			case ContactsConstants.UNSELECT_CONTACT:
				if( !action.data.id ) {
					throw new Error( "ContactsStore Error: Contact ID not found" );
					return false;
				}

				// look for index of element to be deleted
				var index;
				this.collection.forEach( function( v, i ){
					if( v.id == action.data.id ) {
						index = i;
					}
				} );

				// if element is founded, delete it
				if( typeof index != 'undefined' ) {
					this.collection[ index ].selected = false;
					this.updateSelected( );
					this.emitChange( );
				}
			break;

			case ContactsConstants.DELETE_SELECTED_CONTACTS:
				if( this.selected == 0 ) {
					return false;
				}

				// look for index of element to be deleted
				var index = [ ];
				this.collection.forEach( function( v, i ){
					if( v.selected == true ) {
						index.push( i );
					}
				} );


				// delete all indexes subtracting the deleted element number every loop,
				// in order to have no problem with the index shifting

				// sort ascendant in order to prevent index subtracting failure,
				// when an element will be deleted after another with greater index then actual
				index.sort( (a,b) => a - b );
				if( index.length ) {
					for( var i = 0; i < index.length; i++ ) {
						this.collection.splice( index[ i ] - i, 1 );
					}

					this.updateSelected( );
					this.emitChange( );
				}
			break;
		}
	}

	emitChange( ) {
		this.emit( CHANGE_EVENT );
	}

	addChangeListener ( callback ) {
		this.on( CHANGE_EVENT, callback );
	}

	removeChangeListener ( callback ) {
		this.removeListener( CHANGE_EVENT, callback );
	}

}