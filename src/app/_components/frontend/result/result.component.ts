import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../../_service/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';

import {
  ApexNonAxisChartSeries,
  ApexTitleSubtitle,
  ApexChart,
  ApexXAxis,
  ApexFill,
  ApexDataLabels,
  ChartComponent,
  ApexStroke,
  ApexPlotOptions,
  ApexYAxis,
  ApexMarkers,
} from 'ng-apexcharts';
export type ChartOptions = {
  series: ApexNonAxisChartSeries | false;
  chart: ApexChart;
  title: ApexTitleSubtitle;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  tooltip: any;
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  colors: string[];
  yaxis: ApexYAxis;
  markers: ApexMarkers;
  xaxis: ApexXAxis;
};

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
})
export class ResultComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent;
  public radarChartOptions: Partial<ChartOptions> | any;
  public dimensionScoreChartOptions_1: Partial<ChartOptions> | any;
  public dimensionScoreChartOptions_2: Partial<ChartOptions> | any;
  public dimensionScoreChartOptions_3: Partial<ChartOptions> | any;
  public dimensionScoreChartOptions_4: Partial<ChartOptions> | any;
  public dimensionScoreChartOptions_5: Partial<ChartOptions> | any;
  public dimensionScoreChartOptions_6: Partial<ChartOptions> | any;
  public dimensionScoreChartOptions_7: Partial<ChartOptions> | any;
  public dimensionScoreChartOptions_8: Partial<ChartOptions> | any;
  public dimensionScoreChartOptions_9: Partial<ChartOptions> | any;
  public companiesOptions: Partial<ChartOptions> | any;

  public canvasWidth = 450;
  public needleValue = 65;
  public centralLabel = '';

  public bottomLabel = '65';
  public options = {
    hasNeedle: true,
    needleColor: '#9e71f9',
    needleUpdateSpeed: 1000,
    arcColors: ['#fd5553', '#efd614', '#3ccc5b'],
    arcDelimiters: [20,50],
    rangeLabel: ['0', '100'],
  };

  surveyDetails: any;
  id: string;
  dimensionsList: any;
  industryList: any;
  companiesList: any;
  indiaIndex: any = 0;
  finalDimensionList: any;
  companyAvgScore: any = 0;
  overalScoreOptions: Object;
  leastFiveAnswered: any;
  companyScores: any;
  businessSector: any = 0;
  permissions: any;
  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      this.id = params.id;
      if (this.id) {
        this.loadSurvey();
      }
    });
  }

  CurrentStatus(state: any) : string {
    let retunvalue = "None";
    switch(state){
      case "1": {
        retunvalue = "Already Under Implementation"
        break;
      }
      case "2": {
        retunvalue = "Planned for Implementaion Within the Next Year"
        break;
      }
      case "3": {
        retunvalue = "Planned for Implementaion Within the Next Two Years"
        break;
      }
      case "4": {
        retunvalue = "Might Get Implemented, But Unsure of Timeline"
        break;
      }
      case "5": {
        retunvalue = "Haven't Thought About It"
        break;
      }
      default : {
        retunvalue = "None"
        break;
      }
    }
    return retunvalue;
  }

  async loadSurvey() {
    const permissions = await this.apiService.readAll('permissions').toPromise();
    if(permissions) {
      this.permissions = permissions.permissions;
    }
    console.log('permissions', this.permissions);
    const d = await this.apiService.readAll('dimension').toPromise();
    this.dimensionsList = d.dimensions.sort((a: any, b: any) =>
      a.name.localeCompare(b.name)
    );
    this.indiaIndex = Math.round(
      this.dimensionsList
        .map((res: any) => res.score)
        .reduce((a: any, b: any) => a + b) / this.dimensionsList.length
    );
    const industry = await this.apiService.readAll('industry').toPromise();
    this.industryList = industry.industries.sort((a: any, b: any) =>
      a.name.localeCompare(b.name)
    );
    const company = await this.apiService.readAll('company-list').toPromise();
    this.companiesList = company.companies.sort((a: any, b: any) =>
      a.name.localeCompare(b.name)
    );
    this.apiService.readAllById('survey', this.id).subscribe(
      (data) => {
        let result = data.survey;
        this.surveyDetails = data.survey;
        this.leastFiveAnswered = _.orderBy(result.questionnaires, [
          'selectedvalue',
        ]);
        this.companyScores = result.questionnaires.filter((res: any) => res.blockIndex === 5);
        let list: any = [];
        this.leastFiveAnswered.map((res: any, index: number) => {
          if (index < 5) {
            list.push(res);
          }
        });
        this.leastFiveAnswered = list;
        let dimensionList = result.questionnaires.map((res: any) => {
          let obj: any = {};
          obj['q_score'] = parseInt(res.selectedvalue);
          obj['dimension'] = res.dimensionId[0].name;
          obj['_id'] = res.dimensionId[0]._id;
          obj['d_score'] = parseInt(res.dimensionId[0].score);
          return obj;
        });
        let dAvg = dimensionList.reduce((group: any, d: any) => {
          if (!group[d.dimension]) {
            group[d.dimension] = { ...d, count: 1 };
            return group;
          }
          group[d.dimension].q_score += d.q_score;
          group[d.dimension].count += 1;
          return group;
        }, {});
        this.finalDimensionList = Object.keys(dAvg).map(function (x) {
          const item = dAvg[x];
          return {
            dimension: item.dimension,
            total: Math.round((item.q_score / item.count) * 20),
            d_score: item.d_score,
          };
        });
        const dimensionValues = this.finalDimensionList.map(
          (res: any) => res.d_score
        );
        const scoreValues = this.finalDimensionList.map(
          (res: any) => res.total
        );
        this.companyAvgScore = Math.ceil(_.mean(scoreValues));
        const industryValues = Object.values(
          _.omit(
            this.industryList.find(
              (res: any) => res._id === this.surveyDetails.businessSector[0]._id
            ),
            ['companies', 'name', '_id']
          )
        );
        const companyCat = this.companiesList.map((res: any) => res.name);
        const companySeries = this.companiesList.map((res: any, i: any) => {
          let series: any = {};
          if (i < 5) {
            series['name'] = res[`type_${i + 1}`]?.name;
            series['data'] = [
              res.type_1.score,
              res.type_2.score,
              res.type_3.score,
              res.type_4.score,
              res.type_5.score,
            ];
          }

          return series;
        });
        this.businessSector = this.avgScore(
          this.surveyDetails?.businessSector[0]
        );
        const cat = this.finalDimensionList.map((res: any) => res.dimension);
        var series = [{}];
        if(['India', 'Middle East', 'Africa'].includes(this.surveyDetails?.country))
        {
          series = [
            {
              name: 'India',
              data: dimensionValues,
            },
            {
              name: this.surveyDetails.companyName,
              data: scoreValues,
            },
            {
              name: this.surveyDetails.businessSector[0].name,
              data: industryValues,
            },
          ];
        }else{
          series = [
            {
              name: this.surveyDetails.companyName,
              data: scoreValues,
            }
          ];
        }
        this.radarChart(series, cat);
        this.dimensionScoreChart(series);
        this.overalScoreChart();
        this.companyChart(companySeries, companyCat);
      },
      (error) => {
        this.router.navigate(['/']);
      }
    );
  }
  showWidget(pos: number) {
    return !this.permissions[pos].location.includes(this.surveyDetails?.country)
  }
  avgScore(item: any) {
    let v = _.omit(item, ['_id', 'companies', 'name']);
    let sumV = Object.values(v);
    return Math.ceil(_.mean(sumV));
  }
  radarChart(series: any, categories: any) {
    this.radarChartOptions = {
      series,
      chart: {
        height: 650,
        type: 'radar',
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['#a071fb', '#efcdaa', '#54e9cc']
      },
      fill: {
        opacity: 0,
        colors: ['#a071fb', '#efcdaa', '#54e9cc'],
      },
      plotOptions: {
        radar: {
          size: 270,
          polygons: {
            width: 1
          }
        },
      },
      dataLabels: {
        enabled: true,
        background: {
          enabled: true,
          borderRadius:2,
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: ["#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff"],
            fontSize: '14px',
          },
        }
      },
      markers: {
        size: 4,
        strokeWidth: 1
      },
      tooltip: {
        y: {
          formatter: function (val: any) {
            return val;
          },
        },
      },
      xaxis: {
        // type: 'category'
        categories,
        labels: {
          show: true,
          style: {
            colors: ["#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff"],
            fontSize: "16px",
            fontFamily: 'Arial'
          }
        }
      },
    };
  }
  dimensionScoreChart(series: any) {
    let options = {
      series: [0, 1, 2],
      chart: {
        height: 350,
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 270,
          hollow: {
            margin: 15,
            size: "40%",
            background: "transparent",
            image: undefined
          },
          dataLabels: {
            name: {
              show: false
            },
            value: {
              show: false
            }
          }
        }
      },
      colors: ["#1ab7ea", "#0084ff", "#39539E"],
      labels: [
        'India',
        this.surveyDetails.companyName,
        this.surveyDetails.businessSector[0].name,
      ],
      legend: {
        show: true,
        floating: true,
        fontSize: '18px',
        position: 'left',
        offsetX: 10,
        offsetY: 5,
        labels: {
          useSeriesColors: true,
        },
        formatter: function (seriesName: any, opts: any) {
          return (
            seriesName + ': ' + opts.w.globals.series[opts.seriesIndex]
          );
        },
        itemMargin: {
          horizontal: 3,
        },
      },
    };
    let o = options.series;
    this.finalDimensionList.map((res: any, index: number) => {
      if (index === 0) {
        let o = options;

        if(['India', 'Middle East', 'Africa'].includes(this.surveyDetails?.country))
        {
          options.labels = [
            'India',
            this.surveyDetails.companyName,
            this.surveyDetails.businessSector[0].name,
          ];
          o.series = [
            series[0].data[index],
            series[1].data[index],
            series[2].data[index],
          ];
        }else{
          options.labels = [
            this.surveyDetails.companyName
          ],
          o.series = [
            series[0].data[index]
          ];
        }

        this.dimensionScoreChartOptions_1 = o;
      }
      if (index === 1) {
        let o = options;

        if(['India', 'Middle East', 'Africa'].includes(this.surveyDetails?.country))
        {
          o.series = [
            series[0].data[index],
            series[1].data[index],
            series[2].data[index],
          ];
        }else{
          o.series = [
            series[0].data[index]
          ];
        }

        this.dimensionScoreChartOptions_2 = o;
      }
      if (index === 2) {
        let o = options;

        if(['India', 'Middle East', 'Africa'].includes(this.surveyDetails?.country))
        {
          o.series = [
            series[0].data[index],
            series[1].data[index],
            series[2].data[index],
          ];
        }else{
          o.series = [
            series[0].data[index]
          ];
        }

        this.dimensionScoreChartOptions_3 = o;
      }
      if (index === 3) {
        let o = options;

        if(['India', 'Middle East', 'Africa'].includes(this.surveyDetails?.country))
        {
          o.series = [
            series[0].data[index],
            series[1].data[index],
            series[2].data[index],
          ];
        }else{
          o.series = [
            series[0].data[index]
          ];
        }

        this.dimensionScoreChartOptions_4 = o;
      }
      if (index === 4) {
        let o = options;

        if(['India', 'Middle East', 'Africa'].includes(this.surveyDetails?.country))
        {
          o.series = [
            series[0].data[index],
            series[1].data[index],
            series[2].data[index],
          ];
        }else{
          o.series = [
            series[0].data[index]
          ];
        }

        this.dimensionScoreChartOptions_5 = o;
      }
      if (index === 5) {
        let o = options;

        if(['India', 'Middle East', 'Africa'].includes(this.surveyDetails?.country))
        {
          o.series = [
            series[0].data[index],
            series[1].data[index],
            series[2].data[index],
          ];
        }else{
          o.series = [
            series[0].data[index]
          ];
        }

        this.dimensionScoreChartOptions_6 = o;
      }
      if (index === 6) {
        let o = options;

        if(['India', 'Middle East', 'Africa'].includes(this.surveyDetails?.country))
        {
          o.series = [
            series[0].data[index],
            series[1].data[index],
            series[2].data[index],
          ];
        }else{
          o.series = [
            series[0].data[index]
          ];
        }

        this.dimensionScoreChartOptions_7 = o;
      }
      if (index === 7) {
        let o = options;

        if(['India', 'Middle East', 'Africa'].includes(this.surveyDetails?.country))
        {
          o.series = [
            series[0].data[index],
            series[1].data[index],
            series[2].data[index],
          ];
        }else{
          o.series = [
            series[0].data[index]
          ];
        }

        this.dimensionScoreChartOptions_8 = o;
      }
    });
    // this.dimensionScoreChartOptions_1  = options;
    // this.dimensionScoreChartOptions_2  = options;
    // this.dimensionScoreChartOptions_3  = options;
    // this.dimensionScoreChartOptions_4  = options;
    // this.dimensionScoreChartOptions_5  = options;
    // this.dimensionScoreChartOptions_6  = options;
    // this.dimensionScoreChartOptions_7  = options;
    // this.dimensionScoreChartOptions_8  = options;
    // this.dimensionScoreChartOptions_9  = options;
  }

  overalScoreChart() {
    this.overalScoreOptions = {
      chart: {
        caption: 'Ovarall LHI Scoring',
        gaugeFillMix: '{dark-30},{light-60},{dark-10}',
        gaugeFillRatio: '15',
        pivotRadius: '10',
        lowerLimit: '0',
        upperLimit: '100',
        showValue: '1',
        numberSuffix: '',
        theme: 'fusion',
        showToolTip: '1',
      },
      dials: {
        dial: [
          {
            value: this.indiaIndex,
            showValue: '1',
            valueX: '200',
            valueY: '180',
            bgAlpha: '10',
            tooltext: 'INDIA INDEX : $value',
            rearExtension: '15',
          },
        ],
      },
    };
  }
  companyChart(series: any, categories: any) {
    this.companiesOptions = {
      series,
      chart: {
        type: 'bar',
        height: 600,
        stacked: true,
        stackType: '100%',
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      xaxis: {
        categories,
      },
      tooltip: {
        y: {
          formatter: function (val: any) {
            return val + 'K';
          },
        },
      },
      fill: {
        opacity: 1,
        colors: ['#b685db', '#cb94cc', '#e288ac', '#eba09e', '#f28578'],
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetX: 0,
      },
    };
  }
}
