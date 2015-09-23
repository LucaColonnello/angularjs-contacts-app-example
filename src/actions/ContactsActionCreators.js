import ContactsConstants from '../constants/ContactsConstants';

export function AddContact( Dispatcher, contact ) {
	Dispatcher.dispatch({
		type: ContactsConstants.ADD_CONTACT,
		data: contact
	});
};

export function DeleteContact( Dispatcher, contact ) {
	Dispatcher.dispatch({
		type: ContactsConstants.DELETE_CONTACT,
		data: contact
	});
};

export function UpdateContact( Dispatcher, contact ) {
	Dispatcher.dispatch({
		type: ContactsConstants.UPDATE_CONTACT,
		data: contact
	});
};

export function SelectContact( Dispatcher, contact ) {
	Dispatcher.dispatch({
		type: ContactsConstants.SELECT_CONTACT,
		data: contact
	});
};

export function UnselectContact( Dispatcher, contact ) {
	Dispatcher.dispatch({
		type: ContactsConstants.UNSELECT_CONTACT,
		data: contact
	});
};

export function DeleteSelectedContacts( Dispatcher ) {
	Dispatcher.dispatch({
		type: ContactsConstants.DELETE_SELECTED_CONTACTS
	});
};

export function SetContacts( Dispatcher, contacts ) {
	Dispatcher.dispatch({
		type: ContactsConstants.SET_CONTACTS,
		data: contacts
	});
};