module BarChart {
  export class Dataset {
  private continentData : any  = {
                "Asia": 31903222,
                "Africa": 30369837,
                "Europe": 23093097,
                "North-America": 22219232,
                "South-America": 17827160,
                "Other-5": 25492544
            };
  private countryData : any = {
                "Asia": {
                    "China": 9596960,
                    "India": 3287263,
                    "Kazakhstan": 2724900,
                    "Saudi-Arabia": 2149690,
                    "Indonesia": 1904569,
                    "Other-46": 12239840
                },
                "Africa": {
                    "Algeria": 2381741,
                    "Democratic-Republic-of-the-Congo": 2344858,
                    "Sudan": 1861484,
                    "Libya": 1759540,
                    "Chad": 1284000,
                    "Other-54": 20738214
                },
                "Europe": {
                    "Russia": 17098242,
                    "France": 643801,
                    "Ukraine": 603550,
                    "Spain": 505370,
                    "Sweden": 450295,
                    "Other-45": 3791839
                },
                "North-America": {
                    "Canada": 9984670,
                    "United-States": 9826675,
                    "Greenland": 2166086,
                    "Cuba": 110860,
                    "Dominican Republic": 48670,
                    "Other-24": 82271
                },
                "South-America": {
                    "Brazil": 8514877,
                    "Argentina": 2780400,
                    "Peru": 1285216,
                    "Colombia": 1138910,
                    "Bolivia": 1098581,
                    "Other-9": 3009176
                },
                "Other-5": {
                    "Antarctica": 14444036,
                    "Australia": 8009115,
                    "Central-America": 2486251,
                    "Oceania": 552623,
                    "America": 519
                }
        };
    private svgHeight : number = 500;
    private svgWidth : number = 500;
    private mainElemId : string = "bar-chart";

    constructor() {}

    //we only need getters for passing these vals to its child class
    getContinentData = () :any => {
      return this.continentData;
    }

    getCountryData = () :any => {
      return this.countryData;
    }

    getContainer = () :string => {
      return this.mainElemId;
    }

    getSVGHeight = () :number => {
      return this.svgHeight;
    }

    getSVGWidth = () :number => {
      return this.svgWidth;
    }
}
}
