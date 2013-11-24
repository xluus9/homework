/*
    ListModel

    Basic model representing an array of model objects. Provides
    support for getting the array of items, getting a single item
    by an 'id' property (if exists), adding new items and removing
    existing items. Triggers events at the appropriate times so that
    views that are bound to it can auto-update
*/
var ListModel = {
    getItems: function() {
        return this.items;
    },

    getItem: function(id) {
        return this.itemIndex[id];
    },

    addItem: function(item) {
        this.items.push(item);
        this.trigger('change');
    },

    removeItem: function(item) {
        for (var i = 0; i < this.items.length; i++) {
            if (item === this.items[i]) {
                this.items.splice(i, 1);
                this.trigger('change');
                break;
            }
        }
    },

    setItems: function(items) {
        this.items = items;
        this.buildIndex();
        this.trigger('change');
    },

    buildIndex: function() {
        this.itemIndex = {};
        for (i = 0; i < this.items.length; i++) {
            item = this.items[i];
            if (undefined != item.index) {
                this.itemIndex[item.index] = item;
            }
        }
    }

};

/*
    createListModel()

    Creates a new instance of a ListModel, applying the
    configuration properties (if any). The config parameter
    may contain the following properties:
    - items (array of objects) the model objects
*/
function createListModel(config) {
    var model = Object.create(ListModel);
    var i;
    var item;

    apply(config, model);
    model = makeEventSource(model);

    //provide default empty items array if
    //nothing was specified in the config
    model.items = model.items || [];

    model.buildIndex();

    return model;
}