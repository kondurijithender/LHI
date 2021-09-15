import { Component, OnInit, ViewChild } from '@angular/core';
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
  public barChartOptions: Partial<ChartOptions> | any;
  public dChartOptions: Partial<ChartOptions> | any;

  constructor() {
    this.radarChartOptions = {
      series: [
        {
          name: 'Series 1',
          data: [20, 100, 40, 30, 50, 80, 33],
        },
      ],
      chart: {
        height: 390,
        type: 'radar',
      },
      dataLabels: {
        enabled: true,
      },
      plotOptions: {
        radar: {
          size: 160,
          polygons: {
            strokeColor: '#e9e9e9',
            fill: {
              colors: ['#f8f8f8', '#fff'],
            },
          },
        },
      },
      colors: ['#FF4560'],
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
        categories: [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ],
      },
      yaxis: {
        tickAmount: 7,
        labels: {
          formatter: function (val: any, i: any) {
            if (i % 2 === 0) {
              return val;
            } else {
              return '';
            }
          },
        },
      },
    };
    this.barChartOptions = {
      series: [
        {
          name: 'serie1',
          data: [44, 55, 41, 64, 22, 43, 21],
        },
        {
          name: 'serie2',

          data: [53, 32, 33, 52, 13, 44, 32],
        },
      ],
      chart: {
        type: 'bar',
        height: 430,
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

  ngOnInit(): void {}
}
