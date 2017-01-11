var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var VerticalChart = (function (_super) {
    __extends(VerticalChart, _super);
    function VerticalChart() {
        var _this = this;
        _super.call(this);
        this.mainData = {};
        this.drilledData = {};
        this.drillDataany = {}; // it will store array of countries with continent name as index for that array
        this.container = '';
        this.svg = {};
        this.svgMargin = {
            top: 30,
            right: 30,
            bottom: 40,
            left: 50
        };
        this.stackedFlag = []; // to check which bar is showing stack in case mouseout event fails
        this.colors = {
            grey: '#7f7c9e',
            white: '#fff',
            black: '#000',
            svgBackground: '#f4f4f4',
            stackStroke: '#f5f5dc',
            stackHover: '#4F70BB',
            barStart: '#339CFF',
            barEnd: '#0F368E'
        };
        this.barChartAxisAndScales = {};
        /* GETTERS AND SETTERS */
        this.findMaxValue = function (data) {
            return d3.max(data, function (d) { return +d.value; });
        };
        this.generateColorRange = function (data) {
            return d3.scale.linear()
                .domain([0, data.length])
                .range([_this.colors.barStart, _this.colors.barEnd]);
        };
        this.drawBarChart = function () {
            _this.drawScales();
            _this.drawAxisScales();
            _this.renderBarChart();
            _this.drawYAxis();
            _this.drawXAxis();
        };
        this.drawScales = function () {
            _this.barChartAxisAndScales.yScale = d3.scale.linear()
                .domain([0, _this.max])
                .range([0, _this.svg.height]);
            _this.barChartAxisAndScales.xScale = d3.scale.ordinal()
                .domain(d3.range(0, _this.mainData.length))
                .rangeBands([0, _this.svg.width]);
        };
        this.drawAxisScales = function () {
            _this.barChartAxisAndScales.vScale = d3.scale.linear()
                .domain([0, _this.max])
                .range([_this.svg.height, 0]);
            _this.barChartAxisAndScales.hScale = d3.scale.ordinal()
                .domain(d3.range(0, _this.mainData.length))
                .rangeBands([0, _this.svg.width]);
        };
        this.drawYAxis = function () {
            var yAxis = d3.svg.axis()
                .scale(_this.barChartAxisAndScales.vScale)
                .orient('left')
                .ticks(5)
                .tickPadding(5);
            var yGuide = d3.select('svg')
                .append('g');
            yAxis(yGuide);
            yGuide.attr('transform', 'translate(' + _this.svgMargin.left + ',' + _this.svgMargin.top + ')');
            yGuide.selectAll('path')
                .style('fill', 'none')
                .style('stroke', _this.colors.black);
            yGuide.selectAll('line')
                .style('stroke', _this.colors.black);
        };
        this.drawXAxis = function () {
            var self = _this;
            var xAxis = d3.svg.axis()
                .scale(self.barChartAxisAndScales.hScale)
                .orient('bottom')
                .tickValues(self.barChartAxisAndScales.hScale.domain().filter(function (d, i) {
                return !(i % (self.mainData.length / 6));
            }));
            var xGuide = d3.select('svg')
                .append('g');
            xAxis(xGuide);
            xGuide.attr('transform', 'translate(' + self.svgMargin.left + ',' + (self.svg.height + self.svgMargin.top) + ')');
            xGuide.selectAll('path')
                .style('fill', 'none')
                .style('stroke', self.colors.black);
            xGuide.selectAll('line')
                .style('stroke', self.colors.black);
        };
        this.setD3Tips = function () {
            _this._maintip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function (d) {
                return '<span>' + d.id + '<br>' + d.value + '<span>';
            });
            _this._stacktip = d3.tip()
                .attr('class', 'd3-stack-tip')
                .offset([-10, 0])
                .html(function (d) {
                return '<span>' + d.id + '<br>' + d.value + '<span>';
            });
            _this.stacktip.direction('e'); //east
            _this._settingMsgTip = d3.tip()
                .attr('class', 'd3-setting-tip')
                .offset([-10, 0])
                .html(function (d) {
                return '<span>Change bar colour<br>Filter out bar';
            });
        };
        this.renderBarChart = function () {
            var self = _this;
            var myBarChart = d3.select('#' + self.container).append('svg')
                .attr('height', self.svg.height + self.svgMargin.top + self.svgMargin.bottom)
                .attr('width', self.svg.width + self.svgMargin.right + self.svgMargin.left)
                .classed('cu-svg-container', true)
                .style('padding-left', '50px')
                .call(self.maintip)
                .call(self.stacktip)
                .call(self.settingMsgTip)
                .append('g')
                .attr('transform', 'translate(' + self.svgMargin.left + ',' + self.svgMargin.top + ')')
                .style('background', self.colors.svgBackground)
                .attr('class', 'bar-chart')
                .selectAll('g')
                .data(self.mainData, function (d) {
                return d.value;
            })
                .enter()
                .append('g')
                .attr('class', function (d) {
                return 'main-bar-group-' + d.id;
            });
            var barChart = myBarChart.append('rect')
                .attr('class', function (d) {
                return 'main-bar main-bar-' + d.id;
            })
                .attr('height', function (d, i) {
                return 0;
            })
                .attr('width', self.barChartAxisAndScales.xScale.rangeBand() - 20)
                .style('fill', function (d, i) {
                return self.barColors(i);
            })
                .attr('x', function (d, i) {
                return self.barChartAxisAndScales.xScale(i);
            })
                .attr('y', function (d) {
                return self.svg.height;
            })
                .on('mouseover', function (d) {
                self.maintip.show(d);
                self.stackedFlag[d.id] = {};
                self.stackedFlag[d.id].flag = true; // right now useless
                setTimeout(function () {
                    self.showStackBar(d.id);
                    for (var i in self.stackedFlag) {
                        if (i != d.id) {
                            self.hideStackBar(i); //here I am hiding all the stack bar container except the one I am on right now
                        }
                    }
                }, 500);
            })
                .on('mouseout', function (d) {
                self.maintip.hide(d);
            });
            self.addSVGAnimation(barChart);
            self.addSettingsLabel(myBarChart);
            self.addBarLabelOnLoad(myBarChart);
            self.createStackBar();
        };
        this.createStackBar = function () {
            var self = _this;
            for (var i in self.mainData) {
                var index = self.mainData[i].id;
                self.createStackedRect(self.drilledData[index], self.mainData[i]);
            }
        };
        this.createStackedRect = function (stackArray, mainBarObj) {
            var self = _this;
            var stackHeightArr = [];
            var stackBar = d3.select(".main-bar-group-" + mainBarObj.id)
                .append('g')
                .attr('class', 'stack-bar-group-' + mainBarObj.id)
                .classed('hide-element', true)
                .selectAll('g')
                .data(stackArray, function (d) {
                return d.value;
            })
                .enter()
                .append('g')
                .on('mousemove', function (d) {
                console.log("vgh");
                var contienent = self.getContienentById(d.parent);
                self.showStackBar(contienent.id);
                self.stacktip.show(d);
                self.addStackTransition(d);
            })
                .on('mouseout', function (d) {
                self.stacktip.hide(d);
                var contienent = self.getContienentById(d.parent);
                self.hideStackBar(contienent.id);
                self.removeStackTransition(d);
            });
            ;
            stackBar.append('rect')
                .attr('class', function (d) {
                return 'stack-bar stack-bar-' + d.id;
            })
                .attr('height', function (d, i) {
                return self.barChartAxisAndScales.yScale(d.value);
            })
                .attr('width', self.barChartAxisAndScales.xScale.rangeBand() - 20)
                .style('fill', function (d, i) {
                var contienent = self.getContienentById(d.parent);
                return self.barColors(contienent.continentid);
            })
                .style('stroke', self.colors.stackStroke)
                .attr('x', function (d, i) {
                return self.barChartAxisAndScales.xScale(d.parent);
            })
                .attr('y', function (d, i) {
                stackHeightArr.push(self.barChartAxisAndScales.yScale(d.value));
                var sum = self.findSumOfArrayExcludingLastElm(stackHeightArr);
                return (self.svg.height - self.barChartAxisAndScales.yScale(d.value)) - sum;
            });
            stackHeightArr = []; //re-initializing this array to get y for text
            stackBar.append('text')
                .text(function (d) {
                return d.id;
            })
                .attr('x', function (d, i) {
                var stackX = self.barChartAxisAndScales.xScale(d.parent);
                var stackWidth = self.barChartAxisAndScales.xScale.rangeBand() - 20;
                return stackX + (stackWidth / 2);
            })
                .attr('y', function (d, i) {
                stackHeightArr.push(self.barChartAxisAndScales.yScale(d.value));
                var sum = self.findSumOfArrayExcludingLastElm(stackHeightArr);
                var stackY = (self.svg.height - self.barChartAxisAndScales.yScale(d.value)) - sum;
                var stackHeight = self.barChartAxisAndScales.yScale(d.value);
                return stackY + (stackHeight / 2);
            })
                .attr('dy', '.35em')
                .style('fill', self.colors.white)
                .style("font-size", function (d) { return Math.min(2 * 13, (2 * 13 - 8) / this.getComputedTextLength() * 24) + "px"; })
                .style("text-anchor", "middle")
                .style("opacity", 1)
                .style("z-index", 1);
        };
        this.addStackTransition = function (data) {
            var self = _this;
            var contienent = self.getContienentById(data.parent);
            d3.select('.main-bar-' + contienent.id).style('opacity', '0');
            d3.select('.stack-bar-' + data.id)
                .style('fill', self.colors.stackHover)
                .transition()
                .ease("elastic")
                .duration("2000")
                .attr("x", function (d, i) {
                return self.barChartAxisAndScales.xScale(d.parent) + 10;
            });
        };
        this.removeStackTransition = function (data) {
            var self = _this;
            var contienent = self.getContienentById(data.parent);
            d3.select('.stack-bar-' + data.id)
                .style('fill', function (d, i) {
                var contienent = self.getContienentById(d.parent);
                return self.barColors(contienent.continentid);
            })
                .transition()
                .ease("elastic")
                .duration("1000")
                .attr("x", function (d, i) {
                return self.barChartAxisAndScales.xScale(d.parent);
            });
            d3.select('.main-bar-' + contienent.id).style('opacity', '1');
        };
        this.getContienentById = function (id) {
            var self = _this;
            for (var i in self.mainData) {
                if (self.mainData[i].continentid == id) {
                    return self.mainData[i];
                }
            }
        };
        this.findSumOfArrayExcludingLastElm = function (arr) {
            var self = _this;
            var sum = 0;
            for (var i in arr) {
                if (parseInt(i) != (arr.length - 1)) {
                    sum += arr[i];
                }
            }
            return sum;
        };
        this.addSVGAnimation = function (svgElement) {
            var self = _this;
            var animateDuration = 700, animateDelay = 30;
            svgElement.transition()
                .attr('height', function (d) {
                return self.barChartAxisAndScales.yScale(d.value);
            })
                .attr('y', function (d) {
                return self.svg.height - self.barChartAxisAndScales.yScale(d.value);
            })
                .duration(animateDuration)
                .delay(function (d, i) {
                return i * animateDelay;
            })
                .ease('elastic');
        };
        this.addSettingsLabel = function (myBarChart) {
            var self = _this;
            myBarChart.append('text')
                .classed('setting-icon', 'true')
                .attr('font-family', 'FontAwesome')
                .attr('font-size', function (d) { return '1.2em'; })
                .attr('fill', self.colors.grey)
                .attr('x', function (d, i) {
                return self.barChartAxisAndScales.xScale(i) + 50;
            })
                .attr('y', function (d, i) {
                return self.svg.height - self.barChartAxisAndScales.yScale(d.value) - 10;
            })
                .text(function (d) {
                return '\uf013';
            })
                .style('cursor', 'pointer')
                .on('mouseover', self.settingMsgTip.show)
                .on('click', self.settingMsgTip.hide);
        };
        this.addBarLabelOnLoad = function (myBarChart) {
            var self = _this;
            myBarChart.append('text')
                .attr('class', function (d) {
                return 'main-label-text-' + d.id;
            })
                .attr('font-size', function (d) { return '1.2em'; })
                .attr('fill', self.colors.grey)
                .attr('x', function (d, i) {
                return self.barChartAxisAndScales.xScale(i);
            })
                .attr('y', function (d, i) {
                return self.svg.height - self.barChartAxisAndScales.yScale(d.value) - 10;
            })
                .text(function (d) {
                return d.id;
            })
                .style('font-size', '10px');
        };
        this.showStackBar = function (className) {
            $('.stack-bar-group-' + className).addClass('show-element');
            $('.stack-bar-group-' + className).removeClass('hide-element');
        };
        this.hideStackBar = function (className) {
            $('.stack-bar-group-' + className).removeClass('show-element');
            $('.stack-bar-group-' + className).addClass('hide-element');
        };
        console.log(this);
        this._mainData = this.getContinentData();
        this._drilledData = this.getCountryData();
        this._svg = {
            height: this.getSVGHeight(),
            width: this.getSVGHeight()
        };
        this._container = this.getContainer();
        this._max = this.findMaxValue(this.mainData);
        this._barColors = this.generateColorRange(this.mainData);
        this.setD3Tips();
        this.drawBarChart();
    }
    Object.defineProperty(VerticalChart.prototype, "_mainData", {
        /* GETTERS AND SETTERS */
        get: function () {
            return this.mainData;
        },
        set: function (data) {
            var counter = 0;
            var tempContinentArray = [];
            for (var i in data) {
                tempContinentArray.push({
                    id: i,
                    value: data[i],
                    continentid: counter
                });
                counter++;
            }
            this.mainData = tempContinentArray;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VerticalChart.prototype, "_drilledData", {
        get: function () {
            return this.drilledData;
        },
        set: function (data) {
            var counter = 0;
            var tempCountryArray = {};
            var parentContiennetId;
            for (var i in data) {
                var tempCountryList = data[i];
                tempCountryArray[i] = [];
                for (var k in this.mainData) {
                    if (this.mainData[k].id == i) {
                        parentContiennetId = this.mainData[k].continentid;
                    }
                }
                for (var j in tempCountryList) {
                    tempCountryArray[i].push({
                        id: j,
                        value: tempCountryList[j],
                        parent: parentContiennetId
                    });
                }
            }
            this.drilledData = tempCountryArray;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VerticalChart.prototype, "_drillDataany", {
        get: function () {
            return this.drillDataany;
        },
        set: function (data) {
            this.drillDataany = data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VerticalChart.prototype, "_svg", {
        get: function () {
            return this.svg;
        },
        set: function (data) {
            this.svg = data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VerticalChart.prototype, "_container", {
        get: function () {
            return this.container;
        },
        set: function (data) {
            this.container = data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VerticalChart.prototype, "_stackedFlag", {
        get: function () {
            return this.stackedFlag;
        },
        set: function (data) {
            this.stackedFlag = data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VerticalChart.prototype, "_colors", {
        get: function () {
            return this.colors;
        },
        set: function (data) {
            this.colors = data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VerticalChart.prototype, "_max", {
        get: function () {
            return this.max;
        },
        set: function (data) {
            this.max = data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VerticalChart.prototype, "_barColors", {
        get: function () {
            return this.barColors;
        },
        set: function (data) {
            this.barColors = data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VerticalChart.prototype, "_maintip", {
        get: function () {
            return this.maintip;
        },
        set: function (data) {
            this.maintip = data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VerticalChart.prototype, "_stacktip", {
        get: function () {
            return this.stacktip;
        },
        set: function (data) {
            this.stacktip = data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VerticalChart.prototype, "_settingMsgTip", {
        get: function () {
            return this.settingMsgTip;
        },
        set: function (data) {
            this.settingMsgTip = data;
        },
        enumerable: true,
        configurable: true
    });
    return VerticalChart;
}(BarChart.Dataset));
//# sourceMappingURL=bar-chart.js.map