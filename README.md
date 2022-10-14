# ng-graphic-editor

A library tool based on angular11 to implement a drag-and-drop component implementation interface, which can inject components and settings externally, and provide the function of binding data sources
[Demo](https://sdrh.github.io/graphic-editor)
![overview](https://github.com/sdrh/graphic-editor/blob/ghpage/overview.PNG?raw=true)
## install
```
    npm i ng-graphic-editor
```

## import
``` javascript
    import: [
        ...,
        GraphicEditorModule.forRoot()
    ],
    providers: [
        // inject components Widget[]
        { provide: WIDGET_LIST, useValue: widgets },
        // Inject component configuration WidgetSetting[]
        { provide: WIDGET_SETTING_LIST, useValue: widgetSettings }
        // Inject save to get page service, realize IGraphicEditorService，Does not provide use default storage indexdb
        { provide: EDITOR_SERVICE, useFactory: () => new AppService() },
    ]
```

``` sass
  @import '~ng-graphic-editor/src/iconfont/iconfont.scss'; 
```

## html use
``` html
    // editor
    <div>
        <ng-graphic-editor></ng-graphic-editor>
    </div>
```
``` html
    // show page directly Page
    <div>
        <ng-graphic-view [page]="page"></ng-graphic-view>
    </div>
```

## how to create widget and use data
``` javascript
    export class ChartComponent
    extends BaseWidgetContent
    implements OnInit, AfterViewInit
    {
        ...
        // Component default display configuration
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
        ...

        constructor(
            private widgetSrv: WidgetService
        ) {
            super();
        }

        ngOnInit(): void {}
        ngAfterViewInit(): void {
            this.widgetSrv.onDataChange().subscribe(() => {
                // can use this.data here
                const data = this.data;
                ...
            });
        }
        ...
```

## how to create widget setting
``` javascript
    export class ChartSettingComponent implements OnInit {
        // ref instance of the component，See specific desirable properties WidgetComponent
        constructor(public ref: ComponentRef<WidgetComponent>) {}
        ...
        // Mark page changes, and call it when each attribute is modified or changed, otherwise the page may not get the changes and cannot save the modified attributes
        emitChange(): void {
            this.ref.instance.page._modified = true;
        }
    }
```

## some type
``` javascript
    export interface IGraphicEditorService {
        addPage(): Observable<Page>;
        updatePage(pages: Page[]): Observable<any>;
        deletePage(page: Page): Observable<any>;
        getPageById(id: number): Observable<Page>;
        getAllPages(): Observable<Page[]>;
    }
```
``` javascript
    export type Page = {
        id: number;
        name?: string;
        style: PageStyle;
        widgets?: { type: string; style: WidgetStyle; widgetData?: WidgetData }[];
        dataSetting?: DataSetting[];
    };

    export type PageStyle = {
        width: number;
        height: number;
        backgroundColor: string;
        adaptive?: boolean;
    };
```
``` javascript
    export type Widget = {
        /** Component category */
        category: WidgetCategory | string;
        /** show name */
        name: string;
        /** Part Type */
        type: string;
        /** widget initial width */
        width?: number;
        /** Part initial height */
        height?: number;
        /** Toolbar display icon */
        icon?: string;
        /** Component class */
        component: any;
        /** set up */
        settings?: WidgetSetting[];
    };

    // @example    
    // {
    //   category: WidgetCategory.Advanced, // Basic,Advanced or custom string
    //   name: 'chart',
    //   icon: 'icon-chart',
    //   type: 'chart',
    //   width: 100,
    //   height: 100,
    //   component: ChartComponent,
    //   settings: [ // A set of settings, which can be combined with multiple settings
    //      { 
    //          type: 'chart', 
    //          name: 'chart', 
    //          component: ChartSettingComponent 
    //      },
    //     'appearance', // apperance-Appearance settings，text-text, image-picture
    //   ],
    // },
```
``` javascript
    export type WidgetSetting =
         {
            type: string;
            name?: string;
            component: any;
            }
        | string;

    // @example    
    // {
    //    type: 'image',
    //    name: 'picture',
    //    component: ImgSettingComponent,
    // },
```
``` javascript
    export type WidgetData<T = any> = {
        id?: number;
        // Subsequent use as component naming, not used yet
        name?: string;
        // General settings
        setting: T;
        // Event settings
        events?: EventListener[];
        // Data source settings
        dataSetting?: DataSetting[];
    };
```
    
