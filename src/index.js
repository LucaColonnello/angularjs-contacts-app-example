import { Dispatcher } from 'flux';
import angular from './vendor/angular';
import Controllers from './controllers';
import ActionCreators from './actions';
import Stores from './stores';
import PersistenceLayers from './persistence';
import Config from './config';
import './styles/app.less';

// create app
const app =
	angular.module('app', [require('angular-route')])
	.service('Dispatcher', Dispatcher )
;

// set config
app.config( [ '$routeProvider', Config ] );

// loop controllers and add to app module
for( var i in Controllers ) {
	app.controller( i, Controllers[ i ] );
}

// loop actions and add to app module
for( var i in ActionCreators ) {
	let index = i;
	app.factory( index, function( Dispatcher ) {
		// inject dispatcher into every action creators as first param
		var actionCreatorsObject = { };
		for( var j in ActionCreators[ index ] )
			actionCreatorsObject[ j ] = ActionCreators[ index ][ j ].bind( null, Dispatcher );

		return actionCreatorsObject;
	} );
}

// loop persistence layers and add to app module
// http://www.michaelbromley.co.uk/blog/350/exploring-es6-classes-in-angularjs-1-x%20nice
for( var i in PersistenceLayers ) {
	let index = i;
	PersistenceLayers[ index ].$inject.push( ( ...args ) => new PersistenceLayers[ index ]( ...args ) );
	app.factory( index, PersistenceLayers[ index ].$inject );
}

// loop stores and add to app module
for( var i in Stores ) {
	let index = i;
	app.factory( i, function( Dispatcher ) {
		return new Stores[ index ]( Dispatcher );
	} );
}

export default app;