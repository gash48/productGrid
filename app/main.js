import {getProductsData} from './apiService';
import { ProductGrid } from './productGrid';

$(document).ready(function () {

    $("#menu-toggle").click(function (e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });

    getProductsData().then((res)=>{
        if(res){
            let prodGrid = new ProductGrid(res);
        }
    });
})