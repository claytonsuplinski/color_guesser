try{ JL = JL; } catch(e){ JL = {}; }

JL.functions = {};

// --------------
// | Arithmetic |
// --------------

JL.functions.average = function( arr ){
	return arr.reduce(function( sum, a, i, ar ){
		sum += a;
		return ( i == ar.length - 1 ? ( ar.length == 0 ? 0 : sum / ar.length ) : sum );
	}, 0);
};

JL.functions.interpolate = function( v1, v2, percent ){
	return (1 - percent) * v1 + percent * v2;
};

JL.functions.random_number = function( low, high ){
	return ( high - low ) * Math.random() + low;
};

JL.functions.random_integer = function( low, high ){
	return Math.floor( this.random_number( low, high + 1 ) );
};

JL.functions.random_element = function( arr ){
	try{ return arr[ Math.floor( Math.random() * arr.length ) ]; } catch(e){}
	return false;
};

JL.functions.random_hex_digit = function(){
	return this.random_element( [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'] );
};

// ---------------------
// | Number Formatting |
// ---------------------

JL.functions.random_color = function( p ){
	var p = p || {};

	var rgb = [ 'r', 'g', 'b' ];

	var color = {};
	rgb.forEach(function( x ){ color[ x ] = this.random_integer( 0, 255 ) / 255; }, this );

	if( p.type ){
		switch( p.type ){
			case 'hex': return this.rgb_to_hex( color );
		};
	}

	if( p.obj ) return color;

	if( p.factor !== undefined ) rgb.forEach(function( x ){ color[ x ] *= p.factor; });

	return 'rgb(' + rgb.map( x => color[ x ] ).join(',') + ')';
};

JL.functions.hex_to_rgb = function( hex, is_obj, p ){
	var p = p || {};

	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec( hex );

	if( !result ) return null;

	var r = parseInt( result[ 1 ], 16 ) / 255;
	var g = parseInt( result[ 2 ], 16 ) / 255;
	var b = parseInt( result[ 3 ], 16 ) / 255;

	if( p.factor ){
		r *= p.factor;
		g *= p.factor;
		b *= p.factor;
	}

	return ( is_obj ? { r, g, b } : [ r, g, b ] );
};

JL.functions.rgb_to_hex = function( color ){
	var to_hex = function( val ){
		var hex = val.toString( 16 );
		return ( hex.length == 1 ? "0" + hex : hex );
	}
	return "#" + to_hex( Math.round( 255 * color.r ) ) + to_hex( Math.round( 255 * color.g ) ) + to_hex( Math.round( 255 * color.b ) );
};

JL.functions.number_to_words = function(num){
	if( num == 0 ) return 'zero';

	var th = [ '','thousand','million', 'billion','trillion' ];
	var dg = [ 'zero','one','two','three','four','five','six','seven','eight','nine' ];
	var tn = [ 'ten','eleven','twelve','thirteen', 'fourteen','fifteen','sixteen','seventeen','eighteen','nineteen' ];
	var tw = [ 'twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety' ];

	var s = num.toString();
	s = s.replace( /[\, ]/g, '' );
	if( s != parseFloat(s) ) return 'not a number';
	var x = s.indexOf('.');
	if( x == -1 ) x = s.length;
	if( x >  15 ) return 'too big';
	var n = s.split('');
	var str = '';
	var sk = 0;
	var str_parts = [];
	for( var i=0; i < x; i++ ){
		if( (x-i) % 3 == 2 ){
			if( n[i] == '1' ){ str_parts.push( tn[Number(n[i+1])] ); i++; sk=1; }
			else if( n[i]!=0 ){ str_parts.push( tw[n[i]-2] ); sk=1; }
		}
		else if( n[i] != 0 ){
			str_parts.push( dg[n[i]] );
			if( (x-i) % 3 == 0 ) str_parts.push( 'hundred' );
			sk=1;
		}

		if( (x-i) % 3 == 1 ){
			if( sk ) str += str_parts.push( th[(x-i-1)/3] );
			sk=0;
		}
	}
	return str_parts.filter( s => s ).join(' ');
};

JL.functions.number_with_commas = function( n ){
	var parts = n.toString().split( '.' );
	parts[ 0 ] = parts[ 0 ].replace( /\B(?=(\d{3})+(?!\d))/g, ',' );
	return parts.join( '.' );
};

JL.functions.pad = function( num, decimal_place, delimiter ){
	var delimiter = delimiter || '0';
	var num = num + '';
	if( num.length >= decimal_place ) return num;
	return new Array( decimal_place - num.length + 1 ).join( delimiter ) + num;
};

// -----------------------
// | Object Manipulation |
// -----------------------

JL.functions.arrays_equal = function( a1, a2 ){
	if( a1.length != a2.length ) return false;
	return a1.every(function( a1_i, i ){ return a1_i == a2[i]; });
};

JL.functions.recursive_assign = function( target, source ){
	var get_merged = function( t, s ){
		if( t !== undefined && typeof t === 'object' ){
			Object.keys( s ).forEach(function( s_key ){
				var s_val = s[ s_key ];
				t[ s_key ] = get_merged( t[ s_key ], s_val );
			});
			return t;
		}
		t = s;
		return t;
	};

	return get_merged( target, source );
};

JL.functions.modify_object_values = function( obj, fn, keys ){
	( keys || Object.keys( obj ) ).forEach(function( k ){
		obj[ k ] = fn( obj[ k ] );
	});
};

// ---------------------
// | String Formatting |
// ---------------------

JL.functions.remove_punctuation = function( str ){
	return String( str ).replace( /[.,\/#!$%\^&\*;:{}=\-_`~()\']/g, "" );
};

JL.functions.title_case = function( str ){
        return String( str ).toLowerCase().split(' ').map( x => x[0].toUpperCase() + x.slice(1) ).join(' ');
};

// --------------------
// | Units Formatting |
// --------------------

JL.functions.hr_bytes = function( b, params ){
	var bytes  = b;
	var units  = ' B';
	var orders = [ 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y' ];
	while( bytes >= 1000 && orders.length ){
		bytes /= 1000;
		units = orders.shift() + 'B';
	}

	if( params ){
		if( params.decimal_places ) bytes = bytes.toFixed( params.decimal_places );
		if( params.sig_figs       ) bytes = bytes.toPrecision( params.sig_figs );
		if( params.integer        ) bytes = parseInt( bytes );
	}

	return bytes + units;
};

JL.functions.time_abbr = function( b, params ){
	var units = 's';
	var sign  = ( b < 0 ? '-' : '' );
	var b     = Math.abs( b );

	var curr_val    = b;
	var curr_factor = 1;
	if( curr_val >= 60 ){
		curr_val /= 60, curr_factor /= 60, units = 'm';
		if( curr_val >= 60 ){
			curr_val /= 60, curr_factor /= 60, units = 'h';
			if( curr_val >= 24 ){
				curr_val /= 24, curr_factor /= 24, units = 'd';
				if( curr_val >= 365.25 ){
					curr_val /= 365, curr_factor /= 365, units = 'y';
				}
			}
		}
	}

	var result_val = parseInt( curr_val );

	var remainder_val = b - result_val / curr_factor;

	return sign + result_val + units + ( remainder_val > 0 ? ' ' + this.time_abbr( remainder_val, params ): '' );
};

// ------------------
// | User Interface |
// ------------------

JL.functions.copy_to_clipboard = function( text ){
	var tmp_ele = document.createElement( 'textarea' );
	tmp_ele.value = text;
	document.body.appendChild( tmp_ele );
	tmp_ele.select();
	document.execCommand( 'copy' );
	document.body.removeChild( tmp_ele );
};


