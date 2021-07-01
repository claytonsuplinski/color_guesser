QUE.player = function( p ){
	var p = p || {};

	this.name = p.name || '???';

	this.score = 0;
	this.turn  = 1;
};

QUE.player.prototype.guess = function(){
	var guess_str = $("#user-guess").val();
	if( guess_str[ 0 ] !== '#' ) guess_str = '#' + guess_str;

	var rgb = JL.functions.hex_to_rgb( guess_str, true, { factor : 255 } );

	this.increment_score( QUE.views.game.get_guess_value( rgb ) );

	this.turn++;
};

QUE.player.prototype.increment_score = function( val ){
	this.score += val;
};