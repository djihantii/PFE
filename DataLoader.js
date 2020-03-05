
class DataLoader {
    /**
     * Creates an instance of DataLoader.
     * @public
     */
    constructor() {
        this.stock_varation = {};
        this.celan_variation = {};
    }

    _loadStockVariation(container, url) {
        var process = function (thisInstance, response) {
            thisInstance.stock_varation = response;
            console.log(response);
        }
        var callBack = function (thisInstance, response) {
            process(thisInstance, response);
        };

        $.ajax({
            type: "GET",
            url: url,
            async: false,
            dataType: "JSON",
            success: function (response) {
                console.log(response);
                callBack(container, response);
            }
        });
    };

    _loadCelanVariation(container, url) {
        var process = function (thisInstance, response) {
            thisInstance.celan_variation = response;
        }
        var callBack = function (thisInstance, response) {
            process(thisInstance, response);
        };

        $.ajax({
            type: "GET",
            url: url,
            async: false,
            dataType: "JSON",
            success: function (response) {
                callBack(container, response);
            }
        });
    };

    LoadStockVariation(url) {
        this._loadStockVariation(this, url);
    };

    LoadCelanVariation(url) {
        this._loadCelanVariation(this, url);
    };

    getStockVariation() {
        return this.stock_varation;
    };

    getCelanVariation() {
        return this.celan_variation;
    }
}
