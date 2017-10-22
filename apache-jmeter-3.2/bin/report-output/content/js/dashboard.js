/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 98.38709677419355, "KoPercent": 1.6129032258064515};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9435483870967742, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "346 /v3/api/check-module/index/app.campaigns.lineitem"], "isController": false}, {"data": [1.0, 500, 1500, "371 /v3/api/marketing/index"], "isController": false}, {"data": [1.0, 500, 1500, "229 /v3/api/account/index"], "isController": false}, {"data": [1.0, 500, 1500, "400 /v3/api/price/info"], "isController": false}, {"data": [1.0, 500, 1500, "account_authenticate_GET_token"], "isController": false}, {"data": [1.0, 500, 1500, "328 /v3/api/metric/index"], "isController": false}, {"data": [1.0, 500, 1500, "365 /js/modules/campaign/templates/lineitem/directives/existLineitem.html"], "isController": false}, {"data": [1.0, 500, 1500, "309 /v3/api/account/index"], "isController": false}, {"data": [1.0, 500, 1500, "321 /js/shared/templates/export-object/export-history.html"], "isController": false}, {"data": [1.0, 500, 1500, "327 /v3/api/account/index/517218636"], "isController": false}, {"data": [1.0, 500, 1500, "401 /js/modules/campaign/templates/lineitem/directives/deviceTarget.html"], "isController": false}, {"data": [1.0, 500, 1500, "338 /v3/api/label/index"], "isController": false}, {"data": [1.0, 500, 1500, "208 /v3/api/check-module/index/buyer"], "isController": false}, {"data": [1.0, 500, 1500, "317 /js/shared/templates/grid/grid.html"], "isController": false}, {"data": [1.0, 500, 1500, "350 /v3/api/find/index"], "isController": false}, {"data": [1.0, 500, 1500, "332 /v3/api/segment/index"], "isController": false}, {"data": [1.0, 500, 1500, "359 /js/modules/campaign/templates/shared/leftNav.html"], "isController": false}, {"data": [1.0, 500, 1500, "319 /js/modules/campaign/templates/editAction.html"], "isController": false}, {"data": [1.0, 500, 1500, "344 /v3/api/filter/index"], "isController": false}, {"data": [1.0, 500, 1500, "324 /js/shared/templates/dropdown/segment.html"], "isController": false}, {"data": [1.0, 500, 1500, "192 /account/login"], "isController": false}, {"data": [1.0, 500, 1500, "374 /v3/api/check-module/index/app.campaigns.lineitem.create"], "isController": false}, {"data": [1.0, 500, 1500, "343 /v3/api/lineItem/type"], "isController": false}, {"data": [1.0, 500, 1500, "399 /v3/api/criterion/info"], "isController": false}, {"data": [0.0, 500, 1500, "GO TO V3 sandbox"], "isController": false}, {"data": [1.0, 500, 1500, "376 /v3/api/check-module/index/app.campaigns.campaign.create"], "isController": false}, {"data": [1.0, 500, 1500, "336 /v3/api/lineItem/info"], "isController": false}, {"data": [1.0, 500, 1500, "364 /v3/api/lineItem/type"], "isController": false}, {"data": [1.0, 500, 1500, "304 /v3/api/account/index"], "isController": false}, {"data": [1.0, 500, 1500, "342 /v3/api/segment/index"], "isController": false}, {"data": [1.0, 500, 1500, "368 /js/modules/campaign/templates/lineitem/directives/budget.html"], "isController": false}, {"data": [1.0, 500, 1500, "314 /js/shared/templates/filter/filter.html"], "isController": false}, {"data": [1.0, 500, 1500, "366 /v3/api/check-module/index/app.campaigns.lineitem.create"], "isController": false}, {"data": [1.0, 500, 1500, "232 /v3/api/check-module/index/buyer"], "isController": false}, {"data": [1.0, 500, 1500, "370 /js/modules/campaign/templates/shared/accordion.html"], "isController": false}, {"data": [1.0, 500, 1500, "325 /js/modules/campaign/templates/createMenu.html"], "isController": false}, {"data": [1.0, 500, 1500, "373 /v3/api/search/index"], "isController": false}, {"data": [1.0, 500, 1500, "331 /v3/api/metric/index"], "isController": false}, {"data": [1.0, 500, 1500, "392 /v3/api/lineItem/info/516336140"], "isController": false}, {"data": [1.0, 500, 1500, "316 /js/shared/templates/chart/chart.html"], "isController": false}, {"data": [1.0, 500, 1500, "345 /v3/api/metric/index"], "isController": false}, {"data": [1.0, 500, 1500, "349 /v3/api/find/index"], "isController": false}, {"data": [1.0, 500, 1500, "377 /js/modules/campaign/templates/campaign/list.html"], "isController": false}, {"data": [1.0, 500, 1500, "398 /js/modules/campaign/templates/campaign/chooseTarget.html"], "isController": false}, {"data": [1.0, 500, 1500, "211 /v3/api/account/index"], "isController": false}, {"data": [1.0, 500, 1500, "323 /js/shared/templates/export-object/export-object.html"], "isController": false}, {"data": [0.5, 500, 1500, "393 /v3/api/check-module/index/app.campaigns.campaign.create"], "isController": false}, {"data": [1.0, 500, 1500, "360 /js/modules/campaign/templates/lineitem/edit.html"], "isController": false}, {"data": [0.0, 500, 1500, "{POST}CREATE_LINEITEM"], "isController": false}, {"data": [0.0, 500, 1500, "347 /v3/api/lineItem/performance"], "isController": false}, {"data": [1.0, 500, 1500, "315 /js/modules/campaign/templates/filterTop.html"], "isController": false}, {"data": [1.0, 500, 1500, "305 /v3/api/account/index"], "isController": false}, {"data": [1.0, 500, 1500, "v3/api/find/index"], "isController": false}, {"data": [1.0, 500, 1500, "329 /v3/api/filter/index"], "isController": false}, {"data": [1.0, 500, 1500, "358 /v3/api/check-module/index/app.campaigns.lineitem.create"], "isController": false}, {"data": [1.0, 500, 1500, "378 /js/modules/campaign/templates/campaign/edit.html"], "isController": false}, {"data": [1.0, 500, 1500, "318 /js/modules/campaign/templates/allLineItems.html"], "isController": false}, {"data": [1.0, 500, 1500, "340 /v3/api/column/index"], "isController": false}, {"data": [1.0, 500, 1500, "367 /js/shared/templates/directive/adxDropdown1.html"], "isController": false}, {"data": [1.0, 500, 1500, "310 /v3/api/check-module/index/app.campaigns.lineitem"], "isController": false}, {"data": [1.0, 500, 1500, "account/index__s2o2w234b4u4x28454o2t2o2v2v213r266v2a4z2d4b45444s2s2r2t426y5j5q486y2v2542484a4w254p294c49454c494b444u2s2u2b4z2p28484a4u2l5b4846434"], "isController": false}, {"data": [1.0, 500, 1500, "403 /v3/api/targeting/info"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 62, 1, 1.6129032258064515, 430.98387096774195, 24, 8311, 441.4000000000001, 657.7999999999987, 8311.0, 2.3058613507884558, 2.7785614749144596, 1.150424620183725], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["346 /v3/api/check-module/index/app.campaigns.lineitem", 1, 0, 0.0, 380.0, 380, 380, 380.0, 380.0, 380.0, 2.631578947368421, 0.8634868421052632, 1.3826069078947367], "isController": false}, {"data": ["371 /v3/api/marketing/index", 1, 0, 0.0, 288.0, 288, 288, 288.0, 288.0, 288.0, 3.472222222222222, 2.288818359375, 1.8276638454861112], "isController": false}, {"data": ["229 /v3/api/account/index", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 2.4390243902439024, 1.7625762195121952, 1.243330792682927], "isController": false}, {"data": ["400 /v3/api/price/info", 1, 0, 0.0, 370.0, 370, 370, 370.0, 370.0, 370.0, 2.7027027027027026, 0.8947423986486487, 1.3803842905405406], "isController": false}, {"data": ["account_authenticate_GET_token", 1, 0, 0.0, 347.0, 347, 347, 347.0, 347.0, 347.0, 2.881844380403458, 1.5140940201729107, 1.3593074567723344], "isController": false}, {"data": ["328 /v3/api/metric/index", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 2.487562189054726, 7.380091728855721, 1.513428949004975], "isController": false}, {"data": ["365 /js/modules/campaign/templates/lineitem/directives/existLineitem.html", 1, 0, 0.0, 29.0, 29, 29, 29.0, 29.0, 29.0, 34.48275862068965, 44.214709051724135, 14.109644396551724], "isController": false}, {"data": ["309 /v3/api/account/index", 1, 0, 0.0, 345.0, 345, 345, 345.0, 345.0, 345.0, 2.898550724637681, 2.0946557971014492, 1.5002264492753625], "isController": false}, {"data": ["321 /js/shared/templates/export-object/export-history.html", 1, 0, 0.0, 24.0, 24, 24, 24.0, 24.0, 24.0, 41.666666666666664, 41.056315104166664, 16.9677734375], "isController": false}, {"data": ["327 /v3/api/account/index/517218636", 1, 0, 0.0, 332.0, 332, 332, 332.0, 332.0, 332.0, 3.0120481927710845, 1.0971620858433735, 1.5677946159638554], "isController": false}, {"data": ["401 /js/modules/campaign/templates/lineitem/directives/deviceTarget.html", 1, 0, 0.0, 32.0, 32, 32, 32.0, 32.0, 32.0, 31.25, 97.747802734375, 13.153076171875], "isController": false}, {"data": ["338 /v3/api/label/index", 1, 0, 0.0, 396.0, 396, 396, 396.0, 396.0, 396.0, 2.5252525252525255, 5.092428188131313, 1.311947601010101], "isController": false}, {"data": ["208 /v3/api/check-module/index/buyer", 1, 0, 0.0, 348.0, 348, 348, 348.0, 348.0, 348.0, 2.8735632183908044, 0.9428879310344829, 1.4620375359195403], "isController": false}, {"data": ["317 /js/shared/templates/grid/grid.html", 1, 0, 0.0, 33.0, 33, 33, 33.0, 33.0, 33.0, 30.303030303030305, 146.60274621212122, 11.777935606060606], "isController": false}, {"data": ["350 /v3/api/find/index", 1, 0, 0.0, 413.0, 413, 413, 413.0, 413.0, 413.0, 2.4213075060532687, 1.723762863196126, 1.5298690980629541], "isController": false}, {"data": ["332 /v3/api/segment/index", 1, 0, 0.0, 291.0, 291, 291, 291.0, 291.0, 291.0, 3.4364261168384878, 1.36584514604811, 1.7786189862542956], "isController": false}, {"data": ["359 /js/modules/campaign/templates/shared/leftNav.html", 1, 0, 0.0, 36.0, 36, 36, 36.0, 36.0, 36.0, 27.777777777777775, 22.352430555555557, 11.20334201388889], "isController": false}, {"data": ["319 /js/modules/campaign/templates/editAction.html", 1, 0, 0.0, 24.0, 24, 24, 24.0, 24.0, 24.0, 41.666666666666664, 35.807291666666664, 16.642252604166668], "isController": false}, {"data": ["344 /v3/api/filter/index", 1, 0, 0.0, 303.0, 303, 303, 303.0, 303.0, 303.0, 3.3003300330033003, 1.518022896039604, 1.7919760726072609], "isController": false}, {"data": ["324 /js/shared/templates/dropdown/segment.html", 1, 0, 0.0, 30.0, 30, 30, 30.0, 30.0, 30.0, 33.333333333333336, 29.6875, 13.18359375], "isController": false}, {"data": ["192 /account/login", 1, 0, 0.0, 289.0, 289, 289, 289.0, 289.0, 289.0, 3.4602076124567476, 6.67711937716263, 1.2908196366782008], "isController": false}, {"data": ["374 /v3/api/check-module/index/app.campaigns.lineitem.create", 1, 0, 0.0, 341.0, 341, 341, 341.0, 341.0, 341.0, 2.932551319648094, 0.9622434017595307, 1.5607817082111435], "isController": false}, {"data": ["343 /v3/api/lineItem/type", 1, 0, 0.0, 301.0, 301, 301, 301.0, 301.0, 301.0, 3.3222591362126246, 1.3529121677740865, 1.7162842607973423], "isController": false}, {"data": ["399 /v3/api/criterion/info", 1, 0, 0.0, 364.0, 364, 364, 364.0, 364.0, 364.0, 2.7472527472527473, 1.6767900068681318, 1.4460637019230769], "isController": false}, {"data": ["GO TO V3 sandbox", 1, 0, 0.0, 2654.0, 2654, 2654, 2654.0, 2654.0, 2654.0, 0.37678975131876413, 0.7999423040693293, 0.1214263847023361], "isController": false}, {"data": ["376 /v3/api/check-module/index/app.campaigns.campaign.create", 1, 0, 0.0, 389.0, 389, 389, 389.0, 389.0, 389.0, 2.5706940874035986, 0.8435089974293059, 1.368191677377892], "isController": false}, {"data": ["336 /v3/api/lineItem/info", 1, 0, 0.0, 387.0, 387, 387, 387.0, 387.0, 387.0, 2.5839793281653747, 2.2862160852713176, 1.5039567183462532], "isController": false}, {"data": ["364 /v3/api/lineItem/type", 1, 0, 0.0, 373.0, 373, 373, 373.0, 373.0, 373.0, 2.680965147453083, 1.0917602211796247, 1.3849907841823057], "isController": false}, {"data": ["304 /v3/api/account/index", 1, 0, 0.0, 313.0, 313, 313, 313.0, 313.0, 313.0, 3.1948881789137378, 1.304163338658147, 1.687924321086262], "isController": false}, {"data": ["342 /v3/api/segment/index", 1, 0, 0.0, 310.0, 310, 310, 310.0, 310.0, 310.0, 3.225806451612903, 1.8586189516129032, 1.6286542338709677], "isController": false}, {"data": ["368 /js/modules/campaign/templates/lineitem/directives/budget.html", 1, 0, 0.0, 45.0, 45, 45, 45.0, 45.0, 45.0, 22.22222222222222, 22.48263888888889, 9.223090277777779], "isController": false}, {"data": ["314 /js/shared/templates/filter/filter.html", 1, 0, 0.0, 42.0, 42, 42, 42.0, 42.0, 42.0, 23.809523809523807, 54.82700892857142, 9.347098214285714], "isController": false}, {"data": ["366 /v3/api/check-module/index/app.campaigns.lineitem.create", 1, 0, 0.0, 313.0, 313, 313, 313.0, 313.0, 313.0, 3.1948881789137378, 1.0483226837060702, 1.7004043530351438], "isController": false}, {"data": ["232 /v3/api/check-module/index/buyer", 1, 0, 0.0, 330.0, 330, 330, 330.0, 330.0, 330.0, 3.0303030303030303, 0.9943181818181818, 1.5417850378787878], "isController": false}, {"data": ["370 /js/modules/campaign/templates/shared/accordion.html", 1, 0, 0.0, 41.0, 41, 41, 41.0, 41.0, 41.0, 24.390243902439025, 18.054496951219512, 9.575076219512194], "isController": false}, {"data": ["325 /js/modules/campaign/templates/createMenu.html", 1, 0, 0.0, 99.0, 99, 99, 99.0, 99.0, 99.0, 10.101010101010102, 18.92952967171717, 4.034485479797979], "isController": false}, {"data": ["373 /v3/api/search/index", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 2.232142857142857, 9.157453264508929, 1.2076241629464286], "isController": false}, {"data": ["331 /v3/api/metric/index", 1, 0, 0.0, 379.0, 379, 379, 379.0, 379.0, 379.0, 2.638522427440633, 4.055697559366755, 1.347604716358839], "isController": false}, {"data": ["392 /v3/api/lineItem/info/516336140", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 2.155172413793103, 2.4203596443965516, 1.1680866109913792], "isController": false}, {"data": ["316 /js/shared/templates/chart/chart.html", 1, 0, 0.0, 27.0, 27, 27, 27.0, 27.0, 27.0, 37.03703703703704, 27.958622685185187, 14.467592592592593], "isController": false}, {"data": ["345 /v3/api/metric/index", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 2.347417840375587, 8.662980487089202, 1.198925322769953], "isController": false}, {"data": ["349 /v3/api/find/index", 1, 0, 0.0, 399.0, 399, 399, 399.0, 399.0, 399.0, 2.506265664160401, 1.583548715538847, 1.4562774122807016], "isController": false}, {"data": ["377 /js/modules/campaign/templates/campaign/list.html", 1, 0, 0.0, 71.0, 71, 71, 71.0, 71.0, 71.0, 14.084507042253522, 15.308648767605636, 5.666813380281691], "isController": false}, {"data": ["398 /js/modules/campaign/templates/campaign/chooseTarget.html", 1, 0, 0.0, 35.0, 35, 35, 35.0, 35.0, 35.0, 28.57142857142857, 80.30133928571428, 11.718749999999998], "isController": false}, {"data": ["211 /v3/api/account/index", 1, 0, 0.0, 390.0, 390, 390, 390.0, 390.0, 390.0, 2.5641025641025643, 2.5190304487179485, 1.342147435897436], "isController": false}, {"data": ["323 /js/shared/templates/export-object/export-object.html", 1, 0, 0.0, 33.0, 33, 33, 33.0, 33.0, 33.0, 30.303030303030305, 30.243844696969695, 12.31060606060606], "isController": false}, {"data": ["393 /v3/api/check-module/index/app.campaigns.campaign.create", 1, 0, 0.0, 692.0, 692, 692, 692.0, 692.0, 692.0, 1.445086705202312, 0.4741690751445087, 0.7691135296242775], "isController": false}, {"data": ["360 /js/modules/campaign/templates/lineitem/edit.html", 1, 0, 0.0, 35.0, 35, 35, 35.0, 35.0, 35.0, 28.57142857142857, 139.00669642857142, 11.495535714285714], "isController": false}, {"data": ["{POST}CREATE_LINEITEM", 1, 1, 100.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 2.444987775061125, 1.7048059290953546, 3.032357885085575], "isController": false}, {"data": ["347 /v3/api/lineItem/performance", 1, 0, 0.0, 8311.0, 8311, 8311, 8311.0, 8311.0, 8311.0, 0.1203224642040669, 0.16520838346769343, 0.07132396071471543], "isController": false}, {"data": ["315 /js/modules/campaign/templates/filterTop.html", 1, 0, 0.0, 27.0, 27, 27, 27.0, 27.0, 27.0, 37.03703703703704, 61.378761574074076, 14.756944444444445], "isController": false}, {"data": ["305 /v3/api/account/index", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 2.1929824561403506, 0.6510416666666666, 1.175729851973684], "isController": false}, {"data": ["v3/api/find/index", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 2.398081534772182, 1.5924760191846523, 1.444937799760192], "isController": false}, {"data": ["329 /v3/api/filter/index", 1, 0, 0.0, 314.0, 314, 314, 314.0, 314.0, 314.0, 3.1847133757961785, 1.46484375, 1.7167595541401275], "isController": false}, {"data": ["358 /v3/api/check-module/index/app.campaigns.lineitem.create", 1, 0, 0.0, 388.0, 388, 388, 388.0, 388.0, 388.0, 2.577319587628866, 0.8456829896907216, 1.3717179445876289], "isController": false}, {"data": ["378 /js/modules/campaign/templates/campaign/edit.html", 1, 0, 0.0, 26.0, 26, 26, 26.0, 26.0, 26.0, 38.46153846153847, 118.50210336538463, 15.474759615384617], "isController": false}, {"data": ["318 /js/modules/campaign/templates/allLineItems.html", 1, 0, 0.0, 25.0, 25, 25, 25.0, 25.0, 25.0, 40.0, 45.0, 16.0546875], "isController": false}, {"data": ["340 /v3/api/column/index", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 2.4813895781637716, 4.247925713399503, 1.2988523573200992], "isController": false}, {"data": ["367 /js/shared/templates/directive/adxDropdown1.html", 1, 0, 0.0, 39.0, 39, 39, 39.0, 39.0, 39.0, 25.64102564102564, 20.557892628205128, 10.291466346153847], "isController": false}, {"data": ["310 /v3/api/check-module/index/app.campaigns.lineitem", 1, 0, 0.0, 347.0, 347, 347, 347.0, 347.0, 347.0, 2.881844380403458, 0.9456051873198847, 1.5140940201729107], "isController": false}, {"data": ["account/index__s2o2w234b4u4x28454o2t2o2v2v213r266v2a4z2d4b45444s2s2r2t426y5j5q486y2v2542484a4w254p294c49454c494b444u2s2u2b4z2p28484a4u2l5b4846434", 1, 0, 0.0, 381.0, 381, 381, 381.0, 381.0, 381.0, 2.6246719160104988, 1.8685408464566928, 1.3584727690288714], "isController": false}, {"data": ["403 /v3/api/targeting/info", 1, 0, 0.0, 355.0, 355, 355, 355.0, 355.0, 355.0, 2.8169014084507045, 1.8375880281690142, 1.8485915492957747], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Test failed: text expected to contain \/\"code\":200\/", 1, 100.0, 1.6129032258064515], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 62, 1, "Test failed: text expected to contain \/\"code\":200\/", 1, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["{POST}CREATE_LINEITEM", 1, 1, "Test failed: text expected to contain \/\"code\":200\/", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
