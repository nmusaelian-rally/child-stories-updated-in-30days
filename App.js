//builds a grid of children stories updated in the last 30 days, sorted by parent
Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    items:{ html:'<a href="https://help.rallydev.com/apps/2.0rc2/doc/">App SDK 2.0rc2 Docs</a>'},
    launch: function() {
        var millisecondsInDay = 86400000;
        var currentDate = new Date();
        var startDate = new Date(currentDate - millisecondsInDay*30); //in the last 30 days
        var startDateUTC = startDate.toISOString();
        Ext.create('Rally.data.WsapiDataStore', {
            model: 'UserStory',
            fetch: ['FormattedID','Name','Parent', 'HasParent','LastUpdateDate', 'ObjectID', 'Project'],
	    limit: Infinity,
            autoLoad: true,
            filters: [
			{
			    property: 'LastUpdateDate',
			    operator: '>',
			    value: startDateUTC
			}
            ],
            listeners: {
                load: this._onDataLoaded,
                scope: this
            }
        }); 
    },
    _onDataLoaded: function(store, data){
        var stories = [];
        _.each(data, function(story) {
            if (story.get('HasParent')) {
                var parent = story.get('Parent');
                
                var s  = {
                FormattedID: story.get('FormattedID'),
                Name: story.get('Name'),
                _ref: story.get("_ref"),
                //Parent: (this._parent && this._parent.FormattedID) || 'None',
                Parent: parent.FormattedID                
            };
            stories.push(s);
            }
        },
        this);
        this._createGrid(stories);
    },
    _createGrid: function(stories) {
        this.add({
            xtype: 'rallygrid',
            store: Ext.create('Rally.data.custom.Store', {
                data: stories,
                sorters: [
			{
			property: 'Parent',
			direction: 'DESC'     //ASC sorts out 'None' on top
			}
		    ],
            }),
            columnCfgs: [
                {
                   text: 'Formatted ID', dataIndex: 'FormattedID', xtype: 'templatecolumn',
                    tpl: Ext.create('Rally.ui.renderer.template.FormattedIDTemplate')
                },
                {
                    text: 'Name', dataIndex: 'Name', editor: 'textfield', flex: 1,
                },
                {
                    text: 'Parent', dataIndex: 'Parent', xtype: 'templatecolumn',
                        tpl: Ext.create('Rally.ui.renderer.template.FormattedIDTemplate')
                }
            ],
            selType: 'cellmodel',
            plugins: [
                Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 1
                })
            ],
	    width: 600   
        });
    }
});
