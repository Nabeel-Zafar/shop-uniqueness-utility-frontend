import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { ApiService } from './../app/Services/api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  Shops:any = [];

  exportAsConfig: ExportAsConfig = {
    type: 'xlsx',
    elementIdOrContent: 'myTableElementId',
  }

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol','Territory','Town',
  'Code','Dist_Code','Dist_Name','Functionality','Dist_Active','Shop_ID','Shop_Code','Shop_Name',
  'Shop_Category','Shop_Channel','Shop_Classification','Shops_Active','Is_PJP', 'newShopCode'];

  dataSource = new MatTableDataSource([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


  constructor(private apiService: ApiService,private exportAsService: ExportAsService) { 
    this.readEmployee();
  }

 export() {
    // download the file using old school javascript method
    this.exportAsService.save(this.exportAsConfig, 'My File Name').subscribe(() => {
      // save started
    });
    // get the data as base64 or json object for json type - this will be helpful in ionic or SSR
    this.exportAsService.get(this.exportAsConfig).subscribe(content => {
      console.log(content);
    });
  }

  readEmployee(){
    this.apiService.getEmployees().subscribe((data) => {
     this.Shops = data;
     let transformData: any = [];
     let count: any = 0;
     const distActive = this.Shops.filter((c : any) => c.Dist_Active == 'Checked');
     const noActiveShops = this.Shops.filter((c : any) => c.Dist_Active == 'Unchecked' && !this.Shops.some((x: any) => x.Dist_Active == 'Checked' && x.Shop_Code == c.Shop_Code));
     console.log('noActiveShops',noActiveShops)
     distActive.forEach((shop: any, i: any) => {
      let noActiveShop =  this.Shops.filter((x: any) => x.Dist_Active == 'Unchecked' && x.Shop_Code== shop.Shop_Code)
       .map((x : any, index: any) => {
        return {
          ...x,
          Shop_Name: shop.Shop_Name,
          Shop_Category	: shop.Shop_Category,
          Shop_Channel	: shop.Shop_Channel,
          Shop_Classification : shop.Shop_Classification,
          Shops_Active	: shop.Shops_Active,
          Dist_Category :	shop.Dist_Category,
          Type	: shop.Type,
          Region	: shop.Region,
          Area	: shop.Area,
          Territory :	shop.Territory,
          Town	: shop.Town,
          Functionality : shop.Functionality,
          NewID : 'KS000' + i 
        }
       })
       shop.NewID = 'KS000' + i 
       transformData.push(...[...noActiveShop, shop])
       let countOfshops = count+=noActiveShop.length+1
       console.log('noActiveShop.length',noActiveShop.length)
     });
     transformData.push(...noActiveShops)
     console.log('transformData',transformData)
    //  console.log('transformData.length',transformData.length)
     this.dataSource = new MatTableDataSource(transformData);
     this.dataSource.paginator = this.paginator;
    //  console.log('this.Shops',this.Shops)
    })    
  }

}
