

$(document).ready(function(){
	skykiwi.global.init();
});

var skykiwi = {
	options: {},
	global: {
		init: function(){
			skykiwi.showOptions.init();
			$("input[type=button]").button();
		},
		getParameterByName: function( url,  name ){
			name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
			var regexS = "[\\?&]" + name + "=([^&#]*)";
			var regex = new RegExp(regexS);
			var results = regex.exec(url);
			if(results == null){
				return "";
			}else{
				return decodeURIComponent(results[1].replace(/\+/g, " "));
			}
		},
		addAction: function(){
			skykiwi.showOptions.panelClose();
			skykiwi.start.init();
		}
	},
	start:{
		init: function(){
			this.startAction();
		},
		startAction: function(){
			$(".btn_start").click(function(){
				skykiwi.start.saveOptions();
				skykiwi.start.getRightForum();
				$(this).removeClass("btn_start").addClass("btn_stop").val("Stop");
				$("#header_panel").addClass("monitoring");
				var uid = skykiwi.start.getUserUID();
				var uid = "338977";
				
				if ( !uid ){
					alert("Please Login First!");
					return false;
				}else{
					var href = new Array();
					var i = skykiwi.options.total_topic;
					$('tbody[id^="normalthread_"]').each(function(){
						var user_href = $(this).find(".by:first").find("cite a").attr("href");
						var user_uid = skykiwi.global.getParameterByName( user_href, "uid");
						if ( user_uid == uid && i > 0 ){
							i--;
							href[i] = $(this).find(".xst").attr("href");
						}
					});
					
					
				}
				

				
				skykiwi.start.stopAction();
			});
		},
		getUserUID: function(){
			var href = $(".vwmy a").attr("href");
			var uid = skykiwi.global.getParameterByName( href, "uid");
			return uid;
		},
		getUsername: function(){
			var username = $(".vwmy").text();
			return username;
		},
		stopAction: function(){
			$(".btn_stop").click(function(){
				$(this).removeClass("btn_stop").addClass("btn_start").val("Start");
				$("#header_panel").removeClass("monitoring");
				skykiwi.start.startAction();
			});
		},
		saveOptions: function(){
			skykiwi.options = {
				forum_id: 		$("input[name=forum_id]").val(),
				total_topic:	$("input[name=total_topic]").val(),
				total_reply:	$("input[name=total_reply]").val(),
				start_time:		$("input[name=start_time]").val(),
				finish_time:	$("input[name=finish_time]").val()
			}
			localStorage.setItem( "options",  JSON.stringify(skykiwi.options));
		},
		getRightForum: function(){
			var forumid = skykiwi.global.getParameterByName( window.location.search, "fid");
			if ( forumid != skykiwi.options.forum_id ){
				window.location.href = "forum.php?mod=forumdisplay&fid="+skykiwi.options.forum_id;
			}else{
				console.log("--- Monitoring ---");
			}
		}
	},
	showOptions:{
		init: function(){
			console.log("--- Create Control Panel ---");
			this.getSavedOptions();
			var html = this.makeHTML();
			$("body").append(html);
			skykiwi.global.addAction();
		},
		getSavedOptions: function(){
			skykiwi.options = $.parseJSON( localStorage.getItem("options") );
		},
		makeHTML: function(){
			var forum_id = skykiwi.options.forum_id ? skykiwi.options.forum_id : 200;
			var total_topic = skykiwi.options.total_topic ? skykiwi.options.total_topic : 4;
			var total_reply = skykiwi.options.total_reply ? skykiwi.options.total_reply : 20;
			var start_time = skykiwi.options.start_time ? skykiwi.options.start_time : "7:00";
			var finish_time = skykiwi.options.finish_time ? skykiwi.options.finish_time : "22:00";
			
			var html = "";
			html = '<div id="helper_panel">';
			html += '<div id="header_panel">Skykiwi Helper<span class="btn_close">close</span></div>';
			html += '<p><label>Forum ID:</label><input type="text" value="'+forum_id+'" name="forum_id" size="2" /></p>';
			html += '<p><label>Total Topic:</label><input type="text" value="'+total_topic+'" name="total_topic" size="2" /></p>';
			html += '<p><label>Total Reply:</label><input type="text" value="'+total_reply+'" name="total_reply" size="2" /> for each topic</p>';
			html += '<p><label>Time Range:</label><input type="text" value="'+start_time+'" name="start_time" size="4" /> - <input type="text" value="'+finish_time+'" name="finish_time" size="4" /></p>';
			html += '<p><input type="button" value="Start" class="btn_start" />';
			html += '</div>';
			return html;
		},
		panelOpen: function(){
			$(".btn_open").on("click", function(){
				var move_height = $("#helper_panel").height() - 18;
				$("#helper_panel").stop(true, true).animate({"bottom": "0px" }, 500);
				$(this).removeClass("btn_open").addClass("btn_close").html("Close");
				skykiwi.showOptions.panelClose();
			});
		},
		panelClose: function(){
			$(".btn_close").on("click", function(){
				var move_height = $("#helper_panel").height() - 18;
				$("#helper_panel").stop(true, true).animate({"bottom": "-"+move_height+"px" }, 500);
				$(this).removeClass("btn_close").addClass("btn_open").html("Open");
				skykiwi.showOptions.panelOpen();
			});
		}		
	},
}
