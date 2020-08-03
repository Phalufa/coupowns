import { Component, Input } from "@angular/core";
import { Customer } from "src/app/models/customer";

@Component({
  selector: "app-customer-details",
  templateUrl: "./customer-details.component.html",
})
export class CustomerDetailsComponent {
  @Input() customer: Customer;
  @Input() index: number;
}
