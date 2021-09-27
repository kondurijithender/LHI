import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../../_service/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import {
  ApexAxisChartSeries,
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
import { createHostListener } from '@angular/compiler/src/core';
export type ChartOptions = {
  series: ApexAxisChartSeries | false;
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
  public dimensionScoreChartOptions: Partial<ChartOptions> | any;
  public companiesOptions: Partial<ChartOptions> | any;
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
  async loadSurvey() {
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
        console.log(companySeries);
        // const companySeries = [
        //   {
        //     name: this.companiesList[0].type_1.name,
        //     data: [44, 55, 41],
        //   },
        //   {
        //     name: this.companiesList[0].type_2.name,
        //     data: [44, 55, 41],
        //   },
        //   {
        //     name: this.companiesList[0].type_3.name,
        //     data: [44, 55, 41],
        //   },
        //   {
        //     name: this.companiesList[0].type_4.name,
        //     data: [44, 55, 41],
        //   },
        //   {
        //     name: this.companiesList[0].type_5.name,
        //     data: [44, 55, 41],
        //   },
        // ];
        const cat = this.finalDimensionList.map((res: any) => res.dimension);
        const series = [
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
        this.radarChart(series, cat);
        this.dimensionScoreChart(series, cat);
        this.overalScoreChart();
        this.companyChart(companySeries, companyCat);
      },
      (error) => {
        this.router.navigate(['/']);
      }
    );
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
        height: 500,
        type: 'radar',
      },
      dataLabels: {
        enabled: true,
      },
      plotOptions: {
        radar: {
          size: 200,
          polygons: {
            strokeColor: '#e9e9e9',
            fill: {
              colors: ['#f8f8f8', '#fff'],
            },
          },
        },
      },
      colors: ['#a071fb'],
      markers: {
        size: 4,
        colors: ['#fff'],
        strokeColors: ['#FF4560'],
        strokeWidth: 2,
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
      },
    };
  }
  dimensionScoreChart(series: any, categories: any) {
    console.log(series);
    this.dimensionScoreChartOptions  = {
      series: [44, 55, 67],
      chart: {
        height: 350,
        type: "radialBar"
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              fontSize: "22px"
            },
            value: {
              fontSize: "16px"
            },
            total: {
              show: true,
              label: "Total",
              formatter: function(w: any) {
                return "100";
              }
            }
          }
        }
      },
      labels: ["Apples", "Oranges", "Bananas"]
    };
    // this.dimensionScoreChartOptions = {
    //   series,
    //   chart: {
    //     type: 'bar',
    //     height: 1200,
    //   },
    //   plotOptions: {
    //     bar: {
    //       horizontal: true,
    //       dataLabels: {
    //         position: 'top',
    //       },
    //     },
    //   },
    //   dataLabels: {
    //     enabled: true,
    //     offsetX: -15,
    //     style: {
    //       fontSize: '18px',
    //       colors: ['#fff'],
    //     },
    //   },
    //   stroke: {
    //     show: true,
    //     width: 1,
    //     colors: ['#fff'],
    //   },
    //   xaxis: {
    //     categories,
    //   },
    // };
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
          {
            value: this.companyAvgScore,
            showValue: '1',
            valueX: '250',
            valueY: '220',
            tooltext: `${this.surveyDetails?.companyName} : $value`,
            rearExtension: '15',
          },
          {
            value: this.avgScore(this.surveyDetails?.businessSector[0]),
            showValue: '1',
            valueX: '250',
            valueY: '220',
            tooltext: `${this.surveyDetails?.businessSector[0].name} : $value`,
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
      stroke: {
        width: 1,
        colors: ['#fff'],
      },
      title: {
        text: 'Companies at various Stages of L&D Technology Adoption',
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
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetX: 40,
      },
    };
  }
}
