import { WidgetData } from '../../model';
import { IWidgetContent } from '../../model/widget-content.interface';

export abstract class BaseWidgetContent implements IWidgetContent {
  widgetData: WidgetData = {};

  setWidgetData(widgetData: WidgetData): void {
    this.widgetData = widgetData;
  }
}
