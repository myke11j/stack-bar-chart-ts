class HorizontalChart extends BarChart.Dataset {

  private maintip : any ;

  //tooltip for stack bar
  private stacktip : any;

  //tooltip for setting icon
  private settingMsgTip : any ;

  private mainData : any = {};
  private drilledData : any = {};
  private drillDataany : any = {}; // it will store array of countries with continent name as index for that array
  private container  :string = '';
  private svg  : any = {}
  private svgMargin : any = {
      top : 30,
      right: 30,
      bottom: 40,
      left: 50
  }
  private stackedFlag  : any[] = []; // to check which bar is showing stack in case mouseout event fails
  private colors : any = {
      grey : '#7f7c9e',
      white : '#fff',
      black : '#000',
      svgBackground : '#f4f4f4',
      stackStroke : '#f5f5dc',
      stackHover : '#4F70BB',
      barStart : '#339CFF',
      barEnd :  '#0F368E'
  }
  private max : number ;
  private barColors : any ;
  private barChartAxisAndScales : any = {};

  constructor() {
    super();
    console.log(this)
    this._mainData = this.getContinentData();
    this._drilledData = this.getCountryData();
    this._svg = {
      height: this.getSVGHeight(),
      width : this.getSVGHeight()
    };
    this._container = this.getContainer();
    this._max = this.findMaxValue(this.mainData);
    this._barColors =  this.generateColorRange(this.mainData);
    this.setD3Tips();
    this.drawBarChart();
  }

  /* GETTERS AND SETTERS */
  get _mainData():any {
      return this.mainData;
  }
  set _mainData(data:any) {
    let counter : number = 0;
    let tempContinentArray : any[] = [];
    for(let i in data) {
        tempContinentArray.push({
            id: i,
            value: data[i],
            continentid : counter
        });
        counter++;
    }
    this.mainData = tempContinentArray;
  }

  get _drilledData():any {
      return this.drilledData;
  }
  set _drilledData(data:any) {
    let counter : number = 0;
    let tempCountryArray : any = {};
    let parentContiennetId : number;
    for(let i in data) {
      let tempCountryList = data[i];
      tempCountryArray[i] = [];
      for(let k in this.mainData) {
        if(this.mainData[k].id == i) {
            parentContiennetId = this.mainData[k].continentid;
        }
      }
      for(let j in tempCountryList) {
        tempCountryArray[i].push({
          id: j,
          value: tempCountryList[j],
          parent: parentContiennetId
        });
      }
    }
    this.drilledData = tempCountryArray;
  }

  get _drillDataany():any {
      return this.drillDataany;
  }
  set _drillDataany(data:any) {
      this.drillDataany = data;
  }

  get _svg():any {
      return this.svg;
  }
  set _svg(data:any) {
      this.svg = data;
  }

  get _container():string {
      return this.container;
  }
  set _container(data:string) {
      this.container = data;
  }

  get _stackedFlag():any[] {
      return this.stackedFlag;
  }
  set _stackedFlag(data:any[]) {
      this.stackedFlag = data;
  }

  get _colors():any {
      return this.colors;
  }
  set _colors(data:any) {
      this.colors = data;
  }

  get _max():number {
      return this.max;
  }
  set _max(data:number) {
      this.max = data;
  }

  get _barColors():any {
      return this.barColors;
  }
  set _barColors(data:any) {
      this.barColors = data;
  }

  get _maintip():any {
      return this.maintip;
  }
  set _maintip(data:any) {
      this.maintip = data;
  }

  get _stacktip():any {
      return this.stacktip;
  }
  set _stacktip(data:any) {
      this.stacktip = data;
  }

  get _settingMsgTip():any {
      return this.settingMsgTip;
  }
  set _settingMsgTip(data:any) {
      this.settingMsgTip = data;
  }


  /* GETTERS AND SETTERS */

  findMaxValue = (data : any) : number => {
    return d3.max(data, function(d) { return +d.value;} )
  }

  generateColorRange = (data : any) : number => {
    return d3.scale.linear()
            .domain([0, data.length])
            .range([this.colors.barStart, this.colors.barEnd]);
  }

  drawBarChart = () : void => {
    this.drawScales();
    this.drawAxisScales();
    this.renderBarChart();
    this.drawYAxis();
    this.drawXAxis();
  }

  drawScales = () : void => {
    this.barChartAxisAndScales.yScale = d3.scale.linear()
                .domain([0, this.max])
                .range([0, this.svg.height]);

    this.barChartAxisAndScales.xScale = d3.scale.ordinal()
                .domain(d3.range(0, this.mainData.length))
                .rangeBands([0, this.svg.width]);
  }

  drawAxisScales = () : void=> {
    this.barChartAxisAndScales.vScale = d3.scale.linear()
            .domain([0, this.max])
            .range([this.svg.height, 0]);

    this.barChartAxisAndScales.hScale = d3.scale.ordinal()
            .domain(d3.range(0, this.mainData.length))
            .rangeBands([0, this.svg.width]);
  }

  drawYAxis = () : void => {
    let yAxis = d3.svg.axis()
                    .scale(this.barChartAxisAndScales.vScale)
                    .orient('left')
                    .ticks(5)
                    .tickPadding(5);

    let yGuide = d3.select('svg')
                    .append('g')
                    yAxis(yGuide)
                    yGuide.attr('transform', 'translate('+  this.svgMargin.left +','+ this.svgMargin.top +')')
                    yGuide.selectAll('path')
                        .style('fill', 'none')
                        .style('stroke', this.colors.black)
                    yGuide.selectAll('line')
                        .style('stroke', this.colors.black)
  }

  drawXAxis = () : void => {
    let self = this;
    let xAxis = d3.svg.axis()
                    .scale(self.barChartAxisAndScales.hScale)
                    .orient('bottom')
                    .tickValues(self.barChartAxisAndScales.hScale.domain().filter(function(d,i) {
                        return !( i % (self.mainData.length/6))
                    }))

    let xGuide = d3.select('svg')
                    .append('g')
                    xAxis(xGuide)
                    xGuide.attr('transform', 'translate('+  self.svgMargin.left +','+ (self.svg.height + self.svgMargin.top) +')')
                    xGuide.selectAll('path')
                        .style('fill', 'none')
                        .style('stroke', self.colors.black)
                    xGuide.selectAll('line')
                        .style('stroke', self.colors.black)
  }

  setD3Tips = () : void => {
    this._maintip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0])
              .html(function(d) {
                return '<span>'+d.id + '<br>' + d.value +'<span>';
              })

    this._stacktip = d3.tip()
              .attr('class', 'd3-stack-tip')
              .offset([-10, 0])
              .html(function(d) {
                return '<span>'+d.id + '<br>' + d.value +'<span>';
              });
    this.stacktip.direction('e'); //east

    this._settingMsgTip = d3.tip()
              .attr('class', 'd3-setting-tip')
              .offset([-10, 0])
              .html(function(d) {
                return '<span>Change bar colour<br>Filter out bar';
              });
  }

  renderBarChart =() : void=> {
    let self = this;
    let myBarChart = d3.select('#'+self.container).append('svg')
               .attr('height', self.svg.height + self.svgMargin.top + self.svgMargin.bottom)
               .attr('width', self.svg.width + self.svgMargin.right + self.svgMargin.left)
               .classed('cu-svg-container', true)
               .style('padding-left', '50px')
               .call(self.maintip)
               .call(self.stacktip)
               .call(self.settingMsgTip)
               .append('g')
                    .attr('transform', 'translate('+ self.svgMargin.left +','+ self.svgMargin.top +')')
                    .style('background', self.colors.svgBackground)
                    .attr('class', 'bar-chart')

               .selectAll('g')
                    .data(self.mainData, function(d) {
                        return d.value;
                    })
                    .enter()
                    .append('g')
                    .attr('class', function(d) {
                        return 'main-bar-group-'+d.id;
                    });


    let barChart = myBarChart.append('rect')
        .attr('class', function(d) {
            return 'main-bar main-bar-'+d.id;
        })
        .attr('height', function(d, i) {
            return 0;
        })
        .attr('width', self.barChartAxisAndScales.xScale.rangeBand() - 20)
        .style('fill', function(d, i) {
            return self.barColors(i);
        })
        .attr('x', function(d, i) {
            return self.barChartAxisAndScales.xScale(i);
        })
       .attr('y', function(d) {
            return self.svg.height;
        })
       .on('mouseover', function(d) {
            self.maintip.show(d);
            self.stackedFlag[d.id] = {};
            self.stackedFlag[d.id].flag = true;// right now useless
            setTimeout(function() {
                self.showStackBar(d.id);
                for(var i in self.stackedFlag) {
                    if(i != d.id) {
                        self.hideStackBar(i); //here I am hiding all the stack bar container except the one I am on right now
                    }
                }
            }, 500);
       })
       .on('mouseout', function(d) {
            self.maintip.hide(d);
       })
       self.addSVGAnimation(barChart);
       self.addSettingsLabel(myBarChart);
       self.addBarLabelOnLoad(myBarChart);
       self.createStackBar();
  }

  createStackBar = () : void=> {
    let self = this;
      for(let i in self.mainData) {
          let index = self.mainData[i].id;
          self.createStackedRect(self.drilledData[index], self.mainData[i]);
      }
  }

  createStackedRect = (stackArray : any[], mainBarObj : any) : void => {
    let self = this;
    let stackHeightArr = [];
    let stackBar = d3.select(".main-bar-group-"+mainBarObj.id)
    .append('g')
    .attr('class', 'stack-bar-group-'+mainBarObj.id)
    .classed('hide-element' ,true)
    .selectAll('g')
    .data(stackArray, function(d) {
        return d.value;
    })
    .enter()
    .append('g')
    .on('mousemove', function(d) {
      console.log("vgh");
        let contienent = self.getContienentById(d.parent)
        self.showStackBar(contienent.id);
        self.stacktip.show(d);
        self.addStackTransition(d);
    })
    .on('mouseout', function(d) {
        self.stacktip.hide(d);
        let contienent = self.getContienentById(d.parent)
        self.hideStackBar(contienent.id);
        self.removeStackTransition(d)
    });;

    stackBar.append('rect')
    .attr('class', function(d) {
        return 'stack-bar stack-bar-'+d.id;
    })
    .attr('height', function(d, i) {
        return self.barChartAxisAndScales.yScale(d.value);
    })
    .attr('width', self.barChartAxisAndScales.xScale.rangeBand() - 20)
    .style('fill', function(d, i) {
        let contienent = self.getContienentById(d.parent);
        return self.barColors(contienent.continentid);
    })
    .style('stroke', self.colors.stackStroke)
    .attr('x', function(d, i) {
        return self.barChartAxisAndScales.xScale(d.parent);
    })
    .attr('y', function(d, i) {
        stackHeightArr.push(self.barChartAxisAndScales.yScale(d.value));
        let sum : number = self.findSumOfArrayExcludingLastElm(stackHeightArr);
        return (self.svg.height - self.barChartAxisAndScales.yScale(d.value)) - sum;
    })

    stackHeightArr = []; //re-initializing this array to get y for text

    stackBar.append('text')
       .text(function(d) {
           return d.id;
       })
       .attr('x', function(d, i) {
            let stackX = self.barChartAxisAndScales.xScale(d.parent);
            let stackWidth = self.barChartAxisAndScales.xScale.rangeBand() - 20
            return stackX + (stackWidth/2) ;
        })
        .attr('y', function(d, i) {
            stackHeightArr.push(self.barChartAxisAndScales.yScale(d.value));
            let sum = self.findSumOfArrayExcludingLastElm(stackHeightArr);
            let stackY = (self.svg.height - self.barChartAxisAndScales.yScale(d.value)) - sum;
            let stackHeight = self.barChartAxisAndScales.yScale(d.value);
            return stackY + (stackHeight/2);
        })
       .attr('dy', '.35em')
       .style('fill', self.colors.white)
       .style("font-size", function(d) { return Math.min(2 * 13, (2 * 13 - 8) / this.getComputedTextLength() * 24) + "px"; })
       .style("text-anchor", "middle")
       .style("opacity", 1)
       .style("z-index", 1)
  }

  addStackTransition = (data : any) : void => {
    let self = this;
      let contienent = self.getContienentById(data.parent);
      d3.select('.main-bar-'+contienent.id).style('opacity', '0')
      d3.select('.stack-bar-'+data.id)
      .style('fill', self.colors.stackHover)
      .transition()
      .ease("elastic")
      .duration("2000")
      .attr("x", function(d, i) {
          return self.barChartAxisAndScales.xScale(d.parent) + 10;
      });
  }

  removeStackTransition = (data : any) : void => {
    let self = this;
      let contienent = self.getContienentById(data.parent)
      d3.select('.stack-bar-'+data.id)
      .style('fill',  function(d, i) {
          let contienent = self.getContienentById(d.parent)
          return self.barColors(contienent.continentid);
      })
      .transition()
      .ease("elastic")
      .duration("1000")
      .attr("x", function(d, i) {
          return self.barChartAxisAndScales.xScale(d.parent);
      });
      d3.select('.main-bar-'+contienent.id).style('opacity', '1')
  }

  getContienentById = (id  : number) : any => {
    let self = this;
      for(let i in self.mainData) {
          if(self.mainData[i].continentid == id) {
              return self.mainData[i];
          }
      }
  }

  findSumOfArrayExcludingLastElm = (arr : any[]) : number => {
    let self = this;
      let sum = 0;
      for(let i in arr) {
          if(parseInt(i) != (arr.length - 1)) {
              sum += arr[i];
          }
      }
      return sum;
  }

  addSVGAnimation = (svgElement: any) : void => {
    let self = this
    let animateDuration = 700,
        animateDelay = 30;

    svgElement.transition()
      .attr('height', function(d) {
        return self.barChartAxisAndScales.yScale(d.value);
      })
      .attr('y', function(d) {
        return self.svg.height - self.barChartAxisAndScales.yScale(d.value);
      })
      .duration(animateDuration)
      .delay(function(d, i) {
        return i * animateDelay;
      })
      .ease('elastic')
  }

  addSettingsLabel = (myBarChart : any) : void => {
    let self = this;
     myBarChart.append('text')
          .classed('setting-icon', 'true')
          .attr('font-family', 'FontAwesome')
          .attr('font-size', function(d) { return '1.2em'})
          .attr('fill', self.colors.grey)
           .attr('x', function(d, i) {
              return self.barChartAxisAndScales.xScale(i) + 50;
          })
         .attr('y', function(d, i) {
              return self.svg.height - self.barChartAxisAndScales.yScale(d.value) - 10;
          })
          .text(function (d) {
              return '\uf013';
          })
          .style('cursor', 'pointer')
          .on('mouseover', self.settingMsgTip.show)
          .on('click',  self.settingMsgTip.hide);
  }

  addBarLabelOnLoad = (myBarChart : any) : void => {
    let self = this;
       myBarChart.append('text')
          .attr('class', function(d) {
              return 'main-label-text-'+d.id;
          })
          .attr('font-size', function(d) { return '1.2em'})
          .attr('fill', self.colors.grey)
           .attr('x', function(d, i) {
              return self.barChartAxisAndScales.xScale(i);
          })
         .attr('y', function(d, i) {
              return self.svg.height - self.barChartAxisAndScales.yScale(d.value) - 10;
          })
          .text(function (d) {
              return d.id;
          })
          .style('font-size', '10px');
  }

  showStackBar = (className : string) : void => {
      $('.stack-bar-group-'+className).addClass('show-element');
      $('.stack-bar-group-'+className).removeClass('hide-element');
  }

  hideStackBar = (className : string) : void => {
      $('.stack-bar-group-'+className).removeClass('show-element');
      $('.stack-bar-group-'+className).addClass('hide-element');
  }
}
