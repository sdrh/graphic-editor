import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ComponentRef,
} from '@angular/core';
import ResizeObserver from 'resize-observer-polyfill';
import * as echarts from 'echarts';
import { HttpClient } from '@angular/common/http';
import { ChartType } from './chart-setting.component';
import { BaseWidgetContent, WidgetData, WidgetService, AppearanceSetting } from 'ng-graphic-editor';

export type ChartWidgetData = WidgetData<
  {
    chartType?: ChartType;
    source?: number;
  } & AppearanceSetting
>;

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent
  extends BaseWidgetContent
  implements OnInit, AfterViewInit
{
  @ViewChild('chartArea') chartArea!: ElementRef;

  widgetData: ChartWidgetData = {
    setting: {
      background: { fill: true, color: '#efefef' },
      radius: 4,
      border: {
        fill: true,
        color: '#efefef',
        style: 'solid',
        width: 1,
      },
    },
  };
  resizeObserver: ResizeObserver | null = null;
  chart: any;

  constructor(
    private widgetSrv: WidgetService
  ) {
    super();
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.chart = echarts.init(this.chartArea.nativeElement);
    this.resizeObserver = new ResizeObserver((entries: any) => {
      this.chart.resize();
    });

    this.resizeObserver.observe(this.chartArea.nativeElement);

    this.draw();
    this.widgetSrv.onDataChange().subscribe(() => {
      this.draw();
    });
    // draw a chart
    // myChart.setOption({
    //   title: {
    //     text: 'ECharts Getting started example',
    //   },
    //   tooltip: {},
    //   xAxis: {
    //     data: ['shirt', 'cardigan', 'chiffon shirt', 'trousers', 'high heels', 'socks'],
    //   },
    //   yAxis: {},
    //   series: [
    //     {
    //       name: 'sales',
    //       type: 'bar',
    //       data: [5, 20, 36, 10, 10, 20],
    //     },
    //   ],
    // });
  }

  draw(): void {
    const chartType = this.widgetData.setting.chartType;
    const source = this.widgetData.setting.source;
    if (this.data?.length && chartType && source) {
      const chartData = this.data.find((item: any) => item.id === source);
      if (chartData.value) {
        const option = {
          legend: {},
          tooltip: {},
          dataset: {
            // Provide a piece of data.
            source: chartData.value,
          },
          // declares an x-axis, category axis（category）. By default, the category axis corresponds to the first column of dataset.
          xAxis: { type: 'category' },
          
          // Declare a Y axis, the value axis.
          yAxis: {},
          // Declare multiple bar series, by default, each series will automatically correspond to each column of the dataset..
          
          series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }],
        };
        this.chart.setOption(option);
      }
    }
  }
}
