QUE.views.game = {};

QUE.views.game.change_background = function(){	
	this.curr_color = { hex: JL.functions.random_color({ type : 'hex' }) };
	this.curr_color.rgb = JL.functions.hex_to_rgb( this.curr_color.hex, true, { factor : 255 } );
	// JL.functions.modify_object_values( this.curr_color.rgb, function( val ){ return val * 255; } );

	$("html").css( 'background', this.curr_color.hex );
};

QUE.views.game.init = function(){
	this.players = [];
	for( var i = 0; i < 4; i++ ){
		this.players.push( new QUE.player({ name : 'Player ' + (i+1) }) );
	}

	this.change_background();

	this.draw();
};

QUE.views.game.guess = function(){
	var rgb = JL.functions.hex_to_rgb( $("#user-guess").val(), true, { factor : 255 } );
	console.log( rgb );
	console.log( this.curr_color.rgb );

	this.change_background();
	this.draw();
};

QUE.views.game.draw = function(){
	$( "body" ).html(
		'<div id="scores">' +
			'<table>' +
				this.players.map(function( player ){
					return '<tr>' +
						'<td class="name"> ' + player.name  + '</td>' +
						'<td class="score">' + player.score + '</td>' +
					'</tr>';
				}).join('') +
			'</table>' +
		'</div>' +
		'<div id="guess-input">' +
			'<input id="user-guess"></input>' +
			'<div class="button guess" onclick="QUE.views.game.guess();">Enter</div>' +
		'</div>'
	);
};