import {Component, Input, NgModule, OnInit} from '@angular/core';
import {CapabilityStatementRestResource, CapabilityStatementRestResourceSearchParam} from "fhir/r4";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatChipsModule} from "@angular/material/chips";
import {MatCardModule} from "@angular/material/card";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-capability-statement-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.scss']
})
export class ResourceComponent implements OnInit {
  @Input() resource!: CapabilityStatementRestResource;
  searchParamDataSource = new MatTableDataSource<CapabilityStatementRestResourceSearchParam>();
  searchParamColumns = ['name', 'type', 'documentation'];

  ngOnInit(): void {
    if (this.resource && this.resource.searchParam) {
      this.searchParamDataSource.data = this.resource.searchParam;
    }
  }
}

@NgModule({
    declarations: [ResourceComponent],
    exports: [ResourceComponent],
    imports: [
        CommonModule,
        MatChipsModule,
        MatCardModule,
        MatTableModule
    ]
})
export class ResourceModule {}