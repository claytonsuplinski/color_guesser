QUE.views.game = {};

QUE.views.game.change_background = function(){	
	this.curr_color = { hex: JL.functions.random_color({ type : 'hex' }) };
	this.curr_color.rgb = JL.functions.hex_to_rgb( this.curr_color.hex, true, { factor : 255 } );

	$("html").css( 'background', this.curr_color.hex );
};

QUE.views.game.init = function(){
	this.players = [];
	for( var i = 0; i < 4; i++ ){
		this.players.push( new QUE.player({ name : 'Player ' + (i+1) }) );
	}

	this.curr_player_idx = 0;

	this.change_background();

	this.draw();
};

QUE.views.game.get_curr_player = function(){
	return this.players[ this.curr_player_idx ];
};

QUE.views.game.next_player = function( offset ){
	this.curr_player_idx += ( offset || 1 );
	this.curr_player_idx %= this.players.length;
};

QUE.views.game.get_guess_value = function( guess ){
	if( !guess ) return 0;

	var score = 0;
	[ 'r', 'g', 'b' ].forEach(function( x ){
		var diff = guess[ x ] - this.curr_color.rgb[ x ];
		score += diff * diff;
	}, this);
	score = Math.sqrt( score );

	if( score >= 100 ) return 0;

	return Number( ( 100 - score ).toFixed( 1 ) );
};

QUE.views.game.guess = function(){
	this.get_curr_player().guess();

	this.change_background();
	this.next_player();
	this.draw();
};

QUE.views.game.draw = function(){
	$( "body" ).html(
		'<div id="scores">' +
			'<table>' +
				this.players.map(function( player, idx ){
					return '<tr>' +
						'<td class="turn ' + ( this.curr_player_idx == idx ? 'active' : '' ) + '"> ' + player.turn + '</td>' +
						'<td class="name"> ' + player.name  + '</td>' +
						'<td class="score">' + player.score + '</td>' +
					'</tr>';
				}, this).join('') +
			'</table>' +
		'</div>' +
		'<div id="guess-input">' +
			'<input id="user-guess" onkeyup="if( event.keyCode == 13 ){ QUE.views.game.guess(); }" ></input>' +
			'<div class="button guess" onclick="QUE.views.game.guess();">Enter</div>' +
		'</div>'
	);

	$( "#user-guess" ).focus();
};