var elements = [
	{"name": "Adamant"},
	{"name": "Adamantite"},
	{"name": "Adamantium"},
	{"name": "Administratium"},
	{"name": "Administrontium"},
	{"name": "Aether"},
	{"name": "Australium"},
	{"name": "Badassium"},
	{"name": "Bavarium"},
	{"name": "Bombastium"},
	{"name": "Bureaucratium"},
	{"name": "Byzanium"},
	{"name": "Carbonadium"},
	{"name": "Cavorite"},
	{"name": "Chronoton"},
	{"name": "Cobalt Thorium G"},
	{"name": "Collapsium"},
	{"name": "Dilithium"},
	{"name": "Divinium (E115)"},
	{"name": "Duranium"},
	{"name": "Durium"},
	{"name": "Dust"},
	{"name": "Element 99"},
	{"name": "Element Zero"},
	{"name": "Feminum"},
	{"name": "Frinkonium"},
	{"name": "Harbenite"},
	{"name": "Ice-Nine"},
	{"name": "Katchin"},
	{"name": "Kryptonite"},
	{"name": "Merkoba 51"},
	{"name": "Meteorillium"},
	{"name": "Mithril"},
	{"name": "Nth Metal"},
	{"name": "Octiron"},
	{"name": "Orichalcum"},
	{"name": "Polydenum"},
	{"name": "Quadium"},
	{"name": "Radium X"},
	{"name": "Rearden Metal"},
	{"name": "Redstone"},
	{"name": "Scrith"},
	{"name": "Timonium"},
	{"name": "Transformium"},
	{"name": "Tritanium"},
	{"name": "Unobtanium"},
	{"name": "Uridium"},
	{"name": "Uru"},
	{"name": "Verterium"},
	{"name": "Vibranium"},
	{"name": "Wishalloy"},
	{"name": "Woodium"},
	{"name": "Xirdalium"},
	{"name": "Xithricite"}
]

var main_title = "E l e m e n t s"
var start_points = 0
var start_count = 30
var tick_timer
var started_timeout
var profits = [-1000000, -800000, -600000, -400000, -200000, 0, 200000, 400000, 600000, 800000, 1000000]
var directions = ["up", "down"]
var msg_open = false
var fmsg_open = false
var highscores
var ls_highscores = "highscores_v4"
var ls_highscores_advanced = "highscores_advanced_v4"
var ls_options = "options_v6"
var msg_closeable = false
var speed_slow = 12000
var speed_normal = 8000
var speed_fast = 5000
var linear_diff = (speed_slow - speed_fast) / (start_count - 1)
var count = 0
var points = 0
var music_fadeout_interval
var playing = false
var started = false
var paused = false
var last_highscore = ""
var sold_on_tick = []
var report = []
var hs_setting = null
var fmsg_mode = null
var num_lit
var num_lit_trios
var gained_from_lit
var ticks_skipped
var bonus
var bonus_points
var lit_trios_on_tick

function init()
{
	get_options()
	overlay_clicked()
	key_detection()
	resize_events()
	music_control()
	check_firstime()
	Math.seedrandom()
	disable_context_menus()
	start_context_menus()
	update_title()
	left_side_clicks()
	title_clicks()
	right_side_clicks()
	succ()
}

function check_start()
{
	if($('#start').html() === 'Stop')
	{
		stop()
	}

	else
	{
		start()
	}
}

function check_escape()
{
	if(msg_open || fmsg_open)
	{
		hide_overlay(true)
		hide_foverlay()
	}

	else
	{
		if($('#title').html() !== main_title)
		{
			stop()
		}
	}

}

function hide_and_stop()
{
	if(msg_open || fmsg_open)
	{
		hide_overlay(true)
		hide_foverlay()
	}

	if($('#title').html() !== main_title)
	{
		stop()
	}

	update_title()
}

function start()
{
	playing = true
	started = false
	paused = false
	stop_loop()
	set_speed()
	hide_overlays()
	generate()
	fit()

	$('#title').html('Starting Game')

	$('#points').html('')

	$('#start').html('Stop')

	$('body').css('background-image', 'none')

	$('#main_container').focus()

	to_top()

	play('started')

	if(music_fadeout_interval !== undefined)
	{
		clearInterval(music_fadeout_interval)
	}

	play('music')

	clear_started()

	last_highscore = ""

	sold_on_tick = []

	report = []

	num_lit = 0

	num_lit_trios = 0

	gained_from_lit = 0

	ticks_skipped = 0

	bonus = 0

	bonus_points = 0

	lit_trios_on_tick = 0

	started_timeout = setTimeout(function()
	{
		$('.element_patent_btn').each(function()
		{
			$(this).css('display', 'inline-block')
		})

		points = start_points
		count = start_count
		update_points()
		update_counter()
		set_cursors_pointer()
		loop()
		started = true

	}, 3700)
}

function clear_started()
{
	if(started_timeout !== undefined)
	{
		clearTimeout(started_timeout)
	}
}

function generate()
{
	$('#main_container').html('')

	if(options.seed === -1)
	{
		Math.seedrandom()
	}

	else
	{
		Math.seedrandom(options.seed)
	}

	for(var i=0; i<elements.length; i++)
	{   
		var element = elements[i]

		element.owned = false

		element.id = i

		element.soldonce = false

		element.frozen = false

		element.freeze_chain = 0

		element.lit = false

		element.deactivated = false

		element.gone = false

		element.bonus = 0

		if(options.seed === 0.1)
		{
			var index = 5
		}

		else
		{
			var index = get_random_int(0, 10)
		}

		element.profit = profits[index]

		if(options.seed === 0.1)
		{
			if(i % 2 === 0)
			{
				index = 1
			}

			else
			{
				index = 0
			}
		}

		else
		{
			index = get_random_int(0, 1)
		}

		element.direction = directions[index]

		if(element.profit === 1000000 && element.direction === "up")
		{
			element.direction = "down"
		}

		else if(element.profit === -1000000 && element.direction === "down")
		{
			element.direction = "up"
		}

		if(element.direction === "up")
		{
			var dir = "UP"
		}

		else
		{
			var dir = "DOWN"
		}

		var s = "<div class='element_container cursor_default"

		if(element.profit > 0)
		{
			s +=  " green"
		}

		else
		{
			s += " red"
		}

		if(options.hints && (element.profit === 0 || element.profit === 200000) && element.direction === "up")
		{
			s += " pulsating"
		}

		s += "'>"

		s += "<div class='element_name'>" + elements[i].name + "</div>"
		s += "<div class='element_profit'>" + format(element.profit) +"</div>"
		s += "<div class='element_direction'>" + dir + "</div>"
		s += "<button class='element_patent_btn' style='display:none'>Buy Patent</button>"
		s += "</div>"

		$('#main_container').append(s)
	}

	var id = 0

	$('.element_container').each(function()
	{
		$(this).mousedown(function()
		{
			if(playing && started && !paused)
			{
				click_events(this)
			}
		})

		$(this).data('id', id)

		id += 1
	})
}

function fit()
{
	if($('#main_container').html() !== "")
	{
		$('.breaker').each(function()
		{
			$(this).remove()
		})

		var size = 1

		$('#main_container').css('font-size', size + 'em')

		if(options.fit)
		{
			for(var i=0; i<20; i++)
			{
				if(document.body.scrollHeight > document.body.clientHeight)
				{
					size -= 0.025
					
					$('#main_container').css('font-size', size + 'em')
				}
			}

			if(document.body.scrollHeight <= document.body.clientHeight)
			{
				var last = $('.element_container').last()
				var qheight = last.outerHeight() / 4
				var top1 = last.offset().top
				var top2 = top1 - last.outerHeight() 
				var row1 = []
				var row2 = []

				$('.element_container').each(function()
				{
					var top = $(this).offset().top
					var t1 = top - qheight
					var t2 = top + qheight

					if(top1 > t1 && top1 < t2)
					{
						row1.push($(this))
					}

					else if(top2 > t1 && top2 < t2)
					{
						row2.push($(this))
					}
				})

				var diff = row2.length - row1.length
				var n = Math.floor(diff / 2)

				if(n > 1)
				{
					$("<div class='breaker'></div>").insertAfter($(row2[row2.length - n]))
				}
			}
		}
	}
}

function click_events(parent)
{
	var element = elements[$(parent).data('id')]

	if(element.gone || element.frozen || element.deactivated)
	{
		return
	}

	var btn = $(parent).find('.element_patent_btn').get(0)

	if(btn.innerHTML === 'Buy Patent')
	{
		sold_on_tick = []

		if(element.profit <= 0)
		{
			var price = Math.abs(element.profit)
		}

		else if(element.profit === 5000000)
		{
			var price = 50000000
			gained_from_lit -= price
		}

		else
		{
			var price = element.profit * 5
		}

		points -= price

		report.push(-price)

		element.owned = true

		if(options.advanced)
		{
			if(element.soldonce && !element.lit)
			{
				element.frozen = true

				$($('.element_container').get(element.id)).removeClass('green')
				$($('.element_container').get(element.id)).removeClass('red')
				$($('.element_container').get(element.id)).addClass('blue')

				if(element.profit === 1000000)
				{
					element.freeze_chain += 1
				}
			}
		}

		$(btn).addClass('btn_sell')
		$(btn).html('Sell Patent')
	}
	
	else
	{
		if(element.profit <= 0)
		{
			var price = 0
		}

		else if(element.profit === 5000000)
		{
			var price = 25000000
			gained_from_lit += price
		}

		else
		{
			var price = element.profit * (element.profit / 200000)
		}

		points += price

		report.push(price)

		element.owned = false

		$(btn).removeClass('btn_sell')
		$(btn).html('Buy Patent')

		if(options.advanced)
		{
			element.soldonce = true

			sold_on_tick.push(element)

			if(sold_on_tick.length > 3)
			{
				sold_on_tick.splice(0, 1)
			}

			if(sold_on_tick.length > 2)
			{
				if(sold_on_tick[0].profit === 5000000)
				{
					if(sold_on_tick[0].profit === sold_on_tick[1].profit && sold_on_tick[0].profit === sold_on_tick[2].profit)
					{
						var id1 = sold_on_tick[0].id
						var id2 = sold_on_tick[1].id
						var id3 = sold_on_tick[2].id

						if(id1 !== id2 && id1 !== id3 && id2 !== id3)
						{
							num_lit_trios += 1

							lit_trios_on_tick += 1

							sold_on_tick[0].bonus = lit_trios_on_tick 
							sold_on_tick[1].bonus = lit_trios_on_tick 
							sold_on_tick[2].bonus = lit_trios_on_tick 

							sold_on_tick[0].deactivated = true
							sold_on_tick[1].deactivated = true
							sold_on_tick[2].deactivated = true

							$($($('.element_container').get(id1)).find('.element_patent_btn').get(0)).remove()
							$($($('.element_container').get(id2)).find('.element_patent_btn').get(0)).remove()
							$($($('.element_container').get(id3)).find('.element_patent_btn').get(0)).remove()

							$($('.element_container').get(id1)).addClass('pulsetrio')
							$($('.element_container').get(id2)).addClass('pulsetrio')
							$($('.element_container').get(id3)).addClass('pulsetrio')
							
							sold_on_tick = []
						}
					}
				}
			}
		}
	}

	update_points()

	if(options.hints)
	{
		check_all_hints()
	}
}

function change_profit(element)
{
	if(element.direction === "up")
	{
		var change = 200000
	}

	else
	{
		var change = -200000
	}

	element.profit += change

	if(element.profit <= -1000000)
	{
		element.direction = "up"
		$($('.element_container').get(element.id)).find('.element_direction').get(0).innerHTML = "UP"
	}

	if(element.profit >= 1000000)
	{
		element.direction = "down"
		$($('.element_container').get(element.id)).find('.element_direction').get(0).innerHTML = "DOWN"
	}
}

function format(n)
{
	return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

function TickTimer(callback, delay) 
{
	var timerId, start, remaining = delay

	this.pause = function() 
	{
		clearTimeout(timerId)
		remaining -= new Date() - start
		this.active = false
	}

	this.resume = function() 
	{
		start = new Date()
		clearTimeout(timerId)
		timerId = setTimeout(callback, remaining)
		this.active = true
	}

	this.resume()
}

function loop() 
{
	tick_timer = new TickTimer(function() 
	{

		if(count > 0)
		{
			tick()
		}

		if(count > 0)
		{
			if(options.speed === "Linear")
			{
				loop_speed = speed_slow - (linear_diff * (start_count - count))
			}

			loop()
		}

	}, loop_speed)
}

function stop_loop()
{
	count = 0

	if(tick_timer !== undefined)
	{
		tick_timer.pause()
	}
}

function tick()
{
	count -= 1

	if(points < 0)
	{
		subtract_count()
	}

	report.push(';' + count + ';')
	
	sold_on_tick = []

	lit_trios_on_tick = 0

	remove_pulsetrios()

	for(var i=0; i<elements.length; i++)
	{
		var element = elements[i]

		if(element.gone)
		{
			continue
		}

		var cont = $('.element_container').get(i)

		if(element.lit)
		{
			gone(cont, element)
			continue
		}

		element.soldonce = false

		if(element.frozen)
		{
			element.frozen = false

			$(cont).removeClass('blue')

			if(element.freeze_chain === 3)
			{
				element.lit = true
				element.profit = 5000000
				num_lit += 1
				gained_from_lit += element.profit
			}
		}

		else
		{
			element.freeze_chain = 0
			change_profit(element)
		}

		$(cont).find('.element_profit').html(format(element.profit))

		if(element.lit)
		{
			$(cont).addClass('yellow')
			$(cont).find('.element_direction').get(0).innerHTML = "LIT"
		}

		else
		{
			if(element.profit > 0)
			{
				$(cont).removeClass('red')
				$(cont).addClass('green')
			}

			else
			{
				$(cont).removeClass('green')
				$(cont).addClass('red')                
			}
		}

		if(element.owned)
		{
			points += element.profit
			report.push(element.profit)
		}
	}
	
	update_counter()
	update_points()

	if(options.hints)
	{
		check_all_hints()
	}

	check_state()
}

function gone(cont, element)
{
	$(cont).removeClass('yellow')
	$(cont).removeClass('cursor_pointer')
	$(cont).addClass('cursor_default')
	$(cont).addClass('gone')

	if(element.bonus > 0)
	{
		$(cont).html("<div class='bonus'>" + element.bonus + "</div>")
		bonus += element.bonus
	}

	else
	{
		$(cont).html('')
	}

	element.lit = false

	if(element.deactivated)
	{
		element.deactivated = false
	}

	element.gone = true
}

function make_all_gone()
{
	for(var i=0; i<elements.length; i++)
	{
		gone($('.element_container').get(i), elements[i])
	}
}

function remove_pulsetrios()
{
	$('.pulsetrio').each(function()
	{
		$(this).removeClass('pulsetrio')
	})
}

function check_hint(element)
{
	var cont = $('.element_container').get(element.id)

	$(cont).removeClass('pulsating')

	if(count > 1)
	{
		if(element.direction === "down" && element.owned)
		{
			$(cont).addClass('pulsating')
		}

		else if(element.profit === 0 && element.direction === "up" && !element.owned)
		{
			$(cont).addClass('pulsating')
		}

		else if(element.profit > 0 && element.profit < 1000000 && element.direction === "up" && !element.owned)
		{
			if(points >= element.profit * 5)
			{
				$(cont).addClass('pulsating')
			}
		}
	}

	else if(count === 1)
	{
		if(element.owned)
		{
			if(element.profit === -200000 && element.direction === "up")
			{
				return
			}

			else if(element.profit === 0 && element.direction === "up")
			{
				return
			}

			else if(element.profit === 200000 && element.direction === "up")
			{
				return
			}

			$(cont).addClass('pulsating')
		}

		else
		{
			if(element.profit === 0 && element.direction === "up")
			{
				$(cont).addClass('pulsating')
			}
		}
	}
}

function check_all_hints()
{
	for(var i=0; i<elements.length; i++)
	{
		check_hint(elements[i])
	}
}

function update_points()
{
	var s = format(points)

	if(bonus > 0 && count > 0)
	{
		s += " (+" + bonus + "%)"
	}

	$('#points').html(s)
}

function check_state()
{
	if(count === 0)
	{
		ended()
	}

	else if($('.gone').length === elements.length)
	{
		ended()
	}

	else
	{
		play('pup')
	}
}

function show_instructions()
{
	var s = "<b>Instructions</b><br><br>"
	s += "<img src='inst.gif?v=2' id='instgif'><br><br>"
	s += "The goal is to get as many points as you can.<br><br>"
	s += "Earn points by owning elements that have a positive profit.<br><br>"
	s += "You lose points when you own elements that have a negative profit.<br><br>"
	s += "You own an element by buying its patent.<br><br>"
	s += "Point earnings or losses of owned patents only occur after each tick.<br><br>"
	s += "The prices for each profit point are shown in the table below:<br><br>"
	s += "<table cellspacing=0><tr><th>Profit</th><th>Buy Price</th><th>Sell Price</th></tr><tr><td>1,000,000</td><td>5,000,000</td><td>5,000,000</td></tr><tr><td>800,000</td><td>4,000,000</td><td>3,200,000</td></tr><tr><td>600,000</td><td>3,000,000</td><td>1,800,000</td></tr><tr><td>400,000</td><td>2,000,000</td><td>800,000</td></tr><tr><td>200,000</td><td>1,000,000</td><td>200,000</td></tr><tr><td>0</td><td>0</td><td>0</td></tr><tr><td>-200,000</td><td>200,000</td><td>0</td></tr><tr><td>-400,000</td><td>400,000</td><td>0</td></tr><tr><td>-600,000</td><td>600,000</td><td>0</td></tr><tr><td>-800,000</td><td>800,000</td><td>0</td></tr><tr><td>-1,000,000</td><td>1,000,000</td><td>0</td></tr></table><br>"
	s += "Changes in profit are either +200,000 or -200,000 per tick.<br><br>"
	s += "The direction, UP or DOWN, shows if the profit is going to increase or decrease.<br><br>"
	s += "The direction changes when an element reaches 1,000,000 or -1,000,000 profit.<br><br>"
	s += "You can click any part of the tile to buy or sell, not just the button.<br><br>"
	s += "You can change the seed (#) to have predictable initial configurations.<br><br>"
	s += "You can change the speed of the game, which changes the interval between ticks.<br><br>"
	s += "Ticks happen every 5, 8 or 12 seconds depending on your speed setting.<br><br>"
	s += "Linear speed mode starts at 12 seconds and ends at 5 seconds.<br><br>"
	s += "If you end a tick with negative points, the tick counter is decreased by 2 instead of 1.<br><br>"
	s += "The game ends when the tick counter reaches 0.<br><br>"
	s += "<br><b>Core Mode</b><br><br>"
	s += "The point is to maximize your points by selling as much as you can while spending the least.<br><br>"
	s += "The ideal is to buy at 0 UP because it costs you 0 points and sell at 1 million DOWN. Earning you 8 million in total.<br><br>"
	s += "200,000 + 400,000 + 600,000 + 800,000 + 1,000,000 + 5,000,000.<br><br>"
	s += "You should sell anything going down because it will only lose value or get in the reds and start subtracting points.<br><br>"
	s += "As ticks are about to end, make sure you don't buy anything that won't earn you points, and sell what you need to sell at the last tick.<br><br>"
	s += "<br><b>Advanced Mode</b><br><br>"
	s += "Advanced mode adds new mechanics to the core game.<br><br>"
	s += "The point is to maximize your score, mainly by selling as many lit elements and lit trios as you can.<br><br>"
	s += "You achieve this by freezing elements.<br><br>"
	s += "Selling and buying an element in the same tick freezes it. Which makes it stay in the same state on the next tick.<br><br>"
	s += "Freezing a 1 million element 3 times in a row makes it lit.<br><br>"
	s += "When lit, its profit is 5 million, selling price is 25 million, and buying price is 50 million.<br><br>"
	s += "Elements that become lit are gone from the game after the next tick.<br><br>"
	s += "Lit elements sold in trios provide a bonus percentage on the overall score at the end.<br><br>"
	s += "The percentage given by each gone element is determined by its bonus stack.<br><br>"
	s += "For instance, the first trio sold gets 1%, the second trio sold in the same tick gets 2%.<br><br>"
	s += "Another way for the game to end is by making all elements gone.<br><br>"
	s += "A good strategy is using freeze to align 3 elements so they become lit at the same time, and sell them as a lit trio.<br><br>"
	s += "You can also try aligning multiple lit trios so you can increase the bonus stack.<br><br>"
	s += "<br><b>Shortcuts</b><br><br>"
	s += "You can start a game with Enter.<br><br>"
	s += "Escape closes windows or stops the current game if there are no windows.<br><br>"
	s += "Backspace opens or closes the menu.<br><br>"
	s += "Clicking on the tick counter, or pressing Space, pauses or resumes the game.<br><br>"
	s += "Clicking on \"Game Ended\" shows the game report.<br><br>"
	s += "Clicking on the game points shows the high scores.<br><br>"
	s += "Clicking on Core or Advanced at the top of High Scores toggles between Core High Scores and Advanced High Scores.<br><br>"
	s += "\"Right clicking\" on the title opens a context menu.<br><br>"
	s += "If there is overflow, you can use UpArrow or W to scroll to the top, and DownArrow or S to scroll to the bottom.<br><br>"

	msg(s)
}

function get_options()
{
	options = JSON.parse(localStorage.getItem(ls_options))

	if(options === null)
	{
		options = {fit: true, sounds: true, music: true, hints: false, advanced: true, seed: 1, speed: "Normal"}
		update_options()
	}

	change_seed(options.seed, false)
	change_speed(options.speed, false)
	change_mode(options.advanced, false)
}

function update_options()
{
	localStorage.setItem(ls_options, JSON.stringify(options))
}

function show_options()
{
	var s = "<b>Options</b><br><br>"

	s += "Automatically Fit Grid<br><br>"

	if(options.fit)
	{
		s += "<input id='chk_fit' type='checkbox' checked>"
	}

	else
	{
		s += "<input id='chk_fit' type='checkbox'>"
	}

	s += "<br><br><br>Enable Sounds<br><br>"

	if(options.sounds)
	{
		s += "<input id='chk_sounds' type='checkbox' checked>"
	}

	else
	{
		s += "<input id='chk_sounds' type='checkbox'>"
	}

	s += "<br><br><br>Enable Music<br><br>"

	if(options.music)
	{
		s += "<input id='chk_music' type='checkbox' checked>"
	}

	else
	{
		s += "<input id='chk_music' type='checkbox'>"
	}

	s += "<br><br><br>Enable Hints<br><br>"

	if(options.hints)
	{
		s += "<input id='chk_hints' type='checkbox' checked>"
	}

	else
	{
		s += "<input id='chk_hints' type='checkbox'>"
	}

	msg(s)

	$('#chk_fit').change(function()
	{
		options.fit = $(this).prop('checked')
		update_options()
		fit()
	})

	$('#chk_sounds').change(function()
	{
		options.sounds = $(this).prop('checked')
		update_options()

		if(!options.sounds)
		{
			stop_all_sounds()
		}
	})

	$('#chk_music').change(function()
	{
		options.music = $(this).prop('checked')
		update_options()

		if(!options.music)
		{
			mute_music()
		}

		else
		{
			unmute_music()
		}
	})

	$('#chk_hints').change(function()
	{
		options.hints = $(this).prop('checked')
		update_options()

		if(playing)
		{
			start()
		}
	})
}

function show_about()
{
	var s = "<b>About</b><br><br>"
	s += "Idea and development by madprops<br><br>"
	s += "Version " + app_version + "<br><br>"
	s += "<a target='_blank' href='http://merkoba.com'>http://merkoba.com</a>"

	msg(s)
}

function get_highscores(advanced)
{
	if(advanced)
	{
		highscores = JSON.parse(localStorage.getItem(ls_highscores_advanced))
	}
	
	else
	{
		highscores = JSON.parse(localStorage.getItem(ls_highscores))
	}

	if(highscores === null)
	{
		highscores = {
			"Overall":[[0, ''], [0, ''], [0, ''], [0, ''], [0, ''], [0, ''], [0, ''], [0, ''], [0, ''], [0, '']],
			"Overall - Slow":[[0, ''], [0, ''], [0, ''], [0, ''], [0, ''], [0, ''], [0, ''], [0, ''], [0, ''], [0, '']],
			"Overall - Normal":[[0, ''], [0, ''], [0, ''], [0, ''], [0, ''], [0, ''], [0, ''], [0, ''], [0, ''], [0, '']],
			"Overall - Fast":[[0, ''], [0, ''], [0, ''], [0, ''], [0, ''], [0, ''], [0, ''], [0, ''], [0, ''], [0, '']],
			"Overall - Linear":[[0, ''], [0, ''], [0, ''], [0, ''], [0, ''], [0, ''], [0, ''], [0, ''], [0, ''], [0, '']]
		}

		if(advanced)
		{
			localStorage.setItem(ls_highscores_advanced, JSON.stringify(highscores))		
		}

		else
		{
			localStorage.setItem(ls_highscores, JSON.stringify(highscores))		
		}
	}

	else
	{
		var keys = Object.keys(highscores)

		for(var i=0; i<keys.length; i++)
		{
			if(keys[i].indexOf("Overall") !== -1)
			{
				continue
			}

			var sum = highscores[keys[i]].reduce((a, b) => a + b, 0)

			if(sum === 0)
			{
				delete highscores[keys[i]]
			}
		}
	}
}

function get_setting_highscores(setting, advanced)
{
	get_highscores(advanced)

	var scores = highscores[setting]

	if(scores === undefined)
	{
		highscores[setting] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		return highscores[setting]
	}

	else
	{
		return scores
	}
}

function get_setting()
{
	if(options.seed === -1)
	{
		var s = "#"
	}

	else if(options.seed === 0.1)
	{
		var s = "#NaN"
	}

	else
	{
		var s = "#" + parseInt(options.seed)
	}

	s += " - " + options.speed

	return s
}

function get_mode_text()
{
	if(options.advanced)
	{
		var m = "Adv"
	}

	else
	{
		var m = "Core"
	}

	return m
}

function get_full_setting()
{
	return get_setting() + " : " + get_mode_text()
}

function start_setting(setting, advanced)
{
	var sd = setting.split(" - ")[0].replace('#', '').trim()

	if(sd === '')
	{
		change_seed('-1', false)
	}

	else if(sd === 'NaN')
	{
		change_seed('0.1', false)
	}

	else
	{
		change_seed(sd, false)
	}

	change_speed(setting.split(" - ")[1].trim(), false)

	change_mode(advanced, false)

	update_options()	

	start()
}

function show_highscores(advanced)
{
	get_highscores(advanced)

	if(advanced)
	{
		var s = "<div id='hs_type_toggle' class='hs_type unselectable'>Advanced</div>"
	}

	else
	{
		var s = "<div id='hs_type_toggle' class='hs_type unselectable'>Core</div>"
	}

	s += "<b class='unselectable'>High Scores</b>"

	s += "<div class='hs_select unselectable'><select id='hs_setting_select'>"

	s += "<option value='Overall'>Overall</option>"
	s += "<option value='Overall - Slow'>Overall - Slow</option>"
	s += "<option value='Overall - Normal'>Overall - Normal</option>"
	s += "<option value='Overall - Fast'>Overall - Fast</option>"
	s += "<option value='Overall - Linear'>Overall - Linear</option>"

	var keys = Object.keys(highscores)

	if(hs_setting === null)
	{
		var setting = get_setting()
	}

	else
	{
		var setting = hs_setting
	}
	
	if(keys.indexOf(setting) === -1)
	{
		keys.push(setting)
	}

	keys.sort()

	for(var i=0; i<keys.length; i++)
	{
		var key = keys[i]

		if(key.indexOf("Overall") !== -1)
		{
			continue
		}

		s += "<option value='" + key + "'>" + key + "</option>"
	}

	s += "</select></div><div id='scores'></div>"

	msg(s)

	$('#hs_type_toggle').click(function()
	{
		if(advanced)
		{
			show_highscores(false)
		}

		else
		{
			show_highscores(true)
		}
	})

	$('#msg').find('option').each(function()
	{
		if($(this).val() === setting)
		{
			$(this).prop('selected', true)
		}
	})
	
	show_scores($('#hs_setting_select option:selected').val(), advanced)

	if(advanced)
	{
		$('#hs_setting_select').change(function()
		{
			show_scores($('#hs_setting_select option:selected').val(), true)
		})
	}

	else
	{
		$('#hs_setting_select').change(function()
		{
			show_scores($('#hs_setting_select option:selected').val(), false)
		})	
	}

}

function show_scores(setting, advanced)
{
	hs_setting = setting

	var scores = get_setting_highscores(setting, advanced)

	var s = ""

	if(setting.indexOf("Overall") !== -1)
	{
		for(var i=0; i<scores.length; i++)
		{
			var hs = scores[i][0]
			var ss = scores[i][1]

			if(hs === 0)
			{
				s += "----"
			}

			else
			{
				s += "<span class='clickable_score' data-ss='" + ss + "'>"
				s += "<div class='setting_small'>" + ss + "</div>"

				if(last_highscore !== "")
				{
					var t = last_highscore.split("=")[0]
					var p = last_highscore.split("=")[1]
					var m = last_highscore.split("=")[2]
				}
				
				if(last_highscore !== "" && ((m === "Advanced" && advanced) || (m === "Core" && !advanced)) && ss == t && hs == p)
				{
					s += "<span class='grey_highlight'>" + format(hs) + "</span>"
				}

				else
				{
					s += "<span>" + format(hs) + "</span>"
				}

				s += "</span>"
			}

			if(i < scores.length - 1)
			{
				s += "<br><br>"
			}
		}

		s += "<br>"
		
		if(setting === "Overall")
		{
			s += "<br><div id='hs_clear' class='linkydiv unselectable'>Clear High Scores</div>"
		}
	}
	
	else
	{
		for(var i=0; i<scores.length; i++)
		{
			var hs = scores[i]

			if(hs === 0)
			{
				s += "----<br><br>"
			}

			else
			{
				if(last_highscore !== "")
				{
					var t = last_highscore.split("=")[0]
					var p = last_highscore.split("=")[1]
					var m = last_highscore.split("=")[2]
				}
				
				if(last_highscore !== "" && ((m === "Advanced" && advanced) || (m === "Core" && !advanced)) && setting == t && hs == p)
				{
					s += "<span class='grey_highlight'>" + format(hs) + "</span>"
				}

				else
				{
					s += "<span>" + format(hs) + "</span>"
				}

				s += "<br><br>"
			}
		}

		s += "<div id='hs_play_again' class='linkydiv unselectable'>Play Again</div>"
	}

	s += "<br><div id='hs_copy_hs' class='linkydiv'>Copy To Clipboard</div>"
	
	$('#scores').html(s)
	
	$('#hs_setting_select').val(setting)

	$('#msg').scrollTop(0)

	$('.clickable_score').click(function()
	{
		show_scores($(this).data('ss'), advanced)
	})

	$('#hs_clear').click(function()
	{
		clear_highscores(advanced)
	})

	$('#hs_play_again').click(function()
	{
		start_setting(setting, advanced)
	})

	$('#hs_copy_hs').click(function()
	{
		copy_highscores(setting, advanced)
	})
}

function copy_highscores(setting, advanced)
{
	var scores = get_setting_highscores(setting, advanced)

	var s = setting

	if(advanced)
	{
		s += " : Adv\n"
	}

	else
	{
		s += " : Core\n"
	}

	if(setting.indexOf("Overall") !== -1)
	{
		for(var i=0; i<scores.length; i++)
		{
			var hs = scores[i][0]
			var ss = scores[i][1]
			
			if(hs === 0)
			{
				s += "----"
			}

			else
			{
				s += format(hs) + " (" + ss + ")"
			}

			s += "\n"
		}
	}

	else
	{
		for(var i=0; i<scores.length; i++)
		{
			var hs = scores[i]

			if(hs === 0)
			{
				s += "----"
			}

			else
			{
				s += format(hs)
			}

			s += "\n"
		}
	}

	copy_to_clipboard(s)
}

function show_report()
{
	var s = "<b>Game Report</b><br>"

	s += "<div id='report_setting'>" + get_full_setting() + "</div>"

	var pts = start_points

	s += "<div class='grey_highlight'>" + start_count + " (" + format(pts) + ")</div><br>"

	var cnt = start_count

	var total_tpts_positive = 0
	var total_tpts_negative = 0
	
	var tpts_positive = 0
	var tpts_negative = 0

	for(var i=0; i<report.length; i++)
	{
		var item = report[i]

		if(typeof item === "string" && item.startsWith(";"))
		{
			cnt = item.replace(/;/g, "")

			s += "<div>Positive: " + format(tpts_positive) + "</div><br>"
			s += "<div>Negative: " + format(tpts_negative) + "</div><br>"
			s += "<div>Balance: " + format(tpts_positive + tpts_negative) + "</div><br>"

			s += "<div class='grey_highlight'>" + cnt + " (" + format(pts) + ")</div><br>"

			tpts_positive = 0
			tpts_negative = 0
		}

		else
		{
			if(item !== 0)
			{
				pts += item

				if(item > 0)
				{
					s += "<div class='green_color'>" + format(item) + "</div><br>"

					tpts_positive += item
					total_tpts_positive += item
				}

				else
				{
					s += "<div class='red_color'>" + format(item) + "</div><br>"

					tpts_negative += item
					total_tpts_negative += item
				}
			}
		}
	}

	s += "<div>Positive: " + format(tpts_positive) + "</div><br>"
	s += "<div>Negative: " + format(tpts_negative) + "</div><br>"
	s += "<div>Balance: " + format(tpts_positive + tpts_negative) + "</div><br>"

	s += "<div id='rep_copy' class='linkydiv'>Copy To Clipboard</div>"

	msg(s)

	var s = "<br><div class='grey_highlight'>Overview</div><br>"

	if(options.advanced)
	{
		s += "<div>Elements Lit: " + num_lit + "</div><br>"
		s += "<div>Lit Trios Sold: " + num_lit_trios + "</div><br>"
		s += "<div>Lit Points: " + format(gained_from_lit) + "</div><br>"
		s += "<div>Elements Gone: " + $('.gone').length + "</div><br>"
	}

	s += "<div>Total Positive: " + format(total_tpts_positive) + "</div><br>"
	s += "<div>Total Negative: " + format(total_tpts_negative) + "</div><br>"

	if(options.advanced)
	{
		s += "<div>Balance: " + format(total_tpts_positive + total_tpts_negative) + "</div><br>"
		s += "<div>Bonus: " + bonus + "% (" + format(bonus_points) + ")</div><br>"
	}

	s += "<div>Final Balance: " + format(points) + "</div><br>"

	s += "<div>Ticks Skipped: " + ticks_skipped + "</div><br>"
	
	$(s).insertAfter($('#report_setting'))

	$('#rep_copy').click(function()
	{
		copy_report()
	})
}

function copy_report()
{
	copy_to_clipboard(document.getElementById('msg').innerText.replace('Game Report', '').replace('Copy To Clipboard', '').replace(/\n\s*\n/g, '\n').trim())
}

function set_speed()
{
	if(options.speed === "Slow" || options.speed === "Linear")
	{
		loop_speed = speed_slow
	}

	else if(options.speed === "Normal")
	{
		loop_speed = speed_normal
	}

	else if(options.speed === "Fast")
	{
		loop_speed = speed_fast
	}
}

function on_finish()
{
	if(count > 0)
	{
		stop_loop()
	}

	playing = false
	start_music_fadeout()
	set_cursors_default()

	$('#start').html('Play Again')
}

function ended()
{
	on_finish()

	if(points > 0 && bonus > 0)
	{
		bonus_points = Math.round(points * (bonus / 100))
		points = points + bonus_points
		update_points()	
	}

	$('#title').html('Game Ended')

	if(options.hints)
	{
		var s = "Time's up!<br><br>Score: " + format(points) + "<br><br><br>"
		s += "<button id='end_play_again' class='dialog_btn'>Play Again</button>"
		s += "<span id='hint_dis'><br><br><button id='end_hint_dis' class='dialog_btn'>Disable Hints</button></span>"
		s += "<br><br><button id='end_rep' class='dialog_btn'>Game Report</button>"
		
		msg(s, true)
		msg_align_btns()
		play('ended')

		$('#end_play_again').click(function()
		{
			start()
		})

		$('#end_hint_dis').click(function()
		{
			disable_hints()
		})

		$('#end_rep').click(function()
		{
			show_report()
		})

		return
	}

	var shs = "<br><br><button id='end_show_hs' class='dialog_btn'>High Scores</button><br><br><button id='end_rep' class='dialog_btn'>Game Report</button>"

	var setting = get_setting()
	var hs = get_setting_highscores(setting, options.advanced)
	
	var overall = highscores.Overall
	var overall_speed = highscores["Overall - " + options.speed]

	if(!options.hints && points > hs[hs.length -1])
	{
		if(points > hs[0])
		{
			msg("Time's up!<br><br>Score: " + format(points) + "<br><br>New high score!<br><br><br><button id='end_play_again' class='dialog_btn'>Play Again</button>" + shs, true)
			msg_align_btns()
			play('highscore')

			hs.push(points)
			hs.sort(function(a, b){return b-a})
			hs.splice(10, hs.length)

			if(options.advanced)
			{
				localStorage.setItem(ls_highscores_advanced, JSON.stringify(highscores))
			}

			else
			{
				localStorage.setItem(ls_highscores, JSON.stringify(highscores))
			}
		}

		else
		{
			msg("Time's up!<br><br>Score: " + format(points) + "<br><br><br><button id='end_play_again' class='dialog_btn'>Play Again</button>" + shs, true)
			msg_align_btns()
			play('ended')
			
			if(hs.indexOf(points) === -1)
			{
				hs.push(points)
				hs.sort(function(a, b){return b-a})
				hs.splice(10, hs.length)

				if(options.advanced)
				{
					localStorage.setItem(ls_highscores_advanced, JSON.stringify(highscores))
				}

				else
				{
					localStorage.setItem(ls_highscores, JSON.stringify(highscores))
				}
			}
		}
	}

	else
	{
		msg("Time's up!<br><br>Score: " + format(points) + "<br><br><br><button id='end_play_again' class='dialog_btn'>Play Again</button>" + shs, true)
		msg_align_btns()
		play('ended')
	}

	$('#end_play_again').click(function()
	{
		start()
	})

	$('#end_show_hs').click(function()
	{
		show_highscores(options.advanced)
	})

	$('#end_rep').click(function()
	{
		show_report()
	})

	overall.sort(function(a, b)
	{
		var x=a[0]
		var y=b[0]

		return y-x
	})

	if(points > overall_speed[overall_speed.length -1][0])
	{
		overall_speed.push([points, setting])

		overall_speed.sort(function(a, b)
		{
			var x=a[0]
			var y=b[0]

			return y-x
		})

		var counted = []
		var ncounted = []

		for(var i=0; i<overall_speed.length; i++)
		{
			if(overall_speed[i][1] === "" || ncounted.indexOf(overall_speed[i][1]) === -1)
			{
				counted.push(overall_speed[i])
				ncounted.push(overall_speed[i][1])

				if(counted.length === 10)
				{
					break
				}
			}
		}

		highscores["Overall - " + options.speed] = counted

		if(options.advanced)
		{
			localStorage.setItem(ls_highscores_advanced, JSON.stringify(highscores))
		}

		else
		{
			localStorage.setItem(ls_highscores, JSON.stringify(highscores))
		}	
	}

	if(points > overall[overall.length -1][0])
	{
		overall.push([points, setting])

		overall.sort(function(a, b)
		{
			var x=a[0]
			var y=b[0]

			return y-x
		})

		var counted = []
		var ncounted = []

		for(var i=0; i<overall.length; i++)
		{
			if(overall[i][1] === "" || ncounted.indexOf(overall[i][1]) === -1)
			{
				counted.push(overall[i])
				ncounted.push(overall[i][1])

				if(counted.length === 10)
				{
					break
				}
			}
		}

		highscores.Overall = counted

		if(options.advanced)
		{
			localStorage.setItem(ls_highscores_advanced, JSON.stringify(highscores))
		}

		else
		{
			localStorage.setItem(ls_highscores, JSON.stringify(highscores))
		}	
	}

	last_highscore = setting + "=" + points

	if(options.advanced)
	{
		last_highscore += "=Advanced"
	}

	else
	{
		last_highscore += "=Core"
	}
}

function overlay_clicked()
{
	$('#overlay').click(function()
	{
		hide_overlay()
	})

	$('#foverlay').click(function()
	{
		hide_foverlay()
	})
}

function hide_overlays()
{
	hide_overlay(true)
	hide_foverlay()
}

function hide_overlay(force=false)
{
	if(msg_open && (msg_closeable || force))
	{
		$('#overlay').css('display', 'none')
		$('#msg').css('display', 'none')
		$('#msg').html('')
		msg_open = false
		msg_closeable = false
	}
}

function msg(txt, temp_disable=false)
{
	hide_foverlay()
	
	$('#overlay').css('display', 'block')
	$('#msg').html(txt)
	$('#msg').css('display', 'block')
	$('#msg').scrollTop(0)
	$('#msg').focus()

	if(temp_disable)
	{
		$('.dialog_btn').prop('disabled', true)
		msg_closeable = false

		setTimeout(function()
		{
			$('.dialog_btn').prop('disabled', false)
			msg_closeable = true

		}, 1000)
	}

	else
	{
		msg_closeable = true
	}

	hs_setting = null
	
	msg_open = true
}

function msg_align_btns(alt=false)
{
	if(alt)
	{
		$('#msg').find('.dialog_btn').each(function()
		{
			$(this).width($(this).outerWidth())
		})		
	}

	else
	{
		var w = 0

		$('#msg').find('.dialog_btn').each(function()
		{
			w = Math.max(w, $(this).outerWidth())
		})

		$('#msg').find('.dialog_btn').each(function()
		{
			$(this).width(w)
		})
	}
}

function hide_foverlay()
{
	if(fmsg_open)
	{
		$('#foverlay').css('display', 'none')
		$('#fmsg').css('display', 'none')
		$('#fmsg').html('')
		fmsg_open = false
		msg_closeable = false
		fmsg_mode = null
	}
}

function fmsg(txt, el)
{
	hide_overlay()	

	if(el === fmsg_mode)
	{
		hide_foverlay()
		return false
	}

	$('#fmsg').css('display', 'block')
	$('#fmsg').css('left', 'auto')
	$('#fmsg').css('right', 'auto')
	$('#fmsg').html(txt)
	$('#foverlay').css('display', 'block')
	$('#fmsg').scrollTop(0)
	$('#fmsg').focus()
	
	fmsg_open = true

	fmsg_mode = el

	return true
}

function fmsg_align_btns(alt=false)
{
	if(alt)
	{
		$('#fmsg').find('.dialog_btn').each(function()
		{
			$(this).width($(this).outerWidth())
		})		
	}

	else
	{
		var w = 0

		$('#fmsg').find('.dialog_btn').each(function()
		{
			w = Math.max(w, $(this).outerWidth())
		})

		$('#fmsg').find('.dialog_btn').each(function()
		{
			$(this).width(w)
		})
	}
}

function position_fmsg(el)
{
	$('#fmsg').css('top', $('#title_container').outerHeight() - 1)

	var left = $('#' + el).offset().left - ($('#fmsg').outerWidth() / 2) + ($('#' + el).width() / 2)

	if(left < 0)
	{
		left = 0
	}

	if((left + $('#fmsg').outerWidth()) > document.documentElement.clientWidth)
	{
		$('#fmsg').css('left', 'auto')
		$('#fmsg').css('right', 0)
	}

	else
	{
		$('#fmsg').css('left', left)
	}
}

function refresh()
{
	document.location = document.location
}

function play(what)
{
	if(what === "music")
	{
		if(options.music)
		{
			unmute_music()
		}

		else
		{
			mute_music()
		}

		$('#music')[0].pause()
		$('#music')[0].currentTime = 0
		$('#music')[0].play()

	}

	else if(options.sounds)
	{
		$('#' + what)[0].pause()
		$('#' + what)[0].currentTime = 0
		$('#' + what)[0].play()
	}
}

function music_control()
{
	$('#music')[0].ontimeupdate = function() 
	{
		if(count > 0 && this.currentTime > 73.2)
		{
			this.currentTime = 4.5
		}
	}
}

function pause_music()
{
	$('#music')[0].pause()
}

function unpause_music()
{
	$('#music')[0].play()
}

function mute_music()
{
	$('#music')[0].volume = 0
}

function unmute_music()
{
	$('#music')[0].volume = 1
}

function start_music_fadeout()
{
	if(music_fadeout_interval !== undefined)
	{
		clearInterval(music_fadeout_interval)
	}
	
	music_fadeout_interval = setInterval(music_fadeout, 100)
}

function music_fadeout() 
{
	var newVolume = $('#music')[0].volume - 0.01

	if(newVolume >= 0)
	{
		$('#music')[0].volume = newVolume
	}

	else
	{
		if(music_fadeout_interval !== undefined)
		{
			clearInterval(music_fadeout_interval)
		}

		$('#music')[0].volume = 0
		$('#music')[0].pause()
		$('#music')[0].currentTIme = 0
	}

}

function to_top()
{
	$('body').scrollTop(0)
}

function update_counter()
{
	$('#title').html(count)
}

function seed_picker()
{
	var s = "0 to 999<br><br><input id='seed_input'><br><br>"
	s += "<button id='seed_check_seed' class='dialog_btn'>Ok</button>&nbsp&nbsp"
	s += "<button id='seed_random_seed' class='dialog_btn'>?</button><br><br>"
	s += "<button id='seed_daily' class='dialog_btn'>Daily</button><br><br>"
	s += "<button id='seed_random' class='dialog_btn'>Random</button>"

	if(fmsg(s, 'seed'))
	{
		fmsg_align_btns(true)

		var bw = ($('#seed_random_seed').offset().left + $('#seed_random_seed').outerWidth()) - $('#seed_check_seed').offset().left

		$('#seed_input').outerWidth(bw)
		$('#seed_daily').outerWidth(bw)
		$('#seed_random').outerWidth(bw)

		position_fmsg('seed')
	}

	$('#seed_check_seed').click(function()
	{
		check_seed()
	})

	$('#seed_random_seed').click(function()
	{
		get_random_seed()
	})

	$('#seed_daily').click(function()
	{
		daily()
	})

	$('#seed_random').click(function()
	{
		change_seed(-1)
	})

	$('#seed_input').attr('type', 'number')
	$('#seed_input').attr('max', 999)
	$('#seed_input').attr('min', 0)

	$('#seed_input').on('input', function()
	{
		if($(this).val().length > 3)
		{
			$(this).val($(this).val().substring(0, 3))
		}
	})

	if(options.seed !== -1)
	{
		$('#seed_input').val(options.seed)
	}

	$('#seed_input').focus()
}

function check_seed()
{
	var input = $('#seed_input').val().trim()

	if(input == "")
	{
		$('#seed_input').focus()
		return false
	}

	if(isNaN(input))
	{
		$('#seed_input').focus()
		return false
	}

	else
	{
		if(input < 0 || input > 999)
		{
			$('#seed_input').focus()
			return false
		}

		else
		{
			change_seed(input)
		}
	}
}

function change_seed(s, save=true)
{
	if(s == '0.1')
	{
		var seed = 0.1
	}

	else
	{
		var seed = parseInt(s)

		if(isNaN(seed))
		{
			$('#seed_input').focus()
			return false
		}
	}

	options.seed = seed

	if(options.seed === -1)
	{
		$('#seed').html('#')
	}

	else if(options.seed === 0.1)
	{
		$('#seed').html('#NaN')
	}

	else
	{
		$('#seed').html('#' + options.seed)
	}

	if(save)
	{
		update_options()
	}

	hide_and_stop()
}

function get_random_seed()
{
	Math.seedrandom()

	var r = get_random_int(0, 999)

	if($('#seed_input').val() == r)
	{
		r += 1

		if(r > 999)
		{
			r = 0
		}
	}

	$('#seed_input').val(r).focus()
}

function get_daily()
{
	var d = new Date()
	
	var s = d.getDate() + (d.getMonth() * 100) + d.getYear()

	Math.seedrandom(s)

	return get_random_int(0, 999)
}

function daily()
{
	change_seed(get_daily())
}

function speed_picker()
{
	var s = "<button id='speed_slow' class='dialog_btn'>Slow</button><br><br>"
	s += "<button id='speed_normal' class='dialog_btn'>Normal</button><br><br>"
	s += "<button id='speed_fast' class='dialog_btn'>Fast</button><br><br>"
	s += "<button id='speed_linear' class='dialog_btn'>Linear</button>"

	if(fmsg(s, 'speed'))
	{
		fmsg_align_btns()
		position_fmsg('speed')
	}

	$('#speed_slow').click(function()
	{
		change_speed("Slow")
	})

	$('#speed_normal').click(function()
	{
		change_speed("Normal")
	})

	$('#speed_fast').click(function()
	{
		change_speed("Fast")
	})

	$('#speed_linear').click(function()
	{
		change_speed("Linear")
	})
}

function change_speed(what, save=true)
{
	options.speed = what

	$('#speed').html(what)

	if(save)
	{
		update_options()
	}

	hide_and_stop()
}

function mode_picker()
{
	var s = "<button id='mode_core'class='dialog_btn'>Core</button><br><br>"
	s += "<button id='mode_advanced'class='dialog_btn'>Advanced</button>"

	if(fmsg(s, 'mode'))
	{
		fmsg_align_btns()
		position_fmsg('mode')
	}

	$('#mode_core').click(function()
	{
		change_mode(false)
	})

	$('#mode_advanced').click(function()
	{
		change_mode(true)
	})		
}

function change_mode(advanced, save=true)
{
	options.advanced = advanced

	$('#mode').html(get_mode_text())

	if(save)
	{
		update_options()
	}	

	hide_and_stop()
}

function get_random_int(min, max)
{
	return Math.floor(Math.random() * (max - min + 1)) + min
}

function check_firstime()
{
	if(localStorage.getItem("firstime") === null)
	{
		show_instructions()
		localStorage.setItem("firstime", "check")
	}
}

function key_detection()
{
	$(document).keydown(function(e)
	{ 
		var code = e.keyCode

		if(!$('input').is(':focus'))
		{
			if(code === 8)
			{
				toggle_menu()
				e.preventDefault()
				return
			}

			else if(code === 13)
			{
				start()
				e.preventDefault()
				return
			}

			else if(code === 32)
			{
				toggle_pause()
				e.preventDefault()
				return
			}
		}

		else
		{
			if(code === 13)
			{
				if($('#seed_input').is(':focus'))
				{
					check_seed()
					return
				}
			}
		}
		
		if(code === 27)
		{
			check_escape()
		}

		if(!msg_open && !fmsg_open)
		{
			if(code === 40 || code === 83)
			{
				$('body').scrollTop($(document).height() - $(window).height())
			}

			else if(code === 38 || code === 87)
			{
				$('body').scrollTop(0)
			}

		}
	})
}

function stop()
{
	playing = false
	clear_started()
	stop_loop()
	stop_all_audio()
	hide_overlays()
	$('#main_container').html('')
	$('#title').html(main_title)
	$('#points').html('')
	$('#start').html('Start')
	$('body').css('background-image', 'url(splash.jpg)')
}

function stop_all_sounds()
{
	$('.sound').each(function()
	{
		this.pause()
		this.currentTime = 0
	})
}

function stop_the_music()
{
	$('#music')[0].pause()
	$('#music')[0].currentTime = 0
}

function stop_all_audio()
{
	stop_all_sounds()
	stop_the_music()
}

function show_menu()
{
	var s = "<div id='msg_menu'></div>"
	s += "<button id='menu_instructions' class='dialog_btn'>Instructions</button><br><br>"
	s += "<button id='menu_highscores' class='dialog_btn'>High Scores</button><br><br>"
	s += "<button id='menu_options' class='dialog_btn'>Options</button><br><br>"
	s += "<button id='menu_about' class='dialog_btn'>About</button>"

	msg(s)
	msg_align_btns()

	$('#menu_instructions').click(function()
	{
		show_instructions()
	})

	$('#menu_highscores').click(function()
	{
		show_highscores(options.advanced)
	})

	$('#menu_options').click(function()
	{
		show_options()
	})

	$('#menu_about').click(function()
	{
		show_about()
	})
}

function toggle_menu()
{
	if($('#msg_menu').length === 0)
	{
		show_menu()
	}

	else
	{
		hide_overlay()
	}
}

function clear_highscores(advanced)
{
	if(advanced)
	{
		var conf = confirm("This will delete all your Advanced high scores. Are you sure?")
	}

	else
	{
		var conf = confirm("This will delete all your Core high scores. Are you sure?")
	}

	if(conf) 
	{
		if(advanced)
		{
			localStorage.removeItem(ls_highscores_advanced)
		}

		else
		{
			localStorage.removeItem(ls_highscores)
		}

		show_highscores(advanced)
	}
}

var resize_timer = (function() 
{
	var timer 
	return function() 
	{
		clearTimeout(timer)
		timer = setTimeout(function() 
		{
			fit()
		}, 350)
	}
})()

function resize_events()
{
	$(window).resize(function()
	{
		resize_timer()
	})
}

function play_with_hints()
{
	options.hints = true
	update_options()
	start()
}

function disable_hints()
{
	options.hints = false
	update_options()

	$('#hint_dis').remove()

	$('.element_container').each(function()
	{
		$(this).removeClass('pulsating')
	})
}

function title_click()
{
	if(playing && started)
	{
		toggle_pause()
	}

	else
	{
		if($('#title').html() === main_title)
		{
			show_about()
		}

		else if($('#title').html() === "Game Ended")
		{
			show_report()
		}

		else if($('#title').html() === ("Starting Game"))
		{
			if(options.seed === 0.1)
			{
				change_seed('-1')
			}

			else
			{
				change_seed('0.1')
			}

			start()
		}
	}
}

function toggle_pause()
{
	if(tick_timer !== undefined && playing && started)
	{
		if(tick_timer.active)
		{
			tick_timer.pause()
			pause_music()
			paused = true
			$('#title').html('Paused')
			set_cursors_default()
		}

		else
		{
			tick_timer.resume()
			unpause_music()
			update_counter()
			paused = false
			set_cursors_pointer()
		}
	}
}

function set_cursors_pointer()
{
	$('.element_container').each(function()
	{
		if(!$(this).hasClass('gone'))
		{
			$(this).removeClass('cursor_default').addClass('cursor_pointer')
		}
	})
}

function set_cursors_default()
{
	$('.element_container').each(function()
	{
		if(!$(this).hasClass('gone'))
		{
			$(this).removeClass('cursor_pointer').addClass('cursor_default')
		}
	})
}

function succ()
{
	console.log("%cThis is a browser feature intended for developers. If someone told you to copy-paste something here to enable a feature, it is a scam and will give them access to your memes.", "color: red; font-size: x-large")
}

function get_setting_title()
{
	return "Elements (" + get_full_setting() + ")"
}

function update_title()
{
	document.title = get_setting_title()
}

function disable_context_menus()
{
	$('#main_container')[0].addEventListener('contextmenu', event => event.preventDefault())
	$('#overlay')[0].addEventListener('contextmenu', event => event.preventDefault())
	$('#foverlay')[0].addEventListener('contextmenu', event => event.preventDefault())
	$('#left_side')[0].addEventListener('contextmenu', event => event.preventDefault())
	$('#title_container')[0].addEventListener('contextmenu', event => event.preventDefault())
	$('#right_side')[0].addEventListener('contextmenu', event => event.preventDefault())
}

function start_context_menus()
{
	$.contextMenu(
	{
		selector: '#title',
		items: 
		{
			lsc1: 
			{
				name: "Copy Setting To Clipboard", callback: function(key, opt)
				{
					copy_setting()
				}
			}
		}
	})
}

function copy_setting()
{
	copy_to_clipboard(get_setting_title())
}

function copy_to_clipboard(s)
{
	var textareaEl = document.createElement('textarea')
	document.body.appendChild(textareaEl)
	textareaEl.value = s
	textareaEl.select()
	document.execCommand('copy')
	document.body.removeChild(textareaEl)
	play('pup2')
}

function subtract_count()
{
	count -= 1

	if(count < 0)
	{
		count = 0
	}

	else
	{
		ticks_skipped += 1
	}
}

function left_side_clicks()
{
	$('#seed').click(function()
	{
		seed_picker()
	})

	$('#speed').click(function()
	{
		speed_picker()
	})
	
	$('#mode').click(function()
	{
		mode_picker()
	})	
		
	$('#start').click(function()
	{
		check_start()
	})
}

function title_clicks()
{
	$('#title').click(function()
	{
		title_click()
	})
}

function right_side_clicks()
{
	$('#points').click(function()
	{
		show_highscores(options.advanced)
	})

	$('#menu').click(function()
	{
		show_menu()
	})
}