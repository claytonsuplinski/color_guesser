QUE.views.landing = {};

QUE.views.landing.draw = function(){
	$( "body" ).html(
		'<div id="landing">' +
			'<div class="title">' +
				'Guess The Color!'.split('').map(function(x){
					return '<span style="color:' + JL.functions.random_color({ factor : 125 }) + ';">' + x + '</span>';
				}).join('') + 
			'</div>' +
			'<div class="body">' + 
				[
					{ label : 'Number of Players', options : [ 1, 2, 3, 4 ] },
					{ label : 'Number of Rounds' , options : Array( 1000 ).fill().map( (x,i) => ( i + 1 ) ) },
					{ label : 'Difficulty'       , options : [ 'Easy', 'Moderate', 'Hard' ] },
				].map(function( section ){
					return '<div class="section">' + 
						'<div class="label">' + section.label + '</div>' +
						'<div class="select">' +
							'<select>' + 
								section.options.map(function( option ){
									return '<option>' + option + '</option>';
								}).join('') +
							'</select>' +
						'</div>' +
					'</div>';
				}).join('') +
				'<div class="button submit" onclick="QUE.views.game.init()">New Game</div>' +
			'</div>' +
		'</div>'
	);
};

/*
-Easy     : full screen color; all multiple choice
-Moderate : full screen and some variable shapes; some multiple choice
-Hard     : lots of movement / shapes / blinking; no multiple choice
*/