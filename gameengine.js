var XX = 0;// broken
	var TL = 1;
	var TR = 2;
	var BL = 3;
	var RB = 4;
	var TB = 5;
	var RL = 6;
	
	var FREE = 0;
	var LOCKED = 1;
	var BROKEN = 2;
	
	var DWIDTH, DHEIGHT, SCALINGFACTOR, BANNERHEIGHT, GAMESPACE;
	var SIZES = {
		column : 50,
		pointsbar : 20,
		margin : 0// без масштабирования
	}
	var level  = 0
		points = 0;
	var Game = {
		width      		: 5,//9 | 7
		height     		: 5,//6 | 9
//		points     		: 0,
		objectsnum 		: 6,//6
//		level			: 1,
		maxlevelsnum	: 10, // mappoints.length
		up				: false,
		start			: 0,
		finish			: 0,
		stepstime		: 5,//5, in sec.
		run				: false,
		map : [],
		mapzero : function(){ // забивает карту 0
			for(var i = 0; i < this.height; i++) {
				this.map[i] = [];
				for(var j = 0; j < this.width; j++) {
					this.map[i][j] = 0;
				}
			}
		},
		randmap : function(){ // рандомно забивает кату
			for(var i = 0; i < this.height; i++) {
				this.map[i] = [];
				for(var j = 0; j < this.width; j++) {
					var l = (Math.random() * this.objectsnum + 1)|0;
					var r = {
						t : false,
						r : false,
						b : false,
						l : false,
						state : FREE,
						label : l
					}
					switch(l) {
						case TL: //1
							r.t = true;
							r.l = true;
							break;
						case TR: //2
							r.t = true;
							r.r = true;
							break;
						case BL: //3
							r.b = true;
							r.l = true;
							break;
						case RB: //4
							r.r = true;
							r.b = true;
							break;
						case TB: //5
							r.t = true;
							r.b = true;
							break;
						case RL: //6
							r.r = true;
							r.l = true;
							break;
					}
					this.map[i][j] = r;
				}
			}
		},
		logmap : function(){// выводит первоначальный массив в консоль
			for(var i = 0; i < this.height; i++) {
				var str = "";
				for(var j = 0; j < this.width; j++) {
					str += this.map[i][j] + ' ';
				}
				console.log(str);
			}
		},
		logarr2 : function(a){// выводит в консоль двумерный массив
			for(i in a) {
				var str = "";
				for(j in a[i]) {
					str += a[i][j] + ' ';
				}
				console.log(str);
			}
		},
		cursor : {},
		drawcolumn : function(x, y, f){//j, i
			var l = $('<div>')
				.addClass('column')
				.css({
					left : ( SIZES.column * x ) + ( (GAMESPACE.X - SIZES.column * Game.width) / 2 ),
					top : SIZES.column + ( SIZES.column * y ) + SIZES.pointsbar,
					width : SIZES.column,
					height : SIZES.column
				});
			if(f){
				$(l).addClass('point' + ( f ));
				if(f === 8){
					$(l).addClass('locked');
					for(var i = 0; i < 10; i++) {
						if($(l).hasClass('point' + i)) {
							$(l).addClass('point' + i + 'f');//.removeClass('point' + i)
						}
					}
				}
			} else {
				$(l).addClass('point' + this.map[y][x].label)
					.data('x', x).data('y', y);
			}
			return l;
		},
		roadsliceclick : function(d) {
			//TODO
			var r = {
				t : false,
				r : false,
				b : false,
				l : false,
				state : FREE,
				label : l
			}
			switch(d) {
				case TL: //1
					r.t = true;
					r.l = true;
					break;
				case TR: //2
					r.t = true;
					r.r = true;
					break;
				case BL: //3
					r.b = true;
					r.l = true;
					break;
				case RB: //4
					r.r = true;
					r.b = true;
					break;
				case TB: //5
					r.t = true;
					r.b = true;
					break;
				case RL: //6
					r.r = true;
					r.l = true;
					break;
			}
		},
		draw : function(){
			$('#map').html('');
			for(var i = 0; i < Game.height; i++) {
				for(var j = 0; j < Game.width; j++) {
					$('#map').append(
						this.drawcolumn(j, i)
					);
				}
				

			}
			this.cursor = {
				y : Game.start,
				x : 0
			}
			$('#map').append(this.drawcolumn(Game.start, Game.height, 8));
			$('#map').append(this.drawcolumn(Game.finish, -1, 9));
			
			$('.point9').click(function(){
				Game.run = true;
			});
			//$('.point8').addClass('fill');
			
			// click's ------------------------------------
/*
			$('#map>div.column').click(function(){
				if($(this).hasClass('locked') || $(this).hasClass('point8') || $(this).hasClass('point9')){return false;}// не зблокированный элемент
				if(Game.up === false) {// первый клик
					console.log('click1');
					$(this).addClass('selected');
						Game.up = {
							y : $(this).data('y'),
							x : $(this).data('x')
						}
						
						console.log('select ' + Game.up.x + ' ' + Game.up.y);
				} else {// втрой клик
					console.log('click2');
					
					
					//$('.column').each(function(){
					//	if( $(this).data('x') === Game.up.x && $(this).data('y') === Game.up.y ) {
					//		$(this).removeClass('selected');
					//	}
					//});
					
					console.log('unselect ' + Game.up.x + ' ' + Game.up.y);
					var c = {
						b : {
							x : $(this).offset().left,//$(this).data('x') * SIZES.column,
							y : $(this).offset().top//$(this).data('y') * SIZES.column
						}
					}
					var tmpa = {}
					$('.column').each(function(){
						if( $(this).data('x') === Game.up.x && $(this).data('y') === Game.up.y ){
							$(this).removeClass('selected');// удаляем выделение у А
							c.a = {//сохраняем координаты А
								x : $(this).offset().left,
								y : $(this).offset().top
							}
							$(this).css({//перемещаем А на место В
								left : c.b.x,
								top : c.b.y
							});
							tmpa = {
								x : $(this).data('x'),
								y : $(this).data('y')
							}
						}
					});
					$(this).css({
						left : c.a.x,
						top : c.a.y
					});
					//console.log('log: ' + c.a.x + ' ' + c.a.y + ' ' + c.b.x + ' ' + c.b.y);
					
					var tmpb = {//сохраняем data координаты В
						x : $(this).data('x'),
						y : $(this).data('y')
					}
					console.log('tmp : ' + tmpa.x + ' ' + tmpa.y + ' ' + tmpb.x + ' ' + tmpb.y + ' ');
					// map a <=> map b
					var tmp = Game.map[Game.up.y][Game.up.x];//tmp = a
					Game.map[Game.up.y][Game.up.x] = Game.map[tmpb.y][tmpb.x];//a = b
					Game.map[tmpb.y][tmpb.x] = tmp;//b = tmp
					
					//data a <=> data b
					$('.column').each(function(){
						if( $(this).data('x') === Game.up.x && $(this).data('y') === Game.up.y ){//ищем А, А = 777
							$(this).data('x', 777);
							$(this).data('y', 777);
						}
						if( $(this).data('x') === tmpb.x && $(this).data('y') === tmpb.y ){//ищем В, В = А
							$(this).data('x', tmpa.x);
							$(this).data('y', tmpa.y);
						}
					});
					$('.column').each(function(){
						if( $(this).data('x') === 777 && $(this).data('y') === 777 ){//ищем А(777), А = В
							$(this).data('x', tmpb.x);
							$(this).data('y', tmpb.y);
						}
					});
					
					
					Game.up = false;
				}
			})
*/
			// -------------------------------------------
			
		},
		addbroken : function(i){//i - количество сломаннных труб
			for(;i--;){
				var c = {}
				c.x = (Math.random() * this.width)|0;
				//c.y = (Math.random() * (this.height - 1)|0)|0;
				c.y = (Math.random() * (this.height / 2)|0)|0;
				if( this.map[c.y][c.x] === 0) {i++}
				var r = {
					label : XX,
					u     : false,
					r     : false,
					d     : false,
					l     : false,
					state : BROKEN
				}
				this.map[c.y][c.x] = r;
			}
		},
		notborder : function(cursor){
			return (
				cursor.x < Game.width &&
				cursor.x >= 0 &&
				cursor.y < Game.height &&
				cursor.y >= 0
			);
		},
		notlocked : function(cursor){
			return (Game.map[cursor.y][cursor.x].state !== LOCKED);
		},
		hasmirror : function(cursor, cursorbackup){
			var xx = cursor.x - cursorbackup.x;
			var yy = cursor.y - cursorbackup.y;
			if( xx === 0 && yy === 1){//сместились вниз смотрим точку top
				return Game.map[cursor.y][cursor.x].t;
			}
			if( xx === 0 && yy === -1){
				return Game.map[cursor.y][cursor.x].b;
			}
			if( xx === 1 && yy === 0){
				return Game.map[cursor.y][cursor.x].l;
			}
			if( xx === -1 && yy === 0){
				return Game.map[cursor.y][cursor.x].r;
			}
		},
		topfinish : function(cursor){
			return(cursor.x === Game.finish && cursor.y < 0);
		},
		check : function(x, y, ax, ay, bx, by){
			var cursorbackup = {}
			cursorbackup.x = x;
			cursorbackup.y = y;
			
			var cursor = {}
			cursor.x = x;
			cursor.y = y;
			//backupcursor = cursor;
			cursor.x += ax
			cursor.y += ay;
			if(Game.notborder(cursor)){
				//1
				if(Game.notlocked(cursor)){
					if(Game.hasmirror(cursor, cursorbackup)){
						//next(cursor);
						return cursor;
					}
				} else {
					//если 2 locked о то так и так gameover
				}
			} else if(Game.topfinish(cursor)){
				return true;
				//win();
				//return true;
			} else {
				//2
				//
			}
			
			cursor.x = x;
			cursor.y = y;
			cursor.x += bx
			cursor.y += by;
			if(Game.notborder(cursor)){
				//2
				if(Game.notlocked(cursor)){
					if(Game.hasmirror(cursor, cursorbackup)){
						//next(cursor);
						return cursor;
					}
				} else {
					//gameover();
					return false;
				}
			} else if(Game.topfinish(cursor)){
				//win();
				return true;
			} else {
				//gameover();
				return false;
			}
			return false;
		},
		win : function(){
			// TODO splash win
			$('.point9').addClass('point9f');
			//localStorage['plumbinglevel'] = parseInt(localStorage['plumbinglevel']) + 1
			level += 1;
			console.log('win (finish)');
			Game.run = false;
			//setTimeout
			$('#youwin').show();
			setTimeout(function(){
				$('#youwin').hide();
				Game.startgame();
			}, 3000);
			
		},
		gameover : function(){
			//TODO splash gameover 
			// go to mainmenu
			console.log('gameover');
			$('#gameover').show();
			setTimeout(function(){
				$('#gameover').hide();
				Game.startgame();
			}, 3000);
		},
		repeater : function(x, y, t){
			//console.log('start repeater');
			if(typeof(t) === 'undefined'){
				Game.repeater(x, y, Game.stepstime);
			} else{
				if(t <= 0){
					console.log('проверка');
					//текущий
					//var cursor = {}
					//cursor.x = x;
					//cursor.y = y;
					var result;
					switch( Game.map[y][x].label ){
						case TL:
							result = Game.check(x, y, 0, -1, -1, 0);//x, y, ax, ay, bx, by
							break;
						case TR:
							result = Game.check(x, y, 0, -1, 1, 0);
							break;
						case BL:
							result = Game.check(x, y, 0, 1, -1, 0);
							break;
						case RB:
							result = Game.check(x, y, 1, 0, 0, 1);
							break;
						case TB:
							result = Game.check(x, y, 0, -1, 0, 1);
							break;
						case RL:
							result = Game.check(x, y, 1, 0, -1, 0);
							break;
					}
					if(result){
						//cursor repeater
						if(
							typeof(result.x) !== 'undefined' &&
							typeof(result.y) !== 'undefined'
						){
							
							
							
							Game.map[result.y][result.x].state = LOCKED
							$('.column').each(function(){
								if( 
									$(this).data('y') === result.y && 
									$(this).data('x') === result.x
								){
									$(this).addClass('locked');
									for(var i = 0; i < 10; i++) {
										if($(this).hasClass('point' + i)) {
											$(this).addClass('point' + i + 'f');//.removeClass('point' + i)
										}
									}
									
									//console.log('fill ok');
								}
							});
							
							
							console.log('go next repeat ' + result.x + ' ' + result.y);
							//localStorage['plumbingpoints'] = parseInt(localStorage['plumbingpoints']) + 10;
							points += 10;
							$('#points').html(points);
							Game.repeater(result.x, result.y);
						} else{
							Game.win();
						}
					} else{
						Game.gameover();
						//gameover
					}
				//}
							//top
/*							cursor.y--;//основное отличие
							if(notrblborder(cursor)){
								if(topborder(cursor)){
									if(finish(cursor)){
										win();
									} else{
										gameover();
									}
								} else if(map[cursor.y].b === true){
									repeater(cursor.x, cursor.y);
								}else{
									gameover();
								}
							} else {
								gameover();
							}
							break;
					}
					//направление текущего
*/				} else{
					$('#debugtime').html(t);
					t--;
					if(Game.run === false){
						setTimeout(function(){Game.repeater(x, y, t);}, 1000);
					} else{
						Game.repeater(x, y, 0);
					}
				}

			}
		},
		firststep : function(i){
			if(typeof(i) === 'undefined'){
				Game.firststep(Game.stepstime);
			} else{
				if(i <= 0){
					//TODO проверка
					//console.log('BOOBS');
					//console.log( Game.height + ' ' + Game.start );
					//console.log( 
					//	Game.map[Game.height - 1][Game.start].t + ' ' + 
					//	Game.map[Game.height - 1][Game.start].r + ' ' + 
					//	Game.map[Game.height - 1][Game.start].b + ' ' + 
					//	Game.map[Game.height - 1][Game.start].l
					//);
					//console.log( (Game.map[Game.height - 1][Game.start].b === true)?'y':'n' );
					if(Game.map[Game.height - 1][Game.start].b === true){
						//var eq = (Game.height - 1) * (Game.width) + Game.start;// вычисляется именно первоначальный eq
						Game.map[Game.height - 1][Game.start].state = LOCKED
						$('.column').each(function(){
							if( 
								$(this).data('y') === (Game.height - 1) && 
								$(this).data('x') === Game.start
							){
								$(this).addClass('locked');
								for(var i = 0; i < 10; i++) {
									if($(this).hasClass('point' + i)) {
										$(this).addClass('point' + i + 'f');//.removeClass('point' + i)
									}
								}
								console.log('fill ok');
							}
						});
						Game.repeater( Game.start, (Game.height - 1) );//x, y, time
						console.log('go to repeater ' + (Game.height - 1) + ' ' + Game.start);
					} else {
						console.log('game over');
						Game.gameover();
						// TODO gameover
					};
					
				} else {
					$('#debugtime').html(i);
					i--;
					if(Game.run === false){
						setTimeout(function(){Game.firststep(i);}, 1000);
					} else{
						Game.firststep(0);
					}
					//setTimeout(function(){Game.firststep(i);}, 1000);
				}
			}
		},
		startfinish : function(){
			this.start = (Math.random() * this.width)|0;
			this.finish = (Math.random() * this.width)|0;
		},
		iswin : function() {
			for(i = 0; i < this.width; i++){if(this.map[this.height - 1][i] === this.objectsnum + 1){return true}}
			return false;
		},
		startgame : function(){
			this.randmap();
			this.startfinish();
			this.addbroken(level);//добавить разбитые
			this.draw();
			setTimeout(function(){
				Game.firststep();
			}, 0);
		},
		init : function(){
//			if(
//				typeof(localStorage['plumbingpoints']) === 'undefined' ||
//				typeof(localStorage['plumbinglevel']) === 'undefined'
//			){
//				localStorage['plumbingpoints'] = 0;
//				localStorage['plumbinglevel'] = 0;
//			}
			$('#points').html(points);
			//this.drawmap();
		}
	}
	$(document).ready(function(){
		Game.init();
		
		DWIDTH = document.body.clientWidth;
		DHEIGHT	= document.body.clientHeight;
		$('body').css({height : DHEIGHT + 'px'});
		SCALINGFACTOR = DWIDTH / 320;
		BANNERHEIGHT = SCALINGFACTOR * 50;
		SIZES.column = ( DWIDTH  < 350 )?50:( DWIDTH < 750 )?70:100;
		GAMESPACE = {
			X : DWIDTH - SIZES.margin * 2,
			Y : DHEIGHT - BANNERHEIGHT - SIZES.pointsbar - SIZES.margin * 2
		}
		Game.width = ( GAMESPACE.X / SIZES.column )|0;
		Game.height = ( ( GAMESPACE.Y / SIZES.column )|0 ) - 2;
		
		
		$('#youwin').css('width', (DWIDTH - 30 + 'px'));
		$('#gameover').css('width', (DWIDTH - 30 + 'px'));
//		$('#thislevel').click(function(){
//			$('#mapsplash').hide();
//			$('#gamescreen').show();
//			Game.startgame();
//		});
		
		Game.startgame();
	});