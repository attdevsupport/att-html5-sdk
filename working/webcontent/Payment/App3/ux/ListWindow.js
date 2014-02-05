/**
 * @class ux.ListWindow
 * ListWindow is a custom plugin to show only a predefined number of records into a list.
 * This List will act as a window in terms of it will display only the number of record the windowSize defines but
 * the records are maintained on the store. In case your windowSize has been reached and you add a new record to the store, 
 * this plugin will show the new record and hide the last one on the list so you always display the number of record defined by windowSize.
 * In the same way, if you remove records that are already visible, the plugin will pull records from the cache / store to fill the 
 * spaces left until windowSize is reached.
 */
Ext.define('ux.ListWindow',{
    extend: 'Ext.Component',
    
    config: {
        /**
         * @cfg windowSize {Number} The size of the window. The number of records you want to display.
         */
        windowSize: 5
    },
    
    /**
     * initializes the plugin
     * @param list
     */
    init: function(list){
        var me = this;

        //hook into the list to override the listeners on the store
        
        list.onStoreRemove = function(){
            list.doRefresh(list);
            list.doRefreshHeaders();
        };
        
        list.onStoreAdd = function(store, records){
            var window = me.getWindowSize(),
                itemsLength = list.container.getViewItems().length,
                recordLength = records.length,
                delta = ( itemsLength + recordLength ) - window,
                pos;
             
            if(!recordLength) return;
            
            list.container.moveItemsFromCache(records);
            
            if(delta > 0){
                pos = window - 1; //zero based 
                list.container.moveItemsToCache(pos+1, pos+delta);
            }
            
            list.doRefreshHeaders();
            
        };
        
        
        list.doRefresh = function(dataview){
            var container = dataview.container,
                store = dataview.getStore(),
                records = me.getRecordsRange(store),
                items = container.getViewItems(),
                recordsLn = records.length,
                itemsLn = items.length,
                deltaLn = recordsLn - itemsLn,
                scrollable = dataview.getScrollable(),
                i, item;
        
            if (dataview.getScrollToTopOnRefresh() && scrollable) {
                scrollable.getScroller().scrollToTop();
            }
        
            // No items, hide all the items from the collection.
            if (recordsLn < 1) {
                dataview.onStoreClear();
                return;
            }
        
            // Too many items, hide the unused ones
            if (deltaLn < 0) {
                container.moveItemsToCache(itemsLn + deltaLn, itemsLn - 1);
                // Items can changed, we need to refresh our references
                items = container.getViewItems();
                itemsLn = items.length;
            }
            // Not enough items, create new ones
            else if (deltaLn > 0) {
                container.moveItemsFromCache(records);
            }
        
            // Update Data and insert the new html for existing items
            for (i = 0; i < itemsLn; i++) {
                item = items[i];
                container.updateListItem(records[i], item);
            }

        };
        
    },
    
    //private
    getRecordsRange : function(store){
        var from = 0,
            to = this.getWindowSize() - 1;
        return store.getRange(from, to);
    }
    

    
    
    
});