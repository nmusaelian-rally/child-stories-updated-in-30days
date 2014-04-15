//child stories updated in the last 30 days
Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    items:{ html:'<a href="https://help.rallydev.com/apps/2.0rc2/doc/">App SDK 2.0rc2 Docs</a>'},
    launch: function() {
        var millisecondsInDay = 86400000;
        var currentDate = new Date();
        var startDate = new Date(currentDate - millisecondsInDay*30); //in the last 30 days
        var startDateUTC = startDate.toISOString();
	
	
	var filters =  [
	    {
		property: 'LastUpdateDate',
		operator: '>',
		value: startDateUTC
	    },
	    {
		property: 'Parent',
		operator: '!=',
		value: null
	    }
        ]
	
	var storeConfig =
	{
	    model: 'UserStory',
	    pageSize: 200,
	    remoteSort: false,
	    fetch: ['FormattedID','Name','Parent', 'HasParent','LastUpdateDate'],
	    filters: filters
	}
	
        this._makeGrid(storeConfig);
    },
    
    _makeGrid: function(storeConfig){
	var _grid = Ext.create('Rally.ui.grid.Grid',{
	    storeConfig: storeConfig,
	    columnCfgs:[
		{
		    text: 'Formatted ID', dataIndex: 'FormattedID', xtype: 'templatecolumn',
			tpl: Ext.create('Rally.ui.renderer.template.FormattedIDTemplate')
                },
                {
                    text: 'Name', dataIndex: 'Name', editor: 'textfield', flex: 1,
                },
                {
                    text: 'Parent', dataIndex: 'Parent',
			renderer: function(parent){
			   return '<a href="' + Rally.nav.Manager.getDetailUrl(parent) + '">' + parent.FormattedID + '</a>'
			}
                        
                }
	    ]
	});
	this.add(_grid);
    }
});
