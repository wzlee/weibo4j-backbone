Weibo4j.Routers.StatusRouter = Backbone.Router.extend({
	routes : {
		"" : "publicTimeline"
	},
	publicTimeline : function() {
		Weibo4j.publicTimelineView = new Weibo4j.Views.PublicTimelineView();
	}
});

Weibo4j.Models.Status = Backbone.Model.extend({
	defaults : {
		created_at : "",
		id : "",
		text : ""
	}
});

var StatusList = Backbone.Collection.extend({
	model : Status,
});

var Notes = new NoteList();

var NoteView = Backbone.View
		.extend({
			tagName : "div",
			className : "span4 well",
			initialize : function() {
				this.model.bind('change', this.render, this);
				this.model.bind('destroy', this.remove, this);
			},
			template : function(note) {
				var template = '<a class="close" title="删除" href="javascript:void(0);">×</a><div class="note"><h2 rel="twipsy" data-original-title="{{title}}">{{short_title}}</h2><p>{{short_content}}</p></div>';
				return Mustache.to_html(template, note);
			},
			render : function() {
				$(this.el).html(this.template(this.model.toJSON()));
				$(':[rel="twipsy"]', this.el).twipsy({
					live : true
				});
				return this;
			},
			events : {
				'click .close' : 'clear',
				'click .note' : 'modify'
			},
			remove : function() {
				$(this.el).remove();
			},
			clear : function() {
				this.model.destroy();
			},
			modify : function() {
				new NoteModifyView({
					model : this.model
				});
			}
		});

var NoteModifyView = Backbone.View
		.extend({
			initialize : function() {
				this.render();
			},
			className : 'modal hide fade',
			events : {
				'hidden' : 'remove',
				'click :submit' : 'submit',
				'click :reset' : 'cancel'
			},
			template : function(note) {
				var template = '<div class="modal-header"><a href="#" class="close">×</a><h3>笔记</h3></div><div class="modal-body"><form class="span7"><fieldset><div class="clearfix" _type="title"><label for="title" _type="title">标题</label><div class="input"><input name="title" _type="title" size="30" type="text" value="{{title}}" /></div></div><div class="clearfix" _type="content"><label for="content" _type="content">内容</label><div class="input"><textarea class="xlarge" name="content" _type="content" rows="6">{{content}}</textarea></div></div></fieldset></form></div><div class="modal-footer"><input type="submit" class="btn primary" value="保存">&nbsp;&nbsp;<button type="reset" class="btn">取消</button></div>';
				return Mustache.to_html(template, note);
			},
			render : function() {
				$(this.el)
						.html(
								this
										.template(typeof (this.model) != 'undefined' ? this.model
												.toJSON()
												: {})).modal({
							keyboard : true,
							show : true,
							backdrop : 'static'
						}).appendTo($('body'));
				return this;
			},
			remove : function(event) {
				event.stopPropagation();
				$(this.el).remove();
			},
			submit : function() {
				var title = $(':[name="title"]', this.el).val();
				var content = $(':[name="content"]', this.el).val();
				if (title && content) {
					if (this.model) {
						this.model.save({
							title : title,
							content : content
						});
					} else {
						Notes.create({
							title : title,
							content : content
						});
					}
					$(this.el).modal('hide');
				} else {
					if (!title) {
						$(':[_type="title"]', this.el).addClass('error');
					} else {
						$(':[_type="title"]', this.el).removeClass('error');
					}

					if (!content) {
						$(':[_type="content"]', this.el).addClass('error');
					} else {
						$(':[_type="content"]', this.el).removeClass('error');
					}
				}
			},
			cancel : function() {
				$(this.el).modal('hide');
			}
		});

var AppView = Backbone.View.extend({
	el : $("#noteapp"),
	events : {
		"click .add_note a" : "addNote"
	},
	initialize : function() {
		Notes.bind('add', this.addOne, this);
		Notes.bind('reset', this.addAll, this);
		Notes.bind('all', this.render, this);
		Notes.fetch();
	},
	addOne : function(note) {
		var view = new NoteView({
			model : note
		});
		$("#noteapp .well").first().after(view.render().el);
	},
	addAll : function() {
		Notes.each(this.addOne);
	},
	addNote : function() {
		new NoteModifyView();
	}
});

$(function() {
	new AppView();
});