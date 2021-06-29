QUE.player = function( p ){
	var p = p || {};

	this.name = p.name || '???';

	this.score = 0;
};

QUE.player.prototype.guess = function(){
};

QUE.player.prototype.increment_score = function( val ){
	this.score += val;
};