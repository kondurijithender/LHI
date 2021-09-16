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
  public dChartOptions: Partial<ChartOptions> | any;
  surveyDetails: any;
  id: string;
  dimensionsList: any;
  industryList: any;
  indiaIndex: any = 0;
  finalDimensionList: any;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.radarChartOptions = {
      series: [
        {
          name: 'India',
          data: [25, 89, 98, 74, 95, 46, 78, 95],
        },
        {
          name: 'Series 2',
          data: [10, 89, 50, 74, 95, 46, 78, 95],
        },
        {
          name: 'Series 3',
          data: [90, 10, 55, 10, 30, 70, 10, 15],
        },
      ],
      chart: {
        height: 320,
        type: 'radar',
      },
      dataLabels: {
        enabled: true,
      },
      plotOptions: {
        radar: {
          size: 110,
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
        categories: [],
      },
    };
    this.dimensionScoreChartOptions = {
      series: [
        {
          name: 'India',
          data: [25, 89, 98, 74, 95, 46, 78, 95],
        },
        {
          name: 'Series 2',
          data: [10, 89, 50, 74, 95, 46, 78, 95],
        },
        {
          name: 'Series 3',
          data: [90, 10, 55, 10, 30, 70, 10, 15],
        },
      ],
      chart: {
        type: 'bar',
        height: 750,
      },
      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: {
            position: 'top',
          },
        },
      },
      dataLabels: {
        enabled: true,
        offsetX: -6,
        style: {
          fontSize: '12px',
          colors: ['#fff'],
        },
      },
      stroke: {
        show: true,
        width: 1,
        colors: ['#fff'],
      },
      xaxis: {
        categories: [2001, 2002, 2003, 2004, 2005, 2006, 2007],
      },
    };
    this.dChartOptions = {
      series: [44, 55, 13, 43, 22],
      chart: {
        type: 'donut',
      },
      labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      this.id = params.id;
      if (this.id) {
        this.loadDimensions();
        this.loadIndustry();
      }
    });
  }
  loadSurvey() {
    this.apiService.readAllById('survey', this.id).subscribe(
      (data) => {
        let result = data.survey;
        this.surveyDetails = data.survey;
        let dimensionList = result.questionnaires.map((res: any) => {
          let obj: any = {};
          obj['q_score'] = parseInt(res.values);
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
        const industryValues = Object.values(
          _.omit(
            this.industryList.find(
              (res: any) => res._id === this.surveyDetails.businessSector[0]._id
            ),
            ['companies', 'name', '_id']
          )
        );
        console.log('dimensionValues', dimensionValues);
        console.log('dimensionValues', dimensionValues);
        console.log('dimensionValues', dimensionValues);
        this.dimensionScoreChartOptions['series'][1].name =
          this.surveyDetails.companyName;

        this.dimensionScoreChartOptions['series'][2].name =
          this.surveyDetails.businessSector[0].name;
        this.dimensionScoreChartOptions['xaxis']['categories'] =
          this.finalDimensionList.map((res: any) => res.dimension);
        console.log(this.dimensionScoreChartOptions['series']);

        this.radarChartOptions['series'][1].name =
          this.surveyDetails.companyName;
        this.radarChartOptions['series'][2].name =
          this.surveyDetails.businessSector[0].name;
        this.radarChartOptions['xaxis']['categories'] =
          this.finalDimensionList.map((res: any) => res.dimension);
      },
      (error) => {
        this.router.navigate(['/']);
      }
    );
  }
  loadDimensions() {
    this.apiService.readAll('dimension').subscribe(
      (data) => {
        this.dimensionsList = data.dimensions.sort((a: any, b: any) =>
          a.name.localeCompare(b.name)
        );
        this.indiaIndex = Math.round(
          this.dimensionsList
            .map((res: any) => res.score)
            .reduce((a: any, b: any) => a + b) / this.dimensionsList.length
        );
      },
      (error) => {}
    );
  }
  loadIndustry() {
    this.apiService.readAll('industry').subscribe(
      (data) => {
        this.industryList = data.industries.sort((a: any, b: any) =>
          a.name.localeCompare(b.name)
        );
        this.loadSurvey();
      },
      (error) => {}
    );
  }
}
