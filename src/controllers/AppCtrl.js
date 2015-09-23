export default class AppCtrl {

	constructor (
		ContactsPersistenceLayer
	,	$scope
	,	Dispatcher
	) {
		// set vars
		this.Dispatcher = Dispatcher;
		this.ContactsPersistenceLayer = ContactsPersistenceLayer;
		this.$scope = $scope;

		// app bootstrap
		angular.element(document).ready( function ( ) {
			// do some stuff in the bootstrap phase
		}.bind( this ) );

		// listen destroy and destroy persistence layer
		$scope.$on( "$destroy", function ( ) {
			this.ContactsPersistenceLayer.destroy( );
		}.bind( this ) );
	}

}